"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "blue" | "yellow" | "green" | "red" | "ocean" | "gold";
  delay?: number;
}

const colorClasses = {
  blue: "bg-blue-500/10 text-blue-500 dark:bg-blue-500/20",
  yellow: "bg-yellow-500/10 text-yellow-500 dark:bg-yellow-500/20",
  green: "bg-green-500/10 text-green-500 dark:bg-green-500/20",
  red: "bg-red-500/10 text-red-500 dark:bg-red-500/20",
  ocean: "bg-ocean-500/10 text-ocean-500 dark:bg-ocean-500/20",
  gold: "bg-gold-500/10 text-gold-600 dark:bg-gold-500/20",
};

export function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  color = "ocean",
  delay = 0,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay * 0.1 }}
    >
      <Card className="maritime-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            {title}
          </CardTitle>
          <div className={cn("p-2 rounded-lg", colorClasses[color])}>
            {icon}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold">{value}</span>
            {trend && (
              <span
                className={cn(
                  "flex items-center text-sm font-medium",
                  trend.isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                {trend.isPositive ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {trend.value}%
              </span>
            )}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

interface DashboardStatsProps {
  stats: {
    totalWorkItems: number;
    openItems: number;
    inProgressItems: number;
    completedItems: number;
    blockedItems: number;
    overdueItems: number;
  };
}

export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Open Items"
        value={stats.openItems}
        description="Waiting to be started"
        icon={<Clock className="w-4 h-4" />}
        color="blue"
        delay={0}
      />
      <StatCard
        title="In Progress"
        value={stats.inProgressItems}
        description="Currently being worked on"
        icon={<AlertCircle className="w-4 h-4" />}
        color="yellow"
        delay={1}
      />
      <StatCard
        title="Completed"
        value={stats.completedItems}
        description="Successfully finished"
        icon={<CheckCircle2 className="w-4 h-4" />}
        color="green"
        trend={{ value: 12, isPositive: true }}
        delay={2}
      />
      <StatCard
        title="Blocked"
        value={stats.blockedItems}
        description={stats.overdueItems > 0 ? `${stats.overdueItems} overdue` : "No overdue items"}
        icon={<XCircle className="w-4 h-4" />}
        color="red"
        delay={3}
      />
    </div>
  );
}
