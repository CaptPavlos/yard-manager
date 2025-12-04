import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects, workItems, users, vessels } from "@/lib/db/schema";
import { eq, count, sql } from "drizzle-orm";
import type { ProjectWithDetails } from "@/lib/types";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    // Get project with vessel info
    const projectList = await db
      .select({
        id: projects.id,
        name: projects.name,
        description: projects.description,
        startDate: projects.startDate,
        endDate: projects.endDate,
        status: projects.status,
        vesselId: vessels.id,
        vesselName: vessels.name,
        vesselType: vessels.type,
        vesselGaPlanUrl: vessels.gaPlanUrl,
      })
      .from(projects)
      .leftJoin(vessels, eq(projects.vesselId, vessels.id))
      .where(eq(projects.id, projectId));

    if (!projectList.length) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const project = projectList[0];

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
        assigneeId: users.id,
        assigneeName: users.name,
        assigneeAvatar: users.avatarUrl,
        createdById: users.id,
        createdByName: users.name,
        createdAt: workItems.createdAt,
        updatedAt: workItems.updatedAt,
        completedAt: workItems.completedAt,
      })
      .from(workItems)
      .leftJoin(users, eq(workItems.assigneeId, users.id))
      .where(eq(workItems.projectId, projectId));

    // Get work item counts
    const counts = await db
      .select({
        total: sql<number>`count(*)`.mapWith(Number),
        open: sql<number>`count(case when ${workItems.status} = 'open' then 1 end)`.mapWith(Number),
        inProgress: sql<number>`count(case when ${workItems.status} = 'in-progress' then 1 end)`.mapWith(Number),
        completed: sql<number>`count(case when ${workItems.status} = 'completed' then 1 end)`.mapWith(Number),
        blocked: sql<number>`count(case when ${workItems.status} = 'blocked' then 1 end)`.mapWith(Number),
      })
      .from(workItems)
      .where(eq(workItems.projectId, projectId));

    const response: ProjectWithDetails = {
      id: project.id,
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      vessel: {
        id: project.vesselId || "",
        name: project.vesselName || "Unknown Vessel",
        type: project.vesselType || null,
        imageUrl: null,
        gaPlanUrl: project.vesselGaPlanUrl || "/yacht-ga-plan.svg",
      },
      workItems: workItemsList.map((item) => ({
        id: item.id,
        title: item.title,
        description: item.description,
        status: item.status,
        priority: item.priority,
        pinX: item.pinX,
        pinY: item.pinY,
        deckLevel: item.deckLevel,
        location: item.location,
        dueDate: item.dueDate,
        estimatedHours: item.estimatedHours,
        actualHours: item.actualHours,
        tags: item.tags,
        customFields: {},
        assignee: item.assigneeId ? {
          id: item.assigneeId,
          name: item.assigneeName || "",
          avatarUrl: item.assigneeAvatar,
        } : null,
        createdBy: item.createdById ? {
          id: item.createdById,
          name: item.createdByName || "",
        } : null,
        commentsCount: 0,
        attachmentsCount: 0,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt,
        completedAt: item.completedAt,
      })),
      stats: {
        total: counts[0]?.total || 0,
        open: counts[0]?.open || 0,
        inProgress: counts[0]?.inProgress || 0,
        completed: counts[0]?.completed || 0,
        blocked: counts[0]?.blocked || 0,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
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
