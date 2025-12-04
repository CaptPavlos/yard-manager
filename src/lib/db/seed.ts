import { db } from "./index";
import { users, vessels, projects, workItems, projectMembers } from "./schema";
import { eq } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create demo users
  await db.insert(users).values([
    {
      name: "Captain Paul",
      email: "captain@yacht.com",
      role: "admin",
      avatarUrl: null,
    },
    {
      name: "John Smith",
      email: "john@yacht.com",
      role: "manager",
      avatarUrl: null,
    },
    {
      name: "Sarah Johnson",
      email: "sarah@yacht.com",
      role: "manager",
      avatarUrl: null,
    },
    {
      name: "Mike Davis",
      email: "mike@yacht.com",
      role: "crew",
      avatarUrl: null,
    },
    {
      name: "Emily Chen",
      email: "emily@yacht.com",
      role: "crew",
      avatarUrl: null,
    },
  ]);

  // Create demo vessels
  await db.insert(vessels).values([
    {
      name: "M/Y Aurora",
      type: "motor-yacht",
      length: 45,
      flag: "Cayman Islands",
      gaPlanUrl: "/yacht-ga-plan.svg",
    },
    {
      name: "M/Y Neptune",
      type: "motor-yacht",
      length: 38,
      flag: "Marshall Islands",
      gaPlanUrl: "/yacht-ga-plan.svg",
    },
    {
      name: "S/Y Windchaser",
      type: "sailing-yacht",
      length: 32,
      flag: "Malta",
      gaPlanUrl: "/yacht-ga-plan.svg",
    },
  ]);

  // Get the created vessels and users for references
  const [aurora, neptune, windchaser] = await db.select().from(vessels);
  const [captain] = await db.select().from(users).where(eq(users.email, "captain@yacht.com"));

  // Create demo projects
  await db.insert(projects).values([
    {
      name: "Annual Refit 2024",
      vesselId: aurora.id,
      description: "Complete annual refit and maintenance",
      startDate: new Date("2024-03-01"),
      endDate: new Date("2024-04-15"),
      status: "active",
      createdBy: captain.id,
    },
    {
      name: "Engine Overhaul",
      vesselId: neptune.id,
      description: "Major engine maintenance and overhaul",
      startDate: new Date("2024-03-10"),
      endDate: new Date("2024-03-28"),
      status: "active",
      createdBy: captain.id,
    },
    {
      name: "Interior Refresh",
      vesselId: windchaser.id,
      description: "Interior renovation and updates",
      startDate: new Date("2024-03-05"),
      endDate: new Date("2024-03-20"),
      status: "active",
      createdBy: captain.id,
    },
  ]);

  // Get the created projects
  const [refitProject, engineProject, interiorProject] = await db.select().from(projects);
  const [john, sarah, mike, emily] = await db.select().from(users).where(eq(users.role, "crew"));

  // Add project members
  await db.insert(projectMembers).values([
    // Aurora project members
    { projectId: refitProject.id, userId: captain.id, role: "admin" },
    { projectId: refitProject.id, userId: john.id, role: "member" },
    { projectId: refitProject.id, userId: sarah.id, role: "member" },
    { projectId: refitProject.id, userId: mike.id, role: "member" },
    { projectId: refitProject.id, userId: emily.id, role: "member" },
    // Neptune project members
    { projectId: engineProject.id, userId: captain.id, role: "admin" },
    { projectId: engineProject.id, userId: john.id, role: "member" },
    // Windchaser project members
    { projectId: interiorProject.id, userId: captain.id, role: "admin" },
    { projectId: interiorProject.id, userId: emily.id, role: "member" },
  ]);

  // Create demo work items for Aurora refit
  await db.insert(workItems).values([
    {
      title: "Engine room ventilation check",
      description: "Inspect and clean engine room ventilation systems",
      status: "in-progress",
      priority: "high",
      projectId: refitProject.id,
      assigneeId: john.id,
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
      title: "Bridge console update",
      description: "Update navigation software on bridge console",
      status: "open",
      priority: "critical",
      projectId: refitProject.id,
      assigneeId: sarah.id,
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
      title: "Deck varnish inspection",
      description: "Inspect teak deck varnish condition",
      status: "completed",
      priority: "low",
      projectId: refitProject.id,
      assigneeId: mike.id,
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
      title: "Safety equipment inspection",
      description: "Annual safety equipment inspection and certification",
      status: "open",
      priority: "high",
      projectId: refitProject.id,
      assigneeId: sarah.id,
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
      title: "Navigation system update",
      description: "Update GPS and navigation systems",
      status: "open",
      priority: "medium",
      projectId: engineProject.id,
      assigneeId: john.id,
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
      title: "Tender service",
      description: "Annual service and maintenance of tender",
      status: "open",
      priority: "low",
      projectId: interiorProject.id,
      assigneeId: mike.id,
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
