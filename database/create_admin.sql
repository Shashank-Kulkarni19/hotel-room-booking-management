-- Create/Update Admin User Script
-- Run this to ensure admin user exists with secure password

USE hotel_booking_db;

-- Delete existing admin if exists
DELETE FROM users WHERE email = 'admin@hotel.com';

-- Create new admin user
-- IMPORTANT: Replace the password hash with your own generated BCrypt hash
-- Generate hash at: https://bcrypt-generator.com/ (rounds: 10)
-- 
-- Example secure password: Admin@Secure2024!
-- You MUST generate your own hash for security!

INSERT INTO users (name, email, password, role, enabled) 
VALUES (
    'Admin User', 
    'admin@hotel.com', 
    '$2a$10$YOUR_BCRYPT_HASH_HERE',  -- REPLACE THIS with your generated hash
    'ROLE_ADMIN', 
    TRUE
);

-- Verify admin was created
SELECT id, name, email, role, enabled, 
       CASE WHEN password LIKE '$2a$10$%' THEN 'Password hash format: OK' ELSE 'Password hash format: INVALID' END as password_check
FROM users 
WHERE email = 'admin@hotel.com';

-- Instructions:
-- 1. Go to https://bcrypt-generator.com/
-- 2. Enter your secure password (e.g., "Admin@Secure2024!")
-- 3. Set rounds to 10
-- 4. Copy the generated hash
-- 5. Replace '$2a$10$YOUR_BCRYPT_HASH_HERE' above with your hash
-- 6. Run this script again

