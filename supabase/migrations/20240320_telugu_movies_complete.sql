-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.user_streaming_services CASCADE;
DROP TABLE IF EXISTS public.streaming_services CASCADE;
DROP TABLE IF EXISTS public.forum_comments CASCADE;
DROP TABLE IF EXISTS public.forum_posts CASCADE;
DROP TABLE IF EXISTS public.watchlist CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.movies CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table (extends auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'))
);

-- Create movies table for Telugu movies with dual rating system
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_telugu TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  backdrop_url TEXT,
  release_date DATE NOT NULL,
  audience_rating NUMERIC(3, 1) DEFAULT 0, -- Calculated from user reviews
  siddu_rating NUMERIC(3, 1) DEFAULT 0,    -- Editorial/Critic rating
  genres TEXT[] NOT NULL DEFAULT '{}',
  director TEXT NOT NULL,
  cast TEXT[] NOT NULL DEFAULT '{}',
  plot TEXT NOT NULL,
  plot_telugu TEXT NOT NULL,
  runtime INTEGER NOT NULL, -- in minutes
  language TEXT NOT NULL DEFAULT 'telugu',
  box_office BIGINT, -- in rupees
  tmdb_id INTEGER UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Create reviews table
CREATE TABLE public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  rating NUMERIC(3, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  content TEXT NOT NULL,
  content_telugu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_draft BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(user_id, movie_id)
);

-- Create watchlist table
CREATE TABLE public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  watched BOOLEAN DEFAULT false NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, movie_id)
);

-- Create forum posts table
CREATE TABLE public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  title_telugu TEXT,
  content TEXT NOT NULL,
  content_telugu TEXT,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  is_pinned BOOLEAN DEFAULT false NOT NULL,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0
);

-- Create forum comments table
CREATE TABLE public.forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  content_telugu TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view all profiles" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for movies table
CREATE POLICY "Movies are viewable by everyone" ON public.movies FOR SELECT USING (true);
CREATE POLICY "Only admins can manage movies" ON public.movies FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- RLS Policies for reviews table
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (NOT is_draft OR auth.uid() = user_id);
CREATE POLICY "Users can create own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own reviews" ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for watchlist table
CREATE POLICY "Users can view own watchlist" ON public.watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own watchlist" ON public.watchlist FOR ALL USING (auth.uid() = user_id);

-- RLS Policies for forum posts
CREATE POLICY "Forum posts are viewable by everyone" ON public.forum_posts FOR SELECT USING (true);
CREATE POLICY "Users can create forum posts" ON public.forum_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.forum_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.forum_posts FOR DELETE USING (auth.uid() = user_id);

-- RLS Policies for forum comments
CREATE POLICY "Forum comments are viewable by everyone" ON public.forum_comments FOR SELECT USING (true);
CREATE POLICY "Users can create comments" ON public.forum_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON public.forum_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.forum_comments FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_movies_language ON public.movies(language);
CREATE INDEX idx_movies_release_date ON public.movies(release_date DESC);
CREATE INDEX idx_movies_audience_rating ON public.movies(audience_rating DESC);
CREATE INDEX idx_movies_siddu_rating ON public.movies(siddu_rating DESC);
CREATE INDEX idx_movies_genres ON public.movies USING GIN(genres);
CREATE INDEX idx_reviews_movie_id ON public.reviews(movie_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_watchlist_user_id ON public.watchlist(user_id);
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category);
CREATE INDEX idx_forum_comments_post_id ON public.forum_comments(post_id);

-- Insert latest Telugu movies with real data
INSERT INTO public.movies (title, title_telugu, poster_url, backdrop_url, release_date, audience_rating, siddu_rating, genres, director, cast, plot, plot_telugu, runtime, language, box_office) VALUES
-- 2024 Latest Movies
('Kalki 2898 AD', 'కల్కి 2898 AD', 'https://image.tmdb.org/t/p/w500/jAe6YvkZUeFbT6Ex2zVCiTrfKhx.jpg', 'https://image.tmdb.org/t/p/original/rqgeBNWXas1yrAyXxwi9CahfScx.jpg', '2024-06-27', 4.2, 4.5, ARRAY['Action', 'Science Fiction', 'Drama'], 'Nag Ashwin', ARRAY['Prabhas', 'Deepika Padukone', 'Amitabh Bachchan', 'Kamal Haasan'], 'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.', 'హిందూ దేవుడైన విష్ణువు యొక్క ఆధునిక అవతారం, దుష్ట శక్తుల నుండి ప్రపంచాన్ని రక్షించడానికి భూమిపై అవతరించినట్లు నమ్ముతారు.', 180, 'telugu', 110000000000),

