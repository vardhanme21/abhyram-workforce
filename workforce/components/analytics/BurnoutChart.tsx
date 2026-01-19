"use client"

import * as React from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Cell } from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { AlertCircle } from "lucide-react"

type Metric = {
    name: string
    value: number // Hours
    threshold: number
    status: string
}

export function BurnoutChart({ data }: { data: Metric[] }) {
    if (!data || data.length === 0) return null;

    // Filter to only show relevant folks (e.g. top 5 or those with hours)
    const chartData = data.filter(d => d.value > 0).slice(0, 10);

    return (
        <Card className="border-white/10 bg-slate-900/40">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary-200">
                    <AlertCircle className="w-5 h-5 text-rose-400" />
                    Burnout Risk
                </CardTitle>
                <CardDescription>
                    Employees exceeding 40h/week
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="h-[200px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} layout="vertical" margin={{ left: 0 }}>
                            <XAxis type="number" hide />
                            <YAxis 
                                dataKey="name" 
                                type="category" 
                                width={100} 
                                tick={{ fill: '#94a3b8', fontSize: 12 }} 
                                axisLine={false} 
                                tickLine={false}
                            />
                            <Tooltip 
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.value > 40 ? '#fb7185' : '#818cf8'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
