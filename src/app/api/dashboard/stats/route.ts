import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workItems, projects } from "@/lib/db/schema";
import { count, eq, and, lt } from "drizzle-orm";

export async function GET() {
  try {
    // Get overall work item stats
    const workItemStats = await db
      .select({
        total: count(),
      })
      .from(workItems);

    const openCount = await db
      .select({ count: count() })
      .from(workItems)
      .where(eq(workItems.status, "open"));

    const inProgressCount = await db
      .select({ count: count() })
      .from(workItems)
      .where(eq(workItems.status, "in-progress"));

    const completedCount = await db
      .select({ count: count() })
      .from(workItems)
      .where(eq(workItems.status, "completed"));

    const blockedCount = await db
      .select({ count: count() })
      .from(workItems)
      .where(eq(workItems.status, "blocked"));

    // Get project stats
    const projectStats = await db
      .select({
        total: count(),
      })
      .from(projects);

    const activeProjectCount = await db
      .select({ count: count() })
      .from(projects)
      .where(eq(projects.status, "active"));

    // Get overdue items count
    const overdueCount = await db
      .select({ count: count() })
      .from(workItems)
      .where(
        and(
          eq(workItems.status, "open"),
          lt(workItems.dueDate, new Date())
        )
      );

    const stats = {
      totalWorkItems: workItemStats[0]?.total || 0,
      openItems: openCount[0]?.count || 0,
      inProgressItems: inProgressCount[0]?.count || 0,
      completedItems: completedCount[0]?.count || 0,
      blockedItems: blockedCount[0]?.count || 0,
      overdueItems: overdueCount[0]?.count || 0,
      projects: {
        total: projectStats[0]?.total || 0,
        active: activeProjectCount[0]?.count || 0,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
