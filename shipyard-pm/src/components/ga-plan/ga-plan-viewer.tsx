"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Plus,
  Layers,
  MousePointer2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PinMarker, NewPinMarker } from "./pin-marker";
import type { Pin, GAViewState, WorkItemWithDetails } from "@/lib/types";

interface GAPlanViewerProps {
  planImageUrl: string;
  pins: Pin[];
  selectedPinId?: string;
  onPinClick?: (pin: Pin) => void;
  onPinMove?: (pinId: string, x: number, y: number) => void;
  onAddPin?: (x: number, y: number) => void;
  isEditing?: boolean;
  className?: string;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 3;
const ZOOM_STEP = 0.25;

export function GAPlanViewer({
  planImageUrl,
  pins,
  selectedPinId,
  onPinClick,
  onPinMove,
  onAddPin,
  isEditing = false,
  className,
}: GAPlanViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [viewState, setViewState] = useState<GAViewState>({
    zoom: 1,
    panX: 0,
    panY: 0,
    activeDeck: null,
  });
  const [isPanning, setIsPanning] = useState(false);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newPinPosition, setNewPinPosition] = useState<{ x: number; y: number } | null>(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Handle zoom
  const handleZoom = useCallback((delta: number) => {
    setViewState((prev) => ({
      ...prev,
      zoom: Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, prev.zoom + delta)),
    }));
  }, []);

  // Handle wheel zoom
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
        handleZoom(delta);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleZoom]);

  // Handle pan start
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAddingPin) return;
    if (e.button === 1 || (e.button === 0 && e.altKey)) {
      setIsPanning(true);
      setDragStart({ x: e.clientX - viewState.panX, y: e.clientY - viewState.panY });
    }
  };

  // Handle pan move
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setViewState((prev) => ({
        ...prev,
        panX: e.clientX - dragStart.x,
        panY: e.clientY - dragStart.y,
      }));
    }
  };

  // Handle pan end
  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Handle click to add pin
  const handleClick = (e: React.MouseEvent) => {
    if (!isAddingPin || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const imageRect = containerRef.current.querySelector("img")?.getBoundingClientRect();
    
    if (!imageRect) return;

    const x = ((e.clientX - imageRect.left) / imageRect.width) * 100;
    const y = ((e.clientY - imageRect.top) / imageRect.height) * 100;

    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      setNewPinPosition({ x, y });
    }
  };

  // Confirm new pin
  const confirmNewPin = () => {
    if (newPinPosition && onAddPin) {
      onAddPin(newPinPosition.x, newPinPosition.y);
      setNewPinPosition(null);
      setIsAddingPin(false);
    }
  };

  // Reset view
  const resetView = () => {
    setViewState({
      zoom: 1,
      panX: 0,
      panY: 0,
      activeDeck: null,
    });
  };

  return (
    <div className={cn("relative h-full w-full overflow-hidden bg-navy-950", className)}>
      {/* Toolbar */}
      <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
        <div className="flex items-center gap-1 p-1 rounded-lg bg-background/90 backdrop-blur border shadow-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom(ZOOM_STEP)}
            disabled={viewState.zoom >= MAX_ZOOM}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <span className="px-2 text-sm font-medium min-w-[3rem] text-center">
            {Math.round(viewState.zoom * 100)}%
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleZoom(-ZOOM_STEP)}
            disabled={viewState.zoom <= MIN_ZOOM}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button variant="ghost" size="icon" onClick={resetView}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>

        {isEditing && (
          <div className="flex items-center gap-1 p-1 rounded-lg bg-background/90 backdrop-blur border shadow-lg">
            <Button
              variant={isAddingPin ? "maritime" : "ghost"}
              size="icon"
              onClick={() => {
                setIsAddingPin(!isAddingPin);
                setNewPinPosition(null);
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <MousePointer2 className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
              <Layers className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Pin count indicator */}
      <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-background/90 backdrop-blur border shadow-lg">
        <span className="text-sm font-medium">
          {pins.length} {pins.length === 1 ? "pin" : "pins"}
        </span>
      </div>

      {/* Instructions when adding pin */}
      <AnimatePresence>
        {isAddingPin && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-16 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-lg bg-ocean-500 text-white shadow-lg"
          >
            Click on the plan to place a new work item pin
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plan container */}
      <div
        ref={containerRef}
        className={cn(
          "relative h-full w-full cursor-grab",
          isPanning && "cursor-grabbing",
          isAddingPin && "cursor-crosshair"
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
      >
        <motion.div
          className="relative h-full w-full flex items-center justify-center"
          style={{
            scale: viewState.zoom,
            x: viewState.panX,
            y: viewState.panY,
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          {/* GA Plan Image */}
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={planImageUrl}
              alt="GA Plan"
              className="max-w-full max-h-full object-contain select-none"
              draggable={false}
            />

            {/* Pins */}
            <AnimatePresence>
              {pins.map((pin) => (
                <PinMarker
                  key={pin.id}
                  pin={pin}
                  isSelected={pin.id === selectedPinId}
                  onClick={() => onPinClick?.(pin)}
                  onDragEnd={(x, y) => onPinMove?.(pin.id, x, y)}
                  isDraggable={isEditing}
                />
              ))}
            </AnimatePresence>

            {/* New pin marker */}
            <AnimatePresence>
              {newPinPosition && (
                <NewPinMarker
                  x={newPinPosition.x}
                  y={newPinPosition.y}
                  onClick={confirmNewPin}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Wave pattern overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-navy-950/50 to-transparent" />
    </div>
  );
}