('Devara: Part 1', 'దేవర: పార్ట్ 1', 'https://image.tmdb.org/t/p/w500/uKb22E0nlzr914bA9KyA5CVCOlV.jpg', 'https://image.tmdb.org/t/p/original/9SSEUrSqhljBMzRe4aBTh17rUaC.jpg', '2024-09-27', 4.0, 4.2, ARRAY['Action', 'Drama', 'Thriller'], 'Koratala Siva', ARRAY['N.T. Rama Rao Jr.', 'Janhvi Kapoor', 'Saif Ali Khan'], 'An epic action saga set against coastal lands, which briefs about rip-roaring action sequences in the backdrop of the sea.', 'తీరప్రాంత భూములకు వ్యతిరేకంగా సెట్ చేయబడిన ఒక ఇతిహాస యాక్షన్ గాథ, ఇది సముద్రం నేపథ్యంలో రిప్-రోరింగ్ యాక్షన్ సీక్వెన్స్‌ల గురించి వివరిస్తుంది.', 175, 'telugu', 85000000000),

('Guntur Kaaram', 'గుంటూరు కారం', 'https://image.tmdb.org/t/p/w500/1KKiq8lYeKjzKNhE8GYLkNTYQtF.jpg', 'https://image.tmdb.org/t/p/original/ta17TltHGdZ5PZz6oUD3N5BRurb.jpg', '2024-01-12', 3.8, 4.0, ARRAY['Action', 'Drama', 'Family'], 'Trivikram Srinivas', ARRAY['Mahesh Babu', 'Sreeleela', 'Meenakshi Chaudhary'], 'Years after his mother abandons him and remarries, a man demands answers when he discovers that his half-sister is getting married.', 'అతని తల్లి అతనిని విడిచిపెట్టి మళ్లీ వివాహం చేసుకున్న సంవత్సరాల తర్వాత, అతని సవతి సోదరి వివాహం చేసుకుంటున్నట్లు తెలుసుకున్నప్పుడు ఒక వ్యక్తి సమాధానాలు కోరుతాడు.', 159, 'telugu', 65000000000),

('HanuMan', 'హనుమాన్', 'https://image.tmdb.org/t/p/w500/lkKl3YCGlWKnqNXVIHSzLGHRzgs.jpg', 'https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc0547VKqEv.jpg', '2024-01-12', 4.3, 4.4, ARRAY['Action', 'Adventure', 'Fantasy'], 'Prasanth Varma', ARRAY['Teja Sajja', 'Amritha Aiyer', 'Varalaxmi Sarathkumar'], 'An imaginary place called Anjanadri where the protagonist gets the powers of Hanuman and fights for Anjanadri.', 'అంజనాద్రి అనే ఊహాత్మక ప్రదేశం, ఇక్కడ కథానాయకుడు హనుమాన్ శక్తులను పొందుతాడు మరియు అంజనాద్రి కోసం పోరాడుతాడు.', 158, 'telugu', 35000000000),

-- 2023 Movies
('Waltair Veerayya', 'వాల్తేర్ వీరయ్య', 'https://image.tmdb.org/t/p/w500/lV17lhOu4QLb5wvPYxiuSWZpAfD.jpg', 'https://image.tmdb.org/t/p/original/fm6KqXpk3M2HVveHwCrBSSBaO0V.jpg', '2023-01-13', 4.1, 4.3, ARRAY['Action', 'Crime', 'Drama'], 'Bobby Kolli', ARRAY['Chiranjeevi', 'Ravi Teja', 'Shruti Haasan'], 'A fisherman who engages in smuggling accepts a request from a disheveled police officer in order to use it to his advantage.', 'స్మగ్లింగ్‌లో నిమగ్నమైన ఒక మత్స్యకారుడు దానిని తన ప్రయోజనం కోసం ఉపయోగించుకోవడానికి చెదిరిన పోలీసు అధికారి నుండి అభ్యర్థనను అంగీకరిస్తాడు.', 155, 'telugu', 72000000000),

