-- Create profiles table (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  username TEXT UNIQUE,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_followers table
CREATE TABLE IF NOT EXISTS user_followers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  follower_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  following_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(follower_id, following_id)
);

-- Create movie_clubs table
CREATE TABLE IF NOT EXISTS movie_clubs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  current_movie TEXT,
  next_meeting TEXT,
  created_by UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create club_members table
CREATE TABLE IF NOT EXISTS club_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  club_id UUID REFERENCES movie_clubs(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, club_id)
);

-- Create activity_likes table
CREATE TABLE IF NOT EXISTS activity_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  activity_id TEXT NOT NULL, -- Can reference reviews, forum_posts, etc.
  activity_type TEXT NOT NULL, -- 'review', 'forum_post', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, activity_id, activity_type)
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE NOT NULL,
  reason TEXT NOT NULL,
  reason_details TEXT,
  score DECIMAL(3,2) DEFAULT 0.5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Create user_feedback table
CREATE TABLE IF NOT EXISTS user_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  movie_id UUID REFERENCES movies(id) ON DELETE CASCADE NOT NULL,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_feedback ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Followers are viewable by everyone" ON user_followers FOR SELECT USING (true);
CREATE POLICY "Users can manage their own follows" ON user_followers FOR ALL USING (auth.uid() = follower_id);

CREATE POLICY "Movie clubs are viewable by everyone" ON movie_clubs FOR SELECT USING (true);
CREATE POLICY "Users can create movie clubs" ON movie_clubs FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Club members are viewable by everyone" ON club_members FOR SELECT USING (true);
CREATE POLICY "Users can manage their own club memberships" ON club_members FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Activity likes are viewable by everyone" ON activity_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage their own likes" ON activity_likes FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Recommendations are viewable by owner" ON recommendations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can create recommendations" ON recommendations FOR INSERT WITH CHECK (true);

CREATE POLICY "User feedback is viewable by owner" ON user_feedback FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own feedback" ON user_feedback FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_user_followers_follower ON user_followers(follower_id);
CREATE INDEX idx_user_followers_following ON user_followers(following_id);
CREATE INDEX idx_club_members_user ON club_members(user_id);
CREATE INDEX idx_club_members_club ON club_members(club_id);
CREATE INDEX idx_activity_likes_user ON activity_likes(user_id);
CREATE INDEX idx_recommendations_user ON recommendations(user_id);
CREATE INDEX idx_user_feedback_user ON user_feedback(user_id);

-- Insert sample movie clubs
INSERT INTO movie_clubs (name, description, current_movie, next_meeting) VALUES
('Telugu Cinema Lovers', 'Discussing the best of Telugu cinema from classics to modern masterpieces', 'RRR', 'Tomorrow at 8:00 PM'),
('Tollywood Critics', 'In-depth analysis of Telugu films, directors, and industry trends', 'Pushpa: The Rise', 'Friday at 9:00 PM'),
('South Indian Film Society', 'Exploring cinema from all South Indian languages', 'Baahubali 2', 'Saturday at 7:00 PM');
