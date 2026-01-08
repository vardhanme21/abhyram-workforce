"use client"

import { useState, useEffect } from "react"
import { ProjectForm } from "@/components/projects/ProjectForm"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Plus, Briefcase } from "lucide-react"
import { toast } from "sonner"

interface Project {
  id: string
  name: string
  code: string
  billable: boolean
  color: string
}

export default function ProjectsPage() {
  const [showForm, setShowForm] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  const loadProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      if (res.ok) {
        const data = await res.json()
        setProjects(data)
      } else {
        toast.error("Failed to load projects")
      }
    } catch (error) {
      console.error("[PROJECTS_LOAD_ERROR]", error)
      toast.error("Network error loading projects")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const handleSuccess = () => {
    setShowForm(false)
    loadProjects()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-500 mt-1">Manage your projects and track time</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="gap-2">
          <Plus className="w-4 h-4" />
          {showForm ? "Cancel" : "New Project"}
        </Button>
      </div>

      {showForm && (
        <ProjectForm 
          onSuccess={handleSuccess}
          onCancel={() => setShowForm(false)}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full flex items-center justify-center p-12">
            <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full text-center p-12">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No projects yet</h3>
            <p className="text-gray-500 mb-4">Create your first project to get started</p>
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        ) : (
          projects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${project.color}`} />
                    <div>
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="font-mono text-xs mt-1">
                        {project.code}
                      </CardDescription>
                    </div>
                  </div>
                  {project.billable && (
                    <div className="text-[10px] text-teal-600 font-bold bg-teal-50 px-2 py-0.5 rounded-full border border-teal-100">
                      BILLABLE
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">
                  Active project
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
