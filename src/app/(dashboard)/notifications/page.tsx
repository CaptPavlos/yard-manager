"use client";

import React from "react";
import { Bell, Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated with your project activity
          </p>
        </div>
        <Button variant="outline">
          <Check className="w-4 h-4 mr-2" />
          Mark all as read
        </Button>
      </div>

      {/* Empty State */}
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Bell className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-2">No notifications</h3>
          <p className="text-muted-foreground text-center">
            You&apos;re all caught up! Notifications will appear here when there&apos;s activity.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
