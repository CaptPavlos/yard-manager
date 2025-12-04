import { pgTable, text, timestamp, uuid, boolean, integer, jsonb, real } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  avatarUrl: text("avatar_url"),
  role: text("role", { enum: ["admin", "manager", "crew", "viewer"] }).notNull().default("crew"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Yachts/Vessels table
export const vessels = pgTable("vessels", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  type: text("type"), // Motor Yacht, Sailing Yacht, etc.
  length: real("length"), // in meters
  flag: text("flag"),
  imo: text("imo"),
  imageUrl: text("image_url"),
  gaPlanUrl: text("ga_plan_url"), // URL to the GA plan image/SVG
  gaPlanData: jsonb("ga_plan_data"), // Additional GA plan metadata
  ownerId: uuid("owner_id").references(() => users.id),
  isArchived: boolean("is_archived").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Projects table
export const projects = pgTable("projects", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  description: text("description"),
  vesselId: uuid("vessel_id").references(() => vessels.id).notNull(),
  status: text("status", { enum: ["active", "completed", "on-hold", "archived"] }).notNull().default("active"),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Work Items (Pins on the GA plan)
export const workItems = pgTable("work_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  status: text("status", { enum: ["open", "in-progress", "completed", "blocked"] }).notNull().default("open"),
  priority: text("priority", { enum: ["low", "medium", "high", "critical"] }).notNull().default("medium"),
  // Pin position on GA plan (percentage-based for responsiveness)
  pinX: real("pin_x"), // 0-100 percentage
  pinY: real("pin_y"), // 0-100 percentage
  deckLevel: text("deck_level"), // e.g., "main-deck", "lower-deck", "bridge"
  location: text("location"), // Human-readable location
  assigneeId: uuid("assignee_id").references(() => users.id),
  dueDate: timestamp("due_date"),
  estimatedHours: real("estimated_hours"),
  actualHours: real("actual_hours"),
  tags: jsonb("tags").$type<string[]>().default([]),
  customFields: jsonb("custom_fields").$type<Record<string, unknown>>().default({}),
  order: integer("order").default(0),
  createdBy: uuid("created_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

// Comments
export const comments = pgTable("comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  workItemId: uuid("work_item_id").references(() => workItems.id).notNull(),
  parentId: uuid("parent_id"), // For threaded comments
  content: text("content").notNull(),
  authorId: uuid("author_id").references(() => users.id).notNull(),
  mentions: jsonb("mentions").$type<string[]>().default([]), // User IDs mentioned
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Media attachments
export const attachments = pgTable("attachments", {
  id: uuid("id").primaryKey().defaultRandom(),
  workItemId: uuid("work_item_id").references(() => workItems.id),
  commentId: uuid("comment_id").references(() => comments.id),
  fileName: text("file_name").notNull(),
  fileType: text("file_type").notNull(), // image, video, document
  fileUrl: text("file_url").notNull(),
  fileSize: integer("file_size"),
  thumbnailUrl: text("thumbnail_url"),
  uploadedBy: uuid("uploaded_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Activity log
export const activityLog = pgTable("activity_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  workItemId: uuid("work_item_id").references(() => workItems.id),
  projectId: uuid("project_id").references(() => projects.id),
  userId: uuid("user_id").references(() => users.id).notNull(),
  action: text("action").notNull(), // created, updated, commented, status_changed, etc.
  details: jsonb("details").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Project members (many-to-many)
export const projectMembers = pgTable("project_members", {
  id: uuid("id").primaryKey().defaultRandom(),
  projectId: uuid("project_id").references(() => projects.id).notNull(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  role: text("role", { enum: ["owner", "admin", "member", "viewer"] }).notNull().default("member"),
  joinedAt: timestamp("joined_at").defaultNow().notNull(),
});

// Notifications
export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: text("type").notNull(), // mention, assignment, due_date, status_change
  title: text("title").notNull(),
  message: text("message"),
  linkUrl: text("link_url"),
  isRead: boolean("is_read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  ownedVessels: many(vessels),
  assignedWorkItems: many(workItems),
  comments: many(comments),
  notifications: many(notifications),
}));

export const vesselsRelations = relations(vessels, ({ one, many }) => ({
  owner: one(users, {
    fields: [vessels.ownerId],
    references: [users.id],
  }),
  projects: many(projects),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
  vessel: one(vessels, {
    fields: [projects.vesselId],
    references: [vessels.id],
  }),
  creator: one(users, {
    fields: [projects.createdBy],
    references: [users.id],
  }),
  workItems: many(workItems),
  members: many(projectMembers),
}));

export const workItemsRelations = relations(workItems, ({ one, many }) => ({
  project: one(projects, {
    fields: [workItems.projectId],
    references: [projects.id],
  }),
  assignee: one(users, {
    fields: [workItems.assigneeId],
    references: [users.id],
  }),
  creator: one(users, {
    fields: [workItems.createdBy],
    references: [users.id],
  }),
  comments: many(comments),
  attachments: many(attachments),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
  workItem: one(workItems, {
    fields: [comments.workItemId],
    references: [workItems.id],
  }),
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  attachments: many(attachments),
}));

// Types
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Vessel = typeof vessels.$inferSelect;
export type NewVessel = typeof vessels.$inferInsert;
export type Project = typeof projects.$inferSelect;
export type NewProject = typeof projects.$inferInsert;
export type WorkItem = typeof workItems.$inferSelect;
export type NewWorkItem = typeof workItems.$inferInsert;
export type Comment = typeof comments.$inferSelect;
export type NewComment = typeof comments.$inferInsert;
export type Attachment = typeof attachments.$inferSelect;
export type NewAttachment = typeof attachments.$inferInsert;
