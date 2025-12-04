"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Maximize2,
  Minimize2,
  MapPin,
  Users,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  Circle,
  Pause,
  Plus,
  Filter,
  Search,
  Download,
  Settings,
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { WorkItemModal } from "@/components/work-item/work-item-modal";
import { GAPlanViewer } from "@/components/ga-plan/ga-plan-viewer";
import { cn, formatDate, formatDateTime, getInitials } from "@/lib/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProjectWithDetails, WorkItemWithDetails, Pin } from "@/lib/types";

export default function ProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const [project, setProject] = useState<ProjectWithDetails | null>(null);
  const [selectedWorkItem, setSelectedWorkItem] = useState<WorkItemWithDetails | null>(null);
  const [showWorkItemModal, setShowWorkItemModal] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchProject() {
      try {
        const resolvedParams = await params;
        const res = await fetch(`/api/projects/${resolvedParams.id}`);
        if (!res.ok) {
          throw new Error("Project not found");
        }
        const data = await res.json();
        setProject(data);
      } catch (error) {
        console.error("Error fetching project:", error);
        router.push("/dashboard");
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [params, router]);

  const handlePinClick = (workItem: WorkItemWithDetails) => {
    setSelectedWorkItem(workItem);
    setShowWorkItemModal(true);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "open":
        return <Circle className="w-4 h-4" />;
      case "in-progress":
        return <Clock className="w-4 h-4" />;
      case "completed":
        return <CheckCircle className="w-4 h-4" />;
      case "blocked":
        return <Pause className="w-4 h-4" />;
      default:
        return <Circle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open":
        return "status-open";
      case "in-progress":
        return "status-in-progress";
      case "completed":
        return "status-completed";
      case "blocked":
        return "status-blocked";
      default:
        return "status-open";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-500";
      case "high":
        return "text-orange-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  if (loading) {
    return <div className="p-8">Loading project...</div>;
  }

  if (!project) {
    return <div className="p-8">Project not found</div>;
  }

  // Convert work items to pins
  const pins: Pin[] = project.workItems
    .filter(item => item.pinX !== null && item.pinY !== null)
    .map(item => ({
      id: item.id,
      x: item.pinX!,
      y: item.pinY!,
      workItem: item,
    }));

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-6 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">{project.name}</h1>
            <p className="text-sm text-muted-foreground">
              {project.vessel.name} • {project.vessel.type || "Unknown type"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="maritime" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Work Item
          </Button>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* GA Plan Viewer */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={cn(
            "relative bg-slate-50 dark:bg-slate-900 transition-all duration-300",
            isFullscreen ? "w-full" : "flex-1"
          )}
        >
          <GAPlanViewer
            planImageUrl={project.vessel.gaPlanUrl || "/yacht-ga-plan.svg"}
            pins={pins}
            onPinClick={(pin: Pin) => handlePinClick(pin.workItem)}
            className="w-full h-full"
          />
          <Button
            variant="secondary"
            size="icon"
            className="absolute top-4 right-4"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? (
              <Minimize2 className="w-4 h-4" />
            ) : (
              <Maximize2 className="w-4 h-4" />
            )}
          </Button>
        </motion.div>

        {/* Sidebar */}
        {!isFullscreen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-96 bg-background border-l overflow-y-auto"
          >
            {/* Project Info */}
            <div className="p-6 border-b">
              <h2 className="font-semibold mb-4">Project Overview</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Start Date</span>
                  <span>{formatDate(project.startDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">End Date</span>
                  <span>{formatDate(project.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant="secondary" className="capitalize">
                    {project.status}
                  </Badge>
                </div>
              </div>
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>
                    {project.stats.completed}/{project.stats.total} items
                  </span>
                </div>
                <Progress
                  value={
                    project.stats.total > 0
                      ? (project.stats.completed / project.stats.total) * 100
                      : 0
                  }
                  className="h-2"
                />
              </div>
            </div>

            {/* Work Items List */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold">Work Items</h2>
                <Badge variant="outline">{project.stats.total}</Badge>
              </div>
              <div className="space-y-2">
                {project.workItems.map((item: WorkItemWithDetails) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02 }}
                    className="p-3 rounded-lg border hover:bg-accent/50 cursor-pointer transition-colors"
                    onClick={() => handlePinClick(item)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={cn("mt-0.5", getStatusColor(item.status))}>
                        {getStatusIcon(item.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {item.deckLevel || "No deck"} • {item.location || "No location"}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className={cn("text-xs", getPriorityColor(item.priority))}
                          >
                            {item.priority}
                          </Badge>
                          {item.assignee && (
                            <div className="flex items-center gap-1">
                              <Avatar className="w-4 h-4">
                                <AvatarImage src={item.assignee.avatarUrl || undefined} />
                                <AvatarFallback className="text-xs">
                                  {getInitials(item.assignee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">
                                {item.assignee.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Work Item Modal */}
      <AnimatePresence>
        {showWorkItemModal && selectedWorkItem && (
          <WorkItemModal
            isOpen={showWorkItemModal}
            workItem={selectedWorkItem}
            onClose={() => {
              setShowWorkItemModal(false);
              setSelectedWorkItem(null);
            }}
            onSave={(updated) => {
              // TODO: Update work item
              console.log("Updated work item:", updated);
              setShowWorkItemModal(false);
              setSelectedWorkItem(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
