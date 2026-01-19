"use client"

import { FocusTimer } from "@/components/productivity/FocusTimer"
import { BrainCircuit } from "lucide-react"

export default function FocusPage() {
    return (
        <div className="min-h-screen bg-slate-950 p-6 sm:p-12 flex flex-col items-center justify-center animate-fade-in relative overflow-hidden">
             {/* Background Effects */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                 <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                 <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700" />
             </div>

            <div className="z-10 w-full max-w-md space-y-8 text-center">
                <div>
                     <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-indigo-500/10 mb-4 ring-1 ring-indigo-500/30">
                        <BrainCircuit className="w-8 h-8 text-indigo-400" />
                     </div>
                     <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-200 to-purple-200">
                         Deep Focus
                     </h1>
                     <p className="text-slate-400 mt-2">
                         Eliminate distractions and enter the flow state.
                     </p>
                </div>

                <FocusTimer />
            </div>
        </div>
    )
}
