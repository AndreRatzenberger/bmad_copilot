"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts"
import {
  Play,
  Pause,
  RefreshCw,
  Database,
  Users,
  DollarSign,
  Activity,
  Clock,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react"

interface SystemStats {
  ingestionStatus: "running" | "paused" | "error"
  totalPapers: number
  totalRepos: number
  totalUsers: number
  weeklyGrowth: number
  lastClusterRun: string
  tokenCostEstimate: number
  systemHealth: "healthy" | "warning" | "critical"
  activeJobs: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<SystemStats>({
    ingestionStatus: "running",
    totalPapers: 1247,
    totalRepos: 892,
    totalUsers: 156,
    weeklyGrowth: 12.5,
    lastClusterRun: "2 hours ago",
    tokenCostEstimate: 245.67,
    systemHealth: "healthy",
    activeJobs: 3,
  })
  const [isToggling, setIsToggling] = useState(false)

  useKeyboardShortcuts()

  const toggleIngestion = async () => {
    setIsToggling(true)
    // Simulate API call
    setTimeout(() => {
      setStats((prev) => ({
        ...prev,
        ingestionStatus: prev.ingestionStatus === "running" ? "paused" : "running",
      }))
      setIsToggling(false)
    }, 1000)
  }

  const runClusterJob = async () => {
    // Simulate cluster job
    setStats((prev) => ({ ...prev, lastClusterRun: "Running..." }))
    setTimeout(() => {
      setStats((prev) => ({ ...prev, lastClusterRun: "Just now" }))
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "text-green-500"
      case "paused":
        return "text-yellow-500"
      case "error":
        return "text-red-500"
      case "healthy":
        return "text-green-500"
      case "warning":
        return "text-yellow-500"
      case "critical":
        return "text-red-500"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
        return <CheckCircle className="h-4 w-4" />
      case "paused":
        return <Pause className="h-4 w-4" />
      case "error":
        return <AlertTriangle className="h-4 w-4" />
      case "healthy":
        return <CheckCircle className="h-4 w-4" />
      case "warning":
        return <AlertTriangle className="h-4 w-4" />
      case "critical":
        return <AlertTriangle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">System Administration</h1>
            <p className="text-muted-foreground">Monitor and manage the Research Catalog system</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={runClusterJob} size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Run Clustering
            </Button>
            <Button
              onClick={toggleIngestion}
              disabled={isToggling}
              variant={stats.ingestionStatus === "running" ? "destructive" : "default"}
              size="sm"
            >
              {isToggling ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : stats.ingestionStatus === "running" ? (
                <Pause className="h-4 w-4 mr-2" />
              ) : (
                <Play className="h-4 w-4 mr-2" />
              )}
              {isToggling ? "Updating..." : stats.ingestionStatus === "running" ? "Pause" : "Resume"} Ingestion
            </Button>
          </div>
        </div>

        {/* System Status Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {/* Ingestion Status */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Ingestion Status</h3>
              <div className={`flex items-center gap-1 ${getStatusColor(stats.ingestionStatus)}`}>
                {getStatusIcon(stats.ingestionStatus)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={stats.ingestionStatus === "running" ? "default" : "secondary"} className="capitalize">
                  {stats.ingestionStatus}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Active Jobs</span>
                <span className="text-sm font-medium">{stats.activeJobs}</span>
              </div>
            </div>
          </div>

          {/* Document Counts */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Document Counts</h3>
              <Database className="h-4 w-4 text-primary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Papers</span>
                <span className="text-sm font-medium">{stats.totalPapers.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Repositories</span>
                <span className="text-sm font-medium">{stats.totalRepos.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* User Activity */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">User Activity</h3>
              <Users className="h-4 w-4 text-secondary" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Users</span>
                <span className="text-sm font-medium">{stats.totalUsers}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Weekly Growth</span>
                <span className="text-sm font-medium text-green-500">+{stats.weeklyGrowth}%</span>
              </div>
            </div>
          </div>

          {/* Cluster Jobs */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Cluster Jobs</h3>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Run</span>
                <span className="text-sm font-medium">{stats.lastClusterRun}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="default">Completed</Badge>
              </div>
            </div>
          </div>

          {/* Token Usage */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">Token Usage</h3>
              <DollarSign className="h-4 w-4 text-yellow-500" />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">This Month</span>
                <span className="text-sm font-medium">${stats.tokenCostEstimate}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Trend</span>
                <span className="text-sm font-medium text-green-500">-5.2%</span>
              </div>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-foreground">System Health</h3>
              <div className={`flex items-center gap-1 ${getStatusColor(stats.systemHealth)}`}>
                {getStatusIcon(stats.systemHealth)}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant={stats.systemHealth === "healthy" ? "default" : "destructive"} className="capitalize">
                  {stats.systemHealth}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Uptime</span>
                <span className="text-sm font-medium">99.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity Log */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-medium text-foreground mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {[
              { time: "2 minutes ago", action: "Ingestion job completed", status: "success" },
              { time: "15 minutes ago", action: "New paper added: Attention Is All You Need", status: "info" },
              { time: "1 hour ago", action: "Cluster analysis started", status: "info" },
              { time: "2 hours ago", action: "User authentication updated", status: "warning" },
              { time: "3 hours ago", action: "Database backup completed", status: "success" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
                <div
                  className={`h-2 w-2 rounded-full ${
                    activity.status === "success"
                      ? "bg-green-500"
                      : activity.status === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <span className="text-sm text-foreground">{activity.action}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {activity.time}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
            <Database className="h-5 w-5" />
            <span className="text-sm">Backup Database</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
            <RefreshCw className="h-5 w-5" />
            <span className="text-sm">Refresh Cache</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
            <Users className="h-5 w-5" />
            <span className="text-sm">Manage Users</span>
          </Button>
          <Button variant="outline" className="h-auto p-4 flex-col gap-2 bg-transparent">
            <Activity className="h-5 w-5" />
            <span className="text-sm">View Logs</span>
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
