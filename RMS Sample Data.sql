-- ============================================================
-- RMS SAMPLE DATABASE
-- Simulates XYZ Clothing Company's Database
-- ============================================================
-- CREATING THE SCHEMA/DATBASE

  CREATE SCHEMA COMPANY;
  
-- USING THE SCHEMA

  USE COMPANY;
  
-- ============================================================
-- TABLE 1: customers
-- Simulates the clothing company's registered customers
-- ============================================================
CREATE TABLE customers (
    customer_id     INT PRIMARY KEY AUTO_INCREMENT,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(100)    UNIQUE NOT NULL,
    phone           VARCHAR(20)     NOT NULL,
    street          VARCHAR(255)    NOT NULL,
    city            VARCHAR(100)    NOT NULL,
    state           VARCHAR(100)    NOT NULL,
    postal_code     VARCHAR(20)     NOT NULL,
    country         VARCHAR(100)    NOT NULL DEFAULT 'Pakistan',
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);
 
INSERT INTO customers
    (full_name, email, phone, street, city, state, postal_code, country)
VALUES
    ('Ali Hassan','ali.hassan@gmail.com','0300-1234567','House 12, Street 4, Gulberg III','Lahore','Punjab','54000', 'Pakistan'),
    ('Sara Khan','sara.khan@gmail.com','0301-2345678', 'Flat 5B, Block C, Clifton','Karachi','Sindh',     '75600', 'Pakistan'),
    ('Usman Tariq','usman.tariq@gmail.com','0302-3456789', 'House 88, F-7/2','Islamabad',  'ICT','44000', 'Pakistan'),
    ('Ayesha Malik','ayesha.malik@gmail.com','0303-4567890', 'Plot 22, Phase 5, DHA','Lahore','Punjab','54810', 'Pakistan'),
    ('Bilal Ahmed','bilal.ahmed@gmail.com','0304-5678901', 'House 3, Sector G-11/1','Islamabad','ICT','44100', 'Pakistan'),
    ('Hina Iqbal','hina.iqbal@gmail.com','0305-6789012', 'Apartment 9, Block 4, PECHS','Karachi','Sindh','75400', 'Pakistan'),
    ('Zain Raza','zain.raza@gmail.com','0306-7890123', 'House 44, Model Town','Lahore','Punjab','54700', 'Pakistan'),
    ('Fatima Noor','fatima.noor@gmail.com','0307-8901234', 'House 7, Street 2, Hayatabad','Peshawar','KPK','25000', 'Pakistan'),
    ('Omar Sheikh','omar.sheikh@gmail.com','0308-9012345', 'Flat 11A, Defence View Apartments','Karachi','Sindh','75500', 'Pakistan'),
    ('Maham Yousuf','maham.yousuf@gmail.com','0309-0123456', 'House 19, Johar Town','Lahore','Punjab','54782','Pakistan'),
    ('Hamza Butt','hamza.butt@gmail.com','0310-1234568', 'House 55, G-9 Markaz','Islamabad','ICT','44060', 'Pakistan'),
    ('Nadia Siddiqui','nadia.siddiqui@gmail.com','0311-2345679', 'Plot 8, Block H, North Nazimabad','Karachi','Sindh','74700', 'Pakistan'),
    ('Faisal Qureshi','faisal.qureshi@gmail.com','0312-3456780', 'House 31, Wapda Town','Lahore','Punjab','54770', 'Pakistan'),
    ('Sana Awan','sana.awan@gmail.com','0313-4567891', 'House 6, Cantonment Area','Rawalpindi','Punjab','46000', 'Pakistan'),
    ('Taha Mirza','taha.mirza@gmail.com','0314-5678902', 'House 14, Samanabad','Lahore','Punjab','54500', 'Pakistan');
 
 -- SAMPLE CHECK 
 SELECT * FROM CUSTOMERS;
 
 
