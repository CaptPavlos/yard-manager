"use client";

import React from "react";
import { Ship, Plus, Search, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function VesselsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Vessels</h1>
          <p className="text-muted-foreground mt-1">
            Manage your fleet of vessels
          </p>
        </div>
        <Button variant="maritime">
          <Plus className="w-4 h-4 mr-2" />
          Add Vessel
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Search vessels..." className="pl-9" />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Ship className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No vessels yet</h3>
          <p className="text-muted-foreground text-center mb-4">
            Add your first vessel to start managing maintenance projects
          </p>
          <Button variant="maritime">
            <Plus className="w-4 h-4 mr-2" />
            Add Vessel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
