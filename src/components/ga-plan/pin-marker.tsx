"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, AlertCircle, Clock, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Pin, Priority, Status } from "@/lib/types";

interface PinMarkerProps {
  pin: Pin;
  isSelected?: boolean;
  onClick?: () => void;
  onDragEnd?: (x: number, y: number) => void;
  isDraggable?: boolean;
}

const priorityIcons = {
  low: CheckCircle2,
  medium: Clock,
  high: AlertCircle,
  critical: XCircle,
};

const priorityColors: Record<Priority, string> = {
  low: "text-green-500 dark:text-green-400",
  medium: "text-yellow-500 dark:text-yellow-400",
  high: "text-orange-500 dark:text-orange-400",
  critical: "text-red-500 dark:text-red-400",
};

const statusBorderColors: Record<Status, string> = {
  open: "border-blue-500",
  "in-progress": "border-yellow-500",
  completed: "border-green-500",
  blocked: "border-red-500",
};

export function PinMarker({
  pin,
  isSelected = false,
  onClick,
  onDragEnd,
  isDraggable = false,
}: PinMarkerProps) {
  const PriorityIcon = priorityIcons[pin.workItem.priority];
  const priorityColor = priorityColors[pin.workItem.priority];
  const statusBorder = statusBorderColors[pin.workItem.status];

  return (
    <motion.div
      className={cn(
        "absolute cursor-pointer z-10",
        isSelected && "z-20"
      )}
      style={{
        left: `${pin.x}%`,
        top: `${pin.y}%`,
        transform: "translate(-50%, -100%)",
      }}
      initial={{ scale: 0, y: -20, opacity: 0 }}
      animate={{ scale: 1, y: 0, opacity: 1 }}
      exit={{ scale: 0, y: -20, opacity: 0 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      drag={isDraggable}
      dragMomentum={false}
      onDragEnd={(_, info) => {
        if (onDragEnd) {
          // Calculate new percentage position
          const parent = (info.target as HTMLElement).parentElement;
          if (parent) {
            const rect = parent.getBoundingClientRect();
            const newX = ((info.point.x - rect.left) / rect.width) * 100;
            const newY = ((info.point.y - rect.top) / rect.height) * 100;
            onDragEnd(
              Math.max(0, Math.min(100, newX)),
              Math.max(0, Math.min(100, newY))
            );
          }
        }
      }}
      onClick={onClick}
    >
      {/* Pin shadow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 bg-black/20 rounded-full blur-sm" />
      
      {/* Pin body */}
      <div
        className={cn(
          "relative flex items-center justify-center w-8 h-8 rounded-full border-2 shadow-lg transition-all duration-200",
          statusBorder,
          isSelected
            ? "bg-navy-800 dark:bg-ocean-600 scale-125"
            : "bg-white dark:bg-navy-800",
          pin.workItem.priority === "critical" && "animate-pulse"
        )}
      >
        <PriorityIcon className={cn("w-4 h-4", priorityColor)} />
        
        {/* Pin pointer */}
        <div
          className={cn(
            "absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0",
            "border-l-[6px] border-l-transparent",
            "border-r-[6px] border-r-transparent",
            "border-t-[8px]",
            isSelected
              ? "border-t-navy-800 dark:border-t-ocean-600"
              : "border-t-white dark:border-t-navy-800"
          )}
        />
      </div>

      {/* Tooltip on hover */}
      <motion.div
        className={cn(
          "absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg shadow-lg pointer-events-none",
          "bg-white dark:bg-navy-800 border border-border",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "min-w-[150px] max-w-[250px]"
        )}
        initial={{ opacity: 0, y: 10 }}
        whileHover={{ opacity: 1, y: 0 }}
      >
        <p className="text-sm font-medium text-foreground truncate">
          {pin.workItem.title}
        </p>
        {pin.workItem.location && (
          <p className="text-xs text-muted-foreground mt-1">
            {pin.workItem.location}
          </p>
        )}
      </motion.div>
    </motion.div>
  );
}

// New pin marker for adding new pins
export function NewPinMarker({
  x,
  y,
  onClick,
}: {
  x: number;
  y: number;
  onClick: () => void;
}) {
  return (
    <motion.div
      className="absolute cursor-pointer z-30"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: "translate(-50%, -100%)",
      }}
      initial={{ scale: 0, y: -30 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0, y: -30 }}
      onClick={onClick}
    >
      <div className="relative">
        {/* Pulse effect */}
        <div className="absolute inset-0 w-10 h-10 -m-1 bg-ocean-500/30 rounded-full animate-ping" />
        
        {/* Pin */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-ocean-500 border-2 border-white shadow-lg">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        
        {/* Pointer */}
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-ocean-500" />
      </div>
    </motion.div>
  );
}
