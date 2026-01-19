"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Play, Pause, RotateCcw, CheckCircle, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/Dialog"
import { Input } from "@/components/ui/Input"
import { Label } from "@/components/ui/Label"

export function FocusTimer() {
    const [timeLeft, setTimeLeft] = React.useState(25 * 60)
    const [isActive, setIsActive] = React.useState(false)
    const [mode, setMode] = React.useState<'focus' | 'break'>('focus') // focus | break
    const [isFullscreen, setIsFullscreen] = React.useState(false)
    
    // Log Time Modal
    const [showLogModal, setShowLogModal] = React.useState(false)
    const [logDetails, setLogDetails] = React.useState({ project: '', notes: '' })

    React.useEffect(() => {
        let interval: NodeJS.Timeout | null = null;

        if (isActive && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => prev - 1)
            }, 1000)
        } else if (timeLeft === 0 && isActive) {
            // Timer complete
            setIsActive(false)
            if (mode === 'focus') {
                toast.success("Focus session complete! Take a break.")
                // Trigger auto-log prompt
                setShowLogModal(true)
            } else {
                toast.info("Break is over. Ready to focus?")
                setMode('focus')
                setTimeLeft(25 * 60)
            }
            if (interval) clearInterval(interval)
        }

        return () => {
            if (interval) clearInterval(interval)
        }
    }, [isActive, timeLeft, mode])

    const toggleTimer = () => setIsActive(!isActive)
    
    const resetTimer = () => {
        setIsActive(false)
        setTimeLeft(mode === 'focus' ? 25 * 60 : 5 * 60)
    }

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }

    const handleLogTime = () => {
        // Mock API Call
        toast.success(`Logged 25 mins to ${logDetails.project || 'Unspecified'}`)
        setShowLogModal(false)
        setLogDetails({ project: '', notes: '' })
        
        // Switch to break
        setMode('break')
        setTimeLeft(5 * 60) // 5 min break
        setIsActive(true) // Auto start break? Maybe not.
    }

    // Circular Progress
    const totalTime = mode === 'focus' ? 25 * 60 : 5 * 60
    const progress = ((totalTime - timeLeft) / totalTime) * 100
    const radius = 120
    const circumference = 2 * Math.PI * radius

    return (
        <>
            <motion.div 
                layout
                className={cn(
                    "relative overflow-hidden transition-all duration-500",
                    isFullscreen 
                        ? "fixed inset-0 z-50 bg-slate-950 flex flex-col items-center justify-center" 
                        : "bg-gradient-to-br from-slate-900 to-indigo-950/30 border border-white/10 rounded-2xl p-6"
                )}
            >
                {/* Header Controls */}
                <div className="absolute top-4 right-4 z-10">
                    <Button variant="ghost" size="icon" onClick={() => setIsFullscreen(!isFullscreen)} className="text-slate-400 hover:text-white">
                        {isFullscreen ? <Minimize2 className="w-5 h-5"/> : <Maximize2 className="w-5 h-5"/>}
                    </Button>
                </div>

                <div className="flex flex-col items-center relative z-10">
                    <h3 className={cn("font-bold text-white mb-8 tracking-widest uppercase", isFullscreen ? "text-2xl" : "text-sm")}>
                        {mode === 'focus' ? 'Focus Mode' : 'Break Time'}
                    </h3>

                    {/* Timer Circle */}
                    <div className="relative mb-8 group">
                         {/* Glow effect */}
                        <div className={cn(
                            "absolute inset-0 rounded-full blur-3xl opacity-20 transition-all duration-1000",
                            isActive ? "bg-indigo-500 scale-110" : "bg-transparent scale-100"
                        )} />
                        
                        <svg className="transform -rotate-90 w-64 h-64 md:w-80 md:h-80">
                            <circle
                                cx="50%" cy="50%" r={radius}
                                stroke="currentColor" strokeWidth="8"
                                fill="transparent"
                                className="text-slate-800"
                            />
                            <circle
                                cx="50%" cy="50%" r={radius}
                                stroke="currentColor" strokeWidth="8"
                                fill="transparent"
                                strokeDasharray={circumference}
                                strokeDashoffset={circumference - (progress / 100) * circumference}
                                strokeLinecap="round"
                                className={cn(
                                    "transition-all duration-1000",
                                    mode === 'focus' ? "text-indigo-500" : "text-emerald-500"
                                )}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className={cn("font-black text-white tabular-nums tracking-tighter", isFullscreen ? "text-8xl" : "text-6xl")}>
                                {formatTime(timeLeft)}
                            </span>
                            <span className="text-slate-400 text-sm mt-2 font-medium">
                                {isActive ? (mode === 'focus' ? 'Stay focused' : 'Relax') : 'Paused'}
                            </span>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-4">
                        <Button 
                            size="lg" 
                            variant="secondary"
                            className="rounded-full w-14 h-14 p-0 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                            onClick={resetTimer}
                        >
                            <RotateCcw className="w-5 h-5" />
                        </Button>

                        <Button 
                            size="lg" 
                            className={cn(
                                "rounded-full w-20 h-20 p-0 shadow-lg shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95",
                                isActive ? "bg-rose-500 hover:bg-rose-600" : "bg-indigo-500 hover:bg-indigo-600"
                            )}
                            onClick={toggleTimer}
                        >
                            {isActive ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
                        </Button>
                        
                         <Button 
                            size="lg" 
                            variant="secondary"
                            className="rounded-full w-14 h-14 p-0 bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300"
                            onClick={() => {
                                setTimeLeft(0); // Debug skip
                                setIsActive(true); // Trigger effect
                            }}
                        >
                            <CheckCircle className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </motion.div>

            {/* Log Modal */}
            <Dialog open={showLogModal} onOpenChange={setShowLogModal}>
                <DialogContent className="bg-slate-900 border-slate-800 text-white">
                    <DialogHeader>
                        <DialogTitle>Session Complete!</DialogTitle>
                        <DialogDescription>Great job! Log this time to a project?</DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                             <Label>Project</Label>
                             <Input 
                                placeholder="Project Name" 
                                className="bg-slate-800 border-slate-700"
                                value={logDetails.project}
                                onChange={e => setLogDetails({...logDetails, project: e.target.value})}
                             />
                        </div>
                        <div className="grid gap-2">
                             <Label>Notes</Label>
                             <Input 
                                placeholder="What did you work on?" 
                                className="bg-slate-800 border-slate-700"
                                value={logDetails.notes}
                                onChange={e => setLogDetails({...logDetails, notes: e.target.value})}
                             />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2">
                        <Button variant="ghost" onClick={() => setShowLogModal(false)}>Skip</Button>
                        <Button className="bg-indigo-600" onClick={handleLogTime}>Log Time</Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
