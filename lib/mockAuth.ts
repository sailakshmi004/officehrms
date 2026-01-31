// ⚠️ TEMP FILE — REMOVE AFTER REAL LOGIN IS DONE

export type MockEmployeeSession = {
  employeeId: string;
  employeeCode: string;
  name: string;
  email: string;
  role: "DIRECTOR" | "HR" | "MANAGER" | "EMPLOYEE";
  deptId: string;
  deptCode: string;
};

// 🔥 CHANGE THIS OBJECT TO SWITCH USER
export const mockSession: MockEmployeeSession = {
  employeeId: "11111111-1111-1111-1111-111111111111",
  employeeCode: "EMP001",
  name: "Balaji",
  email: "balaji@company.com",
  role: "HR",
  deptId: "22222222-2222-2222-2222-222222222222",
  deptCode: "HR",
};
