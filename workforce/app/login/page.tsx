import { AuthForm } from "@/components/auth/AuthForm"
import { MotionDiv, MotionHeader } from "@/components/ui/MotionPrimitives"
import { Suspense } from "react"
import { Sparkles } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
       {/* Cinematic Background */}
       <div className="absolute inset-0 bg-slate-950">
          <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-indigo-600/30 rounded-full blur-[120px] animate-pulse-slow" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-violet-600/20 rounded-full blur-[100px] animate-float" />
          <div className="absolute top-[40%] left-[30%] w-[400px] h-[400px] bg-teal-500/10 rounded-full blur-[80px] animate-bounce-slow" />
       </div>

       {/* Grid Pattern Overlay */}
       <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <div className="z-10 w-full max-w-5xl flex flex-col md:flex-row items-center gap-12 lg:gap-24">
        
        {/* Left Side: Brand & Marketing Text (Hidden on mobile) */}
        <div className="hidden md:block flex-1 text-white space-y-6">
            <MotionHeader delay={0.2} className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-sm font-medium mb-4">
                    <Sparkles className="w-4 h-4" />
                    <span>Workforce Management Reimagined</span>
                </div>
                <h1 className="text-6xl font-black tracking-tight leading-tight">
                    Manage your <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-teal-400">Team & Time</span>
                    <br/> Effortlessly.
                </h1>
            </MotionHeader>
            <MotionDiv delay={0.4} className="text-lg text-slate-400 max-w-md leading-relaxed">
                Connect seamlessly with Salesforce. Track attendance, manage projects, and generate reports with a premium experience designed for pros.
            </MotionDiv>
        </div>

        {/* Right Side: Auth Card */}
        <div className="flex-1 w-full max-w-md animate-scale-in">
          <Suspense fallback={<div className="text-white text-center">Loading interface...</div>}>
            <AuthForm defaultMode="login" />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