-- ============================================================
-- TABLE 2: products
-- Simulates the clothing company's product catalog
-- ============================================================
CREATE TABLE products (
    product_id      INT             PRIMARY KEY AUTO_INCREMENT,
    sku             VARCHAR(100)    UNIQUE NOT NULL,
    product_name    VARCHAR(255)    NOT NULL,
    category        VARCHAR(100)    NOT NULL,
    brand           VARCHAR(100)    NOT NULL,
    price           DECIMAL(10,2)   NOT NULL,
    color           VARCHAR(50)     NOT NULL,
    size_options    VARCHAR(100)    NOT NULL,
    material        VARCHAR(100)    NOT NULL,
    image_url       VARCHAR(500)    NOT NULL,
    stock_quantity  INT             DEFAULT 50,
    is_active       BOOLEAN         DEFAULT TRUE,
    created_at      TIMESTAMP       DEFAULT CURRENT_TIMESTAMP
);
 
INSERT INTO products
    (sku, product_name, category, brand, price, color, size_options, material, image_url, stock_quantity)
VALUES
    ('XYZ-TS-001', 'Classic Crew Neck T-Shirt',        'T-Shirt',   'Az Clothing', 1299.00, 'White',       'S,M,L,XL,XXL',  'Cotton 100%',         'https://drive.google.com/file/d/1TITWp-y0y7Ek1xdTGlHAglh74byG-OkW/view?usp=drive_link',      120),
    ('XYZ-TS-002', 'Classic Crew Neck T-Shirt',        'T-Shirt',   'Az Clothing', 1299.00, 'Black',       'S,M,L,XL,XXL',  'Cotton 100%',         'https://drive.google.com/file/d/1WqM-UaowNE2I1xcLvT0d6XR0U_U4kgiu/view?usp=sharing',      100),
    ('XYZ-TS-003', 'Classic Crew Neck T-Shirt',        'T-Shirt',   'Az Clothing', 1299.00, 'Blue',       'S,M,L,XL,XXL',  'Cotton 100%',         'https://drive.google.com/file/d/1yukkUXyH5E1OeVsNBQtgV72KifGh_Pkn/view?usp=sharing',      120),
    ('XYZ-TS-004', 'Classic Crew Neck T-Shirt',        'T-Shirt',   'Az Clothing', 1299.00, 'Pink',       'S,M,L,XL,XXL',  'Cotton 100%',         'https://drive.google.com/file/d/1vaPGDrzAw3qmX7im6wdxHjErgw_fqtNL/view?usp=sharing',      90),
    ('XYZ-TS-005', 'Classic Crew Neck T-Shirt',        'T-Shirt',   'Az Clothing', 1299.00, 'Sky Blue',       'S,M,L,XL,XXL',  'Cotton 100%',         'https://drive.google.com/file/d/1jEKncSHtnH4UWyNjPGwVsjr-zwPQrYOu/view?usp=sharing',      70),
    ('XYZ-TS-010', 'Polo Collor T-Shirt', 		       'T-Shirt',   'Az Clothing', 1599.00, 'Browm',       'S,M,L,XL,XXL',  'Cotton 100%',         'https://drive.google.com/file/d/1m4PYki1Ti1HIeaJCclRhDvQVRZ2lTqNq/view?usp=sharing',      70),
    ('XYZ-TS-011', 'Polo Collor T-Shirt',        	   'T-Shirt',   'Az Clothing', 1599.00, 'Green',       'S,M,L,XL',  'Cotton 100%',         'https://drive.google.com/file/d/1rM81VXBOAbjqApGEpWb0Xf8kRech4nOv/view?usp=sharing',      70),
    ('XYZ-TS-012', 'Polo Collor T-Shirt',              'T-Shirt',   'Az Clothing', 1599.00, 'Navy Blue',       'S,M,L,XL,XXL',  'Cotton 100%',         'https://drive.google.com/file/d/1E1G-R8AHkzkYm4ABIr_nzz2c8GZvya2E/view?usp=sharing',      70),
    ('XYZ-TS-013', 'Polo Collor T-Shirt',              'T-Shirt',   'Az Clothing', 1599.00, 'Purple',       'S,M,L,XL',  'Cotton 100%',         'https://drive.google.com/file/d/186dS_2J7RwBGw2-D3QawC0PKRIAUdAFu/view?usp=sharing',      70),
    ('XYZ-TS-014', 'Polo Collor T-Shirt',              'T-Shirt',   'Az Clothing', 1599.00, 'Red',       'S,M,L,XL',  'Cotton 100%',         'https://drive.google.com/file/d/1qEmhyd4H7q9Liu4mkSz2C8AjUMjNShLk/view?usp=sharing',      70),
    ('XYZ-TS-015', 'Polo Collor T-Shirt',              'T-Shirt',   'Az Clothing', 1599.00, 'White',       'S,M,L,XL,XXL',  'Cotton 100%',         'https://drive.google.com/file/d/1EbmXdCUK6FBz6AA67bZEdkoJwylqYaeP/view?usp=sharing',      70),
	('XYZ-TS-021', 'Zipper Polo Collor T-Shirt',       'T-Shirt',   'Az Clothing', 1899.00, 'Brown',       'S,M,L,XL,XXL',  'Cotton 100%',         'https://drive.google.com/file/d/19ry7uX3nG5MOt3oA90Dv9xKFV85yftZM/view?usp=sharing',      70),
    ('XYZ-TS-022', 'Zipper Polo Collor T-Shirt',       'T-Shirt',   'Az Clothing', 1899.00, 'Pink',       'S,M,L,XL,XXL',  'Cotton 100%',         'https://drive.google.com/file/d/1HoZJuRHYiaa5GWrG2TQB58TRW0gj7vHs/view?usp=sharing',      70),
    ('XYZ-SH-001', 'Formal Oxford Button Down Shirt',  'Shirt',     'Az Clothing', 2499.00, 'Light Blue',  'S,M,L,XL,XXL',  'Cotton Blend',        'https://drive.google.com/file/d/19HQyiaZk0vFujS1lSzaiy66r-AwC7-eK/view?usp=drive_link',        70),
    ('XYZ-SH-002', 'Casual Flannel Check Shirt',       'Shirt',     'Az Clothing', 2199.00, 'Red/Black',   'S,M,L,XL',      'Flannel Cotton',      'https://drive.google.com/file/d/1s_EzwT5MkHz7Tt0qpomFs5cM6C8lmbjo/view?usp=drive_link',       55);
 

 -- SAMPLE CHECK 
 SELECT * FROM products;
 
