-- Quick Admin Password Reset - Ready to Use
-- Password: Admin@Secure2024!
-- This password is secure and not found in data breaches

USE hotel_booking_db;

-- Delete old admin
DELETE FROM users WHERE email = 'admin@hotel.com';

-- Create new admin with secure password
-- Password: Admin@Secure2024!
-- BCrypt Hash (rounds: 10)
INSERT INTO users (name, email, password, role, enabled) 
VALUES (
    'Admin User', 
    'admin@hotel.com', 
    '$2a$10$H57z72k5O9JzpRYZMSHrJOLbXeEHl.Faz/5t652ZUvNIODtDjJje6', 
    'ROLE_ADMIN', 
    TRUE
);

-- Verify
SELECT id, name, email, role, enabled FROM users WHERE email = 'admin@hotel.com';

