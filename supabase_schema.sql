-- ============================================================
-- SUPABASE DATABASE SETUP FOR IMRAN HOSSAIN PORTFOLIO
-- ============================================================
-- Instructions:
-- 1. Go to your Supabase project (https://supabase.com/dashboard)
-- 2. Open the "SQL Editor" from the left menu
-- 3. Click "New query", paste this entire script, and click "Run"
-- ============================================================

-- 1. Create the portfolio_content table
CREATE TABLE IF NOT EXISTS public.portfolio_content (
  id TEXT PRIMARY KEY DEFAULT 'main',
  data JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.portfolio_content ENABLE ROW LEVEL SECURITY;

-- 3. Allow public read-only access (anyone visiting the site can load portfolio data)
DROP POLICY IF EXISTS "Allow public read access" ON public.portfolio_content;
CREATE POLICY "Allow public read access"
  ON public.portfolio_content
  FOR SELECT
  TO public
  USING (true);

-- 4. Allow insert and update access (authenticated or through API)
DROP POLICY IF EXISTS "Allow all access" ON public.portfolio_content;
CREATE POLICY "Allow all access"
  ON public.portfolio_content
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- 5. Create an updated_at auto-refresh trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at ON public.portfolio_content;
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.portfolio_content
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Done! Your database is now ready to store portfolio content.
