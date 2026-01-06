import { TeamCard } from "@/components/manager/TeamCard"
import { Button } from "@/components/ui/Button"
import { Filter } from "lucide-react"

export default function ManagerDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-700">Team Approvals</h1>
          <p className="text-gray-500">Review and approve timesheets for Week of Jan 15-21.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" /> Filter Status
          </Button>
          <Button>Approve All Selected</Button>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex gap-8 items-center text-sm text-blue-800">
         <div><strong>Pending:</strong> 4</div>
         <div><strong>Approved:</strong> 12</div>
         <div><strong>Team Utilization:</strong> 78% <span className="text-xs font-normal text-blue-600">(Target: 80%)</span></div>
         <div><strong>Missing:</strong> 1</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <TeamCard 
          employeeName="John Doe" 
          role="Senior Developer" 
          hours={42.5} 
          billablePercent={88} 
          status="Submitted" 
          submittedDate="2h ago"
        />
        <TeamCard 
          employeeName="Alice Smith" 
          role="UX Designer" 
          hours={40.0} 
          billablePercent={92} 
          status="Submitted" 
          submittedDate="5h ago"
        />
        <TeamCard 
          employeeName="Bob Wilson" 
          role="QA Engineer" 
          hours={45.0} 
          billablePercent={65} 
          status="Draft" 
          submittedDate="In Progress"
        />
        <TeamCard 
          employeeName="Sarah Jones" 
          role="DevOps" 
          hours={38.0} 
          billablePercent={20} 
          status="Approved" 
          submittedDate="Yesterday"
        />
      </div>
    </div>
  )
}
