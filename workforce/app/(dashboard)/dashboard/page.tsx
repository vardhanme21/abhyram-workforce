"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import AttendanceTimer from "@/components/dashboard/AttendanceTimer"
import { Clock, FileText, TrendingUp, Users, Plus, ArrowRight, Calendar } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export default function DashboardPage() {
  const { data: session } = useSession()

  const quickActions = [
    {
      title: "Log Time",
      description: "Add timesheet entries",
      icon: Clock,
      href: "/dashboard/timesheet",
      color: "bg-blue-500",
    },
    {
      title: "Create Project",
      description: "Start a new project",
      icon: Plus,
      href: "/projects",
      color: "bg-teal-500",
    },
    {
      title: "View Reports",
      description: "Check analytics",
      icon: TrendingUp,
      href: "/reports",
      color: "bg-purple-500",
    },
    {
      title: "Manage Team",
      description: "Review submissions",
      icon: Users,
      href: "/manager",
      color: "bg-orange-500",
    },
  ]

  const recentActivity = [
    { action: "Timesheet submitted", time: "2 hours ago", status: "success" },
    { action: "Project created", time: "Yesterday", status: "info" },
    { action: "Report generated", time: "2 days ago", status: "success" },
  ]

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-blue-600 rounded-2xl p-8 text-white shadow-lg flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {session?.user?.name || "User"}! 👋
            </h1>
            <p className="text-primary-100 text-lg">
              Here&apos;s what&apos;s happening with your workforce today.
            </p>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-2 border border-white/20">
            <AttendanceTimer />
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer border-2 border-transparent hover:border-primary-500 h-full">
                <CardHeader>
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-3`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle className="text-lg">{action.title}</CardTitle>
                  <CardDescription>{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="w-full justify-between group">
                    Get Started
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">This Week</CardTitle>
            <Clock className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">32.5 hrs</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-green-600 font-medium">+12%</span> from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Projects</CardTitle>
            <FileText className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">8</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-blue-600 font-medium">2 new</span> this month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Approvals</CardTitle>
            <Calendar className="w-4 h-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">3</div>
            <p className="text-xs text-gray-500 mt-1">
              <span className="text-orange-600 font-medium">Needs review</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
