
CREATE POLICY "Anyone can update invoices"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'invoices')
WITH CHECK (bucket_id = 'invoices');
