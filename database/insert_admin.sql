-- SQL Query to Insert Admin User
-- Run this query in your MySQL database

USE hotel_booking_db;

-- Option 1: Insert Admin with Secure Password
-- Password: Admin@Secure2024!
-- IMPORTANT: You need to generate your own BCrypt hash at https://bcrypt-generator.com/
-- Replace the password hash below with your generated hash

INSERT INTO users (name, email, password, role, enabled) 
VALUES (
    'Admin User', 
    'admin@hotel.com', 
    '$2a$10$YOUR_BCRYPT_HASH_HERE',  -- REPLACE THIS with hash from https://bcrypt-generator.com/
    'ROLE_ADMIN', 
    TRUE
);

-- Option 2: Insert Admin with Default Password (admin123)
-- WARNING: This password is insecure and found in data breaches!
-- Use only for testing, change immediately in production

INSERT INTO users (name, email, password, role, enabled) 
VALUES (
    'Admin User', 
    'admin@hotel.com', 
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 
    'ROLE_ADMIN', 
    TRUE
)
ON DUPLICATE KEY UPDATE email=email;

-- Verify the admin was created
SELECT id, name, email, role, enabled FROM users WHERE email = 'admin@hotel.com';

-- Instructions:
-- 1. Go to https://bcrypt-generator.com/
-- 2. Enter your secure password (e.g., "Admin@Secure2024!")
-- 3. Set rounds to 10
-- 4. Copy the generated hash
-- 5. Replace '$2a$10$YOUR_BCRYPT_HASH_HERE' in Option 1 above
-- 6. Run the INSERT query

