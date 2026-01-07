'use client';

import { signIn } from "next-auth/react"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Cloud, ArrowRight, ShieldCheck, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { toast } from "sonner"

export default function LoginPage() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "otp">("email");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (errorParam) {
      console.error("[OAUTH_ERROR]", errorParam);
      if (errorParam === "OAuthSignin") {
        toast.error("Salesforce connection error (Discovery failed). check your Client ID and Login URL.");
      } else if (errorParam === "OAuthCallback") {
        toast.error("Authentication failed during callback. Check your Client Secret and Redirect URI.");
      } else {
        toast.error(`Authentication error: ${errorParam}`);
      }
    }
  }, [errorParam]);

  const handleSendOTP = async () => {
    if (!email) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStep("otp");
        toast.success("Verification code sent to your email!");
      } else {
        toast.error("Failed to send code. Please try again.");
      }
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) return;
    setLoading(true);
    try {
      const result = await signIn("email-otp", {
        email,
        code: otp,
        callbackUrl: "/dashboard",
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid verification code. Use 123456 for testing.");
        setLoading(false);
      } else {
        toast.success("Identity verified! Redirecting...");
        window.location.href = "/dashboard";
      }
    } catch (error) {
      console.error("[AUTH_ERROR]", error);
      toast.error("Authentication failed. Check your connection or see console for details.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-primary-700 via-primary-600 to-teal-900">
      
      {/* Background ambient effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-accent-500/20 rounded-full blur-[100px] animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md px-4 z-10 animate-slide-in">
        <div className="flex flex-col items-center mb-8 space-y-2">
          <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm border border-white/10 shadow-xl mb-4">
            <Logo className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white drop-shadow-md">Abhyram IT Solutions</h1>
          <p className="text-primary-100 text-lg font-light text-center">Workforce Portal</p>
        </div>

        <Card className="glass-card border-white/20 shadow-2xl backdrop-blur-xl bg-white/90">
          <CardHeader className="space-y-1 text-center pb-6">
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-accent-600">
              {step === "email" ? "Welcome Back" : "Verify Identity"}
            </CardTitle>
            <CardDescription className="text-base text-gray-500 px-4">
              {step === "email" 
                ? "Enter your work email to access the portal." 
                : `Enter the 6-digit code sent to ${email}`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === "email" ? (
              <div className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                  <input 
                    id="email" 
                    type="email" 
                    placeholder="name@company.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-gray-200 bg-white pl-11 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                  />
                </div>
                <Button 
                  onClick={handleSendOTP}
                  disabled={loading || !email}
                  size="lg" 
                  className="w-full text-base py-6 shadow-lg shadow-accent-500/20 group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-accent-500 to-accent-600 group-hover:opacity-90 transition-opacity" />
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? "Sending Code..." : "Continue with Email"}
                    {!loading && <ArrowRight className="w-4 h-4" />}
                  </div>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3.5 h-5 w-5 text-accent-600" />
                  <input 
                    id="otp" 
                    type="text" 
                    maxLength={6}
                    placeholder="123456" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="flex h-12 w-full rounded-lg border border-accent-200 bg-accent-50/50 pl-11 pr-3 py-2 text-xl tracking-[0.3em] font-mono focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
                  />
                </div>
                <Button 
                  onClick={handleVerifyOTP}
                  disabled={loading || otp.length < 6}
                  size="lg" 
                  className="w-full text-base py-6 shadow-lg shadow-accent-500/20 bg-primary-700 hover:bg-primary-800"
                >
                  <div className="relative flex items-center justify-center gap-3">
                    {loading ? "Verifying..." : "Verify & Sign In"}
                  </div>
                </Button>
                <button 
                  onClick={() => setStep("email")}
                  className="w-full text-sm text-gray-400 hover:text-accent-600 underline transition-colors"
                >
                  Use a different email
                </button>
              </div>
            )}
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-300">Enterprise Access</span>
              </div>
            </div>

            <Button 
              variant="outline"
              onClick={() => signIn('salesforce', { callbackUrl: '/dashboard' })}
              className="w-full border-gray-200 hover:bg-gray-50 text-gray-600 h-11"
            >
              <Cloud className="w-4 h-4 mr-2 text-blue-400" />
              Sign in with Salesforce
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-xs text-center text-gray-400">
              Protected by Salesforce Identity. <br />
              Authorized personnel only.
            </p>
          </CardFooter>
        </Card>
      </div>
      
      <div className="absolute bottom-6 text-white/30 text-xs font-light">
        © 2024 Abhyram IT Solutions. All rights reserved.
      </div>
    </div>
  )
}
