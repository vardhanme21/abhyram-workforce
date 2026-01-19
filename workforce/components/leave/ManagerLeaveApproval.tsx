"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Check, X, Calendar } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type LeaveRequest = {
    Id: string;
    Employee__r?: { Name: string };
    Start_Date__c: string;
    End_Date__c: string;
    Leave_Type__c: string;
    Status__c: string;
    Reason__c: string;
}

export function ManagerLeaveApproval({ initialRequests }: { initialRequests: LeaveRequest[] }) {
    const [requests, setRequests] = React.useState(initialRequests)

    const handleAction = async (id: string, action: 'Approved' | 'Rejected') => {
        // Optimistic update
        setRequests(prev => prev.map(r => r.Id === id ? { ...r, Status__c: action } : r));
        
        // TODO: Call API to update status
    }

    return (
        <div className="space-y-4">
            {requests.length === 0 && (
                <div className="text-center py-10 text-slate-500">
                    No pending leave requests.
                </div>
            )}
            {requests.map((req, i) => (
                <motion.div 
                    key={req.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-slate-900/50 border border-white/10 rounded-xl gap-4"
                >
                    <div className="flex items-start gap-4">
                        <div className={cn("mt-1 p-2 rounded-lg", 
                            req.Leave_Type__c === 'Vacation' ? "bg-emerald-500/20 text-emerald-400" :
                            req.Leave_Type__c === 'Sick' ? "bg-rose-500/20 text-rose-400" :
                            "bg-blue-500/20 text-blue-400"
                        )}>
                            <Calendar className="w-5 h-5" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-bold text-white text-base">
                                    {req.Employee__r?.Name || "Employee"}
                                </h3>
                                <span className={cn("text-xs px-1.5 py-0.5 rounded border", 
                                    getStatusStyles(req.Status__c)
                                )}>
                                    {req.Status__c}
                                </span>
                            </div>
                            <div className="text-sm text-slate-400 flex items-center gap-2 mt-1">
                                <span>{req.Leave_Type__c}</span>
                                <span>•</span>
                                <span>{format(new Date(req.Start_Date__c), 'MMM d')} - {format(new Date(req.End_Date__c), 'MMM d, yyyy')}</span>
                            </div>
                           {req.Reason__c &&  <p className="text-xs text-slate-500 mt-2 italic">&quot;{req.Reason__c}&quot;</p>}
                        </div>
                    </div>
                    
                    {req.Status__c === 'Pending' && (
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Button 
                                size="sm" 
                                variant="ghost" 
                                className="flex-1 sm:flex-none text-rose-300 hover:bg-rose-500/10 hover:text-rose-200"
                                onClick={() => handleAction(req.Id, 'Rejected')}
                            >
                                <X className="w-4 h-4 mr-1" />
                                Reject
                            </Button>
                            <Button 
                                size="sm" 
                                className="flex-1 sm:flex-none bg-emerald-600 hover:bg-emerald-500 text-white"
                                onClick={() => handleAction(req.Id, 'Approved')}
                            >
                                <Check className="w-4 h-4 mr-1" />
                                Approve
                            </Button>
                        </div>
                    )}
                </motion.div>
            ))}
        </div>
    )
}

function getStatusStyles(status: string) {
    switch (status) {
        case 'Approved': return 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400';
        case 'Rejected': return 'bg-rose-500/10 border-rose-500/20 text-rose-400';
        default: return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    }
}
