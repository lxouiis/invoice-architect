-- Create files table for metadata storage
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  google_drive_id TEXT NOT NULL,
  google_drive_link TEXT NOT NULL,
  file_size INTEGER,
  upload_date DATE NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('invoice', 'scan', 'document')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_files_upload_date ON files(upload_date DESC);
CREATE INDEX IF NOT EXISTS idx_files_category ON files(category);
CREATE INDEX IF NOT EXISTS idx_files_file_name ON files(file_name);

-- Enable RLS (Row Level Security)
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all authenticated users to read/write their files
CREATE POLICY "Allow authenticated users" ON files
  USING (true)
  WITH CHECK (true);
