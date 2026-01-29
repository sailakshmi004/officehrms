-- Insert sample users for testing
INSERT INTO users (id, email, name, role, manager_id, department, is_active, created_at, updated_at) VALUES
(1, 'john.doe@example.com', 'John Doe', 'employee', 2, 'Engineering', true, NOW(), NOW()),
(2, 'jane.smith@example.com', 'Jane Smith', 'manager', 3, 'Engineering', true, NOW(), NOW()),
(3, 'mike.johnson@example.com', 'Mike Johnson', 'director', NULL, 'Executive', true, NOW(), NOW()),
(4, 'sarah.williams@example.com', 'Sarah Williams', 'employee', 2, 'Engineering', true, NOW(), NOW()),
(5, 'tom.brown@example.com', 'Tom Brown', 'employee', 2, 'Engineering', true, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- Verify data was inserted
SELECT * FROM users;
