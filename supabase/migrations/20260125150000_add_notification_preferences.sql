-- Add notification preferences to profiles
ALTER TABLE profiles
ADD COLUMN email_notifications BOOLEAN DEFAULT true;

-- Add comment to clarify field purpose
COMMENT ON COLUMN profiles.email_notifications IS 'Whether user wants to receive email notifications for new updates';

-- Update existing clients to opt-in by default
UPDATE profiles
SET email_notifications = true
WHERE role = 'client';
