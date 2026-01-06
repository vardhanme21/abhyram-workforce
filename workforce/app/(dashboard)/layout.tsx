import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { Bell, User } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-primary-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary-500" />
              <span className="text-lg font-bold text-primary-700 hidden md:inline-block">
                Abhyram IT
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium text-primary-600 hover:text-accent-500 transition-colors">
                Dashboard
              </Link>
              <Link href="/dashboard/timesheet" className="text-sm font-medium text-gray-500 hover:text-accent-500 transition-colors">
                My Timesheets
              </Link>
              <Link href="/dashboard/reports" className="text-sm font-medium text-gray-500 hover:text-accent-500 transition-colors">
                Reports
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500 hover:text-primary-600">
              <Bell className="h-5 w-5" />
            </Button>
            
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="hidden md:block text-right">
                <p className="text-sm font-medium text-gray-900">Jyoshi</p>
                <p className="text-xs text-gray-500">Senior Developer</p>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 bg-primary-100 text-primary-700">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 md:px-6 py-8">
        {children}
      </main>
    </div>
  )
}
