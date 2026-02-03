import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { dailyTasks, employees } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    const tasks = await db.select().from(dailyTasks);
    return NextResponse.json(
      {
        success: true,
        data: tasks,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch tasks",
      },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/daily-tasks:
 *   get:
 *     summary: Get all daily tasks
 *     description: Retrieve all daily tasks from the database
 *     tags:
 *       - Daily Tasks
 *     responses:
 *       200:
 *         description: Tasks retrieved successfully
 *       500:
 *         description: Server error
 *   post:
 *     summary: Create a new daily task
 *     description: Create a new daily task
 *     tags:
 *       - Daily Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - projectId
 *               - taskDate
 *               - description
 *               - hoursSpent
 *             properties:
 *               empId:
 *                 type: string
 *                 description: Employee ID (optional, uses first employee if not provided)
 *               approverId:
 *                 type: string
 *                 description: Approver ID (optional, defaults to empId)
 *               projectId:
 *                 type: string
 *                 description: Project ID
 *               taskDate:
 *                 type: string
 *                 description: Date of task (YYYY-MM-DD)
 *               description:
 *                 type: string
 *                 description: Task description
 *               hoursSpent:
 *                 type: number
 *                 description: Hours spent on task
 *               comments:
 *                 type: string
 *                 description: Optional comments
 *     responses:
 *       201:
 *         description: Task created successfully
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    let {
      empId,
      approverId,
      projectId,
      taskDate,
      description,
      hoursSpent,
      comments,
    } = body;

    // Validation
    if (!projectId || !taskDate || !description || hoursSpent === undefined) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: projectId, taskDate, description, hoursSpent",
        },
        { status: 400 },
      );
    }

    // If empId is not provided or invalid UUID format, fetch first employee
    if (!empId || !isValidUUID(empId)) {
      const firstEmployee = await db.select().from(employees).limit(1);
      if (firstEmployee.length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: "No employees found in the system",
          },
          { status: 400 },
        );
      }
      empId = firstEmployee[0].id;
    }

    // If approverId is not provided, use empId
    if (!approverId || !isValidUUID(approverId)) {
      approverId = empId;
    }

    // Validate hoursSpent is a number
    const hours = parseFloat(hoursSpent);
    if (isNaN(hours) || hours < 0) {
      return NextResponse.json(
        {
          success: false,
          error: "hoursSpent must be a valid positive number",
        },
        { status: 400 },
      );
    }

    // Create task
    const newTask = await db
      .insert(dailyTasks)
      .values({
        empId: empId as any,
        approverId: approverId as any,
        projectId: projectId as any,
        taskDate: taskDate,
        description,
        hoursSpent: hours.toString(),
        submissionStatus: "DRAFT" as any,
        comments: comments || null,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        message: "Task created successfully",
        data: newTask[0],
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating task:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to create task",
      },
      { status: 500 },
    );
  }
}

// Helper function to validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}