-- ============================================================
-- TABLE 3: orders
-- Simulates the clothing company's orders
-- ============================================================
CREATE TABLE orders (
    order_id            VARCHAR(50)     PRIMARY KEY,
    customer_id         INT             NOT NULL,
    order_date          DATE            NOT NULL,
    received_date       DATE            NOT NULL,
    total_amount        DECIMAL(10,2)   NOT NULL,
    payment_method      ENUM('cash_on_delivery','card','bank_transfer') NOT NULL,
    order_status        ENUM('delivered','cancelled','pending')         NOT NULL DEFAULT 'delivered',
    shipping_address    VARCHAR(500)    NOT NULL,
    created_at          TIMESTAMP       DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);
 
INSERT INTO orders
    (order_id, customer_id, order_date, received_date, total_amount, payment_method, order_status, shipping_address)
VALUES
    -- Ali Hassan - 2 orders (1 eligible, 1 expired)
    ('ORD-20250401-0001', 1,  '2025-04-01', '2025-04-05', 4197.00,  'card',             'delivered', 'House 12, Street 4, Gulberg III, Lahore'),
    ('ORD-20250101-0002', 1,  '2025-01-01', '2025-01-05', 3499.00,  'cash_on_delivery', 'delivered', 'House 12, Street 4, Gulberg III, Lahore'),
 
    -- Sara Khan - 1 order (eligible)
    ('ORD-20250410-0003', 2,  '2025-04-10', '2025-04-14', 3798.00,  'card',             'delivered', 'Flat 5B, Block C, Clifton, Karachi'),
 
    -- Usman Tariq - 2 orders
    ('ORD-20250405-0004', 3,  '2025-04-05', '2025-04-09', 2898.00,  'bank_transfer',    'delivered', 'House 88, F-7/2, Islamabad'),
    ('ORD-20250415-0005', 3,  '2025-04-15', '2025-04-19', 2499.00,  'card',             'delivered', 'House 88, F-7/2, Islamabad'),
 
    -- Ayesha Malik - 1 order (eligible)
    ('ORD-20250412-0006', 4,  '2025-04-12', '2025-04-16', 3198.00,  'card',             'delivered', 'Plot 22, Phase 5, DHA, Lahore'),
 
    -- Bilal Ahmed - 1 order
    ('ORD-20250408-0007', 5,  '2025-04-08', '2025-04-12', 1599.00,  'cash_on_delivery', 'delivered', 'House 3, Sector G-11/1, Islamabad'),
 
    -- Hina Iqbal - 1 order
    ('ORD-20250411-0008', 6,  '2025-04-11', '2025-04-15', 2199.00,  'card',             'delivered', 'Apartment 9, Block 4, PECHS, Karachi'),
 
    -- Zain Raza - 2 orders
    ('ORD-20250403-0009', 7,  '2025-04-03', '2025-04-07', 3198.00,  'card',             'delivered', 'House 44, Model Town, Lahore'),
    ('ORD-20250416-0010', 7,  '2025-04-16', '2025-04-20', 1899.00,  'cash_on_delivery', 'delivered', 'House 44, Model Town, Lahore'),
 
    -- Fatima Noor - 1 order
    ('ORD-20250413-0011', 8,  '2025-04-13', '2025-04-17', 1299.00,  'bank_transfer',    'delivered', 'House 7, Street 2, Hayatabad, Peshawar'),
 
    -- Omar Sheikh - 1 order
    ('ORD-20250407-0012', 9,  '2025-04-07', '2025-04-11', 1299.00,  'card',             'delivered', 'Flat 11A, Defence View Apartments, Karachi'),
 
    -- Maham Yousuf - 1 order
    ('ORD-20250414-0013', 10, '2025-04-14', '2025-04-18', 2898.00,  'card',             'delivered', 'House 19, Johar Town, Lahore'),
 
    -- Hamza Butt - 1 order
    ('ORD-20250309-0014', 11, '2025-04-09', '2025-04-13', 2999.00,  'cash_on_delivery', 'delivered', 'House 55, G-9 Markaz, Islamabad'),
 
    -- Nadia Siddiqui - 1 order
    ('ORD-20250406-0015', 12, '2025-04-06', '2025-04-10', 4797.00,  'card',             'delivered', 'Plot 8, Block H, North Nazimabad, Karachi'),
 
    -- Faisal Qureshi - 1 order
    ('ORD-20250317-0016', 13, '2025-04-17', '2025-04-21', 1899.00,  'bank_transfer',    'delivered', 'House 31, Wapda Town, Lahore'),
 
    -- Sana Awan - 1 order
    ('ORD-20250402-0017', 14, '2025-04-02', '2025-04-06', 1299.00,  'card',             'delivered', 'House 6, Cantonment Area, Rawalpindi'),
 
    -- Taha Mirza - 1 order
    ('ORD-20250418-0018', 15, '2025-04-18', '2025-04-22', 3897.00,  'card',             'delivered', 'House 14, Samanabad, Lahore');
 
  -- SAMPLE CHECK 
 SELECT * FROM orders;
 
