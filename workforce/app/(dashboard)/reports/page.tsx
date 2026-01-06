import { UtilizationChart } from "@/components/reports/UtilizationChart"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Download, TrendingUp, DollarSign, Users } from "lucide-react"

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary-700">Financial Insights</h1>
          <p className="text-gray-500">Performance metrics for Jan 1, 2024 - Jan 31, 2024</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export CSV
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              Total Billable Hours
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">1,240 h</div>
            <p className="text-xs text-green-600 font-medium mt-1">↑ 12% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-500" />
              Est. Revenue
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">$186k</div>
            <p className="text-xs text-green-600 font-medium mt-1">↑ 15% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-500" />
              Avg. Utilization
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-gray-900">78%</div>
            <p className="text-xs text-red-500 font-medium mt-1">↓ 3% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts & Breakdowns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
           <UtilizationChart />
        </div>
        
        <div className="space-y-6">
           <Card>
             <CardHeader>
               <CardTitle>Project Margins</CardTitle>
               <CardDescription>Profitability Analysis</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-4">
                 {[
                   { name: "Client Portal", margin: 33, status: "Good", color: "text-green-600" },
                   { name: "Mobile App", margin: 33, status: "Good", color: "text-green-600" },
                   { name: "Internal Dash", margin: 20, status: "Watch", color: "text-yellow-600" },
                   { name: "Legacy Migr.", margin: -6, status: "Crit", color: "text-red-600" },
                 ].map((item) => (
                   <div key={item.name} className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-0 last:pb-0">
                     <div className="font-medium text-sm">{item.name}</div>
                     <div className={`font-bold text-sm ${item.color}`}>{item.margin}%</div>
                   </div>
                 ))}
               </div>
             </CardContent>
           </Card>

           <Card className="bg-red-50 border-red-100">
             <CardHeader className="pb-2">
               <CardTitle className="text-red-700 text-base">⚠️ Risk Alerts</CardTitle>
             </CardHeader>
             <CardContent className="text-sm text-red-600 space-y-2">
               <p>• &quot;Legacy Migration&quot; is 110% over budget.</p>
               <p>• 3 emp. &gt;50h/week (Burnout Risk).</p>
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  )
}
