import { WeeklyCalendar } from "@/components/timesheet/WeeklyCalendar"

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 via-violet-800 to-indigo-900 animate-gradient-x pb-1">
            Timesheet
          </h1>
          <p className="text-gray-500 font-medium">Track your weekly hours and project allocation.</p>
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