-- ============================================================
-- TABLE 4: order_items
-- Individual products inside each order
-- ============================================================

CREATE TABLE order_items (
    order_item_id   INT             PRIMARY KEY AUTO_INCREMENT,
    order_id        VARCHAR(50)     NOT NULL,
    product_id      INT             NOT NULL,
    quantity        INT             NOT NULL DEFAULT 1,
    size_ordered    VARCHAR(20)     NOT NULL,
    color_ordered   VARCHAR(50)     NOT NULL,
    unit_price      DECIMAL(10,2)   NOT NULL,
    FOREIGN KEY (order_id)   REFERENCES orders(order_id),
    FOREIGN KEY (product_id) REFERENCES products(product_id)
);
INSERT INTO order_items
    (order_id, product_id, quantity, size_ordered, color_ordered, unit_price)
VALUES
    -- ORD-20250401-0001: Ali Hassan →
    ('ORD-20250401-0001', 1,  2, 'L',   'White',       1299.00),
    ('ORD-20250401-0001', 6,  1, 'L',   'Brown',       1599.00),
 
    -- ORD-20250101-0002: Ali Hassan (EXPIRED) 
    ('ORD-20250101-0002', 3,  1, '32',  'Dark Blue',   3499.00),
 
    -- ORD-20250410-0003: Sara Khan 
    ('ORD-20250410-0003', 2,  1, 'M',   'Navy Blue',   1899.00),
    ('ORD-20250410-0003', 13,  1, 'M',   'Pink',   1899.00),
    
 
    -- ORD-20250405-0004: Usman Tariq  
    ('ORD-20250405-0004', 7,  1, 'L',   'Green',       1599.00),
    ('ORD-20250405-0004', 3,  1, 'L',  'Blue',   1299.00),
 
    -- ORD-20250415-0005: Usman Tariq 
    ('ORD-20250415-0005', 5,  1, 'M',   'Light Blue',  2499.00),
 
    -- ORD-20250412-0006: Ayesha Malik 
    ('ORD-20250412-0006', 8,  1, 'S',   'Navy Blue',    1599.00),
    ('ORD-20250412-0006', 9,  1, 'S',   'Purple',        1599.00),
 
    -- ORD-20250408-0007: Bilal Ahmed
    ('ORD-20250408-0007', 10, 1, 'XL',  'Charcoal',    1599.00),
 
    -- ORD-20250411-0008: Hina Iqbal
    ('ORD-20250411-0008', 15,  1, 'S',   'Red/Black',   2199.00),
 
    -- ORD-20250403-0009: Zain Raza 
    ('ORD-20250403-0009', 7,  1, 'M',   'Green',       1599.00),
    ('ORD-20250403-0009', 8,  1, 'M',   'Navy Blue',       1599.00),
 
    -- ORD-20250416-0010: Zain Raza 
    ('ORD-20250416-0010', 12,  1, 'L',   'Brown',        1899.00),
 
    -- ORD-20250413-0011: Fatima Noor
    ('ORD-20250413-0011', 3,  1, 'S',  'Blue',   1299.00),
 
    -- ORD-20250407-0012: Omar Sheikh 
    ('ORD-20250407-0012', 1,  1, 'M',   'White',       1299.00),
 
    -- ORD-20250414-0013: Maham Yousuf 
    ('ORD-20250414-0013', 8,  1, 'M',   'Navy Blue',    1599.00),
    ('ORD-20250414-0013', 2,  1, 'S',   'Black',   1299.00),
 
    -- ORD-20250409-0014: Hamza Butt (not eligible)
    ('ORD-20250309-0014', 4,  1, '32',  'Olive Green', 2999.00),

    -- ORD-20250406-0015: Nadia Siddiqui 
    ('ORD-20250406-0015', 7,  1, 'S',   'Green',       1599.00),
    ('ORD-20250406-0015', 11,  1, 'S',   'White',       1599.00),
    ('ORD-20250406-0015', 13,  1, 'M',  'Pink', 1599.00),
    
 
    -- ORD-20250417-0016: Faisal Qureshi
    ('ORD-20250317-0016', 2,  1, 'L',   'Navy Blue',   1899.00),
 
    -- ORD-20250402-0017: Sana Awan 
    ('ORD-20250402-0017', 2, 1, 'M',   'Black',    1299.00),
 
    -- ORD-20250418-0018: Taha Mirza 
    ('ORD-20250418-0018', 1,  1, 'S',   'White',       1299.00),
    ('ORD-20250418-0018', 4,  1, 'M',  'Pink', 1299.00),
	('ORD-20250418-0018', 5,  1, 'L',   'Sky Blue',  1299.00);
 
   -- SAMPLE CHECK 
 SELECT * FROM order_items;
 

SELECT o.order_id, p.product_name, oi.quantity
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.product_id
WHERE o.order_id = 'ORD-20250405-0004';

 