"use client"

import { cn } from "@/lib/utils"

import * as React from "react"
import { format, addDays, startOfWeek } from "date-fns"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { EntryCell } from "./EntryCell"
import { StatusBadge } from "./StatusBadge"
import { Plus, Info, Trash2, ChevronLeft, ChevronRight, Save, Send } from "lucide-react"
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
  const [loading, setLoading] = React.useState(true)

  const projects = allProjects.filter(p => visibleProjectIds.includes(p.id))

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
          toast.error("Using mock projects as Salesforce connection is pending.")
          setAllProjects([
            { id: "p1", name: "Client Portal", code: "CP-001", color: "bg-blue-500", billable: true },
            { id: "p2", name: "Internal Dashboard", code: "ID-002", color: "bg-teal-500", billable: false },
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

  const [entries, setEntries] = React.useState<TimesheetEntry[]>([
    { id: "e1", projectId: "p1", date: format(addDays(currentWeekStart, 0), "yyyy-MM-dd"), hours: 8 },
    { id: "e2", projectId: "p1", date: format(addDays(currentWeekStart, 1), "yyyy-MM-dd"), hours: 8 },
    { id: "e3", projectId: "p2", date: format(addDays(currentWeekStart, 2), "yyyy-MM-dd"), hours: 4 },
  ])

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
    setStatus("Draft") // Reset status for the new week view
  }

  // Calculate totals
  const dailyTotals = Array.from({ length: 7 }).map((_, i) => {
    const date = format(addDays(currentWeekStart, i), "yyyy-MM-dd")
    return entries
        .filter(e => e.date === date)
        .reduce((sum, e) => sum + e.hours, 0)
  })

  const totalHours = entries.reduce((sum, e) => sum + e.hours, 0)


  // Intelligence Mock
  const [showSuggestion, setShowSuggestion] = React.useState(true)

  const handleApplySuggestion = () => {
    if (allProjects.length > 0) {
      setHours(allProjects[0].id, 0, 8.0)
      setShowSuggestion(false)
    }
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
    <div className="space-y-4">
    {showSuggestion && (
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex items-start sm:items-center justify-between gap-4 animate-slide-in">
            <div className="flex items-start sm:items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-full hidden sm:block">
                    <Info className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <h4 className="text-sm font-semibold text-blue-900">Smart Suggestion</h4>
                    <p className="text-xs text-blue-700 mt-0.5">Based on your history, you usually work <strong>8.0h</strong> on <strong>Client Portal</strong> on Mondays.</p>
                </div>
            </div>
            <div className="flex gap-2">
                <Button size="sm" variant="ghost" className="h-8 text-blue-600 hover:text-blue-800 hover:bg-blue-100" onClick={() => setShowSuggestion(false)}>Dismiss</Button>
                <Button size="sm" className="h-8 bg-blue-600 hover:bg-blue-700 text-white border-none" onClick={handleApplySuggestion}>Apply</Button>
            </div>
        </div>
    )}

    <Card className="border-none shadow-lg overflow-hidden bg-white/80 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-gray-100/50">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-3">
            Timesheet Summary
            <StatusBadge status={status} />
          </CardTitle>
          <CardDescription className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleNavigateWeek(-1)}><ChevronLeft className="w-4 h-4" /></Button>
            Week of {format(currentWeekStart, "MMM d")} - {format(addDays(currentWeekStart, 6), "MMM d, yyyy")}
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleNavigateWeek(1)}><ChevronRight className="w-4 h-4" /></Button>
          </CardDescription>
        </div>
        <div className="flex items-center gap-3">
           <div className="text-right mr-4 hidden md:block">
             <div className="text-sm text-gray-500">Total Hours</div>
             <div className="text-2xl font-bold text-primary-600">{totalHours} <span className="text-sm font-normal text-gray-400">/ 40</span></div>
           </div>
           <Button variant="outline" size="sm" className="hidden sm:flex items-center gap-2" onClick={handleSave} disabled={status !== "Draft"}>
             <Save className="h-4 w-4" /> Save Draft
           </Button>
           <Button onClick={handleSubmit} disabled={status !== "Draft" || totalHours === 0} className="bg-primary-700 hover:bg-primary-800">
             <Send className="h-4 w-4 mr-2" /> Submit
           </Button>
        </div>
      </CardHeader>

      <CardContent className="p-0 overflow-x-auto">
        <div className="min-w-[800px]">
          {/* Header Row */}
          <div className="grid grid-cols-[250px_repeat(7,1fr)_80px] bg-gray-50/50 border-b border-gray-200">
            <div className="p-4 text-xs font-semibold uppercase text-gray-500 tracking-wider">Project</div>
            {DAYS.map((day, i) => (
              <div key={day} className="p-4 text-center border-l border-gray-100">
                <div className="text-xs font-semibold text-gray-500 mb-1">{day}</div>
                <div className="text-lg font-light text-primary-700">
                  {format(addDays(currentWeekStart, i), "d")}
                </div>
              </div>
            ))}
            <div className="p-4 text-center text-xs font-semibold uppercase text-gray-500 tracking-wider border-l border-gray-200 bg-gray-100/30">
              Total
            </div>
          </div>

          {/* Project Rows */}
          {projects.map((project) => (
            <div key={project.id} className="grid grid-cols-[250px_repeat(7,1fr)_80px] border-b border-gray-100 hover:bg-white transition-colors group">
              <div className="p-4 flex items-center gap-3 border-r border-transparent">
                <div className={`w-3 h-3 rounded-full ${project.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 truncate">{project.name}</div>
                  <div className="text-xs text-gray-400 font-mono">{project.code}</div>
                </div>
                {project.billable && (
                   <div className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">BILLABLE</div>
                )}
                <Button 
                   variant="ghost" 
                   size="icon" 
                   className="h-8 w-8 text-gray-300 opacity-0 group-hover:opacity-100 hover:text-error transition-all ml-auto"
                   onClick={() => handleRemoveProject(project.id)}
                   disabled={status !== "Draft"}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              {DAYS.map((_, i) => (
                <div key={i} className="border-l border-gray-100 h-16">
                  <EntryCell 
                    value={getHours(project.id, i)} 
                    onChangeValue={(v) => setHours(project.id, i, v)}
                    isReadOnly={status !== "Draft"}
                  />
                </div>
              ))}

              <div className="p-4 flex items-center justify-center font-bold text-gray-700 bg-gray-50/30 border-l border-gray-200">
                {Array.from({length: 7}).reduce((sum: number, _, i) => sum + getHours(project.id, i), 0)}
              </div>
            </div>
          ))}

          {/* Add Project Row */}
          <div className="p-4 border-b border-dashed border-gray-200 bg-gray-50/20">
            <Button 
              variant="ghost" 
              className="text-accent-600 hover:text-accent-700 hover:bg-accent-50 text-sm pl-2 font-semibold"
              onClick={handleAddProject}
              disabled={status !== "Draft"}
            >
              <Plus className="w-4 h-4 mr-2" /> Add Project Row
            </Button>
          </div>

          {/* Daily Totals Footer */}
          <div className="grid grid-cols-[250px_repeat(7,1fr)_80px] bg-gray-100 border-t border-gray-200">
            <div className="p-4 text-xs font-bold uppercase text-gray-500 text-right pr-6 self-center">
              Daily Total
            </div>
            {dailyTotals.map((total, i) => (
              <div key={i} className={cn(
                "p-4 text-center font-bold text-gray-700 border-l border-gray-200 self-center",
                total > 10 ? "text-orange-600 bg-orange-50/50" : "",
                total < 8 && total > 0 ? "text-yellow-600" : ""
              )}>
                {total > 0 ? total : "-"}
              </div>
            ))}
            <div className="p-4 text-center font-bold text-xl text-primary-700 bg-gray-200/50 border-l border-white self-center">
              {totalHours}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  )
}
