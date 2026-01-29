import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { tasks } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const employeeId = searchParams.get("employeeId");
    const status = searchParams.get("status");

    if (!employeeId) {
      return NextResponse.json(
        { error: "employeeId is required" },
        { status: 400 },
      );
    }

    const conditions = [eq(tasks.employeeId, parseInt(employeeId))];

    if (status) {
      conditions.push(eq(tasks.status, status as any));
    }

    const query = db
      .select()
      .from(tasks)
      .where(conditions.length === 1 ? conditions[0] : and(...conditions));

    const userTasks = await query;

    return NextResponse.json({
      success: true,
      tasks: userTasks,
      count: userTasks.length,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      employeeId,
      taskDate,
      title,
      description,
      hours,
      priority,
      category,
      completionPercentage,
    } = body;

    if (!employeeId || !taskDate || !title) {
      return NextResponse.json(
        { error: "Missing required fields: employeeId, taskDate, title" },
        { status: 400 },
      );
    }

    const newTask = await db
      .insert(tasks)
      .values({
        employeeId: parseInt(employeeId),
        taskDate: new Date(taskDate),
        title,
        description,
        hours: hours || 8,
        priority: priority || "medium",
        category,
        completionPercentage: completionPercentage || 0,
        status: "draft",
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        task: newTask[0],
      },
      { status: 201 },
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error creating task:", errorMessage);
    console.error("Full error:", error);
    return NextResponse.json(
      {
        error: "Failed to create task",
        details: errorMessage,
      },
      { status: 500 },
    );
  }
}
