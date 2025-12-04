-- Update Admin Password Script
-- Run this script to update the admin password

USE hotel_booking_db;

-- Option 1: Update existing admin user with new password
-- Replace 'NEW_BCRYPT_HASH' with the BCrypt hash of your new password
-- You can generate BCrypt hash at: https://bcrypt-generator.com/ (rounds: 10)

-- Example: Password "Admin@2024" (BCrypt hash)
UPDATE users 
SET password = '$2a$10$8K1p/a0dL1L0YqZ5X5X5XeX5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X5X' 
WHERE email = 'admin@hotel.com';

-- Option 2: Delete old admin and create new one with secure password
-- First, delete if exists
DELETE FROM users WHERE email = 'admin@hotel.com';

-- Insert new admin with secure password
-- Password: Admin@Secure2024!
-- BCrypt Hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- (This is just an example - generate your own hash)

-- To generate your own BCrypt hash:
-- 1. Go to https://bcrypt-generator.com/
-- 2. Enter your new password
-- 3. Set rounds to 10
-- 4. Copy the generated hash
-- 5. Replace the hash below

INSERT INTO users (name, email, password, role, enabled) 
VALUES ('Admin User', 'admin@hotel.com', 
        '$2a$10$YOUR_NEW_BCRYPT_HASH_HERE', 
        'ROLE_ADMIN', TRUE);

-- Verify admin user
SELECT id, name, email, role, enabled FROM users WHERE email = 'admin@hotel.com';

