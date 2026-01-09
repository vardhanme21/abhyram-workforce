"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/Card"
import { AnimatedButton } from "@/components/ui/MotionButton"
import { toast } from "sonner"
import { Clock, Play, Square } from "lucide-react"

export default function AttendanceTimer() {
  const [status, setStatus] = useState<'idle' | 'active'>('idle')
  const [startTime, setStartTime] = useState<Date | null>(null)
  const [elapsed, setElapsed] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch initial status
  useEffect(() => {
    fetchStatus()
  }, [])

  // Timer logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (status === 'active' && startTime) {
      interval = setInterval(() => {
        const now = new Date()
        const diff = Math.floor((now.getTime() - startTime.getTime()) / 1000)
        setElapsed(diff)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [status, startTime])

  const fetchStatus = async () => {
    try {
      const res = await fetch('/api/attendance/status')
      const data = await res.json()
      if (data.isActive) {
        setStatus('active')
        setStartTime(new Date(data.loginTime))
        // Calculate initial elapsed
        const now = new Date()
        const start = new Date(data.loginTime)
        setElapsed(Math.floor((now.getTime() - start.getTime()) / 1000))
      } else {
        setStatus('idle')
        setElapsed(0)
      }
    } catch (error) {
      console.error("Failed to fetch status:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = async () => {
    setLoading(true)
    const action = status === 'idle' ? 'START' : 'STOP'
    
    try {
      const res = await fetch('/api/attendance/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      
      const data = await res.json()
      
      if (res.ok) {
        if (action === 'START') {
          setStatus('active')
          setStartTime(new Date())
          toast.success("Login Successful! Timer started.")
        } else {
          setStatus('idle')
          setStartTime(null)
          setElapsed(0)
          toast.success("Logout Successful! Session saved.")
        }
      } else {
        toast.error(data.error || "Action failed")
        // If simulated backend failure, manually toggle for demo if strictly requested? 
        // No, stick to error.
      }
    } catch {
      toast.error("Network error")
    } finally {
      setLoading(false)
    }
  }

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
    const m = Math.floor((seconds % 3600) / 60)
    const s = seconds % 60
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  if (loading) return null // Or skeleton

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0 flex items-center gap-4">
        {status === 'active' && (
             <div className="flex items-center gap-2 px-4 py-2 bg-primary-50 rounded-full border border-primary-100 animate-in fade-in slide-in-from-right-4">
                <Clock className="h-4 w-4 text-primary-600 animate-pulse" />
                <span className="font-mono text-lg font-bold text-primary-700">
                    {formatTime(elapsed)}
                </span>
            </div>
        )}
       
        <AnimatedButton
          onClick={handleToggle}
          variant={status === 'idle' ? 'default' : 'destructive'}
          className={`min-w-[140px] font-bold shadow-lg transition-all ${
            status === 'idle' 
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white' 
                : 'bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white'
          }`}
        >
          {status === 'idle' ? (
            <>
              <Play className="mr-2 h-4 w-4 fill-current" /> Login
            </>
          ) : (
            <>
              <Square className="mr-2 h-4 w-4 fill-current" /> Logout
            </>
          )}
        </AnimatedButton>
      </CardContent>
    </Card>
  )
}
