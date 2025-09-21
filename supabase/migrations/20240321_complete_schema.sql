-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create user profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    location TEXT,
    website TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create movies table with dual rating system
CREATE TABLE IF NOT EXISTS movies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    title_telugu TEXT,
    description TEXT,
    poster_url TEXT,
    backdrop_url TEXT,
    trailer_url TEXT,
    release_date DATE NOT NULL,
    runtime INTEGER NOT NULL, -- in minutes
    director TEXT NOT NULL,
    cast TEXT[] DEFAULT '{}',
    genres TEXT[] DEFAULT '{}',
    languages TEXT[] DEFAULT '{}',
    box_office BIGINT DEFAULT 0,
    budget BIGINT DEFAULT 0,
    siddu_rating DECIMAL(3,1) DEFAULT 0,
    audience_rating DECIMAL(3,1) DEFAULT 0,
    imdb_rating DECIMAL(3,1) DEFAULT 0,
    imdb_id TEXT,
    tmdb_id INTEGER,
    status TEXT DEFAULT 'released' CHECK (status IN ('announced', 'in_production', 'post_production', 'released')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create streaming services table
CREATE TABLE IF NOT EXISTS streaming_services (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    logo_url TEXT,
    website_url TEXT,
    subscription_required BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create movie streaming availability table
CREATE TABLE IF NOT EXISTS movie_streaming (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    service_id UUID REFERENCES streaming_services(id) ON DELETE CASCADE,
    available_from DATE,
    available_until DATE,
    is_free BOOLEAN DEFAULT false,
    quality TEXT[] DEFAULT '{}', -- ['HD', '4K', etc.]
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(movie_id, service_id)
);

-- Create user watchlist table
CREATE TABLE IF NOT EXISTS user_watchlist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    watched BOOLEAN DEFAULT false,
    watched_at TIMESTAMP WITH TIME ZONE,
    rating DECIMAL(3,1),
    notes TEXT,
    UNIQUE(user_id, movie_id)
);

-- Create user reviews table
CREATE TABLE IF NOT EXISTS user_reviews (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id) ON DELETE CASCADE,
    rating DECIMAL(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
    title TEXT,
    content TEXT NOT NULL,
    spoiler_warning BOOLEAN DEFAULT false,
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, movie_id)
);

-- Create review likes table
CREATE TABLE IF NOT EXISTS review_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    review_id UUID REFERENCES user_reviews(id) ON DELETE CASCADE,
    is_like BOOLEAN NOT NULL, -- true for like, false for dislike
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, review_id)
);

-- Create forum categories table
CREATE TABLE IF NOT EXISTS forum_categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    color TEXT DEFAULT '#3b82f6',
    icon TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum topics table
