"use client"

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"

const data = [
  { name: 'Jan 1', billable: 30, nonBillable: 10 },
  { name: 'Jan 8', billable: 35, nonBillable: 5 },
  { name: 'Jan 15', billable: 28, nonBillable: 12 },
  { name: 'Jan 22', billable: 40, nonBillable: 0 },
  { name: 'Jan 29', billable: 32, nonBillable: 8 },
  { name: 'Feb 5', billable: 38, nonBillable: 2 },
]

export function UtilizationChart() {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Utilization Trend</CardTitle>
        <CardDescription>Billable vs Non-Billable Hours (Last 6 Weeks)</CardDescription>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBillable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorNonBillable" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#6b7280'}} />
            <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area type="monotone" dataKey="billable" stroke="#3b82f6" fillOpacity={1} fill="url(#colorBillable)" name="Billable" strokeWidth={2} />
            <Area type="monotone" dataKey="nonBillable" stroke="#14b8a6" fillOpacity={1} fill="url(#colorNonBillable)" name="Internal" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
