-- Drop existing tables if they exist
DROP TABLE IF EXISTS public.user_streaming_services;
DROP TABLE IF EXISTS public.streaming_services;
DROP TABLE IF EXISTS public.forum_comments;
DROP TABLE IF EXISTS public.forum_posts;
DROP TABLE IF EXISTS public.watchlist;
DROP TABLE IF EXISTS public.reviews;
DROP TABLE IF EXISTS public.movies;
DROP TABLE IF EXISTS public.users;

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

-- Create movies table for Telugu movies
CREATE TABLE public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_telugu TEXT NOT NULL,
  poster_url TEXT NOT NULL,
  backdrop_url TEXT,
  release_date DATE NOT NULL,
  rating NUMERIC(3, 1) DEFAULT 0,
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
CREATE INDEX idx_movies_rating ON public.movies(rating DESC);
CREATE INDEX idx_movies_genres ON public.movies USING GIN(genres);
CREATE INDEX idx_reviews_movie_id ON public.reviews(movie_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_watchlist_user_id ON public.watchlist(user_id);
CREATE INDEX idx_forum_posts_category ON public.forum_posts(category);
CREATE INDEX idx_forum_comments_post_id ON public.forum_comments(post_id);

-- Insert some sample Telugu movies
INSERT INTO public.movies (title, title_telugu, poster_url, backdrop_url, release_date, rating, genres, director, cast, plot, plot_telugu, runtime, language, box_office) VALUES
('RRR', 'ఆర్ఆర్ఆర్', 'https://image.tmdb.org/t/p/w500/1A11Ej8WKVhoVkm7LzqNYmKrZmF.jpg', 'https://image.tmdb.org/t/p/original/8rpDcsfLJypbO6vREc0547VKqEv.jpg', '2022-03-25', 4.8, ARRAY['Action', 'Drama', 'History'], 'S.S. Rajamouli', ARRAY['N.T. Rama Rao Jr.', 'Ram Charan', 'Alia Bhatt', 'Ajay Devgn'], 'A fictional story about two legendary revolutionaries and their journey away from home before they started fighting for their country in 1920s.', 'రెండు పురాణ విప్లవకారుల గురించిన కల్పిత కథ మరియు 1920లలో తమ దేశం కోసం పోరాడటం ప్రారంభించే ముందు ఇంటి నుండి దూరంగా వారి ప్రయాణం.', 187, 'telugu', 120000000000),
('Pushpa: The Rise', 'పుష్ప: ది రైజ్', 'https://image.tmdb.org/t/p/w500/pU4baeKjAAvzSDKTdBlYuBOib6a.jpg', 'https://image.tmdb.org/t/p/original/xvYCZ740XvngXK0FNeSNVTJJJ5R.jpg', '2021-12-17', 4.5, ARRAY['Action', 'Crime', 'Drama'], 'Sukumar', ARRAY['Allu Arjun', 'Rashmika Mandanna', 'Fahadh Faasil'], 'A laborer named Pushpa makes enemies as he rises in the world of red sandalwood smuggling.', 'పుష్ప అనే కూలీ ఎర్ర చందనం స్మగ్లింగ్ ప్రపంచంలో ఎదుగుతున్నప్పుడు శత్రువులను సృష్టించుకుంటాడు.', 179, 'telugu', 35000000000),
('Baahubali 2: The Conclusion', 'బాహుబలి 2: ది కన్‌క్లూజన్', 'https://image.tmdb.org/t/p/w500/V1gKt3ZnWJkCaOOKHhHhqZhJmq.jpg', 'https://image.tmdb.org/t/p/original/InRojjSANBdaOOXEL9Iy8GFJdz1.jpg', '2017-04-28', 4.7, ARRAY['Action', 'Adventure', 'Drama'], 'S.S. Rajamouli', ARRAY['Prabhas', 'Rana Daggubati', 'Anushka Shetty'], 'When Shiva, the son of Bahubali, learns about his heritage, he begins to look for answers.', 'బాహుబలి కుమారుడు శివుడు తన వంశావళి గురించి తెలుసుకున్నప్పుడు, అతను సమాధానాలను వెతకడం ప్రారంభిస్తాడు.', 167, 'telugu', 170000000000);
