"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Flame, Trophy, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

type GameStats = {
    streak: number;
    level: number;
    xp: number;
    nextLevelXp: number;
    badge?: string;
}

export function StreakCounter() {
    const [stats, setStats] = React.useState<GameStats | null>(null)
    const [loading, setLoading] = React.useState(true)
    const prevLevelRef = React.useRef(0)

    React.useEffect(() => {
        fetch('/api/gamification')
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setStats(data.data)
                    // Level Up Check
                    if (prevLevelRef.current > 0 && data.data.level > prevLevelRef.current) {
                        toast.success(`Level Up! You reached Level ${data.data.level}! 🎉`, {
                            duration: 5000,
                            style: { background: 'linear-gradient(to right, #6366f1, #a855f7)', color: 'white', border: 'none' }
                        })
                    }
                    prevLevelRef.current = data.data.level
                }
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading || !stats) return null;

    const progress = (stats.xp / stats.nextLevelXp) * 100;

    return (
        <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2">
            {/* Streak */}
            <div className="flex items-center gap-1.5 text-orange-500 font-bold" title="Daily Streak">
                <Flame className={cn("w-5 h-5 fill-current", stats.streak > 0 && "animate-pulse")} />
                <span>{stats.streak}</span>
            </div>

            <div className="w-px h-6 bg-white/10" />

            {/* Level & XP */}
            <div className="flex items-center gap-3">
                 <div className="flex flex-col items-end">
                     <span className="text-xs font-bold text-indigo-400">LVL {stats.level}</span>
                     <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                         />
                     </div>
                 </div>
                 {stats.badge && (
                     <div className="p-1.5 bg-yellow-500/10 rounded-full text-yellow-500" title={stats.badge}>
                         <Trophy className="w-4 h-4" />
                     </div>
                 )}
            </div>
        </div>
    )
}
