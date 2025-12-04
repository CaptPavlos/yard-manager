import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, workItems, users, vessels } from "@/lib/db/schema";
import { eq, and, count } from "drizzle-orm";
import type { ProjectWithDetails } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // Get project with vessel info
    const [project] = await db
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
          gaPlanUrl: vessels.gaPlanUrl,
        },
      })
      .from(projects)
      .leftJoin(vessels, eq(projects.vesselId, vessels.id))
      .where(eq(projects.id, projectId));

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get work items for this project
    const workItemsList = await db
      .select({
        id: workItems.id,
        title: workItems.title,
        description: workItems.description,
        status: workItems.status,
        priority: workItems.priority,
        pinX: workItems.pinX,
        pinY: workItems.pinY,
        deckLevel: workItems.deckLevel,
        location: workItems.location,
        dueDate: workItems.dueDate,
        estimatedHours: workItems.estimatedHours,
        actualHours: workItems.actualHours,
        tags: workItems.tags,
        assignee: {
          id: users.id,
          name: users.name,
          avatarUrl: users.avatarUrl,
        },
        createdBy: {
          id: users.id,
          name: users.name,
        },
        createdAt: workItems.createdAt,
        updatedAt: workItems.updatedAt,
        completedAt: workItems.completedAt,
      })
      .from(workItems)
      .leftJoin(users, eq(workItems.assigneeId, users.id))
      .where(eq(workItems.projectId, projectId));

    // Get work item counts
    const [counts] = await db
      .select({
        total: count(),
        open: count(workItems.id).where(eq(workItems.status, "open")),
        inProgress: count(workItems.id).where(eq(workItems.status, "in-progress")),
        completed: count(workItems.id).where(eq(workItems.status, "completed")),
        blocked: count(workItems.id).where(eq(workItems.status, "blocked")),
      })
      .from(workItems)
      .where(eq(workItems.projectId, projectId));

    const response: ProjectWithDetails = {
      ...project,
      workItems: workItemsList.map((item) => ({
        ...item,
        commentsCount: 0, // TODO: Add comments count
        attachmentsCount: 0, // TODO: Add attachments count
        customFields: {},
      })),
      stats: {
        total: counts.total,
        open: counts.open,
        inProgress: counts.inProgress,
        completed: counts.completed,
        blocked: counts.blocked,
      },
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
