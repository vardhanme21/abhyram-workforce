"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { MapPin, Users } from "lucide-react"
import { cn } from "@/lib/utils"

type TeamMember = {
    name: string;
    role: string;
    status: 'Online' | 'Away' | 'Focus Mode';
    location: string;
}

export function LiveTeamGrid() {
    const [team, setTeam] = React.useState<TeamMember[]>([])
    const [loading, setLoading] = React.useState(true)

    // Poll for status updates
    React.useEffect(() => {
        const fetchStatus = async () => {
             try {
                const res = await fetch('/api/team/status')
                const data = await res.json()
                
                if (data.success && Array.isArray(data.data)) {
                    setTeam(data.data)
                } else if (data.success === false) { 
                     // Fallback if Salesforce is empty or error
                    // console.warn("API returned error, using fallback")
                }
                setLoading(false)
             } catch (e) {
                 console.log(e)
                 setLoading(false)
             }
        }
        
        fetchStatus()
        const interval = setInterval(fetchStatus, 30000) // 30s poll
        return () => clearInterval(interval)
    }, [])

    if (loading) return <div className="animate-pulse bg-slate-800/50 h-64 rounded-xl" />

    return (
        <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                    <Users className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-white">Team Live Pulse</h3>
                <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    Live
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {team.map((member, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className={cn(
                            "relative overflow-hidden p-4 rounded-xl border transition-all hover:bg-white/5",
                            member.status === 'Focus Mode' ? "border-purple-500/30 bg-purple-500/5" :
                            member.status === 'Online' ? "border-emerald-500/30 bg-emerald-500/5" :
                            "border-white/10 bg-slate-800/20"
                        )}
                    >
                        <div className="flex justify-between items-start">
                             <div>
                                 <h4 className="font-bold text-white text-sm">{member.name}</h4>
                                 <p className="text-xs text-slate-400">{member.role}</p>
                             </div>
                             <div className={cn(
                                 "w-2 h-2 rounded-full",
                                 member.status === 'Focus Mode' ? "bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" :
                                 member.status === 'Online' ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" :
                                 "bg-amber-500"
                             )} />
                        </div>
                        
                        <div className="mt-4 flex items-center justify-between text-xs">
                             <span className={cn(
                                 "px-1.5 py-0.5 rounded font-medium",
                                 member.status === 'Focus Mode' ? "bg-purple-500/20 text-purple-300" :
                                 member.status === 'Online' ? "bg-emerald-500/20 text-emerald-300" :
                                 "bg-amber-500/20 text-amber-300"
                             )}>
                                 {member.status}
                             </span>
                             
                             <div className="flex items-center gap-1 text-slate-500">
                                 <MapPin className="w-3 h-3" />
                                 {member.location.split(' ')[0]}
                             </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
