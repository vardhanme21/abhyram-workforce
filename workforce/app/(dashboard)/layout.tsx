"use client"

import { AppSidebar } from "@/components/layout/AppSidebar"
import { Toaster } from "sonner"
import { MotionDiv } from "@/components/ui/MotionPrimitives"
import { StreakCounter } from "@/components/gamification/StreakCounter"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-950 transition-colors duration-300">
       {/* Global Ambient Background */}
       <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px]" />
       </div>

      <Toaster position="top-right" richColors theme="system" />
      
      <AppSidebar />

      {/* Top Bar for Gamification */}
      <div className="fixed top-4 right-4 z-50 md:right-8">
          <StreakCounter />
      </div>

      {/* Main Content Area */}
      <MotionDiv 
        className="relative z-10 md:pl-[320px] pt-20 md:pt-8 pr-4 md:pr-8 min-h-screen flex flex-col"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <main className="flex-1 w-full max-w-7xl mx-auto">
          {children}
        </main>
      </MotionDiv>
    </div>
  )
}
