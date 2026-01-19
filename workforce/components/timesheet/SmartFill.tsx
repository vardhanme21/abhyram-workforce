"use client"

import * as React from "react"
import { MotionDiv } from "@/components/ui/MotionPrimitives"
import { Button } from "@/components/ui/Button"
import { Sparkles } from "lucide-react" // Changed Sparkles for premium feel
import { toast } from "sonner"

type Suggestion = {
    projectId: string
    projectName: string
    hours: number
    confidenceScore: number
    reason: string
}

interface SmartFillProps {
    onApply: (projectId: string, hours: number) => void
}

export function SmartFill({ onApply }: SmartFillProps) {
    const [suggestion, setSuggestion] = React.useState<Suggestion | null>(null)
    const [visible, setVisible] = React.useState(true)

    React.useEffect(() => {
        async function fetchSuggestion() {
            try {
                const res = await fetch('/api/intelligence/suggestions')
                if (res.ok) {
                    const data = await res.json()
                    if (data.success && data.data) {
                        setSuggestion(data.data)
                    } else {
                        setVisible(false) // No suggestion found
                    }
                }
            } catch (error) {
                console.error("Failed to load intelligence", error)
                setVisible(false)
            }
        }
        fetchSuggestion()
    }, [])

    if (!visible || !suggestion) return null

    return (
        <MotionDiv 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 relative overflow-hidden bg-gradient-to-r from-indigo-900/40 to-violet-900/40 backdrop-blur-xl border border-indigo-500/30 rounded-2xl p-1 shadow-lg shadow-indigo-500/10"
        >
             {/* Glass Reflection Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl relative z-10">
                <div className="flex items-center gap-4 text-center sm:text-left">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-40 group-hover:opacity-60 transition-opacity" />
                        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-xl shadow-lg relative">
                            <Sparkles className="w-5 h-5 text-white animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <h4 className="text-sm font-bold text-white tracking-wide uppercase">AI Insight</h4>
                            <span className="text-[10px] font-bold bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/30">
                                {Math.round(suggestion.confidenceScore * 100)}% Match
                            </span>
                        </div>
                        <p className="text-sm text-indigo-200 mt-1 max-w-lg">
                            {suggestion.reason}. We recommend logging <span className="font-bold text-white">{suggestion.hours}h</span> on <span className="text-indigo-300 font-medium">{suggestion.projectName}</span>.
                        </p>
                    </div>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Button 
                        size="sm" 
                        variant="ghost" 
                        className="flex-1 sm:flex-none h-10 text-indigo-300 hover:text-white hover:bg-white/5 rounded-lg" 
                        onClick={() => setVisible(false)}
                    >
                        Dismiss
                    </Button>
                    <Button 
                        size="sm" 
                        className="flex-1 sm:flex-none h-10 bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 border-none transition-all hover:scale-105 active:scale-95 rounded-lg px-6" 
                        onClick={() => {
                            onApply(suggestion.projectId, suggestion.hours);
                            toast.success("Time applied via AI Smart-Fill");
                            setVisible(false);
                        }}
                    >
                        Apply Smart Fill
                    </Button>
                </div>
            </div>
        </MotionDiv>
    )
}
