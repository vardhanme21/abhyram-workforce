'use client';

import { signIn } from "next-auth/react"
import { Logo } from "@/components/Logo"
import { Button } from "@/components/ui/Button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/Card"
import { Cloud } from "lucide-react"

export default function LoginPage() {
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
              Welcome Back
            </CardTitle>
            <CardDescription className="text-base text-gray-500">
              Enter your work email to access the portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <input 
                id="email" 
                type="email" 
                placeholder="name@company.com" 
                className="flex h-12 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
              <Button 
                onClick={() => {
                  const email = (document.getElementById('email') as HTMLInputElement).value;
                  if (email) signIn('credentials', { email, callbackUrl: '/dashboard' });
                }}
                size="lg" 
                className="w-full text-base py-6 shadow-lg shadow-accent-500/20 group relative overflow-hidden mt-2"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-accent-500 to-accent-600 group-hover:opacity-90 transition-opacity" />
                <div className="relative flex items-center justify-center gap-3">
                  Continue with Email
                </div>
              </Button>
            </div>
            
            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-300">or use Enterprise SSO</span>
              </div>
            </div>

            <Button 
              variant="outline"
              onClick={() => signIn('salesforce', { callbackUrl: '/dashboard' })}
              className="w-full border-gray-200 hover:bg-gray-50 text-gray-600"
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
