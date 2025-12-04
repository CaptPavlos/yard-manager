import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { workItems, projects } from "@/lib/db/schema";
import { count, eq } from "drizzle-orm";

export async function GET() {
  try {
    // Get overall work item stats
    const [workItemStats] = await db
      .select({
        total: count(),
        open: count(workItems.id).where(eq(workItems.status, "open")),
        inProgress: count(workItems.id).where(eq(workItems.status, "in-progress")),
        completed: count(workItems.id).where(eq(workItems.status, "completed")),
        blocked: count(workItems.id).where(eq(workItems.status, "blocked")),
      })
      .from(workItems);

    // Get project stats
    const [projectStats] = await db
      .select({
        total: count(),
        active: count(projects.id).where(eq(projects.status, "active")),
      })
      .from(projects);

    // Get overdue items count
    const overdueCount = await db
      .select({ count: count() })
      .from(workItems)
      .where(
        and(
          eq(workItems.status, "open"),
          // workItems.dueDate < new Date() // TODO: Add date comparison
        )
      );

    const stats = {
      workItems: {
        total: workItemStats.total,
        open: workItemStats.open,
        inProgress: workItemStats.inProgress,
        completed: workItemStats.completed,
        blocked: workItemStats.blocked,
        overdue: overdueCount[0]?.count || 0,
      },
      projects: {
        total: projectStats.total,
        active: projectStats.active,
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