CREATE TABLE IF NOT EXISTS forum_topics (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    category_id UUID REFERENCES forum_categories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT false,
    is_locked BOOLEAN DEFAULT false,
    views_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_reply_user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forum replies table
CREATE TABLE IF NOT EXISTS forum_replies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    topic_id UUID REFERENCES forum_topics(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    parent_reply_id UUID REFERENCES forum_replies(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create movie clubs table
CREATE TABLE IF NOT EXISTS movie_clubs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    avatar_url TEXT,
    banner_url TEXT,
    owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    is_private BOOLEAN DEFAULT false,
    member_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create club members table
CREATE TABLE IF NOT EXISTS club_members (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    club_id UUID REFERENCES movie_clubs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(club_id, user_id)
);

-- Create club discussions table
CREATE TABLE IF NOT EXISTS club_discussions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    club_id UUID REFERENCES movie_clubs(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    movie_id UUID REFERENCES movies(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    replies_count INTEGER DEFAULT 0,
    last_reply_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user followers table
CREATE TABLE IF NOT EXISTS user_followers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    follower_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(follower_id, following_id),
    CHECK (follower_id != following_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN ('review_like', 'new_follower', 'club_invite', 'forum_reply', 'movie_release')),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB DEFAULT '{}',
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default streaming services
INSERT INTO streaming_services (name, logo_url, website_url, subscription_required) VALUES
('Netflix', 'https://cdn.worldvectorlogo.com/logos/netflix-3.svg', 'https://netflix.com', true),
('Amazon Prime Video', 'https://cdn.worldvectorlogo.com/logos/amazon-prime-video.svg', 'https://primevideo.com', true),
('Disney+ Hotstar', 'https://cdn.worldvectorlogo.com/logos/disney-hotstar.svg', 'https://hotstar.com', true),
('YouTube', 'https://cdn.worldvectorlogo.com/logos/youtube-icon.svg', 'https://youtube.com', false),
('Zee5', 'https://cdn.worldvectorlogo.com/logos/zee5.svg', 'https://zee5.com', true),
('Sony LIV', 'https://cdn.worldvectorlogo.com/logos/sony-liv.svg', 'https://sonyliv.com', true)
ON CONFLICT (name) DO NOTHING;

-- Insert default forum categories
INSERT INTO forum_categories (name, description, color, icon, sort_order) VALUES
('General Discussion', 'General movie discussions and recommendations', '#3b82f6', 'MessageCircle', 1),
('Telugu Cinema', 'Discussions about Telugu movies and industry', '#ef4444', 'Film', 2),
('Reviews & Ratings', 'Share your movie reviews and ratings', '#f59e0b', 'Star', 3),
('Upcoming Releases', 'Discuss upcoming movie releases', '#10b981', 'Calendar', 4),
('Technical Discussion', 'Cinematography, direction, and technical aspects', '#8b5cf6', 'Settings', 5)
ON CONFLICT (name) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_movies_release_date ON movies(release_date DESC);
CREATE INDEX IF NOT EXISTS idx_movies_siddu_rating ON movies(siddu_rating DESC);
CREATE INDEX IF NOT EXISTS idx_movies_audience_rating ON movies(audience_rating DESC);
CREATE INDEX IF NOT EXISTS idx_movies_genres ON movies USING GIN(genres);
CREATE INDEX IF NOT EXISTS idx_user_watchlist_user_id ON user_watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_movie_id ON user_reviews(movie_id);
CREATE INDEX IF NOT EXISTS idx_user_reviews_user_id ON user_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_topics_category_id ON forum_topics(category_id);
CREATE INDEX IF NOT EXISTS idx_forum_replies_topic_id ON forum_replies(topic_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id, read);

-- Create function to automatically create user profile
CREATE OR REPLACE FUNCTION create_user_profile()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_profiles (id, email, full_name)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile on signup
DROP TRIGGER IF EXISTS create_user_profile_trigger ON auth.users;
CREATE TRIGGER create_user_profile_trigger
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION create_user_profile();

-- Create function to update movie ratings
CREATE OR REPLACE FUNCTION update_movie_ratings()
RETURNS TRIGGER AS $$
BEGIN
    -- Update audience rating based on user reviews
    UPDATE movies 
    SET audience_rating = (
        SELECT ROUND(AVG(rating), 1)
        FROM user_reviews 
        WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id)
    )
    WHERE id = COALESCE(NEW.movie_id, OLD.movie_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to update movie ratings when reviews change
DROP TRIGGER IF EXISTS update_movie_ratings_trigger ON user_reviews;
CREATE TRIGGER update_movie_ratings_trigger
    AFTER INSERT OR UPDATE OR DELETE ON user_reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_movie_ratings();

-- Create function to update counters
CREATE OR REPLACE FUNCTION update_counters()
RETURNS TRIGGER AS $$
BEGIN
    -- Update forum topic reply count
    IF TG_TABLE_NAME = 'forum_replies' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE forum_topics 
            SET replies_count = replies_count + 1,
                last_reply_at = NEW.created_at,
                last_reply_user_id = NEW.user_id
            WHERE id = NEW.topic_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE forum_topics 
            SET replies_count = replies_count - 1
            WHERE id = OLD.topic_id;
        END IF;
    END IF;
    
    -- Update club member count
    IF TG_TABLE_NAME = 'club_members' THEN
        IF TG_OP = 'INSERT' THEN
            UPDATE movie_clubs 
            SET member_count = member_count + 1
            WHERE id = NEW.club_id;
        ELSIF TG_OP = 'DELETE' THEN
            UPDATE movie_clubs 
            SET member_count = member_count - 1
            WHERE id = OLD.club_id;
        END IF;
    END IF;
    
    -- Update review likes/dislikes count
    IF TG_TABLE_NAME = 'review_likes' THEN
        IF TG_OP = 'INSERT' THEN
            IF NEW.is_like THEN
                UPDATE user_reviews SET likes_count = likes_count + 1 WHERE id = NEW.review_id;
            ELSE
                UPDATE user_reviews SET dislikes_count = dislikes_count + 1 WHERE id = NEW.review_id;
            END IF;
        ELSIF TG_OP = 'DELETE' THEN
            IF OLD.is_like THEN
                UPDATE user_reviews SET likes_count = likes_count - 1 WHERE id = OLD.review_id;
            ELSE
                UPDATE user_reviews SET dislikes_count = dislikes_count - 1 WHERE id = OLD.review_id;
            END IF;
        ELSIF TG_OP = 'UPDATE' THEN
            IF OLD.is_like != NEW.is_like THEN
                IF NEW.is_like THEN
                    UPDATE user_reviews 
                    SET likes_count = likes_count + 1, dislikes_count = dislikes_count - 1 
                    WHERE id = NEW.review_id;
                ELSE
                    UPDATE user_reviews 
                    SET likes_count = likes_count - 1, dislikes_count = dislikes_count + 1 
                    WHERE id = NEW.review_id;
                END IF;
            END IF;
        END IF;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create triggers for counter updates
DROP TRIGGER IF EXISTS update_forum_counters_trigger ON forum_replies;
CREATE TRIGGER update_forum_counters_trigger
    AFTER INSERT OR DELETE ON forum_replies
    FOR EACH ROW
    EXECUTE FUNCTION update_counters();

DROP TRIGGER IF EXISTS update_club_counters_trigger ON club_members;
CREATE TRIGGER update_club_counters_trigger
    AFTER INSERT OR DELETE ON club_members
    FOR EACH ROW
    EXECUTE FUNCTION update_counters();

DROP TRIGGER IF EXISTS update_review_counters_trigger ON review_likes;
CREATE TRIGGER update_review_counters_trigger
    AFTER INSERT OR UPDATE OR DELETE ON review_likes
    FOR EACH ROW
    EXECUTE FUNCTION update_counters();

-- Row Level Security Policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaming_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_streaming ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE forum_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE movie_clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_discussions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- Movies policies (public read access)
CREATE POLICY "Anyone can view movies" ON movies FOR SELECT USING (true);

-- Streaming services policies (public read access)
CREATE POLICY "Anyone can view streaming services" ON streaming_services FOR SELECT USING (true);
CREATE POLICY "Anyone can view movie streaming" ON movie_streaming FOR SELECT USING (true);

-- User watchlist policies
CREATE POLICY "Users can view own watchlist" ON user_watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to own watchlist" ON user_watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own watchlist" ON user_watchlist FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete from own watchlist" ON user_watchlist FOR DELETE USING (auth.uid() = user_id);

-- User reviews policies
CREATE POLICY "Anyone can view reviews" ON user_reviews FOR SELECT USING (true);
CREATE POLICY "Users can insert own reviews" ON user_reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON user_reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON user_reviews FOR DELETE USING (auth.uid() = user_id);

-- Review likes policies
CREATE POLICY "Anyone can view review likes" ON review_likes FOR SELECT USING (true);
CREATE POLICY "Users can manage own review likes" ON review_likes FOR ALL USING (auth.uid() = user_id);

-- Forum policies
CREATE POLICY "Anyone can view forum categories" ON forum_categories FOR SELECT USING (true);
CREATE POLICY "Anyone can view forum topics" ON forum_topics FOR SELECT USING (true);
CREATE POLICY "Users can create forum topics" ON forum_topics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forum topics" ON forum_topics FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Anyone can view forum replies" ON forum_replies FOR SELECT USING (true);
CREATE POLICY "Users can create forum replies" ON forum_replies FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own forum replies" ON forum_replies FOR UPDATE USING (auth.uid() = user_id);

-- Movie clubs policies
CREATE POLICY "Anyone can view public clubs" ON movie_clubs FOR SELECT USING (NOT is_private OR auth.uid() IN (
    SELECT user_id FROM club_members WHERE club_id = movie_clubs.id
));
CREATE POLICY "Users can create clubs" ON movie_clubs FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Club owners can update clubs" ON movie_clubs FOR UPDATE USING (auth.uid() = owner_id);

-- Club members policies
CREATE POLICY "Anyone can view club members" ON club_members FOR SELECT USING (true);
CREATE POLICY "Users can join clubs" ON club_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave clubs" ON club_members FOR DELETE USING (auth.uid() = user_id);

-- User followers policies
CREATE POLICY "Anyone can view followers" ON user_followers FOR SELECT USING (true);
CREATE POLICY "Users can manage own follows" ON user_followers FOR ALL USING (auth.uid() = follower_id);

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications FOR UPDATE USING (auth.uid() = user_id);
