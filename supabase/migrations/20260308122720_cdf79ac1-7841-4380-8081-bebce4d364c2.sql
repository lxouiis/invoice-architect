
-- Create storage bucket for invoice files (public so anyone with the link can download)
INSERT INTO storage.buckets (id, name, public) VALUES ('invoices', 'invoices', true);

-- Allow anyone to read files from the invoices bucket (public download)
CREATE POLICY "Invoice files are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'invoices');

-- Allow anonymous uploads to the invoices bucket (no auth required for MVP)
CREATE POLICY "Anyone can upload invoices"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'invoices');

-- Create table to track generated invoices
CREATE TABLE public.generated_invoices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  invoice_numbers TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.generated_invoices ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and insert (no auth for MVP)
CREATE POLICY "Anyone can view generated invoices"
ON public.generated_invoices FOR SELECT
USING (true);

CREATE POLICY "Anyone can insert generated invoices"
ON public.generated_invoices FOR INSERT
WITH CHECK (true);
