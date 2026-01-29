import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { taskApprovals, tasks } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const approvalId = parseInt(id);
    const body = await request.json();
    const { rejectionReason } = body;

    if (!rejectionReason) {
      return NextResponse.json(
        { error: "rejectionReason is required" },
        { status: 400 },
      );
    }

    // Get the approval to find task ID
    const approval = await db
      .select()
      .from(taskApprovals)
      .where(eq(taskApprovals.id, approvalId))
      .limit(1);

    if (!approval || approval.length === 0) {
      return NextResponse.json(
        { error: "Approval not found" },
        { status: 404 },
      );
    }

    const taskId = approval[0].taskId;

    // Update approval status
    const updatedApproval = await db
      .update(taskApprovals)
      .set({
        status: "rejected",
        rejectionReason,
      })
      .where(eq(taskApprovals.id, approvalId))
      .returning();

    // Update task status to rejected
    const updatedTask = await db
      .update(tasks)
      .set({ status: "rejected", updatedAt: new Date() })
      .where(eq(tasks.id, taskId))
      .returning();

    return NextResponse.json({
      success: true,
      message: "Task rejected successfully",
      approval: updatedApproval[0],
      task: updatedTask[0],
    });
  } catch (error) {
    console.error("Error rejecting task:", error);
    return NextResponse.json(
      { error: "Failed to reject task" },
      { status: 500 },
    );
  }
}
