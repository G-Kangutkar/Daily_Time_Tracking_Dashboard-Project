/*
  # Time Tracking Application - Activities Table

  1. New Tables
    - `activities`
      - `id` (uuid, primary key) - Unique identifier for each activity
      - `user_id` (uuid, foreign key) - References auth.users
      - `date` (date) - The date this activity belongs to
      - `activity_name` (text) - Name/title of the activity
      - `category` (text) - Category like Work, Study, Sleep, Entertainment, Exercise, etc.
      - `duration_minutes` (integer) - Duration in minutes (must be > 0)
      - `created_at` (timestamptz) - Timestamp when record was created
      - `updated_at` (timestamptz) - Timestamp when record was last updated

  2. Security
    - Enable RLS on `activities` table
    - Add policy for users to read their own activities
    - Add policy for users to insert their own activities
    - Add policy for users to update their own activities
    - Add policy for users to delete their own activities

  3. Indexes
    - Add index on (user_id, date) for fast lookups by user and date
*/

CREATE TABLE IF NOT EXISTS activities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date date NOT NULL,
  activity_name text NOT NULL,
  category text NOT NULL,
  duration_minutes integer NOT NULL CHECK (duration_minutes > 0),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activities"
  ON activities FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities"
  ON activities FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities"
  ON activities FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities"
  ON activities FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_activities_user_date ON activities(user_id, date);
