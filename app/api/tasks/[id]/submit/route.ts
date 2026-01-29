import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { tasks, taskApprovals } from "@/src/db/schema";
import { eq } from "drizzle-orm";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const taskId = parseInt(id);
    const body = await request.json();
    const { managerId, employeeId } = body;

    console.log("Submit task request:", { taskId, managerId, employeeId });

    if (!managerId || !employeeId) {
      return NextResponse.json(
        { error: "Missing required fields: managerId, employeeId" },
        { status: 400 },
      );
    }

    // Update task status to submitted
    console.log("Updating task status...");
    const updatedTask = await db
      .update(tasks)
      .set({ status: "submitted", updatedAt: new Date() })
      .where(eq(tasks.id, taskId))
      .returning();

    console.log("Updated task:", updatedTask);

    if (!updatedTask || updatedTask.length === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Create approval record
    console.log("Creating approval record...");
    const approval = await db
      .insert(taskApprovals)
      .values({
        taskId,
        employeeId: parseInt(employeeId),
        managerId: parseInt(managerId),
        status: "pending",
        submittedAt: new Date(),
      })
      .returning();

    console.log("Created approval:", approval);

    return NextResponse.json(
      {
        success: true,
        message: "Task submitted for approval",
        task: updatedTask[0],
        approval: approval[0],
      },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error submitting task:", errorMessage);
    console.error("Full error:", error);
    return NextResponse.json(
      { 
        error: "Failed to submit task for approval",
        details: errorMessage 
      },
      { status: 500 },
    );
  }
}

