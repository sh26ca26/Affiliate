-- ============================================
-- Affiliate SaaS - Initial Database Schema
-- ============================================

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  role ENUM('admin','merchant','affiliate') NOT NULL DEFAULT 'affiliate',
  merchant_id BIGINT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NULL,
  verified TINYINT DEFAULT 0,
  verification_token VARCHAR(255) NULL,
  verification_token_expires_at TIMESTAMP NULL,
  reset_token VARCHAR(255) NULL,
  reset_token_expires_at TIMESTAMP NULL,
  last_login_at TIMESTAMP NULL,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_merchant_id (merchant_id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Merchants Table
CREATE TABLE IF NOT EXISTS merchants (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT NULL,
  logo_url VARCHAR(500) NULL,
  website_url VARCHAR(500) NULL,
  api_key VARCHAR(128) UNIQUE NOT NULL,
  api_secret VARCHAR(128) NOT NULL,
  settings JSON DEFAULT '{}',
  commission_rate DECIMAL(5,2) DEFAULT 10.00,
  payout_schedule ENUM('instant','weekly','monthly','net30') DEFAULT 'monthly',
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_api_key (api_key),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Affiliates Table
CREATE TABLE IF NOT EXISTS affiliates (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL UNIQUE,
  affiliate_code VARCHAR(64) UNIQUE NOT NULL,
  display_name VARCHAR(255) NULL,
  bio TEXT NULL,
  avatar_url VARCHAR(500) NULL,
  website_url VARCHAR(500) NULL,
  social_links JSON DEFAULT '{}',
  metadata JSON DEFAULT '{}',
  total_clicks BIGINT DEFAULT 0,
  total_conversions BIGINT DEFAULT 0,
  total_earnings DECIMAL(12,2) DEFAULT 0.00,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_affiliate_code (affiliate_code),
  INDEX idx_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Links Table (Referral Links)
CREATE TABLE IF NOT EXISTS links (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  merchant_id BIGINT NOT NULL,
  affiliate_id BIGINT NULL,
  type ENUM('store','product','offer','custom') DEFAULT 'store',
  target_id VARCHAR(255) NULL,
  target_url VARCHAR(500) NOT NULL,
  slug VARCHAR(128) UNIQUE NOT NULL,
  title VARCHAR(255) NULL,
  description TEXT NULL,
  utm_params JSON DEFAULT '{}',
  metadata JSON DEFAULT '{}',
  total_clicks BIGINT DEFAULT 0,
  total_conversions BIGINT DEFAULT 0,
  is_active TINYINT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_slug (slug),
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_affiliate_id (affiliate_id),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Clicks Table
CREATE TABLE IF NOT EXISTS clicks (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  link_id BIGINT NOT NULL,
  affiliate_id BIGINT NULL,
  merchant_id BIGINT NOT NULL,
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  referrer VARCHAR(500) NULL,
  country VARCHAR(2) NULL,
  city VARCHAR(100) NULL,
  device_type VARCHAR(50) NULL,
  browser VARCHAR(100) NULL,
  os VARCHAR(100) NULL,
  utm JSON DEFAULT '{}',
  custom_params JSON DEFAULT '{}',
  session_id VARCHAR(255) NULL,
  fingerprint VARCHAR(255) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_link_id (link_id),
  INDEX idx_affiliate_id (affiliate_id),
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_created_at (created_at),
  INDEX idx_ip_address (ip_address),
  INDEX idx_session_id (session_id),
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE SET NULL,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Conversions Table
CREATE TABLE IF NOT EXISTS conversions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  order_id VARCHAR(128) NOT NULL,
  link_id BIGINT NOT NULL,
  affiliate_id BIGINT NULL,
  merchant_id BIGINT NOT NULL,
  customer_email VARCHAR(255) NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  status ENUM('pending','approved','rejected','refunded') DEFAULT 'pending',
  rejection_reason VARCHAR(255) NULL,
  metadata JSON DEFAULT '{}',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  UNIQUE KEY unique_order_id (order_id, merchant_id),
  INDEX idx_link_id (link_id),
  INDEX idx_affiliate_id (affiliate_id),
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE CASCADE,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE SET NULL,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Commissions Table
CREATE TABLE IF NOT EXISTS commissions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  conversion_id BIGINT NOT NULL,
  affiliate_id BIGINT NOT NULL,
  merchant_id BIGINT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  rate DECIMAL(5,2) NOT NULL,
  status ENUM('unpaid','pending_payout','paid','refunded') DEFAULT 'unpaid',
  payout_id BIGINT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP NULL,
  
  INDEX idx_conversion_id (conversion_id),
  INDEX idx_affiliate_id (affiliate_id),
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (conversion_id) REFERENCES conversions(id) ON DELETE CASCADE,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE,
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payouts Table
CREATE TABLE IF NOT EXISTS payouts (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  affiliate_id BIGINT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'USD',
  method VARCHAR(64) NOT NULL,
  method_details JSON DEFAULT '{}',
  status ENUM('requested','approved','processing','completed','failed','cancelled') DEFAULT 'requested',
  transaction_id VARCHAR(255) NULL,
  failure_reason VARCHAR(255) NULL,
  metadata JSON DEFAULT '{}',
  requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  processed_at TIMESTAMP NULL,
  completed_at TIMESTAMP NULL,
  
  INDEX idx_affiliate_id (affiliate_id),
  INDEX idx_status (status),
  INDEX idx_requested_at (requested_at),
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fraud Logs Table
CREATE TABLE IF NOT EXISTS fraud_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  merchant_id BIGINT NULL,
  affiliate_id BIGINT NULL,
  link_id BIGINT NULL,
  conversion_id BIGINT NULL,
  click_id BIGINT NULL,
  reason VARCHAR(255) NOT NULL,
  severity ENUM('low','medium','high','critical') DEFAULT 'medium',
  status ENUM('flagged','under_review','resolved','dismissed') DEFAULT 'flagged',
  meta JSON DEFAULT '{}',
  reviewed_by BIGINT NULL,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_merchant_id (merchant_id),
  INDEX idx_affiliate_id (affiliate_id),
  INDEX idx_severity (severity),
  INDEX idx_status (status),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE SET NULL,
  FOREIGN KEY (affiliate_id) REFERENCES affiliates(id) ON DELETE SET NULL,
  FOREIGN KEY (link_id) REFERENCES links(id) ON DELETE SET NULL,
  FOREIGN KEY (conversion_id) REFERENCES conversions(id) ON DELETE SET NULL,
  FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NULL,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(100) NOT NULL,
  entity_id BIGINT NULL,
  changes JSON DEFAULT '{}',
  ip_address VARCHAR(45) NULL,
  user_agent TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_action (action),
  INDEX idx_entity_type (entity_type),
  INDEX idx_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Refresh Tokens Table
CREATE TABLE IF NOT EXISTS refresh_tokens (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  token VARCHAR(500) NOT NULL UNIQUE,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  INDEX idx_user_id (user_id),
  INDEX idx_expires_at (expires_at),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Store Integrations Table
CREATE TABLE IF NOT EXISTS store_integrations (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  merchant_id BIGINT NOT NULL,
  type ENUM('shopify','woocommerce','custom','api') NOT NULL,
  config JSON DEFAULT '{}',
  is_active TINYINT DEFAULT 1,
  last_sync_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX idx_merchant_id (merchant_id),
  FOREIGN KEY (merchant_id) REFERENCES merchants(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- Create Indexes for Performance
-- ============================================

ALTER TABLE clicks ADD INDEX idx_created_at_merchant (created_at, merchant_id);
ALTER TABLE conversions ADD INDEX idx_created_at_merchant (created_at, merchant_id);
ALTER TABLE commissions ADD INDEX idx_created_at_affiliate (created_at, affiliate_id);

-- ============================================
-- Sample Data (Optional)
-- ============================================

-- Admin User
INSERT INTO users (role, name, email, password_hash, verified, is_active) 
VALUES ('admin', 'Platform Admin', 'admin@affiliatesaas.com', '$2b$10$YourHashedPasswordHere', 1, 1)
ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);

-- Demo Merchant
INSERT INTO merchants (user_id, name, slug, api_key, api_secret, commission_rate, payout_schedule) 
VALUES (1, 'Demo Shop', 'demo-shop', 'demo-api-key-123', 'demo-api-secret-456', 10.00, 'monthly')
ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);

-- Demo Affiliate
INSERT INTO users (role, name, email, password_hash, verified, is_active) 
VALUES ('affiliate', 'Demo Affiliate', 'affiliate@example.com', '$2b$10$YourHashedPasswordHere', 1, 1)
ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);

INSERT INTO affiliates (user_id, affiliate_code, display_name) 
VALUES (2, 'AFF-DEMO-001', 'Demo Affiliate')
ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);

-- Demo Link
INSERT INTO links (merchant_id, affiliate_id, type, target_url, slug, title) 
VALUES (1, 1, 'store', 'https://demo-shop.com', 'demo-aff-link', 'Demo Shop Referral Link')
ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id);

