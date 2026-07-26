-- ============================================================
-- RMS BACKEND — extra tables (run AFTER importing RMS_Sample_Data.sql)
-- Adds the two tables the Return Management System needs on top of
-- your existing customers / products / orders / order_items tables.
-- ============================================================
USE COMPANY;

-- ------------------------------------------------------------
-- users: Admin and Staff login accounts
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    user_id       INT PRIMARY KEY AUTO_INCREMENT,
    full_name     VARCHAR(100)  NOT NULL,
    email         VARCHAR(100)  UNIQUE NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    role          ENUM('admin','staff','warehouse') NOT NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
-- return_requests: every return / exchange (RMA) record
-- (named return_requests because RETURNS is a reserved word in MySQL)
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS return_requests (
    return_id           INT PRIMARY KEY AUTO_INCREMENT,
    rma_id              VARCHAR(50)  UNIQUE NOT NULL,
    order_id            VARCHAR(50)  NOT NULL,
    order_item_id       INT          NOT NULL,
    product_id          INT          NOT NULL,
    customer_id         INT          NOT NULL,
    request_type        ENUM('return','exchange') NOT NULL,
    reason_code         ENUM('not_fit','wrong_item','not_like','defected') NOT NULL,
    reason              VARCHAR(255) NOT NULL,
    refund_method       ENUM('bank_account','store_credit') DEFAULT NULL,
    refund_amount       DECIMAL(10,2) DEFAULT NULL,
    bank_name           VARCHAR(100) DEFAULT NULL,
    bank_account        VARCHAR(100) DEFAULT NULL,
    beneficiary_name    VARCHAR(100) DEFAULT NULL,
    exchange_product_id INT          DEFAULT NULL,
    exchange_size       VARCHAR(20)  DEFAULT NULL,
    defect_confidence   DECIMAL(5,2) DEFAULT NULL,
    status              ENUM('pending','accepted','rejected','completed') NOT NULL DEFAULT 'pending',
    tracking_stage      ENUM('received','in_transit','inspected','restocked') NOT NULL DEFAULT 'received',
    created_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP    DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rr_order    FOREIGN KEY (order_id)            REFERENCES orders(order_id),
    CONSTRAINT fk_rr_item     FOREIGN KEY (order_item_id)       REFERENCES order_items(order_item_id),
    CONSTRAINT fk_rr_product  FOREIGN KEY (product_id)          REFERENCES products(product_id),
    CONSTRAINT fk_rr_customer FOREIGN KEY (customer_id)         REFERENCES customers(customer_id),
    CONSTRAINT fk_rr_exchange FOREIGN KEY (exchange_product_id) REFERENCES products(product_id)
);
