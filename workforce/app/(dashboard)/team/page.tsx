"use client"

import { LiveTeamGrid } from "@/components/team/LiveTeamGrid"

export default function TeamPage() {
    return (
        <div className="space-y-6 animate-fade-in p-6">
            <div>
                <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Team View</h1>
                <p className="text-slate-400">Real-time status of your workforce.</p>
            </div>
            
            <LiveTeamGrid />
        </div>
    )
}
