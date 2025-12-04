"use client";

import React from "react";
import { MapPin, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WorkItemsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Work Items</h1>
          <p className="text-muted-foreground mt-1">
            Track and manage all maintenance tasks
          </p>
        </div>
        <Button variant="maritime">
          <Plus className="w-4 h-4 mr-2" />
          New Work Item
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search work items..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No work items yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Work items will appear here once you create them from a project
          </p>
          <Button variant="maritime">
            <Plus className="w-4 h-4 mr-2" />
            Create Work Item
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
