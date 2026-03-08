
-- Drop the restrictive policies
DROP POLICY IF EXISTS "Anyone can insert generated invoices" ON public.generated_invoices;
DROP POLICY IF EXISTS "Anyone can view generated invoices" ON public.generated_invoices;

-- Recreate as permissive policies
CREATE POLICY "Anyone can insert generated invoices"
ON public.generated_invoices
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Anyone can view generated invoices"
ON public.generated_invoices
FOR SELECT
TO anon, authenticated
USING (true);
