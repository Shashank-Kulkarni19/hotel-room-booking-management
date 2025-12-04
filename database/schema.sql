-- Hotel Booking Management System Database Schema
-- MySQL Database

-- Create database
CREATE DATABASE IF NOT EXISTS hotel_booking_db;
USE hotel_booking_db;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'ROLE_USER',
    enabled BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Rooms table
CREATE TABLE IF NOT EXISTS rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    room_type VARCHAR(50) NOT NULL,
    room_number VARCHAR(20) NOT NULL UNIQUE,
    description TEXT,
    price DOUBLE NOT NULL,
    total_rooms INT NOT NULL,
    available_rooms INT NOT NULL,
    image LONGBLOB,
    available BOOLEAN NOT NULL DEFAULT TRUE,
    INDEX idx_room_number (room_number),
    INDEX idx_available (available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    total_amount DOUBLE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'BOOKED',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id),
    INDEX idx_room_id (room_id),
    INDEX idx_status (status),
    INDEX idx_dates (check_in_date, check_out_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Ratings table
CREATE TABLE IF NOT EXISTS ratings (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    rating INT NOT NULL,
    review TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_room_rating (user_id, room_id),
    INDEX idx_room_id (room_id),
    INDEX idx_user_id (user_id),
    INDEX idx_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Insert default admin user (password: admin123)
-- Password is BCrypt hashed: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
INSERT INTO users (name, email, password, role, enabled) 
VALUES ('Admin User', 'admin@hotel.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ROLE_ADMIN', TRUE)
ON DUPLICATE KEY UPDATE email=email;

-- Sample rooms data
INSERT INTO rooms (room_type, room_number, description, price, total_rooms, available_rooms, available) VALUES
('Single', '101', 'Comfortable single room with a queen-size bed', 50.00, 5, 5, TRUE),
('Double', '201', 'Spacious double room with two queen-size beds', 80.00, 3, 3, TRUE),
('Suite', '301', 'Luxurious suite with living area and premium amenities', 150.00, 2, 2, TRUE)
ON DUPLICATE KEY UPDATE room_number=room_number;

