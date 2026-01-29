import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { taskApprovals, tasks, users } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const managerId = searchParams.get("managerId");
    const status = searchParams.get("status") || "pending";

    if (!managerId) {
      return NextResponse.json(
        { error: "managerId is required" },
        { status: 400 },
      );
    }

    const approvals = await db
      .select({
        id: taskApprovals.id,
        taskId: taskApprovals.taskId,
        employeeId: taskApprovals.employeeId,
        managerId: taskApprovals.managerId,
        approvalStatus: taskApprovals.status,
        comments: taskApprovals.comments,
        rejectionReason: taskApprovals.rejectionReason,
        submittedAt: taskApprovals.submittedAt,
        approvedAt: taskApprovals.approvedAt,
        taskTitle: tasks.title,
        taskDate: tasks.taskDate,
        taskDescription: tasks.description,
        hours: tasks.hours,
        priority: tasks.priority,
        category: tasks.category,
        employeeName: users.name,
      })
      .from(taskApprovals)
      .innerJoin(tasks, eq(taskApprovals.taskId, tasks.id))
      .innerJoin(users, eq(taskApprovals.employeeId, users.id))
      .where(
        and(
          eq(taskApprovals.managerId, parseInt(managerId)),
          eq(taskApprovals.status, status as any),
        ),
      );

    return NextResponse.json({
      success: true,
      approvals,
      count: approvals.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error fetching approvals:", errorMessage);
    console.error("Full error:", error);
    return NextResponse.json(
      { 
        error: "Failed to fetch approvals",
        details: errorMessage 
      },
      { status: 500 },
    );
  }
}
