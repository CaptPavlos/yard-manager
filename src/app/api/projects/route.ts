import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, vessels, workItems, users } from "@/lib/db/schema";
import { eq, count } from "drizzle-orm";

export async function GET() {
  try {
    const projectsList = await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        startDate: projects.startDate,
        endDate: projects.endDate,
        status: projects.status,
        vessel: {
          id: vessels.id,
          name: vessels.name,
          type: vessels.type,
        },
        workItemCount: count(workItems.id),
        completedCount: count(workItems.id).where(eq(workItems.status, "completed")),
      })
      .from(projects)
      .leftJoin(vessels, eq(projects.vesselId, vessels.id))
      .leftJoin(workItems, eq(projects.id, workItems.projectId))
      .groupBy(projects.id, vessels.id)
      .limit(10);

    const formattedProjects = projectsList.map((project) => ({
      id: project.id,
      name: project.name,
      vessel: project.vessel.name,
      progress: project.workItemCount > 0 
        ? Math.round((project.completedCount / project.workItemCount) * 100)
        : 0,
      workItems: project.workItemCount,
      completed: project.completedCount,
      dueDate: project.endDate,
    }));

    return NextResponse.json(formattedProjects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
