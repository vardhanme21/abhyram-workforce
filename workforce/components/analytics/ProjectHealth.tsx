"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card"
import { Wallet } from "lucide-react"

type Metric = {
    projectName: string
    usedHours: number
    totalBudget: number
    percentUsed: number
}

const COLORS = ['#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];

export function ProjectHealth({ data }: { data: Metric[] }) {
    if (!data || data.length === 0) return null;

    return (
        <Card className="border-white/10 bg-slate-900/40">
             <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary-200">
                    <Wallet className="w-5 h-5 text-emerald-400" />
                    Budget Utilized
                </CardTitle>
                 <CardDescription>Active Projects vs. Budget</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {data.slice(0, 4).map((proj, i) => (
                        <div key={i} className="space-y-1">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-300 font-medium">{proj.projectName}</span>
                                <span className="text-slate-500">{Math.round(proj.percentUsed)}%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div 
                                    className="h-full rounded-full transition-all" 
                                    style={{ 
                                        width: `${Math.min(proj.percentUsed, 100)}%`,
                                        backgroundColor: proj.percentUsed > 90 ? '#fb7185' : COLORS[i % COLORS.length]
                                    }} 
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