('Veera Simha Reddy', 'వీర సింహ రెడ్డి', 'https://image.tmdb.org/t/p/w500/fBJducGBcmrcIOQdhm4BUBNDiMu.jpg', 'https://image.tmdb.org/t/p/original/xvYCZ740XvngXK0FNeSNVTJJJ5R.jpg', '2023-01-12', 3.9, 4.1, ARRAY['Action', 'Drama', 'Family'], 'Gopichand Malineni', ARRAY['Nandamuri Balakrishna', 'Shruti Haasan', 'Honey Rose'], 'The father of a grown daughter meets the father of a toddler at a playground and recounts the story of his own father.', 'ఒక పెద్ద కుమార్తె తండ్రి ఆట స్థలంలో పసిపిల్లవాడి తండ్రిని కలుసుకుని తన స్వంత తండ్రి కథను వివరిస్తాడు.', 169, 'telugu', 55000000000),

-- Classic hits
('RRR', 'ఆర్ఆర్ఆర్', 'https://image.tmdb.org/t/p/w500/1A11Ej8WKVhoVkm7LzqNYmKrZmF.jpg', 'https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc0547VKqEv.jpg', '2022-03-25', 4.8, 4.9, ARRAY['Action', 'Drama', 'History'], 'S.S. Rajamouli', ARRAY['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'], 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.', 'రెండు పురాణ విప్లవకారుల గురించిన కల్పిత కథ మరియు 1920లలో తమ దేశం కోసం పోరాడటం ప్రారంభించే ముందు ఇంటి నుండి దూరంగా వారి ప్రయాణం.', 187, 'telugu', 120000000000),

('Pushpa: The Rise', 'పుష్ప: ది రైజ్', 'https://image.tmdb.org/t/p/w500/pU4baeKjAAvzSDKTdBlYuBOib6a.jpg', 'https://image.tmdb.org/t/p/original/xvYCZ740XvngXK0FNeSNVTJJJ5R.jpg', '2021-12-17', 4.5, 4.6, ARRAY['Action', 'Crime', 'Drama'], 'Sukumar', ARRAY['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil'], 'A laborer named Pushpa makes enemies as he rises in the world of red sandalwood smuggling.', 'పుష్ప అనే కూలీ ఎర్ర చందనం స్మగ్లింగ్ ప్రపంచంలో ఎదుగుతున్నప్పుడు శత్రువులను సృష్టించుకుంటాడు.', 179, 'telugu', 35000000000),

('Baahubali 2: The Conclusion', 'బాహుబలి 2: ది కన్‌క్లూజన్', 'https://image.tmdb.org/t/p/w500/V1gKt3ZnWJkCaOOKHhHhqZhJmq.jpg', 'https://image.tmdb.org/t/p/original/InRojjSANBdaOOXEL9Iy8GFJdz1.jpg', '2017-04-28', 4.7, 4.8, ARRAY['Action', 'Adventure', 'Drama'], 'S.S. Rajamouli', ARRAY['Prabhas', 'Rana Daggubati', 'Anushka Shetty'], 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers.', 'బాహుబలి కుమారుడు శివుడు తన వంశావళి గురించి తెలుసుకున్నప్పుడు, అతను సమాధానాలను వెతకడం ప్రారంభిస్తాడు.', 167, 'telugu', 170000000000);

-- Function to update audience rating when reviews are added/updated
CREATE OR REPLACE FUNCTION update_movie_audience_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.movies 
  SET audience_rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM public.reviews 
    WHERE movie_id = COALESCE(NEW.movie_id, OLD.movie_id) 
    AND is_draft = false
  )
  WHERE id = COALESCE(NEW.movie_id, OLD.movie_id);
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers to automatically update audience rating
CREATE TRIGGER trigger_update_audience_rating_on_insert
  AFTER INSERT ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_movie_audience_rating();

CREATE TRIGGER trigger_update_audience_rating_on_update
  AFTER UPDATE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_movie_audience_rating();

CREATE TRIGGER trigger_update_audience_rating_on_delete
  AFTER DELETE ON public.reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_movie_audience_rating();
