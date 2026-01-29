import { NextRequest, NextResponse } from "next/server";
import { db } from "@/src/db";
import { tasks, users } from "@/src/db/schema";
import { eq, gte, lte, and, count, sql } from "drizzle-orm";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const range = searchParams.get("range") || "week"; // week, month, quarter

    let start: Date;
    let end: Date;
    const today = new Date();

    if (startDate && endDate) {
      start = new Date(startDate);
      end = new Date(endDate);
    } else {
      end = new Date();
      start = new Date();

      switch (range) {
        case "month":
          start.setMonth(end.getMonth() - 1);
          break;
        case "quarter":
          start.setMonth(end.getMonth() - 3);
          break;
        default: // week
          start.setDate(end.getDate() - 7);
          break;
      }
    }

    // Get all employees with their task statistics
    const reportData = await db
      .select({
        employeeName: users.name,
        employeeId: users.id,
        totalTasks: count(tasks.id),
        approvedTasks: count(
          sql`CASE WHEN ${tasks.status} = 'approved' THEN 1 END`,
        ),
        rejectedTasks: count(
          sql`CASE WHEN ${tasks.status} = 'rejected' THEN 1 END`,
        ),
        pendingTasks: count(
          sql`CASE WHEN ${tasks.status} = 'submitted' OR ${tasks.status} = 'draft' THEN 1 END`,
        ),
        totalHours: sql<number>`SUM(${tasks.hours}) as total_hours`,
      })
      .from(users)
      .leftJoin(
        tasks,
        and(
          eq(tasks.employeeId, users.id),
          gte(tasks.taskDate, start),
          lte(tasks.taskDate, end),
        ),
      )
      .where(eq(users.role, "employee"))
      .groupBy(users.id, users.name);

    // Calculate approval rates
    const reportsWithRates = reportData.map((report) => {
      const totalTasks = report.totalTasks || 0;
      const approvalRate =
        totalTasks > 0
          ? Math.round(((report.approvedTasks || 0) / totalTasks) * 100)
          : 0;

      return {
        ...report,
        approvalRate,
        totalHours: report.totalHours || 0,
      };
    });

    return NextResponse.json({
      success: true,
      reports: reportsWithRates,
      period: {
        start: start.toISOString(),
        end: end.toISOString(),
        range,
      },
    });
  } catch (error) {
    console.error("Error fetching reports:", error);
    return NextResponse.json(
      { error: "Failed to fetch reports" },
      { status: 500 },
    );
  }
}
