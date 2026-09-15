-- Run this in the Supabase SQL Editor

-- 1. Create table for Chat Sessions
CREATE TABLE public.chat_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    messages_json JSONB DEFAULT '[]'::jsonb NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create table for Quiz Scores
CREATE TABLE public.quiz_scores (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    chapter TEXT NOT NULL,
    score INT NOT NULL,
    max_score INT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create table for Syllabus Progress
CREATE TABLE public.syllabus_progress (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    completed_subtopics_json JSONB DEFAULT '[]'::jsonb NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS) on all tables
ALTER TABLE public.chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.syllabus_progress ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS Policies
-- Users can only SELECT, INSERT, UPDATE, and DELETE their own data

-- Chat Sessions
CREATE POLICY "Users can manage their own chat sessions"
ON public.chat_sessions FOR ALL USING (auth.uid() = user_id);

-- Quiz Scores
CREATE POLICY "Users can manage their own quiz scores"
ON public.quiz_scores FOR ALL USING (auth.uid() = user_id);

-- Syllabus Progress
CREATE POLICY "Users can manage their own syllabus progress"
ON public.syllabus_progress FOR ALL USING (auth.uid() = user_id);
