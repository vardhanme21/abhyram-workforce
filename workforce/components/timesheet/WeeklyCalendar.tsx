"use client"

import { cn } from "@/lib/utils"

import * as React from "react"
import { format, addDays, startOfWeek } from "date-fns"
import { CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { MotionCard } from "@/components/ui/MotionPrimitives"
import { Button } from "@/components/ui/Button"
import { EntryCell } from "./EntryCell"
import { StatusBadge } from "./StatusBadge"
import { SmartFill } from "./SmartFill"
import { Plus, Trash2, ChevronLeft, ChevronRight, Save, Send } from "lucide-react"
import { toast } from "sonner"

// Mock Data Types
type TimesheetEntry = {
  id: string
  projectId: string
  date: string // YYYY-MM-DD
  hours: number
}

type Project = {
  id: string
  name: string
  code: string
  color: string
  billable: boolean
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

export function WeeklyCalendar() {
  const [status, setStatus] = React.useState<"Draft" | "Submitted">("Draft")
  const [currentWeekStart, setCurrentWeekStart] = React.useState(startOfWeek(new Date(), { weekStartsOn: 1 }))
  
  const [allProjects, setAllProjects] = React.useState<Project[]>([])
  const [visibleProjectIds, setVisibleProjectIds] = React.useState<string[]>([])
  const [entries, setEntries] = React.useState<TimesheetEntry[]>([])
  const [loading, setLoading] = React.useState(true)

  const projects = allProjects.filter(p => visibleProjectIds.includes(p.id))

  // Helper to get hours
  const getHours = (projectId: string, dayIndex: number) => {
    const targetDate = format(addDays(currentWeekStart, dayIndex), "yyyy-MM-dd")
    const entry = entries.find(e => e.projectId === projectId && e.date === targetDate)
    return entry ? entry.hours : 0
  }

  // Helper to set hours
  const setHours = (projectId: string, dayIndex: number, hours: number) => {
    const targetDate = format(addDays(currentWeekStart, dayIndex), "yyyy-MM-dd")
    setEntries(prev => {
      const existing = prev.find(e => e.projectId === projectId && e.date === targetDate)
      if (hours === 0 && existing) {
        return prev.filter(e => e.id !== existing.id) // Remove
      }
      if (existing) {
        return prev.map(e => e.id === existing.id ? { ...e, hours } : e) // Update
      }
      return [...prev, { id: Math.random().toString(), projectId, date: targetDate, hours }] // Create
    })
  }

  // Fetch real projects from Salesforce on mount
  React.useEffect(() => {
    async function loadProjects() {
      try {
        const res = await fetch("/api/projects")
        if (res.ok) {
          const data = await res.json()
          setAllProjects(data)
          // Initially show all fetched projects
          setVisibleProjectIds(data.map((p: Project) => p.id))
        } else {
          try {
            const errData = await res.json();
            const errMsg = errData.error || "Unknown Error";
            toast.error(`Salesforce Error (${res.status}): ${errMsg}`);
          } catch {
            toast.error(`Connection Error (${res.status}): Access Denied or Server Down`);
          }
          
          // Fallback placeholders for UI demo
          setAllProjects([
            { id: "p1", name: "Client Portal (MOCK)", code: "CP-001", color: "bg-blue-500", billable: true },
            { id: "p2", name: "Internal Dashboard (MOCK)", code: "ID-002", color: "bg-teal-500", billable: false },
          ])
          setVisibleProjectIds(["p1", "p2"])
        }
      } catch {
        toast.error("Network error loading projects.")
      } finally {
        setLoading(false)
      }
    }
    loadProjects()
  }, [])

  // Fetch timesheet data when week changes
  React.useEffect(() => {
    async function loadTimesheet() {
      // Don't show global loading if just switching weeks (optional UX choice, but better to show entry loading)
      // For now, we reuse 'loading' for initial load, but maybe we need a local 'fetchingEntries' state
      const weekStr = format(currentWeekStart, "yyyy-MM-dd");
      
      try {
        const res = await fetch(`/api/timesheets?weekStart=${weekStr}`);
        if (res.ok) {
          const data = await res.json();
          if (data.status) { // If we got data back
            setStatus(data.status);
            // Transform backend entries to frontend format if needed (though API already matches mostly)
            // Backend sends: { id, projectId, date, hours, ... }
            if (data.entries) {
               setEntries(data.entries.map((e: { id: string; projectId: string; date: string; hours: number }) => ({
                 id: e.id,
                 projectId: e.projectId,
                 date: e.date,
                 hours: e.hours
               })));
               
               // Also make sure these projects are visible
               const newProjectIds = data.entries.map((e: { projectId: string }) => e.projectId);
               setVisibleProjectIds(prev => Array.from(new Set([...prev, ...newProjectIds])));
            }
          } else {
            // No data for this week -> Reset to empty Draft
            setStatus("Draft");
            setEntries([]);
          }
        }
      } catch (err) {
        console.error("Failed to load history", err);
        // Don't toast error on simple navigation to empty weeks, just log
      }
    }
    
    // Only run if not the very first initial mount (which might race with project loading)
    // But actually we want it to run on first mount too.
    if (!loading) {
        loadTimesheet();
    }
  }, [currentWeekStart, loading]);



  // ... (Keep handleSync etc.)



  const handleAddProject = () => {
    const nextProject = allProjects.find((p: Project) => !visibleProjectIds.includes(p.id))
    if (nextProject) {
      setVisibleProjectIds([...visibleProjectIds, nextProject.id])
      toast.success(`Project added: ${nextProject.name}`)
    } else {
      toast.error("No more projects available to add")
    }
  }

  const handleRemoveProject = (id: string) => {
    setVisibleProjectIds(visibleProjectIds.filter(pid => pid !== id))
    setEntries(entries.filter(e => e.projectId !== id))
    toast.info("Project removed from view")
  }

  const handleSync = async (newStatus: "Draft" | "Submitted") => {
    const promise = async () => {
      const res = await fetch("/api/timesheets/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          weekStart: format(currentWeekStart, "yyyy-MM-dd"),
          status: newStatus,
          entries: entries.map(e => ({
            projectId: e.projectId, // In a real app, this would be the SF Project__c Record ID
            date: e.date,
            hours: e.hours
          }))
        })
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to sync with Salesforce");
      }

      return await res.json();
    };

    toast.promise(promise(), {
      loading: newStatus === "Submitted" ? "Submitting to Salesforce..." : "Syncing to Salesforce...",
      success: () => {
        if (newStatus === "Submitted") setStatus("Submitted");
        return newStatus === "Submitted" ? "Submitted for approval!" : "Saved to Salesforce";
      },
      error: (err: unknown) => {
        const error = err as { message?: string };
        return `${error.message || "Failed to sync"}`;
      }
    });
  };

  const handleSave = () => handleSync("Draft");
  const handleSubmit = () => handleSync("Submitted");

  const handleNavigateWeek = (direction: number) => {
    setCurrentWeekStart(prev => addDays(prev, direction * 7))
    // Status and Entries will be updated by the useEffect above
  }

  // Calculate totals
  const dailyTotals = Array.from({ length: 7 }).map((_, i) => {
    const date = format(addDays(currentWeekStart, i), "yyyy-MM-dd")
    return entries
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.hours, 0)
  })

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)



  const handleSmartApply = (projectId: string, hours: number) => {
      // 1. Ensure project is visible
      if (!visibleProjectIds.includes(projectId)) {
          setVisibleProjectIds(prev => [...prev, projectId]);
      }
      
      // 2. Determine target date (Today)
      const todayStr = format(new Date(), "yyyy-MM-dd");
      
      // 3. Update entry
      setEntries(prev => {
          const existing = prev.find(e => e.projectId === projectId && e.date === todayStr);
          if (existing) {
             return prev.map(e => e.id === existing.id ? { ...e, hours } : e);
          }
          return [...prev, { id: Math.random().toString(), projectId, date: todayStr, hours }];
      });
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24 bg-white rounded-3xl shadow-xl">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-accent-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-medium animate-pulse">Connecting to Salesforce...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
    <SmartFill onApply={handleSmartApply} />

    <MotionCard delay={0.1} className="overflow-visible border-white/10 bg-slate-900/40">
      <CardHeader className="flex flex-row items-center justify-between pb-8 pt-8 px-8 border-b border-white/5">
        <div className="space-y-2">
          <CardTitle className="text-2xl font-black flex items-center gap-4 text-white tracking-tight">
            Timesheet
            <StatusBadge status={status} />
          </CardTitle>
          <CardDescription className="flex items-center gap-3 bg-white/5 border border-white/5 w-fit p-1 rounded-lg">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm hover:bg-white/10 hover:text-white text-gray-400 transition-all" onClick={() => handleNavigateWeek(-1)}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-sm font-bold text-indigo-100 w-48 text-center tracking-wide">{format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}</span>
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-sm hover:bg-white/10 hover:text-white text-gray-400 transition-all" onClick={() => handleNavigateWeek(1)}><ChevronRight className="w-4 h-4" /></Button>
          </CardDescription>
        </div>
        <div className="flex items-center gap-6">
           <div className="text-right hidden md:block">
             <div className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-1">Total Hours</div>
             <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 drop-shadow-sm">
                {totalHours}
                <span className="text-lg font-medium text-slate-600 ml-1">/ 40</span>
             </div>
           </div>
           <div className="flex gap-3">
             <Button variant="outline" className="hidden sm:flex border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 pointer-events-auto" onClick={handleSave} disabled={status !== "Draft"}>
               <Save className="h-4 w-4 mr-2" /> Save Draft
             </Button>
             <Button onClick={handleSubmit} disabled={status !== "Draft" || totalHours === 0} className="bg-white text-slate-950 hover:bg-indigo-50 font-bold shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all hover:scale-105 active:scale-95 pointer-events-auto">
               <Send className="h-4 w-4 mr-2" /> Submit
             </Button>
           </div>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto scroller">
        <div className="min-w-[900px]">
          {/* Header Row */}
          <div className="grid grid-cols-[280px_repeat(7,1fr)_100px] border-b border-white/5 bg-white/[0.02]">
            <div className="p-6 text-xs font-bold uppercase text-slate-500 tracking-widest">Project</div>
            {DAYS.map((day, i) => {
               const isToday = format(addDays(currentWeekStart, i), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");
               return (
                <div key={day} className={cn("py-4 px-2 text-center transition-colors relative group", isToday && "bg-indigo-500/10")}>
                    {isToday && <div className="absolute top-0 left-0 right-0 h-0.5 bg-indigo-500 shadow-[0_0_10px_#6366f1]" />}
                    <div className={cn("text-xs font-bold mb-1 tracking-wider", isToday ? "text-indigo-400" : "text-slate-500")}>{day}</div>
                    <div className={cn("text-xl transition-all", isToday ? "font-black text-white scale-110" : "font-medium text-slate-400 group-hover:text-slate-200")}>
                    {format(addDays(currentWeekStart, i), "d")}
                    </div>
                </div>
              );
            })}
            <div className="p-6 text-center text-xs font-bold uppercase text-slate-500 tracking-widest">
              Total
            </div>
          </div>

          {/* Project Rows */}
          <div className="divide-y divide-white/5">
          {projects.map((project) => (
            <div key={project.id} className="grid grid-cols-[280px_repeat(7,1fr)_100px] hover:bg-white/[0.02] transition-colors group">
              <div className="p-4 pl-8 flex items-center gap-4">
                <div className={`w-1.5 h-8 rounded-full ${project.color} shadow-[0_0_10px_currentColor]`} />
                <div className="flex-1 min-w-0 py-2">
                  <div className="font-bold text-slate-200 truncate leading-tight group-hover:text-indigo-300 transition-colors">{project.name}</div>
                  <div className="text-xs text-slate-500 font-medium tracking-wide mt-1">{project.code}</div>
                </div>
                {project.billable && (
                   <div className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-500/20 text-teal-400 border border-teal-500/30" title="Billable">
                     <span className="text-[10px] font-bold">$</span>
                   </div>
                )}
                <Button 
                   variant="ghost" 
                   size="icon" 
                   className="h-8 w-8 text-slate-600 opacity-0 group-hover:opacity-100 hover:text-rose-400 hover:bg-rose-500/10 transition-all rounded-full ml-auto"
                   onClick={() => handleRemoveProject(project.id)}
                   disabled={status !== "Draft"}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {DAYS.map((_, i) => (
                <div key={i} className="h-20 border-l border-white/5 p-1 relative">
                  <EntryCell 
                    value={getHours(project.id, i)} 
                    onChangeValue={(v) => setHours(project.id, i, v)}
                    isReadOnly={status !== "Draft"}
                    highlight={format(addDays(currentWeekStart, i), "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")}
                  />
                </div>
              ))}

              <div className="flex items-center justify-center border-l border-white/5">
                 <div className="text-lg font-bold text-slate-300 bg-white/5 px-4 py-1.5 rounded-lg min-w-[3rem] text-center border border-white/5">
                    {Array.from({length: 7}).reduce((sum: number, _, i) => sum + getHours(project.id, i), 0)}
                 </div>
              </div>
            </div>
          ))}
          </div>

          {/* Add Project Row */}
          <div className="p-4 pl-8 border-t border-dashed border-white/10">
            <Button 
              variant="ghost" 
              className="text-slate-400 hover:text-white hover:bg-white/5 text-sm font-medium transition-all group"
              onClick={handleAddProject}
              disabled={status !== "Draft"}
            >
              <div className="bg-white/10 group-hover:bg-indigo-500 group-hover:text-white text-slate-400 rounded-full p-1 mr-3 transition-colors">
                  <Plus className="w-4 h-4" />
              </div>
              Add Project Line
            </Button>
          </div>

          {/* Daily Totals Footer */}
          <div className="grid grid-cols-[280px_repeat(7,1fr)_100px] bg-white/[0.02] border-t border-white/10">
            <div className="p-6 text-xs font-bold uppercase text-slate-500 text-right pr-6 self-center tracking-widest">
              Daily Total
            </div>
            {dailyTotals.map((total, i) => (
              <div key={i} className="p-4 flex items-center justify-center border-l border-white/5">
                  <div className={cn(
                    "font-bold text-sm px-3 py-1 rounded-full transition-all",
                    total === 0 ? "text-slate-700" : "bg-white/10 text-white shadow-sm ring-1 ring-white/10",
                    total > 10 && "text-amber-400 ring-amber-500/30 bg-amber-500/10",
                  )}>
                    {total > 0 ? total + "h" : "-"}
                  </div>
              </div>
            ))}
            <div className="p-4 flex items-center justify-center border-l border-white/5">
               <div className="text-xl font-black text-indigo-400 bg-indigo-500/10 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(99,102,241,0.2)] ring-1 ring-indigo-500/20">
                 {totalHours}
               </div>
            </div>
          </div>
        </div>
      </CardContent>
    </MotionCard>
    </div>
  )
}
