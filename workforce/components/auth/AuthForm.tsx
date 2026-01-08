
"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"
import { toast } from "sonner"
import { Cloud, Loader2, ArrowRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface AuthFormProps {
  defaultMode?: "login" | "signup"
}

export function AuthForm({ defaultMode = "login" }: AuthFormProps) {
  const router = useRouter()
  const [mode, setMode] = useState<"login" | "signup">(defaultMode)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    employeeId: "",
    department: "",
    manager: "",
    hireDate: "",
    role: "",
    costRate: 0,
    status: "Active" // Default
  })

  // Dropdown options
  const departments = ["IT", "HR", "Sales", "Engineering", "Marketing", "Finance", "Operations"];
  const roles = ["Developer", "Manager", "Admin", "Analyst", "Designer", "Consultant"];
  const statuses = ["Active", "Inactive", "On Leave"];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (mode === "login") {
        const result = await signIn("email-password", {
          email: formData.email,
          password: formData.password,
          redirect: false,
          callbackUrl: "/dashboard"
        })

        if (result?.error) {
          toast.error("Invalid email or password")
        } else {
          toast.success("Welcome back!")
          router.push("/dashboard")
        }
      } else {
        // Signup
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        })

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.error || "Signup failed")
        }

        toast.success("Account created! Please sign in.")
        setMode("login")
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        toast.error(error.message)
      } else {
        toast.error("An unknown error occurred")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }

  return (
    <div className={`w-full ${mode === 'signup' ? 'max-w-4xl' : 'max-w-md'} mx-auto p-6 transition-all duration-500`}>
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-accent-600 mb-2">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-gray-500 text-sm">
              {mode === "login" 
                ? "Enter your credentials to access the workspace" 
                : "Join the workforce management platform"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="wait">
              {mode === "signup" ? (
                <motion.div
                  key="signup-grid"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Left Column */}
                  <div className="space-y-4">
                     <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="employeeId">Employee Name (ID)</Label>
                      <Input id="employeeId" placeholder="EMP-001" value={formData.employeeId} onChange={(e) => handleChange('employeeId', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <select 
                        id="department" 
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                        value={formData.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                      >
                        <option value="">--None--</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status">Status</Label>
                       <select 
                        id="status" 
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                      >
                         {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="manager">Manager</Label>
                      <Input id="manager" placeholder="Search Employees..." value={formData.manager} onChange={(e) => handleChange('manager', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hireDate">Hire Date</Label>
                      <Input id="hireDate" type="date" value={formData.hireDate} onChange={(e) => handleChange('hireDate', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="role">Role</Label>
                      <select 
                        id="role" 
                        className="flex h-10 w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-500"
                        value={formData.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                      >
                        <option value="">--None--</option>
                         {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="costRate">Cost Rate</Label>
                      <Input id="costRate" type="number" placeholder="0.00" value={formData.costRate} onChange={(e) => handleChange('costRate', parseFloat(e.target.value) || 0)} />
                    </div>
                    
                    {/* Owner Field - Read only simulation */}
                    <div className="space-y-2 pt-2">
                       <Label className="text-xs uppercase text-gray-400">Owner</Label>
                       <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                          <div className="h-6 w-6 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs">A</div>
                          Current User
                       </div>
                    </div>

                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="login-single-col"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                   <div className="space-y-2">
                    <Label htmlFor="email-login">Work Email</Label>
                    <Input id="email-login" type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login">Password</Label>
                    <Input id="password-login" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              type="submit" 
              className="w-full h-11 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white transition-all shadow-md hover:shadow-lg mt-6"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin mr-2" />
              ) : (
                <span className="flex items-center justify-center">
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="px-4 text-xs text-gray-400 uppercase font-medium">Or continue with</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              type="button"
              className="w-full h-11 border-gray-200 bg-white hover:bg-gray-50 text-gray-700"
              onClick={() => signIn("salesforce", { callbackUrl: "/dashboard" })}
            >
              <Cloud className="w-5 h-5 mr-2 text-[#00A1E0]" />
              Salesforce
            </Button>
          </div>
        </div>

        <div className="bg-gray-50/50 p-4 text-center border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="ml-2 font-semibold text-primary-600 hover:text-primary-700 transition-colors"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
