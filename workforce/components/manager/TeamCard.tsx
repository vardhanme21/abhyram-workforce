import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { StatusBadge } from "@/components/timesheet/StatusBadge"
import { Check, X, Eye, MoreHorizontal } from "lucide-react"
import { cn } from "@/lib/utils"

interface TeamCardProps {
  employeeName: string
  role: string
  hours: number
  billablePercent: number
  status: "Draft" | "Submitted" | "Approved" | "Rejected"
  submittedDate?: string
}

export function TeamCard({ employeeName, role, hours, billablePercent, status, submittedDate }: TeamCardProps) {
  // Utilization logic
  const utilizationColor = billablePercent >= 85 ? "bg-green-500" : billablePercent >= 70 ? "bg-blue-500" : "bg-orange-500"
  const hoursColor = hours > 45 ? "text-orange-600 font-bold" : "text-gray-900"
  
  return (
    <Card className="hover:shadow-card-hover transition-all duration-200">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-bold">
            {employeeName.charAt(0)}
          </div>
          <div>
            <CardTitle className="text-base">{employeeName}</CardTitle>
            <CardDescription className="text-xs">{role}</CardDescription>
          </div>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
          <MoreHorizontal className="w-4 h-4" />
        </Button>
      </CardHeader>
      
      <CardContent className="space-y-4 pb-2">
        <div className="flex justify-between items-end">
          <div>
            <div className="text-2xl font-bold flex items-baseline gap-1">
              <span className={hoursColor}>{hours.toFixed(1)}</span>
              <span className="text-xs font-normal text-gray-400">/ 40h</span>
            </div>
            
            <div className="flex items-center gap-2 text-xs mt-1">
               <StatusBadge status={status} />
               {submittedDate && <span className="text-gray-400">{submittedDate}</span>}
            </div>
          </div>
          
          <div className="text-right">
             <div className="text-sm font-medium text-gray-700">{billablePercent}%</div>
             <div className="text-xs text-gray-400">Billable</div>
          </div>
        </div>

        {/* Utilization Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            className={cn("h-full rounded-full transition-all duration-500", utilizationColor)} 
            style={{ width: `${billablePercent}%` }} 
          />
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t border-gray-100 flex gap-2">
        <Button className="flex-1 bg-green-600 hover:bg-green-700 h-9" disabled={status !== "Submitted" && status !== "Draft"}>
           <Check className="w-4 h-4 mr-2" /> Approve
        </Button>
        <Button variant="outline" className="flex-1 h-9 hover:bg-red-50 hover:text-red-600 hover:border-red-200" disabled={status !== "Submitted" && status !== "Draft"}>
           <X className="w-4 h-4 mr-2" /> Reject
        </Button>
        <Button variant="secondary" size="icon" className="h-9 w-9">
           <Eye className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
