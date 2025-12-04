"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Users,
  Plus,
  Filter,
  Download,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { GAPlanViewer } from "@/components/ga-plan/ga-plan-viewer";
import { WorkItemModal } from "@/components/work-item/work-item-modal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Pin, WorkItemWithDetails } from "@/lib/types";

// Demo GA plan - yacht layout
const DEMO_GA_PLAN = "/yacht-ga-plan.svg";

// Demo pins data
const demoPins: Pin[] = [
  {
    id: "1",
    x: 25,
    y: 40,
    workItem: {
      id: "1",
      title: "Engine room ventilation check",
      description: "Inspect and clean engine room ventilation systems",
      status: "in-progress",
      priority: "high",
      pinX: 25,
      pinY: 40,
      deckLevel: "Lower Deck",
      location: "Engine Room",
      dueDate: new Date("2024-03-20"),
      estimatedHours: 4,
      actualHours: 2,
      tags: ["maintenance", "engine"],
      customFields: {},
      assignee: { id: "1", name: "John Smith", avatarUrl: null },
      createdBy: { id: "2", name: "Captain Paul" },
      commentsCount: 3,
      attachmentsCount: 2,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    },
  },
  {
    id: "2",
    x: 70,
    y: 30,
    workItem: {
      id: "2",
      title: "Bridge console update",
      description: "Update navigation software on bridge console",
      status: "open",
      priority: "critical",
      pinX: 70,
      pinY: 30,
      deckLevel: "Bridge",
      location: "Navigation Station",
      dueDate: new Date("2024-03-18"),
      estimatedHours: 8,
      actualHours: null,
      tags: ["navigation", "software"],
      customFields: {},
      assignee: { id: "3", name: "Sarah Johnson", avatarUrl: null },
      createdBy: { id: "2", name: "Captain Paul" },
      commentsCount: 5,
      attachmentsCount: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    },
  },
  {
    id: "3",
    x: 50,
    y: 60,
    workItem: {
      id: "3",
      title: "Deck varnish inspection",
      description: "Inspect teak deck varnish condition",
      status: "completed",
      priority: "low",
      pinX: 50,
      pinY: 60,
      deckLevel: "Main Deck",
      location: "Aft Deck",
      dueDate: new Date("2024-03-15"),
      estimatedHours: 2,
      actualHours: 1.5,
      tags: ["deck", "cosmetic"],
      customFields: {},
      assignee: { id: "4", name: "Mike Davis", avatarUrl: null },
      createdBy: { id: "2", name: "Captain Paul" },
      commentsCount: 1,
      attachmentsCount: 4,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: new Date("2024-03-14"),
    },
  },
  {
    id: "4",
    x: 35,
    y: 50,
    workItem: {
      id: "4",
      title: "HVAC filter replacement",
      description: "Replace all HVAC filters in guest cabins",
      status: "blocked",
      priority: "medium",
      pinX: 35,
      pinY: 50,
      deckLevel: "Lower Deck",
      location: "Guest Cabin 1",
      dueDate: new Date("2024-03-22"),
      estimatedHours: 3,
      actualHours: null,
      tags: ["hvac", "maintenance"],
      customFields: {},
      assignee: null,
      createdBy: { id: "2", name: "Captain Paul" },
      commentsCount: 2,
      attachmentsCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: null,
    },
  },
];

