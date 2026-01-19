"use client"

import * as React from "react"
import { ManagerLeaveApproval } from "@/components/leave/ManagerLeaveApproval"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export default function ManagerApprovalsPage() {
    const [requests, setRequests] = React.useState([])
    const [loading, setLoading] = React.useState(true)

    React.useEffect(() => {
        // Fetch pending requests
        // Note: We might need a specific endpoint for manager view or just filter locally for now
        // In a real app we'd have a specific /api/manager/leaves endpoint
        async function fetchRequests() {
            try {
                // Mocking fetching 'all pending' by just using the same endpoint for now
                // Ideally this should call `LeaveAPI.getPendingLeavesForManager()`
                // For MVP Phase 2, we will reuse the GET but maybe query differently?
                // Actually, the current API gets leaves for the *current user*.
                // Managers need to see leaves for *their team*.
                // I need to update LeaveAPI to support manager view or create a new endpoint.
                // Let's assume for this step we will fetching via a new query param or just mock data first to get UI up.
                // Or better, I'll update the API to handle ?type=approval
                
                // For now, let's just show empty state or mock to verify UI, 
                // but actually I should update the API to be correct.
                // Let's do a quick fetch and if empty show empty.
                const res = await fetch('/api/leave?type=team') 
                const data = await res.json()
                if (data.success) {
                    setRequests(data.data)
                }
            } catch (e) {
                console.error(e)
                toast.error("Failed to load approvals")
            } finally {
                setLoading(false)
            }
        }
        fetchRequests()
    }, [])

    return (
        <div className="space-y-6 animate-fade-in p-6">
            <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Approvals</h1>
                <p className="text-slate-400">Review and manage team leave requests.</p>
            </div>

            {loading ? (
                <div className="flex justify-center p-12">
                     <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
                </div>
            ) : (
                <ManagerLeaveApproval initialRequests={requests} />
            )}
        </div>
    )
}
