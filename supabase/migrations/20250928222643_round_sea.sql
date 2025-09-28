/*
  # Create pets table and storage

  1. New Tables
    - `pets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `breed` (text)
      - `personality` (text)
      - `about` (text)
      - `owner_name` (text)
      - `owner_phone` (text)
      - `owner_email` (text)
      - `image_url` (text, optional)
      - `qr_code` (text, optional)
      - `created_at` (timestamp)

  2. Storage
    - Create `pets` bucket for images

  3. Security
    - Enable RLS on `pets` table
    - Add policies for authenticated users to manage their pets
    - Add policy for public read access to individual pets
*/

-- Create pets table
CREATE TABLE IF NOT EXISTS pets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL DEFAULT '',
  breed text NOT NULL DEFAULT '',
  personality text NOT NULL DEFAULT '',
  about text NOT NULL DEFAULT '',
  owner_name text NOT NULL DEFAULT '',
  owner_phone text NOT NULL DEFAULT '',
  owner_email text NOT NULL DEFAULT '',
  image_url text DEFAULT '',
  qr_code text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;

-- Policy for users to manage their own pets
CREATE POLICY "Users can manage their own pets"
  ON pets
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for public read access (for QR code scanning)
CREATE POLICY "Anyone can view individual pets"
  ON pets
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create storage bucket for pet images
INSERT INTO storage.buckets (id, name, public)
VALUES ('pets', 'pets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow public access to pet images
CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'pets');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'pets');

-- Allow authenticated users to update their own images
CREATE POLICY "Users can update own images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'pets');

-- Allow authenticated users to delete their own images
CREATE POLICY "Users can delete own images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'pets');