-- QUICK ADMIN INSERT - Copy and Paste This Query
-- This will create/update admin user

USE hotel_booking_db;

-- Delete existing admin if you want to recreate
-- DELETE FROM users WHERE email = 'admin@hotel.com';

-- Insert Admin User
-- Password: admin123 (INSECURE - Change immediately!)
INSERT INTO users (name, email, password, role, enabled) 
VALUES (
    'Admin User', 
    'admin@hotel.com', 
    '$2a$10$GM1TBjf5Y3g9z377EOZA8e4fKhEoM.iaBviuihD1340PmAwzYKSKW', 
    'ROLE_ADMIN', 
    TRUE
)
ON DUPLICATE KEY UPDATE 
    name = 'Admin User',
    role = 'ROLE_ADMIN',
    enabled = TRUE;

-- Verify
SELECT id, name, email, role, enabled FROM users WHERE email = 'admin@hotel.com';

-- Login Credentials:
-- Email: admin@hotel.com
-- Password: admin123
-- 
-- ⚠️ WARNING: Change password immediately for security!

