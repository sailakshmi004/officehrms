-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'employee', -- 'employee', 'manager', 'hr', 'director'
  manager_id INTEGER REFERENCES users(id),
  department VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tasks Table (General Tasks)
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  employee_id INTEGER NOT NULL REFERENCES users(id),
  task_date TIMESTAMP NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  hours INTEGER DEFAULT 8,
  status VARCHAR(20) DEFAULT 'draft', -- draft | submitted | approved | rejected
  priority VARCHAR(50) DEFAULT 'medium', -- low, medium, high
  category VARCHAR(100),
  completion_percentage INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Daily Tasks Table (Daily work updates)
CREATE TABLE IF NOT EXISTS daily_tasks (
  id SERIAL PRIMARY KEY,
  emp_id INTEGER NOT NULL REFERENCES users(id),
  approver_id INTEGER NOT NULL REFERENCES users(id),
  task_date DATE NOT NULL DEFAULT CURRENT_DATE,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50),
  priority VARCHAR(20) DEFAULT 'medium', -- low, medium, high
  hours_spent NUMERIC(4, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'draft', -- draft | submitted | approved | rejected
  submitted_at TIMESTAMP,
  approved_at TIMESTAMP,
  rejection_reason TEXT,
  manager_comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(emp_id, task_date)
);

-- Task Approvals Table (Manager approval workflow)
CREATE TABLE IF NOT EXISTS task_approvals (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  employee_id INTEGER NOT NULL REFERENCES users(id),
  manager_id INTEGER NOT NULL REFERENCES users(id),
  status VARCHAR(20) DEFAULT 'pending', -- pending | approved | rejected | resubmitted
  comments TEXT,
  rejection_reason TEXT,
  approved_at TIMESTAMP,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Task History Table (Audit log)
CREATE TABLE IF NOT EXISTS task_history (
  id SERIAL PRIMARY KEY,
  task_id INTEGER NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  action VARCHAR(100) NOT NULL, -- created, updated, submitted, approved, rejected
  changed_by INTEGER NOT NULL REFERENCES users(id),
  previous_data TEXT, -- JSON stringified
  new_data TEXT, -- JSON stringified
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for better query performance
CREATE INDEX idx_tasks_employee_id ON tasks(employee_id);
CREATE INDEX idx_tasks_task_date ON tasks(task_date);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_daily_tasks_emp_id ON daily_tasks(emp_id);
CREATE INDEX idx_daily_tasks_task_date ON daily_tasks(task_date);
CREATE INDEX idx_daily_tasks_status ON daily_tasks(status);
CREATE INDEX idx_task_approvals_manager_id ON task_approvals(manager_id);
CREATE INDEX idx_task_approvals_status ON task_approvals(status);
CREATE INDEX idx_task_history_task_id ON task_history(task_id);
