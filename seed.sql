-- ===============================
-- ROLES
-- ===============================
INSERT INTO roles (id, role_name)
VALUES
  (gen_random_uuid(), 'ADMIN'),
  (gen_random_uuid(), 'HR'),
  (gen_random_uuid(), 'MANAGER'),
  (gen_random_uuid(), 'EMPLOYEE');

-- ===============================
-- DEPARTMENTS
-- ===============================
INSERT INTO departments (id, name, code)
VALUES
  (gen_random_uuid(), 'Human Resources', 'HR'),
  (gen_random_uuid(), 'Engineering', 'ENG'),
  (gen_random_uuid(), 'Finance', 'FIN');

-- ===============================
-- SAMPLE ADMIN EMPLOYEE
-- ===============================
INSERT INTO employees (
  id,
  name,
  email,
  employee_code,
  password,
  joining_date,
  status
)
VALUES (
  gen_random_uuid(),
  'System Admin',
  'admin@company.com',
  'EMP001',
  '$2b$10$HASHED_PASSWORD',
  CURRENT_DATE,
  'ACTIVE'
);

-- ===============================
-- NOTIFICATION TYPES (OPTIONAL)
-- ===============================
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
LIMIT 1;
