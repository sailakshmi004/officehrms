// import {
//   pgTable,
//   uuid,
//   varchar,
//   text,
//   timestamp,
//   date,
//   boolean,
//   numeric,
//   integer,
//   time,
// } from "drizzle-orm/pg-core";

// /* ===============================
//    CORE TABLES (NO REFERENCES)
// ================================ */

// export const departments = pgTable("departments", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   name: varchar("name", { length: 100 }).notNull(),
//   code: varchar("code", { length: 20 }).notNull().unique(),
//   hodId: uuid("hod_id"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const roles = pgTable("roles", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   roleName: varchar("role_name", { length: 50 }).notNull().unique(),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const employees = pgTable("employees", {
//   id: uuid("id").primaryKey().defaultRandom(),
//   name: varchar("name", { length: 100 }).notNull(),
//   email: varchar("email", { length: 100 }).notNull().unique(),
//   employeeCode: varchar("employee_code", { length: 20 }).notNull().unique(),
//   password: text("password").notNull(),
//   joiningDate: date("joining_date").notNull(),
//   status: varchar("status", { length: 20 }).notNull(),

//   deptId: uuid("dept_id"),
//   roleId: uuid("role_id"),
//   managerId: uuid("manager_id"),

//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });


// export const passwordResetTokens = pgTable("password_reset_tokens", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   userId: uuid("user_id").notNull().references(() => employees.id),
//   token: text("token").notNull(),
//   expiresAt: timestamp("expires_at").notNull(),
//   isUsed: boolean("is_used").default(false),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// /* =====================================================
//    ATTENDANCE & ON-DUTY
// ===================================================== */

// export const attendance = pgTable("attendance", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   empId: uuid("emp_id").notNull().references(() => employees.id),
//   attendanceDate: date("attendance_date").notNull(),
//   checkIn: time("check_in"),
//   checkOut: time("check_out"),
//   latLong: varchar("lat_long", { length: 50 }),
//   ipAddress: varchar("ip_address", { length: 50 }),
//   photoUrl: text("photo_url"),
//   isLate: boolean("is_late").default(false),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const onDutyRequests = pgTable("on_duty_requests", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   empId: uuid("emp_id").notNull().references(() => employees.id),
//   approverId: uuid("approver_id").notNull().references(() => employees.id),
//   dutyType: varchar("duty_type", { length: 20 }).notNull(),
//   startDate: date("start_date").notNull(),
//   endDate: date("end_date").notNull(),
//   reason: text("reason"),
//   status: varchar("status", { length: 20 }).notNull(),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const regularizationRequests = pgTable("regularization_requests", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   empId: uuid("emp_id").notNull().references(() => employees.id),
//   attendanceId: uuid("attendance_id").notNull().references(() => attendance.id),
//   approverId: uuid("approver_id").notNull().references(() => employees.id),
//   actualIn: time("actual_in"),
//   actualOut: time("actual_out"),
//   reason: text("reason"),
//   status: varchar("status", { length: 20 }).notNull(),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// /* =====================================================
//    LEAVES & TASKS
// ===================================================== */

// export const leaveRequests = pgTable("leave_requests", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   empId: uuid("emp_id").notNull().references(() => employees.id),
//   managerId: uuid("manager_id").notNull().references(() => employees.id),
//   leaveType: varchar("leave_type", { length: 30 }),
//   startDate: date("start_date").notNull(),
//   endDate: date("end_date").notNull(),
//   isHalfDay: boolean("is_half_day").default(false),
//   halfDaySlot: varchar("half_day_slot", { length: 10 }),
//   reason: text("reason"),
//   status: varchar("status", { length: 20 }).notNull(),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const dailyTasks = pgTable("daily_tasks", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   empId: uuid("emp_id").notNull().references(() => employees.id),
//   approverId: uuid("approver_id").notNull().references(() => employees.id),
//   projectId: uuid("project_id").references(() => projects.id),
//   taskDate: date("task_date").notNull(),
//   description: text("description"),
//   hoursSpent: numeric("hours_spent", { precision: 5, scale: 2 }),
//   submissionStatus: varchar("submission_status", { length: 20 }).notNull(),
//   comments: text("comments"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// /* =====================================================
//    PROJECTS, ASSETS & FINANCE
// ===================================================== */

