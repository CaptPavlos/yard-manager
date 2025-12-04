// Extended types for the application

export type Priority = "low" | "medium" | "high" | "critical";
export type Status = "open" | "in-progress" | "completed" | "blocked";
export type ProjectStatus = "active" | "completed" | "on-hold" | "archived";
export type UserRole = "admin" | "manager" | "crew" | "viewer";
export type ProjectMemberRole = "owner" | "admin" | "member" | "viewer";

export interface Pin {
  id: string;
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  workItem: WorkItemWithDetails;
}

export interface WorkItemWithDetails {
  id: string;
  title: string;
  description: string | null;
  status: Status;
  priority: Priority;
  pinX: number | null;
  pinY: number | null;
  deckLevel: string | null;
  location: string | null;
  dueDate: Date | null;
  estimatedHours: number | null;
  actualHours: number | null;
  tags: string[];
  customFields: Record<string, unknown>;
  assignee: {
    id: string;
    name: string;
    avatarUrl: string | null;
  } | null;
  createdBy: {
    id: string;
    name: string;
  } | null;
  commentsCount: number;
  attachmentsCount: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt: Date | null;
}

export interface ProjectWithDetails {
  id: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  startDate: Date | null;
  endDate: Date | null;
  vessel: {
    id: string;
    name: string;
    type: string | null;
    imageUrl: string | null;
    gaPlanUrl: string | null;
  };
  workItems: WorkItemWithDetails[];
  stats: {
    total: number;
    open: number;
    inProgress: number;
    completed: number;
    blocked: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface VesselWithProjects {
  id: string;
  name: string;
  type: string | null;
  length: number | null;
  flag: string | null;
  imageUrl: string | null;
  gaPlanUrl: string | null;
  projectsCount: number;
  activeProjectsCount: number;
}

export interface DashboardStats {
  totalWorkItems: number;
  openItems: number;
  inProgressItems: number;
  completedItems: number;
  blockedItems: number;
  overdueItems: number;
  dueSoon: number; // Due within 7 days
  priorityBreakdown: {
    low: number;
    medium: number;
    high: number;
    critical: number;
  };
  recentActivity: ActivityItem[];
}

export interface ActivityItem {
  id: string;
  action: string;
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  workItem?: {
    id: string;
    title: string;
  };
  project?: {
    id: string;
    name: string;
  };
  details: Record<string, unknown>;
  createdAt: Date;
}

export interface CommentWithAuthor {
  id: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };
  mentions: string[];
  attachments: {
    id: string;
    fileName: string;
    fileType: string;
    fileUrl: string;
    thumbnailUrl: string | null;
  }[];
  replies?: CommentWithAuthor[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  type: "mention" | "assignment" | "due_date" | "status_change" | "comment";
  title: string;
  message: string | null;
  linkUrl: string | null;
  isRead: boolean;
  createdAt: Date;
}

// GA Plan related types
export interface GADeck {
  id: string;
  name: string;
  level: number;
  imageUrl: string;
}

export interface GAViewState {
  zoom: number;
  panX: number;
  panY: number;
  activeDeck: string | null;
}

// Filter types
export interface WorkItemFilters {
  status?: Status[];
  priority?: Priority[];
  assigneeId?: string;
  tags?: string[];
  deckLevel?: string;
  search?: string;
  dueDateFrom?: Date;
  dueDateTo?: Date;
}

export interface ProjectFilters {
  status?: ProjectStatus[];
  vesselId?: string;
  search?: string;
}
