"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Ship,
  FolderKanban,
  MapPin,
  Users,
  Settings,
  Bell,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Anchor,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavItem {
  href: string;
  icon: React.ElementType;
  label: string;
  badge?: number;
}

const mainNavItems: NavItem[] = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/vessels", icon: Ship, label: "Vessels" },
  { href: "/projects", icon: FolderKanban, label: "Projects" },
  { href: "/work-items", icon: MapPin, label: "Work Items" },
  { href: "/team", icon: Users, label: "Team" },
];

const bottomNavItems: NavItem[] = [
  { href: "/notifications", icon: Bell, label: "Notifications", badge: 3 },
  { href: "/settings", icon: Settings, label: "Settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      className={cn(
        "fixed left-0 top-0 bottom-0 z-40 flex flex-col",
        "bg-navy-900 dark:bg-navy-950 text-white",
        "border-r border-navy-800"
      )}
    >
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-navy-800">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-ocean-500">
            <Anchor className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex flex-col"
              >
                <span className="font-bold text-lg tracking-tight">YachtPinpoint</span>
                <span className="text-xs text-navy-400">Work Management</span>
              </motion.div>
            )}
          </AnimatePresence>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {mainNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-navy-800/50",
                isActive && "bg-ocean-600 hover:bg-ocean-600 shadow-lg shadow-ocean-600/20"
              )}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-navy-400")} />
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn("font-medium", isActive ? "text-white" : "text-navy-300")}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="px-3 py-4 space-y-1 border-t border-navy-800">
        {bottomNavItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                "hover:bg-navy-800/50",
                isActive && "bg-ocean-600 hover:bg-ocean-600"
              )}
            >
              <div className="relative">
                <Icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-navy-400")} />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-xs flex items-center justify-center bg-red-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <AnimatePresence>
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    className={cn("font-medium", isActive ? "text-white" : "text-navy-300")}
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}

        {/* Theme toggle */}
        <button
          onClick={toggleDarkMode}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg transition-all duration-200 hover:bg-navy-800/50"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-navy-400" />
          ) : (
            <Moon className="w-5 h-5 text-navy-400" />
          )}
          <AnimatePresence>
            {!isCollapsed && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="font-medium text-navy-300"
              >
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* User section */}
      <div className="px-3 py-4 border-t border-navy-800">
        <div className="flex items-center gap-3 px-3 py-2">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/captain.jpg" />
            <AvatarFallback className="bg-gold-500 text-navy-900">CP</AvatarFallback>
          </Avatar>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-white truncate">Captain Paul</p>
                <p className="text-xs text-navy-400 truncate">captain@yacht.com</p>
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Button variant="ghost" size="icon" className="text-navy-400 hover:text-white hover:bg-navy-800">
                  <LogOut className="w-4 h-4" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          "absolute -right-3 top-20 w-6 h-6 rounded-full",
          "bg-navy-800 border border-navy-700",
          "flex items-center justify-center",
          "hover:bg-navy-700 transition-colors"
        )}
      >
        {isCollapsed ? (
          <ChevronRight className="w-4 h-4 text-navy-400" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-navy-400" />
        )}
      </button>
    </motion.aside>
  );
}
