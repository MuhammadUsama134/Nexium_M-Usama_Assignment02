-- Create blog_summaries table in Supabase
CREATE TABLE IF NOT EXISTS blog_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  urdu_summary TEXT NOT NULL,
  word_count INTEGER DEFAULT 0,
  summary_method VARCHAR(20) DEFAULT 'static',
  processing_time INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_blog_summaries_url ON blog_summaries(url);
CREATE INDEX IF NOT EXISTS idx_blog_summaries_created_at ON blog_summaries(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_summaries_method ON blog_summaries(summary_method);
CREATE INDEX IF NOT EXISTS idx_blog_summaries_word_count ON blog_summaries(word_count);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_blog_summaries_updated_at 
    BEFORE UPDATE ON blog_summaries 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies if needed
ALTER TABLE blog_summaries ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations for now (adjust based on your auth requirements)
CREATE POLICY "Allow all operations on blog_summaries" ON blog_summaries
    FOR ALL USING (true);
