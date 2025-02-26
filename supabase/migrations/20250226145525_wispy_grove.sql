/*
  # Add user data export functionality

  1. New Views
    - `user_data_export`
      - Combines user profile data in an easy-to-export format
      - Includes name, phone, and resume URL
      - Adds formatted timestamps

  2. Security
    - Enable RLS on the view
    - Add policy for authenticated admin users only
*/

-- Create a view for exporting user data
CREATE VIEW user_data_export AS
SELECT
  p.name,
  p.phone,
  p.resume_url,
  TO_CHAR(p.created_at, 'YYYY-MM-DD HH24:MI:SS') as signup_date,
  TO_CHAR(p.updated_at, 'YYYY-MM-DD HH24:MI:SS') as last_updated
FROM profiles p;

-- Enable RLS on the view
ALTER VIEW user_data_export ENABLE ROW LEVEL SECURITY;

-- Create policy for admin access
CREATE POLICY "Allow admin access to export view"
  ON user_data_export
  FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = 'admin@techshaadi.com');

-- Function to export data as CSV
CREATE OR REPLACE FUNCTION export_user_data()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT string_agg(
    concat_ws(',',
      quote_literal(name),
      quote_literal(phone),
      quote_literal(resume_url),
      quote_literal(signup_date),
      quote_literal(last_updated)
    ),
    E'\n'
  )
  FROM user_data_export;
$$;