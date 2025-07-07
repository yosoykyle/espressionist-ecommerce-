"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { authService } from "@/lib/api-service"
import { AdminLayout } from "@/components/admin-layout"

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ username: "", password: "" })
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [archivedMsg, setArchivedMsg] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Show archived message if redirected
    const msg = sessionStorage.getItem("archivedLogoutMsg")
    if (msg) {
      setArchivedMsg(msg)
      sessionStorage.removeItem("archivedLogoutMsg")
      authService.logout(); // Ensure JWT is removed so auto-redirect does not happen
      return; // Prevent auto-redirect if archived message is present
    }

    // Check if already logged in
    try {
      if (authService.isLoggedIn()) {
        console.log("Already logged in, redirecting to dashboard") // Debug log
        router.push("/admin/dashboard")
      }
    } catch (error) {
      console.error("Error checking login status:", error)
    }
  }, [router])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log("Attempting login with:", credentials.username) // Debug log

      const loginSuccess = await authService.login(credentials.username, credentials.password)

      if (loginSuccess) {
        // Fetch admin details after successful login
        const admin = await authService.getCurrentAdmin()
        console.log("Login successful, admin:", admin) // Debug log
        if (admin && admin.archived) {
          // If archived, show banner, log out, and do not show welcome toast
          setArchivedMsg("Your account is archived. Contact support at vanceddotseti@gmail.com.")
          authService.logout()
          return
        }
        toast({
          title: "Login Successful",
          description: admin && admin.username ? `Welcome back, ${admin.username}!` : "Welcome back!",
        })

        // Small delay to ensure localStorage is written
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 100)
      } else {
        console.log("Login failed - invalid credentials") // Debug log
        toast({
          title: "Login Failed",
          description: "Invalid username or password.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: "Login Failed",
        description: "An error occurred during login. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminLayout>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-logo text-brand-primary">espressionist</h2>
            <p className="mt-2 text-sm text-gray-600">Admin Portal</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-center">Sign In</CardTitle>
            </CardHeader>
            <CardContent>
              {archivedMsg && (
                <div className="mb-4 p-3 rounded bg-red-100 text-red-800 border border-red-300 text-center font-medium">
                  {archivedMsg.includes('vanceddotseti@gmail.com') ? (
                    <>
                      Your account is archived. Contact support at{' '}
                      <a href="mailto:vanceddotseti@gmail.com" className="underline text-red-700 hover:text-red-900">vanceddotseti@gmail.com</a>.
                    </>
                  ) : (
                    archivedMsg
                  )}
                </div>
              )}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={credentials.username}
                    onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={credentials.password}
                      onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 focus:outline-none"
                      onClick={() => setShowPassword((prev) => !prev)}
                      tabIndex={-1}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-5.523 0-10-4.477-10-10 0-1.657.403-3.22 1.125-4.575M15 12a3 3 0 11-6 0 3 3 0 016 0zm6.875-4.575A9.956 9.956 0 0122 9c0 5.523-4.477 10-10 10a9.956 9.956 0 01-4.575-1.125M3 3l18 18" /></svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm7.5 0c0 4.142-5.373 7.5-10.5 7.5S1.5 16.142 1.5 12 6.873 4.5 12 4.5s10.5 3.358 10.5 7.5z" /></svg>
                      )}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full bg-brand-primary hover:bg-brand-primary/90" disabled={isLoading}>
                  {isLoading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
