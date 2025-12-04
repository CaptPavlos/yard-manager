"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  User,
  MessageSquare,
  Paperclip,
  MoreHorizontal,
  X,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn, formatDate, getInitials } from "@/lib/utils";
import type { WorkItemWithDetails, Priority, Status } from "@/lib/types";

const workItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  status: z.enum(["open", "in-progress", "completed", "blocked"]),
  priority: z.enum(["low", "medium", "high", "critical"]),
  location: z.string().optional(),
  deckLevel: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().optional(),
  tags: z.array(z.string()).optional(),
});

type WorkItemFormData = z.infer<typeof workItemSchema>;

interface WorkItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  workItem?: WorkItemWithDetails;
  onSave?: (data: WorkItemFormData) => void;
  onDelete?: () => void;
  isNew?: boolean;
}

const statusOptions: { value: Status; label: string; color: string }[] = [
  { value: "open", label: "Open", color: "bg-blue-500" },
  { value: "in-progress", label: "In Progress", color: "bg-yellow-500" },
  { value: "completed", label: "Completed", color: "bg-green-500" },
  { value: "blocked", label: "Blocked", color: "bg-red-500" },
];

const priorityOptions: { value: Priority; label: string; icon: React.ReactNode }[] = [
  { value: "low", label: "Low", icon: <div className="w-2 h-2 rounded-full bg-green-500" /> },
  { value: "medium", label: "Medium", icon: <div className="w-2 h-2 rounded-full bg-yellow-500" /> },
  { value: "high", label: "High", icon: <div className="w-2 h-2 rounded-full bg-orange-500" /> },
  { value: "critical", label: "Critical", icon: <AlertCircle className="w-4 h-4 text-red-500" /> },
];

