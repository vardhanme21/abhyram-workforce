"use client"

import * as React from "react"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
// Note: We will need a way to trigger the 'Request Leave' modal from here.

type LeaveRequest = {
    Id: string;
    Start_Date__c: string;
    End_Date__c: string;
    Leave_Type__c: string;
    Status__c: string;
    Reason__c: string;
}

export function LeaveCalendar({ leaves }: { leaves: LeaveRequest[] }) {
    const [currentMonth, setCurrentMonth] = React.useState(new Date())
    
    const days = React.useMemo(() => {
        const start = startOfMonth(currentMonth)
        const end = endOfMonth(currentMonth)
        return eachDayOfInterval({ start, end })
    }, [currentMonth])

    const getLeaveForDay = (day: Date) => {
        return leaves.find(l => {
            const start = new Date(l.Start_Date__c);
            const end = new Date(l.End_Date__c);
            // Simple check: is day between start and end (inclusive)?
            // Adjust to midnight for correct comparison
            const d = new Date(day.toDateString());
            const s = new Date(start.toDateString());
            const e = new Date(end.toDateString());
            return d >= s && d <= e;
        })
    }

    const prevMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
    const nextMonth = () => setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <CalendarIcon className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-0">{format(currentMonth, 'MMMM yyyy')}</h2>
                </div>
                <div className="flex gap-1">
                    <Button variant="ghost" size="icon" onClick={prevMonth} className="hover:bg-white/5 text-slate-400">
                        <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={nextMonth} className="hover:bg-white/5 text-slate-400">
                        <ChevronRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
                {days.map((day) => {
                    const leave = getLeaveForDay(day);
                    return (
                        <div 
                            key={day.toISOString()} 
                            className={cn(
                                "aspect-square rounded-xl p-2 flex flex-col justify-between transition-all border border-transparent",
                                "hover:border-white/10 hover:bg-white/5",
                                leave ? `bg-${getStatusColor(leave.Status__c)}-500/10 border-${getStatusColor(leave.Status__c)}-500/30` : "bg-slate-800/30"
                            )}
                        >
                            <span className={cn("text-sm font-medium", isSameDay(day, new Date()) ? "text-indigo-400" : "text-slate-400")}>
                                {format(day, 'd')}
                            </span>
                             {leave && (
                                <div className={cn(
                                    "text-[10px] font-bold px-1.5 py-0.5 rounded truncate",
                                    `bg-${getStatusColor(leave.Status__c)}-500/20 text-${getStatusColor(leave.Status__c)}-300`
                                )}>
                                    {leave.Leave_Type__c}
                                </div>
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function getStatusColor(status: string) {
    switch (status) {
        case 'Approved': return 'emerald';
        case 'Rejected': return 'rose';
        case 'Pending': return 'amber';
        default: return 'slate';
    }
}
