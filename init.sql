-- ============================================================
-- EventZen — Database Initialization Script
-- Creates all 4 databases and their tables
-- Run: mysql -u root -p < init.sql
-- ============================================================

-- ============================================================
-- DATABASE 1: eventzen_users (User & Auth Service)
-- ============================================================
CREATE DATABASE IF NOT EXISTS eventzen_users;
USE eventzen_users;

CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'ORGANIZER', 'ATTENDEE') NOT NULL DEFAULT 'ATTENDEE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert default admin user (password: admin123 — BCrypt hash)
INSERT INTO users (name, email, password_hash, role) VALUES
('Admin User', 'admin@eventzen.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN');


-- ============================================================
-- DATABASE 2: eventzen_events (Event Service)
-- ============================================================
CREATE DATABASE IF NOT EXISTS eventzen_events;
USE eventzen_events;

CREATE TABLE IF NOT EXISTS venues (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    address VARCHAR(300) NOT NULL,
    city VARCHAR(100),
    capacity INT NOT NULL,
    cost_per_day DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS events (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    start_date DATETIME NOT NULL,
    end_date DATETIME NOT NULL,
    venue_id BIGINT,
    organizer_id BIGINT NOT NULL,
    status ENUM('DRAFT', 'PUBLISHED', 'ONGOING', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT',
    max_attendees INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (venue_id) REFERENCES venues(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    service_type VARCHAR(100) NOT NULL,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(20),
    cost DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS event_vendors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    vendor_id BIGINT NOT NULL,
    assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
    UNIQUE KEY unique_event_vendor (event_id, vendor_id)
);

-- Insert sample venues
INSERT INTO venues (name, address, city, capacity, cost_per_day) VALUES
('Grand Ballroom', '123 Main Street', 'Bangalore', 500, 50000.00),
('Tech Hub Conference Center', '456 Innovation Park', 'Bangalore', 200, 25000.00),
('Garden Pavilion', '789 Lake View Road', 'Mumbai', 150, 35000.00);


-- ============================================================
-- DATABASE 3: eventzen_attendees (Attendee Service)
-- ============================================================
CREATE DATABASE IF NOT EXISTS eventzen_attendees;
USE eventzen_attendees;

CREATE TABLE IF NOT EXISTS registrations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status ENUM('INVITED', 'CONFIRMED', 'DECLINED', 'WAITLISTED') NOT NULL DEFAULT 'INVITED',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_event_user (event_id, user_id)
);

CREATE TABLE IF NOT EXISTS invitations (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL,
    email VARCHAR(150) NOT NULL,
    invitee_name VARCHAR(100),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    rsvp_status ENUM('PENDING', 'ACCEPTED', 'DECLINED') NOT NULL DEFAULT 'PENDING',
    rsvp_at TIMESTAMP NULL
);


-- ============================================================
-- DATABASE 4: eventzen_budget (Budget Service)
-- ============================================================
CREATE DATABASE IF NOT EXISTS eventzen_budget;
USE eventzen_budget;

CREATE TABLE IF NOT EXISTS budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    event_id BIGINT NOT NULL UNIQUE,
    total_budget DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS expenses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    budget_id BIGINT NOT NULL,
    category ENUM('VENUE', 'CATERING', 'DECORATION', 'ENTERTAINMENT', 'MARKETING', 'TRANSPORTATION', 'STAFF', 'MISCELLANEOUS') NOT NULL,
    description VARCHAR(300),
    amount DECIMAL(10, 2) NOT NULL,
    expense_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (budget_id) REFERENCES budgets(id) ON DELETE CASCADE
);


-- ============================================================
-- Verification: Show all created databases and tables
-- ============================================================
SELECT 'DATABASE: eventzen_users' AS info;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'eventzen_users';

SELECT 'DATABASE: eventzen_events' AS info;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'eventzen_events';

SELECT 'DATABASE: eventzen_attendees' AS info;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'eventzen_attendees';

SELECT 'DATABASE: eventzen_budget' AS info;
SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = 'eventzen_budget';