export function WorkItemModal({
  isOpen,
  onClose,
  workItem,
  onSave,
  onDelete,
  isNew = false,
}: WorkItemModalProps) {
  const [isEditing, setIsEditing] = useState(isNew);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<WorkItemFormData>({
    resolver: zodResolver(workItemSchema),
    defaultValues: {
      title: workItem?.title || "",
      description: workItem?.description || "",
      status: workItem?.status || "open",
      priority: workItem?.priority || "medium",
      location: workItem?.location || "",
      deckLevel: workItem?.deckLevel || "",
      dueDate: workItem?.dueDate ? new Date(workItem.dueDate).toISOString().split("T")[0] : "",
      estimatedHours: workItem?.estimatedHours || undefined,
      tags: workItem?.tags || [],
    },
  });

  const currentStatus = watch("status");
  const currentPriority = watch("priority");

  const onSubmit = (data: WorkItemFormData) => {
    onSave?.(data);
    setIsEditing(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="border-b pb-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {isEditing ? (
                <Input
                  {...register("title")}
                  placeholder="Work item title"
                  className="text-lg font-semibold border-0 p-0 h-auto focus-visible:ring-0"
                />
              ) : (
                <DialogTitle className="text-xl font-semibold">
                  {workItem?.title || "New Work Item"}
                </DialogTitle>
              )}
              {errors.title && (
                <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              {!isNew && (
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 py-4">
          {/* Status and Priority row */}
          <div className="flex flex-wrap gap-4">
            {/* Status */}
            <div className="relative">
              <label className="text-sm text-muted-foreground mb-1 block">Status</label>
              <Button
                type="button"
                variant="outline"
                className="justify-between min-w-[140px]"
                onClick={() => setShowStatusDropdown(!showStatusDropdown)}
                disabled={!isEditing}
              >
                <div className="flex items-center gap-2">
                  <div className={cn("w-2 h-2 rounded-full", statusOptions.find(s => s.value === currentStatus)?.color)} />
                  <span>{statusOptions.find(s => s.value === currentStatus)?.label}</span>
                </div>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              {showStatusDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 w-full bg-popover border rounded-md shadow-lg z-10"
                >
                  {statusOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-2"
                      onClick={() => {
                        setValue("status", option.value);
                        setShowStatusDropdown(false);
                      }}
                    >
                      <div className={cn("w-2 h-2 rounded-full", option.color)} />
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            {/* Priority */}
            <div className="relative">
              <label className="text-sm text-muted-foreground mb-1 block">Priority</label>
              <Button
                type="button"
                variant="outline"
                className="justify-between min-w-[140px]"
                onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                disabled={!isEditing}
              >
                <div className="flex items-center gap-2">
                  {priorityOptions.find(p => p.value === currentPriority)?.icon}
                  <span>{priorityOptions.find(p => p.value === currentPriority)?.label}</span>
                </div>
                <ChevronDown className="h-4 w-4 ml-2" />
              </Button>
              {showPriorityDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-1 w-full bg-popover border rounded-md shadow-lg z-10"
                >
                  {priorityOptions.map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      className="w-full px-3 py-2 text-left hover:bg-accent flex items-center gap-2"
                      onClick={() => {
                        setValue("priority", option.value);
                        setShowPriorityDropdown(false);
                      }}
                    >
                      {option.icon}
                      {option.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-sm text-muted-foreground mb-1 block">Description</label>
            {isEditing ? (
              <textarea
                {...register("description")}
                placeholder="Add a description..."
                className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            ) : (
              <p className="text-sm text-foreground">
                {workItem?.description || "No description"}
              </p>
            )}
          </div>

          {/* Location & Deck */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Location
              </label>
              {isEditing ? (
                <Input {...register("location")} placeholder="e.g., Engine Room" />
              ) : (
                <p className="text-sm">{workItem?.location || "Not specified"}</p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">Deck Level</label>
              {isEditing ? (
                <Input {...register("deckLevel")} placeholder="e.g., Lower Deck" />
              ) : (
                <p className="text-sm">{workItem?.deckLevel || "Not specified"}</p>
              )}
            </div>
          </div>

          {/* Due Date & Estimated Hours */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> Due Date
              </label>
              {isEditing ? (
                <Input {...register("dueDate")} type="date" />
              ) : (
                <p className="text-sm">
                  {workItem?.dueDate ? formatDate(workItem.dueDate) : "Not set"}
                </p>
              )}
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Estimated Hours
              </label>
              {isEditing ? (
                <Input
                  {...register("estimatedHours", { valueAsNumber: true })}
                  type="number"
                  step="0.5"
                  placeholder="0"
                />
              ) : (
                <p className="text-sm">
                  {workItem?.estimatedHours ? `${workItem.estimatedHours}h` : "Not estimated"}
                </p>
              )}
            </div>
          </div>

          {/* Assignee */}
          {workItem?.assignee && !isNew && (
            <div>
              <label className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
                <User className="w-3 h-3" /> Assignee
              </label>
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={workItem.assignee.avatarUrl || undefined} />
                  <AvatarFallback>{getInitials(workItem.assignee.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm">{workItem.assignee.name}</span>
              </div>
            </div>
          )}

          {/* Tags */}
          <div>
            <label className="text-sm text-muted-foreground mb-2 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {(workItem?.tags || []).map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {isEditing && (
                <Button type="button" variant="outline" size="sm">
                  + Add tag
                </Button>
              )}
            </div>
          </div>

          {/* Comments & Attachments counts */}
          {!isNew && workItem && (
            <div className="flex items-center gap-4 pt-4 border-t">
              <button type="button" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <MessageSquare className="w-4 h-4" />
                {workItem.commentsCount} comments
              </button>
              <button type="button" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <Paperclip className="w-4 h-4" />
                {workItem.attachmentsCount} attachments
              </button>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={() => {
                  if (isNew) {
                    onClose();
                  } else {
                    setIsEditing(false);
                  }
                }}>
                  Cancel
                </Button>
                <Button type="submit" variant="maritime">
                  {isNew ? "Create Work Item" : "Save Changes"}
                </Button>
              </>
            ) : (
              <>
                {onDelete && (
                  <Button type="button" variant="destructive" onClick={onDelete}>
                    Delete
                  </Button>
                )}
                <Button type="button" variant="maritime" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
