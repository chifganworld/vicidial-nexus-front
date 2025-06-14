
-- Create a table to store Vicidial integration settings
CREATE TABLE public.vicidial_integration (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vicidial_domain TEXT NOT NULL,
  api_user TEXT NOT NULL,
  api_password TEXT NOT NULL, -- Reminder: Consider secure storage like Supabase Vault for this
  ports TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.vicidial_integration ENABLE ROW LEVEL SECURITY;

-- Policies:
-- Allow authenticated users to view all configurations (assuming there might be few, or a single one)
CREATE POLICY "Authenticated users can view vicidial_integration"
  ON public.vicidial_integration
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow authenticated users to insert new configurations
CREATE POLICY "Authenticated users can insert vicidial_integration"
  ON public.vicidial_integration
  FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to update configurations
-- For simplicity, allowing update on any row. Could be restricted further.
CREATE POLICY "Authenticated users can update vicidial_integration"
  ON public.vicidial_integration
  FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

-- Allow authenticated users to delete configurations
CREATE POLICY "Authenticated users can delete vicidial_integration"
  ON public.vicidial_integration
  FOR DELETE
  USING (auth.role() = 'authenticated');

-- Optional: Create a trigger to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_vicidial_integration_updated_at
BEFORE UPDATE ON public.vicidial_integration
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

