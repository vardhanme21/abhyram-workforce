"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { 
  LayoutDashboard, 
  Clock, 
  Briefcase, 
  Users, 
  BarChart, 
  LogOut, 
  Menu
} from "lucide-react"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Clock, label: "Timesheets", href: "/dashboard/timesheet" },
  { icon: Briefcase, label: "Projects", href: "/projects" },
  { icon: Users, label: "Manager", href: "/manager" },
  { icon: BarChart, label: "Reports", href: "/reports" },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <>
      {/* Desktop Sidebar - The Floating Dock */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="hidden md:flex flex-col fixed left-4 top-4 bottom-4 w-[280px] rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl z-50 overflow-hidden"
      >
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="bg-gradient-to-tr from-indigo-500 to-violet-500 p-2 rounded-xl shadow-lg shadow-indigo-500/20">
               <Logo className="h-6 w-6 text-white" />
            </div>
            <span className="font-bold text-lg text-white tracking-tight">Abhyram<span className="font-light text-indigo-300">Work</span></span>
          </div>
        </div>

        <div className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-none">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link key={item.href} href={item.href} className="block relative group">
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 rounded-xl border border-indigo-500/30"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <div className={cn(
                  "relative flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300",
                  isActive ? "text-white" : "text-indigo-200/70 hover:text-white hover:bg-white/5"
                )}>
                  <item.icon className={cn("w-5 h-5", isActive && "text-indigo-400")} />
                  <span className="font-medium">{item.label}</span>
                  
                  {isActive && (
                    <motion.div
                      layoutId="glow"
                      className="absolute right-3 w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]"
                    />
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* User Profile Section */}
        <div className="p-4 mt-auto">
          <div className="bg-white/5 rounded-2xl p-4 border border-white/10 glass-card-hover group">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-400 to-cyan-400 p-[1px]">
                  <div className="h-full w-full rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-sm">
                    {session?.user?.name?.[0] || "U"}
                  </div>
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{session?.user?.name || "User"}</p>
                <p className="text-xs text-indigo-300 truncate">{session?.user?.email || "user@example.com"}</p>
              </div>
            </div>
            <Button 
                variant="ghost" 
                className="w-full justify-start text-red-300 hover:text-red-200 hover:bg-red-500/10 h-9"
                onClick={() => signOut({ callbackUrl: "/login" })}
            >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Header (replaces sidebar on small screens) */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 z-50 flex items-center justify-between px-4">
          <Logo className="h-6 w-6 text-white" />
          <Button variant="ghost" size="icon" className="text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <Menu className="w-6 h-6" />
          </Button>
      </div>
      
      {/* Mobile Menu Overlay could go here */}
    </>
  )
}
