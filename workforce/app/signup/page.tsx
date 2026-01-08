import { AuthForm } from "@/components/auth/AuthForm"

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gradient-to-br from-primary-700 via-primary-600 to-teal-900">
       {/* Background ambient effects */}
       <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[100px] animate-pulse" />
       <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px]" />
       
      <div className="z-10 w-full animate-slide-in">
        <AuthForm defaultMode="signup" />
      </div>
    </div>
  )
}
