"use client"

import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import AttendanceTimer from "@/components/dashboard/AttendanceTimer"
import { Clock, FileText, TrendingUp, Users, Plus, ArrowRight, Calendar, Activity } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { MotionDiv, MotionCard, MotionContainer, MotionHeader } from "@/components/ui/MotionPrimitives"

export default function DashboardPage() {
  const { data: session } = useSession()

  const quickActions = [
    {
      title: "Log Time",
      description: "Add timesheet entries",
      icon: Clock,
      href: "/dashboard/timesheet",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      title: "Create Project",
      description: "Start a new project",
      icon: Plus,
      href: "/projects",
      gradient: "from-emerald-500 to-teal-500",
    },
    {
      title: "View Reports",
      description: "Check analytics",
      icon: TrendingUp,
      href: "/reports",
      gradient: "from-violet-500 to-purple-500",
    },
    {
      title: "Manage Team",
      description: "Review submissions",
      icon: Users,
      href: "/manager",
      gradient: "from-orange-500 to-amber-500",
    },
  ]

  const recentActivity = [
    { action: "Timesheet submitted", time: "2 hours ago", status: "success" },
    { action: "Project created", time: "Yesterday", status: "info" },
    { action: "Report generated", time: "2 days ago", status: "success" },
  ]

  return (
    <MotionContainer className="space-y-8">
      {/* Welcome Section */}
      <MotionDiv className="bg-gradient-to-r from-indigo-600 to-violet-700 rounded-3xl p-8 text-white shadow-2xl shadow-indigo-500/20 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-1000"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full -ml-10 -mb-10 blur-2xl opacity-50"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2">
                <MotionHeader>
                    <h1 className="text-4xl font-extrabold tracking-tight">
                    Welcome back, {session?.user?.name || "User"}! 👋
                    </h1>
                </MotionHeader>
                <p className="text-indigo-100 text-lg font-medium max-w-xl">
                Ready to conquer the day? Here&apos;s your workforce snapshot.
                </p>
                <div className="flex gap-3 pt-4">
                    <Button className="bg-white text-indigo-700 hover:bg-indigo-50 border-none shadow-lg hover:shadow-xl">View Schedule</Button>
                    <Button variant="outline" className="text-white border-indigo-400 hover:bg-indigo-800/50 hover:text-white backdrop-blur-sm">My Profile</Button>
                </div>
            </div>
            <MotionCard whileHover={{ scale: 1.05 }} className="bg-white/10 backdrop-blur-md rounded-2xl p-1 border border-white/20 shadow-inner min-w-[320px]">
                <AttendanceTimer />
            </MotionCard>
        </div>
      </MotionDiv>

      {/* Quick Actions */}
      <div>
        <MotionDiv delay={0.2} className="flex items-center gap-2 mb-6">
            <Activity className="w-6 h-6 text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-800">Quick Actions</h2>
        </MotionDiv>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, i) => (
            <Link key={action.title} href={action.href}>
              <MotionCard 
                delay={0.1 * i}
                className="h-full hover:border-indigo-200 transition-colors group cursor-pointer"
              >
                <CardHeader>
                  <div className={`bg-gradient-to-br ${action.gradient} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <action.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-800 group-hover:text-indigo-700 transition-colors">{action.title}</CardTitle>
                  <CardDescription className="text-gray-500 font-medium">{action.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center text-sm font-semibold text-indigo-600 group-hover:translate-x-2 transition-transform duration-300">
                    Get Started <ArrowRight className="w-4 h-4 ml-1" />
                  </div>
                </CardContent>
              </MotionCard>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MotionCard delay={0.4}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">This Week</CardTitle>
            <div className="bg-green-100 p-2 rounded-lg">
                <Clock className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-900">32.5 <span className="text-lg text-gray-400 font-medium">hrs</span></div>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <span className="text-green-600 font-bold bg-green-50 px-1.5 py-0.5 rounded text-xs">+12%</span> from last week
            </p>
          </CardContent>
        </MotionCard>

        <MotionCard delay={0.5}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Active Projects</CardTitle>
            <div className="bg-blue-100 p-2 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-900">8</div>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <span className="text-blue-600 font-bold bg-blue-50 px-1.5 py-0.5 rounded text-xs">2 new</span> this month
            </p>
          </CardContent>
        </MotionCard>

        <MotionCard delay={0.6}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-bold text-gray-500 uppercase tracking-wider">Pending Approvals</CardTitle>
            <div className="bg-orange-100 p-2 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-black text-gray-900">3</div>
            <p className="text-sm text-gray-500 mt-2 flex items-center gap-1">
              <span className="text-orange-600 font-bold bg-orange-50 px-1.5 py-0.5 rounded text-xs">Action Required</span>
            </p>
          </CardContent>
        </MotionCard>
      </div>

      {/* Recent Activity */}
      <MotionCard delay={0.7} className="border-l-4 border-l-indigo-500">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recent Activity</CardTitle>
          <CardDescription>Your latest actions and updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <MotionDiv key={index} delay={0.8 + (index * 0.1)} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0 hover:bg-gray-50/50 transition-colors px-2 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 ring-4 ring-opacity-20 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500 ring-green-500 text-green-500' : 'bg-blue-500 ring-blue-500 text-blue-500'
                  }`} />
                  <div>
                    <p className="font-bold text-gray-800">{activity.action}</p>
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{activity.time}</p>
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-300">DETAILS</div>
              </MotionDiv>
            ))}
          </div>
        </CardContent>
      </MotionCard>
    </MotionContainer>
  )
}
