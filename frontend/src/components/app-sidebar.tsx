"use client"

import * as React from "react"
import Link from "next/link"
import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboardIcon,
  ArrowLeftRightIcon,
  ChartAreaIcon,
  SettingsIcon,
  LifeBuoyIcon,
  LandmarkIcon,
  TrendingUpIcon,
  WalletIcon,
  ActivityIcon,
} from "lucide-react"

const data = {
  user: {
    name: "BlockPerp Trader",
    email: "Connect wallet to begin",
    avatar: "/avatars/user.jpg",
  },
  navMain: [
    {
      title: "Overview",
      url: "/dashboard",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Trade",
      url: "/trade",
      icon: <TrendingUpIcon />,
    },
    {
      title: "Positions",
      url: "/positions",
      icon: <WalletIcon />,
    },
    {
      title: "Activity",
      url: "/activity",
      icon: <ActivityIcon />,
    },
    {
      title: "Protocol Analytics",
      url: "/analytics",
      icon: <ChartAreaIcon />,
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: <SettingsIcon />,
    },
    {
      title: "Help & Support",
      url: "/support",
      icon: <LifeBuoyIcon />,
    },
  ],
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              render={<Link href="/dashboard" />}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <LandmarkIcon className="size-4" />
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">
                  BlockPerp
                </span>
                <span className="truncate text-xs text-muted-foreground">
                  Onchain Perpetuals
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} label="Trading" />
        <NavSecondary
          items={data.navSecondary}
          className="mt-auto"
        />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}