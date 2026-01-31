-- =====================================================
-- SEED DATA FOR HRMS
-- =====================================================

-- =====================================================
-- ROLES
-- =====================================================
INSERT INTO roles (id, role_name)
VALUES
  (gen_random_uuid(), 'ADMIN'),
  (gen_random_uuid(), 'HR'),
  (gen_random_uuid(), 'MANAGER'),
  (gen_random_uuid(), 'EMPLOYEE')
ON CONFLICT (role_name) DO NOTHING;

-- =====================================================
-- DEPARTMENTS
-- =====================================================
INSERT INTO departments (id, name, code)
VALUES
  (gen_random_uuid(), 'Human Resources', 'HR'),
  (gen_random_uuid(), 'Engineering', 'ENG'),
  (gen_random_uuid(), 'Finance', 'FIN')
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- SAMPLE ADMIN EMPLOYEE
-- =====================================================
-- NOTE:
-- Password must be bcrypt-hashed before inserting
-- Example hash generated via bcrypt.hash("Admin@123", 10)

INSERT INTO employees (
  id,
  name,
  email,
  employee_code,
  password,
  joining_date,
  status,
  role_id,
  dept_id
)
SELECT
  gen_random_uuid(),
  'System Admin',
  'admin@company.com',
  'EMP001',
  '$2b$10$REPLACE_WITH_REAL_BCRYPT_HASH',
  CURRENT_DATE,
  'ACTIVE',
  r.id,
  d.id
FROM roles r
JOIN departments d ON d.code = 'HR'
WHERE r.role_name = 'ADMIN'
LIMIT 1
ON CONFLICT (email) DO NOTHING;

-- =====================================================
-- WELCOME NOTIFICATION FOR ADMIN
-- =====================================================
INSERT INTO notifications (
  id,
  recipient_id,
  notification_type,
  message
)
SELECT
  gen_random_uuid(),
  e.id,
  'SYSTEM',
  'Welcome to HRMS'
FROM employees e
WHERE e.email = 'admin@company.com'
ON CONFLICT DO NOTHING;