// export const projects = pgTable("projects", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   pmId: uuid("pm_id").notNull().references(() => employees.id),
//   projectName: varchar("project_name", { length: 100 }),
//   clientName: varchar("client_name", { length: 100 }),
//   budgetCode: varchar("budget_code", { length: 50 }),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const assets = pgTable("assets", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   name: varchar("name", { length: 50 }),
//   assetTag: varchar("asset_tag", { length: 50 }).unique(),
//   assetImg: text("asset_img"),
//   category: varchar("category", { length: 50 }),
//   assetType: varchar("asset_type", { length: 20 }),
//   purchaseCost: numeric("purchase_cost", { precision: 10, scale: 2 }),
//   purchaseDate: date("purchase_date"),
//   expiryDate: date("expiry_date"),
//   status: varchar("status", { length: 20 }),
//   description: text("description"),
//   assignedTo: uuid("assigned_to").references(() => employees.id),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const subscriptions = pgTable("subscriptions", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   assetId: uuid("asset_id").notNull().references(() => assets.id),
//   name: varchar("name", { length: 100 }),
//   licenseKey: varchar("license_key", { length: 100 }),
//   startDate: date("start_date"),
//   expiryDate: date("expiry_date"),
//   renewalCost: numeric("renewal_cost", { precision: 10, scale: 2 }),
//   isRecurring: boolean("is_recurring").default(false),
//   status: varchar("status", { length: 20 }),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const expenses = pgTable("expenses", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   empId: uuid("emp_id").notNull().references(() => employees.id),
//   projId: uuid("proj_id").references(() => projects.id),
//   assetId: uuid("asset_id").references(() => assets.id),
//   subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
//   expenseType: varchar("expense_type", { length: 20 }).notNull(),
//   category: varchar("category", { length: 50 }),
//   amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
//   description: text("description"),
//   receiptUrl: text("receipt_url"),
//   expenseDate: date("expense_date").notNull(),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const expenseApprovals = pgTable("expense_approvals", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   expenseId: uuid("expense_id").notNull().references(() => expenses.id),
//   approverId: uuid("approver_id").notNull().references(() => employees.id),
//   approvalLevel: integer("approval_level").notNull(),
//   status: varchar("status", { length: 20 }),
//   comments: text("comments"),
//   actionDate: timestamp("action_date"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// /* =====================================================
//    ASSET REQUESTS & COMMUNICATION
// ===================================================== */

// export const assetRequests = pgTable("asset_requests", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   name: varchar("name", { length: 100 }),
//   description: text("description"),
//   cost: numeric("cost", { precision: 10, scale: 2 }),
//   assetId: uuid("asset_id").references(() => assets.id),
//   subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
//   requestedBy: uuid("requested_by").notNull().references(() => employees.id),
//   requestType: varchar("request_type", { length: 20 }).notNull(),
//   status: varchar("status", { length: 20 }),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const assetApprovals = pgTable("asset_approvals", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   assetRequestId: uuid("asset_request_id").notNull().references(() => assetRequests.id),
//   approvedBy: uuid("approved_by").notNull().references(() => employees.id),
//   approvalLevel: integer("approval_level"),
//   status: varchar("status", { length: 20 }),
//   comments: text("comments"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const announcements = pgTable("announcements", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   createdBy: uuid("created_by").notNull().references(() => employees.id),
//   targetDept: uuid("target_dept").references(() => departments.id),
//   title: varchar("title", { length: 200 }),
//   content: text("content"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });

// export const notifications = pgTable("notifications", {
//   id: uuid("id").defaultRandom().primaryKey(),
//   recipientId: uuid("recipient_id").notNull().references(() => employees.id),
//   notificationType: varchar("notification_type", { length: 50 }),
//   message: text("message"),
//   isRead: boolean("is_read").default(false),
//   link: text("link"),
//   createdAt: timestamp("created_at").defaultNow(),
//   updatedAt: timestamp("updated_at").defaultNow(),
// });


import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  date,
  boolean,
  numeric,
  integer,
  time,
  pgEnum,
} from "drizzle-orm/pg-core";

/* ===============================
   ENUM DEFINITIONS
================================ */

// Employees
export const employeeStatusEnum = pgEnum("employee_status", [
  "ACTIVE",
  "INACTIVE",
  "ONBOARDING",
  "PROBATION",
  "TERMINATED",
]);

