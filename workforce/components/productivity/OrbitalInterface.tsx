"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Mic, Command } from "lucide-react"
import { useVoiceInput } from "@/hooks/useVoiceInput"
import { parseVoiceCommand } from "@/lib/voice-parser"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export function OrbitalInterface() {
    const { isListening, transcript, startListening, stopListening, notSupported } = useVoiceInput();
  const [isOpen, setIsOpen] = React.useState(false);
  const router = useRouter();

  const handleCommand = React.useCallback(async (text: string) => {
      console.log("Processing command:", text);
      const result = parseVoiceCommand(text);
      
      if (result.intent === 'NAVIGATE' && result.entities.page) {
          toast.info(`Navigating to ${result.entities.page}...`);
          router.push(`/${result.entities.page}`);
          setIsOpen(false);
      } else if (result.intent === 'LOG_TIME') {
         if (result.entities.hours && result.entities.project) {
             // Ideally we'd call an API here to log time directly
             // For now just show a toast mockup
             toast.success(`Logged ${result.entities.hours}h to ${result.entities.project}`);
             setIsOpen(false); 
         } else {
             toast.warning("I heard you, but I need both hours and a project name.");
         }
      } else {
          // toast.error("Sorry, I didn't catch that command.");
      }
  }, [router]);

  // Debounce processing of transcript
  React.useEffect(() => {
    if (!isListening && transcript) {
        handleCommand(transcript);
    }
  }, [isListening, transcript, handleCommand]);

  if (notSupported) return null;

  return (
    <>
      {/* Floating Orb Button */}
      <motion.button
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-slate-900 border border-indigo-500/50 shadow-lg shadow-indigo-500/20 flex items-center justify-center z-50 group overflow-hidden"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => {
            setIsOpen(true);
            startListening();
        }}
      >
         <div className="absolute inset-0 bg-indigo-500/20 group-hover:bg-indigo-500/30 transition-colors" />
         <Mic className="w-6 h-6 text-indigo-400 group-hover:text-white transition-colors" />
         {isListening && (
             <span className="absolute inset-0 rounded-full border-2 border-indigo-500 animate-ping opacity-50" />
         )}
      </motion.button>

      {/* Fullscreen Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-md flex flex-col items-center justify-center"
            onClick={(e) => {
                // Close if clicking background
                if(e.target === e.currentTarget) {
                    stopListening();
                    setIsOpen(false);
                }
            }}
          >
            <div className="relative">
                {/* The Orb */}
                <motion.div 
                    animate={{ 
                        scale: isListening ? [1, 1.2, 1] : 1,
                        rotate: isListening ? [0, 360] : 0
                    }}
                    transition={{ 
                        scale: { repeat: Infinity, duration: 1.5 },
                        rotate: { repeat: Infinity, duration: 8, ease: "linear" }
                    }}
                    className={cn(
                        "w-32 h-32 rounded-full flex items-center justify-center relative",
                        isListening ? "bg-gradient-to-br from-indigo-500 to-purple-600 shadow-[0_0_100px_rgba(99,102,241,0.5)]" : "bg-slate-800 border border-white/10"
                    )}
                >
                    <Mic className="w-12 h-12 text-white" />
                </motion.div>
                
                {/* Status Text */}
                <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="mt-8 text-center"
                >
                    <h2 className="text-2xl font-light text-white mb-2">
                        {isListening ? "Listening..." : "Processing..."}
                    </h2>
                    <p className="text-slate-400 text-lg max-w-md h-8">
                        {transcript || "Say 'Log 4 hours on Project Alpha'..."}
                    </p>
                </motion.div>
            </div>
            
            <button 
                className="absolute top-8 right-8 text-slate-500 hover:text-white"
                onClick={() => {
                    stopListening();
                    setIsOpen(false);
                }}
            >
                <Command className="w-8 h-8" />
                <span className="sr-only">Close</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
