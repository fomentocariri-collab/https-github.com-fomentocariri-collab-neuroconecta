/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://gbjanxdyllxpsydsubcx.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_3YXxIUQtChenhRgqMlr0Xw_W8DgQ2da";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_SQL_SCHEMA = `-- COPY AND RUN THIS IN SUPABASE SQL EDITOR TO CREATE TABLES (PROJECT: neuroconecta)

-- 1. User Profiles Table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id TEXT PRIMARY KEY DEFAULT 'default_user',
  preferred_name TEXT,
  pronouns TEXT,
  diagnosis_status TEXT,
  support_level INTEGER,
  current_focus TEXT,
  low_stimulation_mode BOOLEAN DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Test History Table
CREATE TABLE IF NOT EXISTS public.test_history (
  id TEXT PRIMARY KEY,
  test_id TEXT NOT NULL,
  test_title TEXT NOT NULL,
  date TEXT NOT NULL,
  score INTEGER NOT NULL,
  max_score INTEGER NOT NULL,
  interpretation_level TEXT NOT NULL,
  percentage INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Routine Tasks Table
CREATE TABLE IF NOT EXISTS public.routine_tasks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  target_time TEXT,
  duration_minutes INTEGER,
  icon TEXT,
  completed BOOLEAN DEFAULT false,
  urgency TEXT,
  energy_level TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Mood Logs Table
CREATE TABLE IF NOT EXISTS public.mood_logs (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  time TEXT NOT NULL,
  mood_score INTEGER NOT NULL,
  energy_score INTEGER NOT NULL,
  sensory_overload BOOLEAN DEFAULT false,
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Caregiver Logs Table
CREATE TABLE IF NOT EXISTS public.caregiver_logs (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  note TEXT NOT NULL,
  tag TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Disable RLS or set public policies for easy access
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.routine_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.caregiver_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select and insert user_profiles" ON public.user_profiles FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public select and insert test_history" ON public.test_history FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public select and insert routine_tasks" ON public.routine_tasks FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public select and insert mood_logs" ON public.mood_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow public select and insert caregiver_logs" ON public.caregiver_logs FOR ALL USING (true) WITH CHECK (true);
`;
