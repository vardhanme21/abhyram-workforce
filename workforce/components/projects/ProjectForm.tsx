
"use client"

import { useState } from "react"
import { AnimatedButton } from "@/components/ui/MotionButton"
import { CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { MotionCard } from "@/components/ui/MotionPrimitives"
import { toast } from "sonner"

interface ProjectFormProps {
  onSuccess?: () => void
  onCancel?: () => void
}

export function ProjectForm({ onSuccess, onCancel }: ProjectFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    projectName: "",
    projectCode: "",
    status: "Active",
    billable: true,
    projectType: "",
    startDate: "",
    endDate: "",
    budgetHours: "",
    projectManager: "",
    billableRate: "",
    account: "",
    opportunity: ""
  })

  // Mock data for dropdowns
  const projectTypes = ["Fixed Price", "Time & Materials", "Retainer", "Internal", "Capital"];
  const statuses = ["Active", "Planning", "On Hold", "Completed", "Cancelled"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Basic Validation
      if (formData.startDate && formData.endDate) {
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
          toast.error("Start Date cannot be after End Date")
          setLoading(false)
          return
        }
      }

      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           ...formData,
           budgetHours: formData.budgetHours ? parseFloat(formData.budgetHours) : undefined,
           billableRate: formData.billableRate ? parseFloat(formData.billableRate) : undefined
        })
      })

      if (res.ok) {
        toast.success("Project created successfully!")
        onSuccess?.()
      } else {
        const error = await res.json()
        toast.error(error.error || "Failed to create project")
      }
    } catch (error) {
      console.error("[PROJECT_CREATE_ERROR]", error)
      toast.error("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | boolean | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  return (
    <MotionCard className="w-full max-w-4xl mx-auto shadow-2xl border-white/10 bg-slate-900/60 backdrop-blur-xl">
      <CardHeader className="pb-6 border-b border-white/5">
        <CardTitle className="text-2xl font-black text-white tracking-tight">New Project</CardTitle>
        <CardDescription className="text-indigo-200">Enter project details below to initialize a new workspace.</CardDescription>
      </CardHeader>
      <CardContent className="pt-8 px-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Project Name <span className="text-rose-400">*</span></label>
                    <input 
                        required
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-500"
                        placeholder="e.g. Website Redesign"
                        value={formData.projectName}
                        onChange={e => handleChange('projectName', e.target.value)}
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Project Manager</label>
                    <input 
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-500"
                        placeholder="Search Employees..."
                        value={formData.projectManager}
                        onChange={e => handleChange('projectManager', e.target.value)}
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Project Code <span className="text-rose-400">*</span></label>
                    <input 
                        required
                         className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-500"
                         placeholder="e.g. PRJ-001"
                        value={formData.projectCode}
                        onChange={e => handleChange('projectCode', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Project Type</label>
                    <select 
                         className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all [&>option]:text-black"
                        value={formData.projectType}
                        onChange={e => handleChange('projectType', e.target.value)}
                    >
                        <option value="">-- Select Type --</option>
                        {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                
                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Opportunity</label>
                    <input 
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-500"
                        placeholder="Search Opportunities..."
                        value={formData.opportunity}
                        onChange={e => handleChange('opportunity', e.target.value)}
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Status</label>
                    <select 
                         className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all [&>option]:text-black"
                        value={formData.status}
                        onChange={e => handleChange('status', e.target.value)}
                    >
                         {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-5">
                <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Start Date</label>
                    <input 
                        type="date"
                         className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all [color-scheme:dark]"
                        value={formData.startDate}
                        onChange={e => handleChange('startDate', e.target.value)}
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">End Date</label>
                    <input 
                        type="date"
                         className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all [color-scheme:dark]"
                        value={formData.endDate}
                        onChange={e => handleChange('endDate', e.target.value)}
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Billable Rate ($)</label>
                    <input 
                         type="number"
                         className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-500"
                         placeholder="0.00"
                        value={formData.billableRate}
                        onChange={e => handleChange('billableRate', e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-3 pt-8 pb-3 bg-white/5 rounded-xl px-4 border border-white/5">
                     <input 
                        type="checkbox"
                        id="billable"
                        checked={formData.billable}
                        onChange={e => handleChange('billable', e.target.checked)}
                        className="h-5 w-5 rounded border-white/20 bg-white/10 text-indigo-500 focus:ring-indigo-500"
                     />
                      <label htmlFor="billable" className="text-sm font-bold text-white cursor-pointer select-none">Billable Project</label>
                </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Account</label>
                    <input 
                        className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-500"
                         placeholder="Search Accounts..."
                        value={formData.account}
                        onChange={e => handleChange('account', e.target.value)}
                    />
                </div>

                 <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-indigo-300">Budget Hours</label>
                    <input 
                        type="number"
                         className="flex h-11 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/10 transition-all placeholder:text-slate-500"
                         placeholder="0"
                        value={formData.budgetHours}
                        onChange={e => handleChange('budgetHours', e.target.value)}
                    />
                </div>
                
                 {/* Read-only Owner Field */}
                 <div className="space-y-2 pt-2">
                    <label className="text-xs uppercase text-slate-500 font-bold tracking-widest">Owner</label>
                     <div className="flex items-center gap-3 text-sm text-indigo-200 font-medium bg-white/5 p-2 rounded-lg border border-white/5 w-fit">
                        <div className="h-6 w-6 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center justify-center text-xs font-bold">U</div>
                        Current User
                     </div>
                </div>

            </div>
          </div>

          <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/5">
            {onCancel && (
              <AnimatedButton type="button" variant="outline" onClick={onCancel} disabled={loading} className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white">
                Cancel
              </AnimatedButton>
            )}
            <AnimatedButton type="submit" disabled={loading} className="min-w-[140px] bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 border-none h-11 text-base font-bold">
              {loading ? "Saving..." : "Create Project"}
            </AnimatedButton>
          </div>
        </form>
      </CardContent>
    </MotionCard>
  )
}
