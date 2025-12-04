import { db } from "./index";
import { users, vessels, projects, workItems, projectMembers } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create demo users
  const [captain] = await db.insert(users).values([
    {
      id: "user-1",
      name: "Captain Paul",
      email: "captain@yacht.com",
      role: "captain",
      avatarUrl: null,
    },
    {
      id: "user-2",
      name: "John Smith",
      email: "john@yacht.com",
      role: "engineer",
      avatarUrl: null,
    },
    {
      id: "user-3",
      name: "Sarah Johnson",
      email: "sarah@yacht.com",
      role: "first-mate",
      avatarUrl: null,
    },
    {
      id: "user-4",
      name: "Mike Davis",
      email: "mike@yacht.com",
      role: "deckhand",
      avatarUrl: null,
    },
    {
      id: "user-5",
      name: "Emily Chen",
      email: "emily@yacht.com",
      role: "stewardess",
      avatarUrl: null,
    },
  ]).returning();

  // Create demo vessels
  const [aurora] = await db.insert(vessels).values([
    {
      id: "vessel-1",
      name: "M/Y Aurora",
      type: "motor-yacht",
      length: 45,
      year: 2022,
      flag: "Cayman Islands",
      gaPlanUrl: "/yacht-ga-plan.svg",
    },
    {
      id: "vessel-2",
      name: "M/Y Neptune",
      type: "motor-yacht",
      length: 38,
      year: 2021,
      flag: "Marshall Islands",
      gaPlanUrl: "/yacht-ga-plan.svg",
    },
    {
      id: "vessel-3",
      name: "S/Y Windchaser",
      type: "sailing-yacht",
      length: 32,
      year: 2020,
      flag: "Malta",
      gaPlanUrl: "/yacht-ga-plan.svg",
    },
  ]).returning();

  // Create demo projects
  const [refitProject, engineProject, interiorProject] = await db.insert(projects).values([
    {
      id: "project-1",
      name: "Annual Refit 2024",
      vesselId: aurora.id,
      description: "Complete annual refit and maintenance",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-04-15"),
      status: "active",
      createdBy: captain.id,
    },
    {
      id: "project-2",
      name: "Engine Overhaul",
      vesselId: "vessel-2",
      description: "Major engine maintenance and overhaul",
      startDate: new Date("2024-03-10"),
      endDate: new Date("2024-03-28"),
      status: "active",
      createdBy: captain.id,
    },
    {
      id: "project-3",
      name: "Interior Refresh",
      vesselId: "vessel-3",
      description: "Interior renovation and updates",
      startDate: new Date("2024-03-05"),
      endDate: new Date("2024-03-20"),
      status: "active",
      createdBy: captain.id,
    },
  ]).returning();

  // Add project members
  await db.insert(projectMembers).values([
    // Aurora project members
    { projectId: refitProject.id, userId: captain.id, role: "manager" },
    { projectId: refitProject.id, userId: "user-2", role: "member" },
    { projectId: refitProject.id, userId: "user-3", role: "member" },
    { projectId: refitProject.id, userId: "user-4", role: "member" },
    { projectId: refitProject.id, userId: "user-5", role: "member" },
    // Neptune project members
    { projectId: engineProject.id, userId: captain.id, role: "manager" },
    { projectId: engineProject.id, userId: "user-2", role: "member" },
    // Windchaser project members
    { projectId: interiorProject.id, userId: captain.id, role: "manager" },
    { projectId: interiorProject.id, userId: "user-5", role: "member" },
  ]);

  // Create demo work items for Aurora refit
  await db.insert(workItems).values([
    {
      id: "work-1",
      title: "Engine room ventilation check",
      description: "Inspect and clean engine room ventilation systems",
      status: "in-progress",
      priority: "high",
      projectId: refitProject.id,
      assigneeId: "user-2",
      pinX: 25,
      pinY: 40,
      deckLevel: "Lower Deck",
      location: "Engine Room",
      dueDate: new Date("2024-03-20"),
      estimatedHours: 4,
      actualHours: 2,
      tags: ["maintenance", "engine"],
      customFields: {},
      createdBy: captain.id,
    },
    {
      id: "work-2",
      title: "Bridge console update",
      description: "Update navigation software on bridge console",
      status: "open",
      priority: "critical",
      projectId: refitProject.id,
      assigneeId: "user-3",
      pinX: 70,
      pinY: 30,
      deckLevel: "Bridge",
      location: "Navigation Station",
      dueDate: new Date("2024-03-18"),
      estimatedHours: 8,
      actualHours: null,
      tags: ["navigation", "software"],
      customFields: {},
      createdBy: captain.id,
    },
    {
      id: "work-3",
      title: "Deck varnish inspection",
      description: "Inspect teak deck varnish condition",
      status: "completed",
      priority: "low",
      projectId: refitProject.id,
      assigneeId: "user-4",
      pinX: 50,
      pinY: 60,
      deckLevel: "Main Deck",
      location: "Aft Deck",
      dueDate: new Date("2024-03-15"),
      estimatedHours: 2,
      actualHours: 1.5,
      tags: ["deck", "cosmetic"],
      customFields: {},
      createdBy: captain.id,
      completedAt: new Date("2024-03-14"),
    },
    {
      id: "work-4",
      title: "HVAC filter replacement",
      description: "Replace all HVAC filters in guest cabins",
      status: "blocked",
      priority: "medium",
      projectId: refitProject.id,
      assigneeId: null,
      pinX: 35,
      pinY: 50,
      deckLevel: "Lower Deck",
      location: "Guest Cabin 1",
      dueDate: new Date("2024-03-22"),
      estimatedHours: 3,
      actualHours: null,
      tags: ["hvac", "maintenance"],
      customFields: {},
      createdBy: captain.id,
    },
    {
      id: "work-5",
      title: "Safety equipment inspection",
      description: "Annual safety equipment inspection and certification",
      status: "open",
      priority: "high",
      projectId: refitProject.id,
      assigneeId: "user-3",
      pinX: 15,
      pinY: 45,
      deckLevel: "Main Deck",
      location: "Forward Deck",
      dueDate: new Date("2024-03-18"),
      estimatedHours: 6,
      actualHours: null,
      tags: ["safety", "inspection"],
      customFields: {},
      createdBy: captain.id,
    },
    {
      id: "work-6",
      title: "Navigation system update",
      description: "Update GPS and navigation systems",
      status: "open",
      priority: "medium",
      projectId: engineProject.id,
      assigneeId: "user-2",
      pinX: 65,
      pinY: 35,
      deckLevel: "Bridge",
      location: "Navigation Station",
      dueDate: new Date("2024-03-19"),
      estimatedHours: 4,
      actualHours: null,
      tags: ["navigation"],
      customFields: {},
      createdBy: captain.id,
    },
    {
      id: "work-7",
      title: "Tender service",
      description: "Annual service and maintenance of tender",
      status: "open",
      priority: "low",
      projectId: interiorProject.id,
      assigneeId: "user-4",
      pinX: 85,
      pinY: 55,
      deckLevel: "Main Deck",
      location: "Aft Deck",
      dueDate: new Date("2024-03-20"),
      estimatedHours: 3,
      actualHours: null,
      tags: ["tender", "maintenance"],
      customFields: {},
      createdBy: captain.id,
    },
  ]);

  console.log("✅ Database seeded successfully!");
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .catch((e) => {
      console.error("❌ Error seeding database:", e);
      process.exit(1);
    })
    .finally(() => {
      process.exit(0);
    });
}

export { seed };
