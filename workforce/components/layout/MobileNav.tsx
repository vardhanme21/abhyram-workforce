"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Clock, 
  Briefcase, 
  Users, 
  BarChart
} from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Home", href: "/dashboard" },
  { icon: Clock, label: "Time", href: "/dashboard/timesheet" },
  { icon: Briefcase, label: "Projects", href: "/projects" },
  { icon: Users, label: "Team", href: "/manager" },
  { icon: BarChart, label: "Reports", href: "/reports" },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-[#0B1121]/90 backdrop-blur-2xl border-t border-white/5 px-4 pb-4 z-[60]">
      <div className="flex items-center justify-around h-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          
          return (
            <Link key={item.href} href={item.href} className="relative group flex flex-col items-center justify-center w-14">
              <div className={cn(
                "relative p-2 rounded-2xl transition-all duration-300",
                isActive ? "text-white -translate-y-2 bg-indigo-500 shadow-lg shadow-indigo-500/40" : "text-slate-400 hover:text-white"
              )}>
                <item.icon className={cn("w-6 h-6", isActive && "scale-110")} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={cn(
                  "text-[10px] font-medium transition-all duration-300 absolute -bottom-1",
                  isActive ? "text-white opacity-100 translate-y-0" : "text-slate-500 opacity-0 translate-y-1"
              )}>
                  {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
