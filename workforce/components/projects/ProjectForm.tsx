"use client"

import { useState } from "react"
import { Button } from "@/components/ui/Button"
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
    budgetHours: ""
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectName: formData.projectName,
          projectCode: formData.projectCode,
          status: formData.status,
          billable: formData.billable,
          projectType: formData.projectType || undefined,
          startDate: formData.startDate || undefined,
          endDate: formData.endDate || undefined,
          budgetHours: formData.budgetHours ? parseFloat(formData.budgetHours) : undefined
        })
      })

      if (res.ok) {
        toast.success("Project created successfully!")
        setFormData({
          projectName: "",
          projectCode: "",
          status: "Active",
          billable: true,
          projectType: "",
          startDate: "",
          endDate: "",
          budgetHours: ""
        })
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Project</CardTitle>
        <CardDescription>Add a new project to track time against</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="projectName" className="text-sm font-medium text-gray-700">
                Project Name <span className="text-red-500">*</span>
              </label>
              <input
                id="projectName"
                type="text"
                required
                value={formData.projectName}
                onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Client Portal Redesign"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="projectCode" className="text-sm font-medium text-gray-700">
                Project Code <span className="text-red-500">*</span>
              </label>
              <input
                id="projectCode"
                type="text"
                required
                value={formData.projectCode}
                onChange={(e) => setFormData({ ...formData, projectCode: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="CP-2024-001"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="status" className="text-sm font-medium text-gray-700">
                Status
              </label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="Active">Active</option>
                <option value="Planning">Planning</option>
                <option value="On Hold">On Hold</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="projectType" className="text-sm font-medium text-gray-700">
                Project Type
              </label>
              <select
                id="projectType"
                value={formData.projectType}
                onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select Type</option>
                <option value="Fixed Price">Fixed Price</option>
                <option value="Time & Materials">Time & Materials</option>
                <option value="Retainer">Retainer</option>
                <option value="Internal">Internal</option>
              </select>
            </div>

            <div className="space-y-2">
              <label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                Start Date
              </label>
              <input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="endDate" className="text-sm font-medium text-gray-700">
                End Date
              </label>
              <input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="budgetHours" className="text-sm font-medium text-gray-700">
                Budget Hours
              </label>
              <input
                id="budgetHours"
                type="number"
                step="0.5"
                value={formData.budgetHours}
                onChange={(e) => setFormData({ ...formData, budgetHours: e.target.value })}
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="160"
              />
            </div>

            <div className="space-y-2 flex items-center pt-6">
              <input
                id="billable"
                type="checkbox"
                checked={formData.billable}
                onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <label htmlFor="billable" className="ml-2 text-sm font-medium text-gray-700">
                Billable Project
              </label>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Project"}
            </Button>
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
                Cancel
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
