
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
    <div className={`w-full ${mode === 'signup' ? 'max-w-4xl' : 'max-w-md'} mx-auto transition-all duration-500`}>
      <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0 pointer-events-none" />
        
        <div className="p-8 relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-indigo-200 text-sm font-medium">
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
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Left Column */}
                  <div className="space-y-4">
                     <div className="space-y-2">
                      <Label htmlFor="name" className="text-indigo-100">Full Name</Label>
                      <Input id="name" className="bg-white/10 border-white/20 text-white placeholder:text-indigo-200/50 focus:bg-white/20" placeholder="John Doe" value={formData.name} onChange={(e) => handleChange('name', e.target.value)} required />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="employeeId" className="text-indigo-100">Employee Name (ID)</Label>
                      <Input id="employeeId" className="bg-white/10 border-white/20 text-white placeholder:text-indigo-200/50 focus:bg-white/20" placeholder="EMP-001" value={formData.employeeId} onChange={(e) => handleChange('employeeId', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="department" className="text-indigo-100">Department</Label>
                      <select 
                        id="department" 
                        className="flex h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/20 transition-all [&>option]:text-black"
                        value={formData.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                      >
                        <option value="">--None--</option>
                        {departments.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-indigo-100">Status</Label>
                       <select 
                        id="status" 
                        className="flex h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/20 transition-all [&>option]:text-black"
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                      >
                         {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-indigo-100">Email</Label>
                      <Input id="email" className="bg-white/10 border-white/20 text-white placeholder:text-indigo-200/50 focus:bg-white/20" type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="manager" className="text-indigo-100">Manager</Label>
                      <Input id="manager" className="bg-white/10 border-white/20 text-white placeholder:text-indigo-200/50 focus:bg-white/20" placeholder="Search Employees..." value={formData.manager} onChange={(e) => handleChange('manager', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hireDate" className="text-indigo-100">Hire Date</Label>
                      <Input id="hireDate" className="bg-white/10 border-white/20 text-white placeholder:text-indigo-200/50 focus:bg-white/20 [color-scheme:dark]" type="date" value={formData.hireDate} onChange={(e) => handleChange('hireDate', e.target.value)} />
                    </div>
                     <div className="space-y-2">
                      <Label htmlFor="role" className="text-indigo-100">Role</Label>
                      <select 
                        id="role" 
                        className="flex h-11 w-full rounded-xl border border-white/20 bg-white/10 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white/20 transition-all [&>option]:text-black"
                        value={formData.role}
                        onChange={(e) => handleChange('role', e.target.value)}
                      >
                        <option value="">--None--</option>
                         {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-indigo-100">Password</Label>
                      <Input id="password" className="bg-white/10 border-white/20 text-white placeholder:text-indigo-200/50 focus:bg-white/20" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="costRate" className="text-indigo-100">Cost Rate</Label>
                      <Input id="costRate" className="bg-white/10 border-white/20 text-white placeholder:text-indigo-200/50 focus:bg-white/20" type="number" placeholder="0.00" value={formData.costRate} onChange={(e) => handleChange('costRate', parseFloat(e.target.value) || 0)} />
                    </div>
                    
                    {/* Owner Field - Read only simulation */}
                    <div className="space-y-2 pt-2">
                       <Label className="text-xs uppercase text-indigo-300 font-bold tracking-wider">Owner</Label>
                       <div className="flex items-center gap-2 text-sm font-medium text-indigo-100">
                          <div className="h-6 w-6 rounded-full bg-indigo-500/30 flex items-center justify-center text-white text-xs border border-indigo-400/50">A</div>
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
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                   <div className="space-y-2">
                    <Label htmlFor="email-login" className="text-indigo-100 ml-1">Work Email</Label>
                    <Input id="email-login" className="bg-white/5 border-white/10 text-white placeholder:text-indigo-200/30 focus:bg-white/10 focus:border-indigo-400 h-12 text-lg transition-all" type="email" placeholder="name@company.com" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password-login" className="text-indigo-100 ml-1">Password</Label>
                    <Input id="password-login" className="bg-white/5 border-white/10 text-white placeholder:text-indigo-200/30 focus:bg-white/10 focus:border-indigo-400 h-12 text-lg transition-all" type="password" placeholder="••••••••" value={formData.password} onChange={(e) => handleChange('password', e.target.value)} required />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <Button 
              type="submit" 
              className="w-full h-12 bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-lg rounded-xl transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 mt-8 border-t border-white/20"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
              ) : (
                <span className="flex items-center justify-center">
                  {mode === "login" ? "Sign In" : "Create Account"}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-between">
            <div className="h-px bg-white/10 flex-1" />
            <span className="px-4 text-xs text-indigo-300 uppercase font-bold tracking-wider">Or continue with</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          <div className="mt-6">
            <Button
              variant="outline"
              type="button"
              className="w-full h-12 border-white/10 bg-white/5 hover:bg-white/10 text-white font-medium rounded-xl transition-all"
              onClick={() => signIn("salesforce", { callbackUrl: "/dashboard" })}
            >
              <Cloud className="w-5 h-5 mr-2 text-[#00A1E0]" />
              Salesforce
            </Button>
          </div>
        </div>

        <div className="bg-black/20 p-4 text-center border-t border-white/5 backdrop-blur-sm">
          <p className="text-sm text-indigo-200 font-medium">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="ml-2 font-bold text-white hover:text-indigo-300 transition-colors underline decoration-indigo-500/50 underline-offset-4"
            >
              {mode === "login" ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
