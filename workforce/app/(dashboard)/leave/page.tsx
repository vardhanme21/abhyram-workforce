"use client"

import * as React from "react"
import { LeaveCalendar } from "@/components/leave/LeaveCalendar"
import { LeaveRequestModal } from "@/components/leave/LeaveRequestModal"
import { Button } from "@/components/ui/Button"
import { Plus, Plane } from "lucide-react"

export default function LeavePage() {
    const [open, setOpen] = React.useState(false)
    const [leaves, setLeaves] = React.useState([])

    React.useEffect(() => {
        fetch('/api/leave')
            .then(res => res.json())
            .then(data => {
                if(data.success) setLeaves(data.data)
            })
    }, [open]) // Refresh when modal closes (submission)

    return (
        <div className="space-y-8 animate-fade-in p-6">
             <div className="flex justify-between items-center">
                <div>
                   <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Leave Management</h1>
                   <p className="text-slate-400">Plan your time off and recharge.</p>
                </div>
                <Button onClick={() => setOpen(true)} className="bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 gap-2">
                    <Plus className="w-4 h-4" /> Request Leave
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <LeaveCalendar leaves={leaves} />
                </div>
                <div className="space-y-6">
                    {/* Balance Cards */}
                    <div className="bg-slate-900/50 border border-white/10 rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                <Plane className="w-5 h-5"/>
                            </div>
                            <h3 className="font-bold text-white">Vacation Balance</h3>
                        </div>
                        <div className="text-3xl font-black text-white">12 <span className="text-sm font-medium text-slate-500">days</span></div>
                        <div className="w-full bg-slate-800 h-2 rounded-full mt-4 overflow-hidden">
                            <div className="bg-emerald-500 h-full w-[60%]" />
                        </div>
                        <p className="text-xs text-slate-400 mt-2">18 days total • Resets Jan 1st</p>
                    </div>
                </div>
            </div>

            <LeaveRequestModal open={open} onOpenChange={setOpen} />
        </div>
    )
}