const projectStats = {
  total: 24,
  open: 8,
  inProgress: 10,
  completed: 4,
  blocked: 2,
};

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [pins, setPins] = useState<Pin[]>(demoPins);
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewPinModal, setShowNewPinModal] = useState(false);
  const [newPinPosition, setNewPinPosition] = useState<{ x: number; y: number } | null>(null);

  const handlePinClick = (pin: Pin) => {
    setSelectedPin(pin);
  };

  const handlePinMove = (pinId: string, x: number, y: number) => {
    setPins((prev) =>
      prev.map((p) =>
        p.id === pinId
          ? { ...p, x, y, workItem: { ...p.workItem, pinX: x, pinY: y } }
          : p
      )
    );
  };

  const handleAddPin = (x: number, y: number) => {
    setNewPinPosition({ x, y });
    setShowNewPinModal(true);
  };

  const handleCreateWorkItem = (data: any) => {
    if (newPinPosition) {
      const newPin: Pin = {
        id: `new-${Date.now()}`,
        x: newPinPosition.x,
        y: newPinPosition.y,
        workItem: {
          id: `new-${Date.now()}`,
          title: data.title,
          description: data.description || null,
          status: data.status,
          priority: data.priority,
          pinX: newPinPosition.x,
          pinY: newPinPosition.y,
          deckLevel: data.deckLevel || null,
          location: data.location || null,
          dueDate: data.dueDate ? new Date(data.dueDate) : null,
          estimatedHours: data.estimatedHours || null,
          actualHours: null,
          tags: data.tags || [],
          customFields: {},
          assignee: null,
          createdBy: { id: "2", name: "Captain Paul" },
          commentsCount: 0,
          attachmentsCount: 0,
          createdAt: new Date(),
          updatedAt: new Date(),
          completedAt: null,
        },
      };
      setPins((prev) => [...prev, newPin]);
      setShowNewPinModal(false);
      setNewPinPosition(null);
    }
  };

  const completionPercentage = Math.round(
    (projectStats.completed / projectStats.total) * 100
  );

  return (
    <div className="h-[calc(100vh-48px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-background/95 backdrop-blur">
        <div className="flex items-center gap-4">
          <Link href="/projects">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">Annual Refit 2024</h1>
            <p className="text-sm text-muted-foreground">M/Y Aurora</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </Button>
          <Button
            variant={isEditing ? "maritime" : "outline"}
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? "Done Editing" : "Edit Plan"}
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex">
        {/* GA Plan Viewer */}
        <div className="flex-1 relative">
          <GAPlanViewer
            planImageUrl={DEMO_GA_PLAN}
            pins={pins}
            selectedPinId={selectedPin?.id}
            onPinClick={handlePinClick}
            onPinMove={handlePinMove}
            onAddPin={handleAddPin}
            isEditing={isEditing}
          />
        </div>

        {/* Sidebar */}
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-80 border-l bg-background/95 backdrop-blur overflow-y-auto"
        >
          {/* Project progress */}
          <div className="p-4 border-b">
            <h3 className="font-semibold mb-3">Project Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion</span>
                <span className="font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-950">
                <div className="text-2xl font-bold text-blue-600">{projectStats.open}</div>
                <div className="text-xs text-blue-600">Open</div>
              </div>
              <div className="p-2 rounded-lg bg-yellow-50 dark:bg-yellow-950">
                <div className="text-2xl font-bold text-yellow-600">{projectStats.inProgress}</div>
                <div className="text-xs text-yellow-600">In Progress</div>
              </div>
              <div className="p-2 rounded-lg bg-green-50 dark:bg-green-950">
                <div className="text-2xl font-bold text-green-600">{projectStats.completed}</div>
                <div className="text-xs text-green-600">Completed</div>
              </div>
              <div className="p-2 rounded-lg bg-red-50 dark:bg-red-950">
                <div className="text-2xl font-bold text-red-600">{projectStats.blocked}</div>
                <div className="text-xs text-red-600">Blocked</div>
              </div>
            </div>
          </div>

          {/* Work items list */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold">Work Items</h3>
              <Button variant="ghost" size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <div className="space-y-2">
              {pins.map((pin) => (
                <button
                  key={pin.id}
                  onClick={() => handlePinClick(pin)}
                  className={cn(
                    "w-full p-3 text-left rounded-lg border transition-colors",
                    selectedPin?.id === pin.id
                      ? "border-ocean-500 bg-ocean-50 dark:bg-ocean-950"
                      : "hover:bg-accent"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{pin.workItem.title}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {pin.workItem.location}
                      </p>
                    </div>
                    <Badge variant={pin.workItem.status} className="text-xs">
                      {pin.workItem.status}
                    </Badge>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Work Item Modal */}
      {selectedPin && (
        <WorkItemModal
          isOpen={!!selectedPin}
          onClose={() => setSelectedPin(null)}
          workItem={selectedPin.workItem}
          onSave={(data) => {
            console.log("Save:", data);
            setSelectedPin(null);
          }}
        />
      )}

      {/* New Work Item Modal */}
      <WorkItemModal
        isOpen={showNewPinModal}
        onClose={() => {
          setShowNewPinModal(false);
          setNewPinPosition(null);
        }}
        isNew
        onSave={handleCreateWorkItem}
      />
    </div>
  );
}
