-- SQL migration for shipping_fees table to support new structure and valid categories

-- 1. Remove old rows
DELETE FROM shipping_fees WHERE category NOT IN ('Coffee & Tea', 'Art & Merch', 'Gift Set', 'Gear');

-- 2. Add new columns if not present
ALTER TABLE shipping_fees ADD COLUMN base_fee DECIMAL(10,2) NOT NULL DEFAULT 0;
ALTER TABLE shipping_fees ADD COLUMN additional_fee DECIMAL(10,2) NOT NULL DEFAULT 0;

-- 3. Remove old 'fee' column if present
ALTER TABLE shipping_fees DROP COLUMN fee;

-- 4. Insert valid categories using enum names (not labels)
INSERT INTO shipping_fees (category, base_fee, additional_fee) VALUES
  ('COFFEE_TEA', 10.00, 2.00),
  ('ART_MERCH', 15.00, 3.00),
  ('GIFT_SET', 20.00, 5.00),
  ('GEAR', 12.00, 2.50)
ON DUPLICATE KEY UPDATE base_fee=VALUES(base_fee), additional_fee=VALUES(additional_fee);

-- 5. Add shipping_fee_total to orders table for persisted order-time fee
ALTER TABLE orders ADD COLUMN shipping_fee_total DECIMAL(10,2) NOT NULL DEFAULT 0;
