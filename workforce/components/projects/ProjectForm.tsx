
"use client"

import { useState } from "react"
import { AnimatedButton } from "@/components/ui/MotionButton"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
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
    <Card className="w-full max-w-4xl mx-auto shadow-sm">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle>New Project</CardTitle>
        <CardDescription>Enter project details below.</CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Project Name <span className="text-red-500">*</span></label>
                    <input 
                        required
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.projectName}
                        onChange={e => handleChange('projectName', e.target.value)}
                    />
                </div>

                 <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Project Manager</label>
                    <input 
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Search Employees..."
                        value={formData.projectManager}
                        onChange={e => handleChange('projectManager', e.target.value)}
                    />
                </div>

                 <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Project Code <span className="text-red-500">*</span></label>
                    <input 
                        required
                         className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.projectCode}
                        onChange={e => handleChange('projectCode', e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Project Type</label>
                    <select 
                         className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.projectType}
                        onChange={e => handleChange('projectType', e.target.value)}
                    >
                        <option value="">--None--</option>
                        {projectTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                
                 <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Opportunity</label>
                    <input 
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        placeholder="Search Opportunities..."
                        value={formData.opportunity}
                        onChange={e => handleChange('opportunity', e.target.value)}
                    />
                </div>

                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <select 
                         className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.status}
                        onChange={e => handleChange('status', e.target.value)}
                    >
                         {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Start Date</label>
                    <input 
                        type="date"
                         className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.startDate}
                        onChange={e => handleChange('startDate', e.target.value)}
                    />
                </div>

                 <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">End Date</label>
                    <input 
                        type="date"
                         className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.endDate}
                        onChange={e => handleChange('endDate', e.target.value)}
                    />
                </div>

                 <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Billable Rate</label>
                    <input 
                         type="number"
                         className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.billableRate}
                        onChange={e => handleChange('billableRate', e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 pt-6 pb-2">
                     <input 
                        type="checkbox"
                        id="billable"
                        checked={formData.billable}
                        onChange={e => handleChange('billable', e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                     />
                      <label htmlFor="billable" className="text-sm font-medium text-gray-700">Billable</label>
                </div>

                 <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Account</label>
                    <input 
                        className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                         placeholder="Search Accounts..."
                        value={formData.account}
                        onChange={e => handleChange('account', e.target.value)}
                    />
                </div>

                 <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Budget Hours</label>
                    <input 
                        type="number"
                         className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                        value={formData.budgetHours}
                        onChange={e => handleChange('budgetHours', e.target.value)}
                    />
                </div>
                
                 {/* Read-only Owner Field */}
                 <div className="space-y-1 pt-2">
                    <label className="text-xs uppercase text-gray-400 font-semibold">Owner</label>
                     <div className="flex items-center gap-2 text-sm text-gray-700 font-medium">
                        <div className="h-6 w-6 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-xs">U</div>
                        Current User
                     </div>
                </div>

            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
            {onCancel && (
              <AnimatedButton type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </AnimatedButton>
            )}
            <AnimatedButton type="submit" disabled={loading} className="min-w-[100px]">
              {loading ? "Saving..." : "Save"}
            </AnimatedButton>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
