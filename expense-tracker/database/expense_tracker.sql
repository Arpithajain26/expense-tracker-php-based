-- ========================================================
-- Personal Expense Tracker - Database Schema & Seed Data
-- Database Name: expense_tracker
-- Compatible with MySQL 5.7+ / MySQL 8.0+ / MariaDB (XAMPP)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `expense_tracker` 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `expense_tracker`;

-- --------------------------------------------------------
-- Table structure for table `users`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `categories`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `categories` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED DEFAULT NULL,
  `name` VARCHAR(80) NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_categories_user` (`user_id`),
  CONSTRAINT `fk_categories_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Table structure for table `transactions`
-- --------------------------------------------------------
CREATE TABLE IF NOT EXISTS `transactions` (
  `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` INT UNSIGNED NOT NULL,
  `category_id` INT UNSIGNED NOT NULL,
  `type` ENUM('income', 'expense') NOT NULL,
  `amount` DECIMAL(10,2) NOT NULL,
  `transaction_date` DATE NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_transactions_user` (`user_id`),
  KEY `fk_transactions_category` (`category_id`),
  KEY `idx_transactions_date` (`transaction_date`),
  CONSTRAINT `fk_transactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_transactions_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------
-- Default Global Categories (user_id IS NULL)
-- --------------------------------------------------------
INSERT INTO `categories` (`user_id`, `name`, `type`) VALUES
-- Income categories
(NULL, 'Salary', 'income'),
(NULL, 'Freelance / Projects', 'income'),
(NULL, 'Allowance / Stipend', 'income'),
(NULL, 'Investments', 'income'),
(NULL, 'Other Income', 'income'),
-- Expense categories
(NULL, 'Food & Dining', 'expense'),
(NULL, 'Transportation', 'expense'),
(NULL, 'Shopping', 'expense'),
(NULL, 'Education & Books', 'expense'),
(NULL, 'Entertainment', 'expense'),
(NULL, 'Bills & Utilities', 'expense'),
(NULL, 'Healthcare', 'expense'),
(NULL, 'Rent & Housing', 'expense'),
(NULL, 'Other Expense', 'expense');

-- --------------------------------------------------------
-- Sample Demo User (Optional for testing)
-- Email: student@college.edu | Password: password123
-- (Hash generated using PASSWORD_BCRYPT)
-- --------------------------------------------------------
INSERT INTO `users` (`name`, `email`, `password`) VALUES
('Rahul Sharma', 'student@college.edu', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample initial transactions for demo user (id: 1)
INSERT INTO `transactions` (`user_id`, `category_id`, `type`, `amount`, `transaction_date`, `description`) VALUES
(1, 1, 'income', 35000.00, '2026-10-01', 'Monthly Internship Stipend'),
(1, 2, 'income', 8500.00, '2026-10-08', 'Frontend Web Design Freelance'),
(1, 6, 'expense', 4200.00, '2026-10-03', 'Hostel Mess & Grocery Shopping'),
(1, 7, 'expense', 1850.00, '2026-10-05', 'Metro Pass & Bus Recharge'),
(1, 9, 'expense', 1200.00, '2026-10-06', 'Database & Cloud Computing Textbooks'),
(1, 11, 'expense', 1450.00, '2026-10-09', 'Internet Wifi & Mobile Bill'),
(1, 10, 'expense', 950.00, '2026-10-10', 'Weekend Movie with College Friends');