// On-duty
export const dutyTypeEnum = pgEnum("duty_type", [
  "CLIENT_VISIT",
  "OFFSITE",
  "TRAINING",
  "OTHER",
]);
export const requestStatusEnum = pgEnum("request_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

// Regularization
export const regularizationStatusEnum = pgEnum("regularization_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

// Leaves
export const leaveTypeEnum = pgEnum("leave_type", [
  "CL",
  "SL",
  "PL",
  "LWP",
  "WFH",
  "BEREAVEMENT",
  "MATERNITY",
]);
export const halfDaySlotEnum = pgEnum("half_day_slot", ["AM", "PM"]);
export const leaveStatusEnum = pgEnum("leave_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);

// Daily tasks
export const submissionStatusEnum = pgEnum("submission_status", [
  "DRAFT",
  "SUBMITTED",
  "APPROVED",
  "REJECTED",
]);

// Assets & subscriptions
export const assetTypeEnum = pgEnum("asset_type", [
  "LAPTOP",
  "DESKTOP",
  "MONITOR",
  "PHONE",
  "LICENSE",
  "OTHER",
]);
export const assetStatusEnum = pgEnum("asset_status", [
  "IN_STOCK",
  "ASSIGNED",
  "REPAIR",
  "RETIRED",
]);
export const subscriptionStatusEnum = pgEnum("subscription_status", [
  "ACTIVE",
  "EXPIRED",
  "CANCELLED",
]);

// Expenses & approvals
export const expenseTypeEnum = pgEnum("expense_type", [
  "TRAVEL",
  "MEAL",
  "SUPPLIES",
  "SOFTWARE",
  "OTHER",
]);
export const expenseApprovalStatusEnum = pgEnum("expense_approval_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

// Asset requests & approvals
export const assetRequestTypeEnum = pgEnum("asset_request_type", [
  "PURCHASE",
  "ASSIGNMENT",
  "SUBSCRIPTION",
]);
export const assetRequestStatusEnum = pgEnum("asset_request_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);
export const assetApprovalStatusEnum = pgEnum("asset_approval_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

// Notifications
export const notificationTypeEnum = pgEnum("notification_type", [
  "ANNOUNCEMENT",
  "APPROVAL",
  "REMINDER",
  "SYSTEM",
]);

/* ===============================
   CORE TABLES (NO REFERENCES)
================================ */

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  code: varchar("code", { length: 20 }).notNull().unique(),
  hodId: uuid("hod_id"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleName: varchar("role_name", { length: 50 }).notNull().unique(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const employees = pgTable("employees", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).notNull().unique(),
  employeeCode: varchar("employee_code", { length: 20 }).notNull().unique(),
  password: text("password").notNull(),
  joiningDate: date("joining_date").notNull(),
  status: employeeStatusEnum("status").notNull(),

  deptId: uuid("dept_id"),
  roleId: uuid("role_id"),
  managerId: uuid("manager_id"),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => employees.id),
  token: text("token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  isUsed: boolean("is_used").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* =====================================================
   ATTENDANCE & ON-DUTY
===================================================== */

export const attendance = pgTable("attendance", {
  id: uuid("id").defaultRandom().primaryKey(),
  empId: uuid("emp_id").notNull().references(() => employees.id),
  attendanceDate: date("attendance_date").notNull(),
  checkIn: time("check_in"),
  checkOut: time("check_out"),
  latLong: varchar("lat_long", { length: 50 }),
  ipAddress: varchar("ip_address", { length: 50 }),
  photoUrl: text("photo_url"),
  isLate: boolean("is_late").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const onDutyRequests = pgTable("on_duty_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  empId: uuid("emp_id").notNull().references(() => employees.id),
  approverId: uuid("approver_id").notNull().references(() => employees.id),
  dutyType: dutyTypeEnum("duty_type").notNull(),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  reason: text("reason"),
  status: requestStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const regularizationRequests = pgTable("regularization_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  empId: uuid("emp_id").notNull().references(() => employees.id),
  attendanceId: uuid("attendance_id").notNull().references(() => attendance.id),
  approverId: uuid("approver_id").notNull().references(() => employees.id),
  actualIn: time("actual_in"),
  actualOut: time("actual_out"),
  reason: text("reason"),
  status: regularizationStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* =====================================================
   LEAVES & TASKS
===================================================== */

export const leaveRequests = pgTable("leave_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  empId: uuid("emp_id").notNull().references(() => employees.id),
  managerId: uuid("manager_id").notNull().references(() => employees.id),
  leaveType: leaveTypeEnum("leave_type"),
  startDate: date("start_date").notNull(),
  endDate: date("end_date").notNull(),
  isHalfDay: boolean("is_half_day").default(false),
  halfDaySlot: halfDaySlotEnum("half_day_slot"),
  reason: text("reason"),
  status: leaveStatusEnum("status").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const dailyTasks = pgTable("daily_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  empId: uuid("emp_id").notNull().references(() => employees.id),
  approverId: uuid("approver_id").notNull().references(() => employees.id),
  projectId: uuid("project_id").references(() => projects.id),
  taskDate: date("task_date").notNull(),
  description: text("description"),
  hoursSpent: numeric("hours_spent", { precision: 5, scale: 2 }),
  submissionStatus: submissionStatusEnum("submission_status").notNull(),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* =====================================================
   PROJECTS, ASSETS & FINANCE
===================================================== */

export const projects = pgTable("projects", {
  id: uuid("id").defaultRandom().primaryKey(),
  pmId: uuid("pm_id").notNull().references(() => employees.id),
  projectName: varchar("project_name", { length: 100 }),
  clientName: varchar("client_name", { length: 100 }),
  budgetCode: varchar("budget_code", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assets = pgTable("assets", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 50 }),
  assetTag: varchar("asset_tag", { length: 50 }).unique(),
  assetImg: text("asset_img"),
  category: varchar("category", { length: 50 }), // Keep varchar if user-extensible
  assetType: assetTypeEnum("asset_type"),
  purchaseCost: numeric("purchase_cost", { precision: 10, scale: 2 }),
  purchaseDate: date("purchase_date"),
  expiryDate: date("expiry_date"),
  status: assetStatusEnum("status"),
  description: text("description"),
  assignedTo: uuid("assigned_to").references(() => employees.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  assetId: uuid("asset_id").notNull().references(() => assets.id),
  name: varchar("name", { length: 100 }),
  licenseKey: varchar("license_key", { length: 100 }),
  startDate: date("start_date"),
  expiryDate: date("expiry_date"),
  renewalCost: numeric("renewal_cost", { precision: 10, scale: 2 }),
  isRecurring: boolean("is_recurring").default(false),
  status: subscriptionStatusEnum("status"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const expenses = pgTable("expenses", {
  id: uuid("id").defaultRandom().primaryKey(),
  empId: uuid("emp_id").notNull().references(() => employees.id),
  projId: uuid("proj_id").references(() => projects.id),
  assetId: uuid("asset_id").references(() => assets.id),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
  expenseType: expenseTypeEnum("expense_type").notNull(),
  category: varchar("category", { length: 50 }), // Keep varchar if open list
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
  description: text("description"),
  receiptUrl: text("receipt_url"),
  expenseDate: date("expense_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const expenseApprovals = pgTable("expense_approvals", {
  id: uuid("id").defaultRandom().primaryKey(),
  expenseId: uuid("expense_id").notNull().references(() => expenses.id),
  approverId: uuid("approver_id").notNull().references(() => employees.id),
  approvalLevel: integer("approval_level").notNull(),
  status: expenseApprovalStatusEnum("status"),
  comments: text("comments"),
  actionDate: timestamp("action_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

/* =====================================================
   ASSET REQUESTS & COMMUNICATION
===================================================== */

export const assetRequests = pgTable("asset_requests", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }),
  description: text("description"),
  cost: numeric("cost", { precision: 10, scale: 2 }),
  assetId: uuid("asset_id").references(() => assets.id),
  subscriptionId: uuid("subscription_id").references(() => subscriptions.id),
  requestedBy: uuid("requested_by").notNull().references(() => employees.id),
  requestType: assetRequestTypeEnum("request_type").notNull(),
  status: assetRequestStatusEnum("status"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assetApprovals = pgTable("asset_approvals", {
  id: uuid("id").defaultRandom().primaryKey(),
  assetRequestId: uuid("asset_request_id").notNull().references(() => assetRequests.id),
  approvedBy: uuid("approved_by").notNull().references(() => employees.id),
  approvalLevel: integer("approval_level"),
  status: assetApprovalStatusEnum("status"),
  comments: text("comments"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const announcements = pgTable("announcements", {
  id: uuid("id").defaultRandom().primaryKey(),
  createdBy: uuid("created_by").notNull().references(() => employees.id),
  targetDept: uuid("target_dept").references(() => departments.id),
  title: varchar("title", { length: 200 }),
  content: text("content"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  recipientId: uuid("recipient_id").notNull().references(() => employees.id),
  notificationType: notificationTypeEnum("notification_type"),
  message: text("message"),
  isRead: boolean("is_read").default(false),
  link: text("link"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
