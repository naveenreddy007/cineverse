-- Create schema for the movie database
CREATE SCHEMA IF NOT EXISTS public;

-- Enable Row Level Security on all tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO postgres, service_role;

-- Users table (extends the auth.users table)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator'))
);

-- Movies table
CREATE TABLE IF NOT EXISTS public.movies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  poster TEXT NOT NULL,
  year INTEGER NOT NULL,
  rating NUMERIC(3, 1),
  genres TEXT[] NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  rating NUMERIC(3, 1) NOT NULL CHECK (rating >= 0 AND rating <= 5),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  is_draft BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(user_id, movie_id)
);

-- Watchlist table
CREATE TABLE IF NOT EXISTS public.watchlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES public.movies(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  watched BOOLEAN DEFAULT false NOT NULL,
  watched_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, movie_id)
);

-- Forum posts table
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE,
  is_pinned BOOLEAN DEFAULT false NOT NULL
);

-- Forum comments table
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE
);

-- Streaming services table
CREATE TABLE IF NOT EXISTS public.streaming_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  logo TEXT NOT NULL,
  color TEXT NOT NULL
);

-- User streaming services table
CREATE TABLE IF NOT EXISTS public.user_streaming_services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_id UUID NOT NULL REFERENCES public.streaming_services(id) ON DELETE CASCADE,
  connected_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(user_id, service_id)
);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.streaming_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_streaming_services ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.users FOR SELECT 
  USING (true);

-- RLS Policies for movies table
CREATE POLICY "Movies are viewable by everyone" 
  ON public.movies FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can insert movies" 
  ON public.movies FOR INSERT 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

CREATE POLICY "Only admins can update movies" 
  ON public.movies FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for reviews table
CREATE POLICY "Reviews are viewable by everyone" 
  ON public.reviews FOR SELECT 
  USING (NOT is_draft OR auth.uid() = user_id);

CREATE POLICY "Users can create their own reviews" 
  ON public.reviews FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews" 
  ON public.reviews FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for watchlist table
CREATE POLICY "Users can view their own watchlist" 
  ON public.watchlist FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own watchlist" 
  ON public.watchlist FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own watchlist" 
  ON public.watchlist FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own watchlist" 
  ON public.watchlist FOR DELETE 
  USING (auth.uid() = user_id);

-- RLS Policies for forum posts
CREATE POLICY "Forum posts are viewable by everyone" 
  ON public.forum_posts FOR SELECT 
  USING (true);

CREATE POLICY "Users can create forum posts" 
  ON public.forum_posts FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum posts" 
  ON public.forum_posts FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum posts" 
  ON public.forum_posts FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and moderators can update any forum post" 
  ON public.forum_posts FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins and moderators can delete any forum post" 
  ON public.forum_posts FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for forum comments
CREATE POLICY "Forum comments are viewable by everyone" 
  ON public.forum_comments FOR SELECT 
  USING (true);

CREATE POLICY "Users can create forum comments" 
  ON public.forum_comments FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own forum comments" 
  ON public.forum_comments FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own forum comments" 
  ON public.forum_comments FOR DELETE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins and moderators can update any forum comment" 
  ON public.forum_comments FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'moderator')
    )
  );

CREATE POLICY "Admins and moderators can delete any forum comment" 
  ON public.forum_comments FOR DELETE 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role IN ('admin', 'moderator')
    )
  );

-- RLS Policies for streaming services
CREATE POLICY "Streaming services are viewable by everyone" 
  ON public.streaming_services FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage streaming services" 
  ON public.streaming_services FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE users.id = auth.uid() 
      AND users.role = 'admin'
    )
  );

-- RLS Policies for user streaming services
CREATE POLICY "Users can view their own streaming services" 
  ON public.user_streaming_services FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can connect their own streaming services" 
  ON public.user_streaming_services FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaming services" 
  ON public.user_streaming_services FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can disconnect their own streaming services" 
  ON public.user_streaming_services FOR DELETE 
  USING (auth.uid() = user_id);

