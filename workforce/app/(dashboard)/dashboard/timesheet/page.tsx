import { WeeklyCalendar } from "@/components/timesheet/WeeklyCalendar"

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-accent-600">
            Good Morning, Jyoshi
          </h1>
          <p className="text-gray-500">Here&apos;s your workforce summary for this week.</p>
        </div>
        <div className="flex gap-3">
          {/* Actions like Export or New Request can go here */}
        </div>
      </div>

      <div className="grid gap-6">
        {/* Main Timesheet Card */}
        <WeeklyCalendar />
        
        {/* Additional widgets can go here below */}
      </div>
    </div>
  )
}
