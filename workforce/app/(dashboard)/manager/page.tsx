"use client"

import { TeamCard } from "@/components/manager/TeamCard"
import { Button } from "@/components/ui/Button"
import { Filter, BarChart3, Users } from "lucide-react"
import { BurnoutChart } from "@/components/analytics/BurnoutChart"
import { ProjectHealth } from "@/components/analytics/ProjectHealth"
import * as React from "react"
import { toast } from "sonner"

export default function ManagerDashboard() {
  const [analytics, setAnalytics] = React.useState<{ teamTotalHours: number, teamBillableHours: number, burnoutRisks: unknown[], projectHealth: unknown[] } | null>(null)

  React.useEffect(() => {
    async function loadAnalytics() {
        try {
            const res = await fetch('/api/manager/analytics')
            const data = await res.json()
            if (data.success) {
                setAnalytics(data)
            }
        } catch (e) {
            console.error(e)
            toast.error("Failed to load analytics")
        } finally {
            // done
        }
    }
    loadAnalytics()
  }, [])

  return (
    <div className="space-y-8 animate-fade-in p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Team Pulse</h1>
          <p className="text-slate-400">Real-time team health and project velocity.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2 border-white/10 hover:bg-white/5 text-slate-300">
            <Filter className="w-4 h-4" /> Filter
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20">
             Export Report
          </Button>
        </div>
      </div>

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Quick Stats */}
          <div className="col-span-1 md:col-span-12 lg:col-span-12 xl:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-900/40 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><Users className="w-5 h-5"/></div>
                  <div>
                      <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">Total Hours</div>
                      <div className="text-2xl font-black text-white">{analytics?.teamTotalHours || 0}h</div>
                  </div>
              </div>
               <div className="bg-slate-900/40 border border-white/10 p-4 rounded-xl flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/20 rounded-lg text-emerald-400"><BarChart3 className="w-5 h-5"/></div>
                  <div>
                      <div className="text-slate-500 text-xs uppercase font-bold tracking-wider">Billable</div>
                      <div className="text-2xl font-black text-white">{analytics?.teamBillableHours || 0}h</div>
                  </div>
              </div>
          </div>

          {/* Charts */}
          <div className="col-span-1 md:col-span-6 lg:col-span-5">
               <BurnoutChart data={analytics?.burnoutRisks || []} />
          </div>
          <div className="col-span-1 md:col-span-6 lg:col-span-4">
               <ProjectHealth data={analytics?.projectHealth || []} />
          </div>
      </div>

      <div className="border-t border-white/10 pt-8">
          <h2 className="text-xl font-bold text-white mb-6">Timesheet Approvals</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Existing hardcoded cards for now, can replace later */}
            <TeamCard 
              employeeName="John Doe" 
              role="Senior Developer" 
              hours={42.5} 
              billablePercent={88} 
              status="Submitted" 
              submittedDate="2h ago"
            />
            <TeamCard 
              employeeName="Alice Smith" 
              role="UX Designer" 
              hours={40.0} 
              billablePercent={92} 
              status="Submitted" 
              submittedDate="5h ago"
            />
            <TeamCard 
              employeeName="Bob Wilson" 
              role="QA Engineer" 
              hours={45.0} 
              billablePercent={65} 
              status="Draft" 
              submittedDate="In Progress"
            />
          </div>
      </div>
    </div>
  )
}
