-- Create leaderboard table
CREATE TABLE public.leaderboard (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_levels INTEGER NOT NULL,
  completion_percentage INTEGER NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add index for better query performance
CREATE INDEX idx_leaderboard_score ON public.leaderboard(score DESC, completed_at DESC);

-- Enable Row Level Security
ALTER TABLE public.leaderboard ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to view leaderboard (public data)
CREATE POLICY "Anyone can view leaderboard"
ON public.leaderboard
FOR SELECT
USING (true);

-- Create policy to allow anyone to insert their score
CREATE POLICY "Anyone can submit scores"
ON public.leaderboard
FOR INSERT
WITH CHECK (true);

-- Add realtime support for live leaderboard updates
ALTER TABLE public.leaderboard REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.leaderboard;