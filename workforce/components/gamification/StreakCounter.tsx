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
    return (
        <div className="flex items-center gap-4 bg-slate-900/50 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 relative overflow-hidden group">
            {/* Particle Effect Background for High Streak */}
            {stats.streak > 3 && (
                 <div className="absolute inset-0 pointer-events-none opacity-20">
                     {[...Array(5)].map((_, i) => (
                         <motion.div 
                            key={i}
                            className="absolute bg-orange-500 rounded-full blur-md"
                            initial={{ x: "10%", y: "100%", opacity: 0, scale: 0.5 }}
                            animate={{ 
                                x: [null, `${Math.random() * 40}px`], 
                                y: [null, "-100%"], 
                                opacity: [0, 1, 0],
                                scale: [0.5, 1.5, 0.5]
                            }}
                            transition={{ 
                                duration: 2 + Math.random(), 
                                repeat: Infinity, 
                                delay: Math.random() * 2,
                                ease: "easeOut" 
                            }}
                            style={{ width: Math.random() * 20 + 10, height: Math.random() * 20 + 10 }}
                         />
                     ))}
                 </div>
            )}

            {/* Streak */}
            <div className="flex items-center gap-1.5 text-orange-500 font-bold relative z-10" title="Daily Streak">
                <div className="relative">
                    <Flame className={cn("w-5 h-5 fill-current", stats.streak > 0 && "animate-pulse drop-shadow-[0_0_8px_rgba(249,115,22,0.5)]")} />
                    {stats.streak > 0 && (
                        <motion.div 
                            className="absolute inset-0 bg-orange-500 blur-lg"
                            animate={{ opacity: [0.2, 0.5, 0.2] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                        />
                    )}
                </div>
                <span className="drop-shadow-sm">{stats.streak}</span>
            </div>

            <div className="w-px h-6 bg-white/10 relative z-10" />

            {/* Level & XP */}
            <div className="flex items-center gap-3 relative z-10">
                 <div className="flex flex-col items-end">
                     <span className="text-xs font-bold text-indigo-400">LVL {stats.level}</span>
                     <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"
                         />
                     </div>
                 </div>
                 {stats.badge && (
                     <motion.div 
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        className="p-1.5 bg-gradient-to-br from-yellow-500/20 to-amber-500/10 rounded-full text-yellow-500 border border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.2)] cursor-help" 
                        title={`Badge: ${stats.badge}`}
                     >
                         <Trophy className="w-4 h-4" />
                     </motion.div>
                 )}
            </div>
        </div>
    )
    )
}
