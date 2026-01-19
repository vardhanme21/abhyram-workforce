"use client"

import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { Bell, User, LogOut } from "lucide-react"
import Link from "next/link"
import { Toaster } from "sonner"
import { signOut, useSession } from "next-auth/react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { data: session } = useSession()
  return (
    <div className="min-h-screen">
      <Toaster position="top-right" richColors theme="system" />
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-white/60 backdrop-blur-xl transition-all">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 group">
              <div className="bg-gradient-to-tr from-indigo-600 to-violet-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform duration-300">
                  <Logo className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 hidden md:inline-block tracking-tight">
                Abhyram<span className="font-light text-slate-400">IT</span>
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-8 pl-6 border-l border-gray-100">
              <Link href="/dashboard" className="text-sm font-semibold text-primary-700 hover:text-accent-500 transition-colors">
                Home
              </Link>
              <Link href="/dashboard/timesheet" className="text-sm font-medium text-gray-500 hover:text-accent-500 transition-colors">
                Timesheets
              </Link>
              <Link href="/projects" className="text-sm font-medium text-gray-500 hover:text-accent-500 transition-colors">
                Projects
              </Link>
              <Link href="/manager" className="text-sm font-medium text-gray-500 hover:text-accent-500 transition-colors">
                Manager
              </Link>
              <Link href="/reports" className="text-sm font-medium text-gray-500 hover:text-accent-500 transition-colors">
                Reports
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-400 hover:text-primary-600 transition-colors">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="hidden md:block text-right">
                <p className="text-sm font-bold text-gray-900">{session?.user?.name || 'User'}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-teal-600">Admin</p>
              </div>
              <Link href="/profile">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full h-9 w-9 bg-primary-100 text-primary-700 ring-2 ring-white shadow-sm"
                >
                  <User className="h-4 w-4" />
                </Button>
              </Link>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="text-gray-400 hover:text-error transition-colors"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-6 py-10 max-w-7xl mx-auto">
        {children}
      </main>
    </div>
  )
}
