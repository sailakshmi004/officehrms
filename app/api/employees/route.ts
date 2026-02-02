import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { employees } from "@/db/schema";

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
  try {
    const body = await request.json();

    const {
      name,
      email,
      employeeCode,
      password,
      joiningDate,
      status
    } = body;

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
        status
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
