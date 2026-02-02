import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { employees } from "@/db/schema";

/**
 * @swagger
 * /api/employees:
 *   get:
 *     summary: Get all employees
 *     description: Retrieve a list of all employees from the database
 *     tags:
 *       - Employees
 *     responses:
 *       200:
 *         description: Successfully retrieved employees
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *                 count:
 *                   type: number
 *                   example: 5
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
export async function GET(request: NextRequest) {
  try {
    // Get all employees from database
    const allEmployees = await db.select().from(employees);

    return NextResponse.json(
      {
        success: true,
        data: allEmployees,
        count: allEmployees.length,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch employees",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  /**
   * @swagger
   * /api/employees:
   *   post:
   *     summary: Create a new employee
   *     description: Add a new employee to the database
   *     tags:
   *       - Employees
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - name
   *               - email
   *               - employeeCode
   *               - password
   *               - joiningDate
   *               - status
   *             properties:
   *               name:
   *                 type: string
   *                 example: John Doe
   *               email:
   *                 type: string
   *                 format: email
   *                 example: john@example.com
   *               employeeCode:
   *                 type: string
   *                 example: EMP001
   *               password:
   *                 type: string
   *                 example: hashedPassword123
   *               joiningDate:
   *                 type: string
   *                 format: date
   *                 example: "2026-01-15"
   *               status:
   *                 type: string
   *                 enum: [ACTIVE, INACTIVE, ON_LEAVE, RESIGNED]
   *                 example: ACTIVE
   *               deptId:
   *                 type: string
   *                 format: uuid
   *               roleId:
   *                 type: string
   *                 format: uuid
   *               managerId:
   *                 type: string
   *                 format: uuid
   *     responses:
   *       201:
   *         description: Employee created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                   example: true
   *                 data:
   *                   $ref: '#/components/schemas/Employee'
   *                 message:
   *                   type: string
   *                   example: Employee created successfully
   *       400:
   *         description: Missing required fields
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       500:
   *         description: Server error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   */
  try {
    const body = await request.json();

    const { name, email, employeeCode, password, joiningDate, status } = body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !employeeCode ||
      !password ||
      !joiningDate ||
      !status
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Missing required fields: name, email, employeeCode, password, joiningDate, status",
        },
        { status: 400 },
      );
    }

    // Insert employee
    const result = await db
      .insert(employees)
      .values({
        name,
        email,
        employeeCode,
        password,
        joiningDate,
        status,
      })
      .returning();

    return NextResponse.json(
      {
        success: true,
        data: result[0],
        message: "Employee created successfully",
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error("Error creating employee:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create employee",
      },
      { status: 500 },
    );
  }
}
