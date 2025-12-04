"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Ship,
  FolderKanban,
  MapPin,
  Plus,
  ArrowRight,
  Calendar,
} from "lucide-react";
import { DashboardStats } from "@/components/dashboard/stats-cards";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { cn, formatDate, getInitials } from "@/lib/utils";
import Link from "next/link";

// Demo data
const demoStats = {
  totalWorkItems: 47,
  openItems: 12,
  inProgressItems: 18,
  completedItems: 14,
  blockedItems: 3,
  overdueItems: 2,
};

const demoProjects = [
  {
    id: "1",
    name: "Annual Refit 2024",
    vessel: "M/Y Aurora",
    progress: 65,
    workItems: 24,
    completed: 16,
    dueDate: new Date("2024-04-15"),
  },
  {
    id: "2",
    name: "Engine Overhaul",
    vessel: "M/Y Neptune",
    progress: 30,
    workItems: 12,
    completed: 4,
    dueDate: new Date("2024-03-28"),
  },
  {
    id: "3",
    name: "Interior Refresh",
    vessel: "S/Y Windchaser",
    progress: 85,
    workItems: 8,
    completed: 7,
    dueDate: new Date("2024-03-20"),
  },
];

const recentActivity = [
  {
    id: "1",
    user: { name: "John Smith", avatar: null },
    action: "completed",
    item: "Replace port engine filter",
    time: "2 hours ago",
  },
  {
    id: "2",
    user: { name: "Sarah Johnson", avatar: null },
    action: "commented on",
    item: "Bridge console update",
    time: "4 hours ago",
  },
  {
    id: "3",
    user: { name: "Mike Davis", avatar: null },
    action: "created",
    item: "Deck varnish inspection",
    time: "5 hours ago",
  },
  {
    id: "4",
    user: { name: "Emily Chen", avatar: null },
    action: "assigned",
    item: "HVAC maintenance check",
    time: "Yesterday",
  },
];

const upcomingTasks = [
  {
    id: "1",
    title: "Safety equipment inspection",
    dueDate: new Date("2024-03-18"),
    priority: "high" as const,
    vessel: "M/Y Aurora",
  },
  {
    id: "2",
    title: "Navigation system update",
    dueDate: new Date("2024-03-19"),
    priority: "medium" as const,
    vessel: "M/Y Neptune",
  },
  {
    id: "3",
    title: "Tender service",
    dueDate: new Date("2024-03-20"),
    priority: "low" as const,
    vessel: "S/Y Windchaser",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back, Captain Paul. Here&apos;s your fleet overview.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(new Date())}
          </Button>
          <Button variant="maritime">
            <Plus className="w-4 h-4 mr-2" />
            New Work Item
          </Button>
        </div>
      </div>

      {/* Stats */}
      <DashboardStats stats={demoStats} />

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Active Projects */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FolderKanban className="w-5 h-5 text-ocean-500" />
                  Active Projects
                </CardTitle>
                <CardDescription>Your ongoing vessel projects</CardDescription>
              </div>
              <Link href="/projects">
                <Button variant="ghost" size="sm">
                  View all
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {demoProjects.map((project) => (
                  <Link
                    key={project.id}
                    href={`/projects/${project.id}`}
                    className="block"
                  >
                    <div className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent/50 transition-colors">
                      <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-navy-100 dark:bg-navy-800">
                        <Ship className="w-5 h-5 text-navy-600 dark:text-navy-300" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium truncate">{project.name}</h4>
                          <span className="text-sm text-muted-foreground">
                            Due {formatDate(project.dueDate)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {project.vessel}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex-1">
                            <Progress value={project.progress} className="h-2" />
                          </div>
                          <span className="text-sm font-medium">
                            {project.completed}/{project.workItems}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates from your team</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={activity.user.avatar || undefined} />
                      <AvatarFallback className="text-xs">
                        {getInitials(activity.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">
                        <span className="font-medium">{activity.user.name}</span>{" "}
                        {activity.action}{" "}
                        <span className="font-medium">{activity.item}</span>
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-ocean-500" />
                Upcoming Tasks
              </CardTitle>
              <CardDescription>Tasks due in the next 7 days</CardDescription>
            </div>
            <Link href="/work-items">
              <Button variant="ghost" size="sm">
                View all
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={task.priority}>{task.priority}</Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  <h4 className="font-medium mb-1">{task.title}</h4>
                  <p className="text-sm text-muted-foreground">{task.vessel}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
