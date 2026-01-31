import { mockSession } from "./mockAuth";

// Later this file will read JWT / cookies instead
export function getCurrentUser() {
  return mockSession;
}



// ❌ NOT THIS
// if (role === "HR") ...

// ✅ THIS
// import { getCurrentUser } from "@/lib/auth";

// const user = getCurrentUser();

// if (user.role === "HR") {
//   // show HR UI
// }
