"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/Dialog"
import { Button } from "@/components/ui/Button"
import { Label } from "@/components/ui/Label"
import { Input } from "@/components/ui/Input"
import { Textarea } from "@/components/ui/Textarea" // Assuming exists or use Input for now
import { toast } from "sonner"

export function LeaveRequestModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
    const [loading, setLoading] = React.useState(false)
    const [formData, setFormData] = React.useState({
        startDate: "",
        endDate: "",
        type: "Vacation",
        reason: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const res = await fetch('/api/leave', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Leave request submitted!")
                onOpenChange(false)
            } else {
                toast.error(data.message || "Failed to submit request")
            }
        } catch (error) {
            console.error(error)
            toast.error("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="bg-slate-900 border border-slate-800 text-white sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Request Leave</DialogTitle>
                    <DialogDescription>Submit a new leave request for approval.</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                             <Label htmlFor="start">Start Date</Label>
                             <Input 
                                id="start" 
                                type="date" 
                                className="bg-slate-800 border-slate-700"
                                value={formData.startDate}
                                onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                required
                             />
                        </div>
                        <div className="grid gap-2">
                             <Label htmlFor="end">End Date</Label>
                             <Input 
                                id="end" 
                                type="date" 
                                className="bg-slate-800 border-slate-700"
                                value={formData.endDate}
                                onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                required
                             />
                        </div>
                    </div>
                    
                    <div className="grid gap-2">
                        <Label htmlFor="type">Leave Type</Label>
                        <select 
                            id="type"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={formData.type}
                            onChange={(e) => setFormData({...formData, type: e.target.value})}
                        >
                            <option value="Vacation">Vacation</option>
                            <option value="Sick">Sick</option>
                            <option value="Personal">Personal</option>
                            <option value="Bereavement">Bereavement</option>
                        </select>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="reason">Reason (Optional)</Label>
                        <Input 
                            id="reason" 
                            className="bg-slate-800 border-slate-700"
                            value={formData.reason}
                            onChange={(e) => setFormData({...formData, reason: e.target.value})}
                        />
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700">
                            {loading ? "Submitting..." : "Submit Request"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
