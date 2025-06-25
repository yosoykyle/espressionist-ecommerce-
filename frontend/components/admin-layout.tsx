"use client"

import type React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Package, ShoppingCart, Users, LogOut, Home, Laptop } from "lucide-react"
import { useEffect, useState, Suspense } from "react"
import { authService } from "@/lib/api-service"
import { useToast } from "@/hooks/use-toast"
import { useIsMobile } from "@/hooks/use-mobile"

const adminNavItems = [
	{
		title: "Dashboard",
		href: "/admin/dashboard",
		icon: LayoutDashboard,
	},
	{
		title: "Products",
		href: "/admin/products",
		icon: Package,
	},
	{
		title: "Orders",
		href: "/admin/orders",
		icon: ShoppingCart,
	},
	{
		title: "Admins",
		href: "/admin/admins",
		icon: Users,
	},
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const isLoginPage = pathname === "/admin"
  const [hasCheckedMobile, setHasCheckedMobile] = useState(false);
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setHasCheckedMobile(true);
  }, [isMobile]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return

    // Check if admin is logged in
    if (!authService.isLoggedIn() && !isLoginPage) {
      router.push("/admin")
    } else if (!isLoginPage) {
      // Check for archived admin globally
      authService.getCurrentAdmin().then((admin) => {
        if (admin?.archived) {
          authService.logout();
          sessionStorage.setItem(
            "archivedLogoutMsg",
            "Your account is archived. Contact support at espressionist.ph@gmail.com."
          );
          router.push("/admin");
        } else {
          setIsAuthenticated(true)
        }
      })
    }
  }, [router, isLoginPage])

  const handleLogout = async () => {
    try {
      await authService.logout()
      router.push("/admin")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // On login page, just render children without the layout
  if (!mounted || !hasCheckedMobile) {
    // Prevent content flash until client-side and mobile check are done
    return null;
  }
  // Block mobile access on all admin pages, not just login
  if (isMobile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full text-center space-y-6 p-6 rounded-lg shadow bg-white border border-gray-200">
          <h2 className="text-2xl font-bold text-brand-primary mb-2">espressionist admin</h2>
          <div className="text-lg font-semibold text-gray-800 mb-1">Desktop Access Only</div>
          <p className="text-gray-700 mb-4">For the best management experience, the admin interface requires a tablet-sized screen or larger (min. 768px width).</p>
          <Link href="/" className="inline-block mt-2 text-brand-primary hover:underline font-medium">Return to Main Site</Link>
        </div>
      </div>
    );
  }
  if (isLoginPage) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header - Always visible during page transitions */}
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/admin/dashboard" className="text-xl font-logo text-brand-primary">espressionist admin</Link>
              {/* Horizontal Nav */}
              <nav className="flex items-center space-x-2 ml-8">
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                        isActive ? "bg-brand-primary text-white" : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button asChild variant="ghost" size="sm">
                <Link href="/">
                  <Home className="h-4 w-4 mr-2" />
                  View Site
                </Link>
              </Button>
              <Button onClick={handleLogout} variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>
      {/* Main Content - Wrapped in Suspense */}
      <main className="flex-1 p-6">
        <Suspense fallback={
          <div className="min-h-[60vh] flex items-center justify-center">
            <div className="flex flex-col items-center gap-2">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
              <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
          </div>
        }>
          {children}
        </Suspense>
      </main>
    </div>
  )
}
