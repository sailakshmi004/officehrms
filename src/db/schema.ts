import {
  integer,
  text,
  timestamp,
  boolean,
  pgTable,
  serial,
  varchar,
  pgEnum,
  decimal,
  date,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enum for approval status
export const taskApprovalStatusEnum = pgEnum("task_approval_status", [
  "pending",
  "approved",
  "rejected",
  "resubmitted",
]);
export const taskStatusEnum = pgEnum("task_status", [
  "draft",
  "submitted",
  "approved",
  "rejected",
]);

// Users table (assumed to exist from auth)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(), // 'employee', 'manager', 'hr', 'director'
  managerId: integer("manager_id"), // Reference to manager for hierarchical approval
  department: varchar("department", { length: 100 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Tasks table - Daily work updates
export const tasks = pgTable("tasks", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => users.id),
  taskDate: timestamp("task_date").notNull(), // Date of the task
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  hours: integer("hours").default(8), // Hours spent
  status: taskStatusEnum("status").default("draft"),
  priority: varchar("priority", { length: 50 }).default("medium"), // low, medium, high
  category: varchar("category", { length: 100 }), // Project name or category
  completionPercentage: integer("completion_percentage").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Task approvals table - Manager approval workflow
export const taskApprovals = pgTable("task_approvals", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => users.id),
  managerId: integer("manager_id")
    .notNull()
    .references(() => users.id), // Manager approving
  status: taskApprovalStatusEnum("status").default("pending"),
  comments: text("comments"),
  rejectionReason: text("rejection_reason"),
  approvedAt: timestamp("approved_at"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Task history - Audit log
export const taskHistory = pgTable("task_history", {
  id: serial("id").primaryKey(),
  taskId: integer("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  action: varchar("action", { length: 100 }).notNull(), // created, updated, submitted, approved, rejected
  changedBy: integer("changed_by")
    .notNull()
    .references(() => users.id),
  previousData: text("previous_data"), // JSON stringified
  newData: text("new_data"), // JSON stringified
  createdAt: timestamp("created_at").defaultNow(),
});

// Daily Tasks table - For daily work updates with manager approval
export const dailyTasks = pgTable(
  "daily_tasks",
  {
    id: serial("id").primaryKey(),
    empId: integer("emp_id")
      .notNull()
      .references(() => users.id),
    approverId: integer("approver_id")
      .notNull()
      .references(() => users.id),
    taskDate: date("task_date").notNull().defaultNow(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    category: varchar("category", { length: 50 }),
    priority: varchar("priority", { length: 20 }).default("medium"), // low, medium, high
    hoursSpent: decimal("hours_spent", { precision: 4, scale: 2 }).notNull(),
    status: varchar("status", { length: 20 }).default("draft"), // draft | submitted | approved | rejected
    submittedAt: timestamp("submitted_at"),
    approvedAt: timestamp("approved_at"),
    rejectionReason: text("rejection_reason"),
    managerComment: text("manager_comment"),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({
    uniqueEmpDate: uniqueIndex("unique_emp_date").on(
      table.empId,
      table.taskDate,
    ),
  }),
);

// Relations
export const usersRelations = relations(users, ({ many, one }) => ({
  tasks: many(tasks),
  approvals: many(taskApprovals),
  manager: one(users, {
    fields: [users.managerId],
    references: [users.id],
  }),
  subordinates: many(users),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  employee: one(users, {
    fields: [tasks.employeeId],
    references: [users.id],
  }),
  approvals: many(taskApprovals),
  history: many(taskHistory),
}));

export const taskApprovalsRelations = relations(taskApprovals, ({ one }) => ({
  task: one(tasks, {
    fields: [taskApprovals.taskId],
    references: [tasks.id],
  }),
  employee: one(users, {
    fields: [taskApprovals.employeeId],
    references: [users.id],
  }),
  manager: one(users, {
    fields: [taskApprovals.managerId],
    references: [users.id],
  }),
}));

export const taskHistoryRelations = relations(taskHistory, ({ one }) => ({
  task: one(tasks, {
    fields: [taskHistory.taskId],
    references: [tasks.id],
  }),
  changedByUser: one(users, {
    fields: [taskHistory.changedBy],
    references: [users.id],
  }),
}));

// Daily Tasks Relations
export const dailyTasksRelations = relations(dailyTasks, ({ one }) => ({
  employee: one(users, {
    fields: [dailyTasks.empId],
    references: [users.id],
  }),
  approver: one(users, {
    fields: [dailyTasks.approverId],
    references: [users.id],
  }),
}));
