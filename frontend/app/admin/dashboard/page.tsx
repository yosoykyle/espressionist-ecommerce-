"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, ShoppingCart, Users, TrendingUp } from "lucide-react"
import { AdminLayout } from "@/components/admin-layout"
import { productStore, orderStore, adminStore, initializeData } from "@/lib/data-store"
import { authService } from "@/lib/api-service"

export default function AdminDashboard() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    activeAdmins: 0,
    revenue: 0,
  })

  useEffect(() => {
    const checkAuth = () => {
      console.log("Checking authentication...") // Debug log

      const isLoggedIn = authService.isLoggedIn()
      console.log("Is logged in:", isLoggedIn) // Debug log

      if (!isLoggedIn) {
        console.log("Not logged in, redirecting to login") // Debug log
        router.push("/admin")
        return
      }

      console.log("Authentication successful") // Debug log
      setIsAuthenticated(true)

      // Initialize data and calculate stats
      try {
        initializeData()

        const products = productStore.getAll()
        const orders = orderStore.getAll()
        const admins = adminStore.getAll()

        const revenue = orders
          .filter((order) => order.status === "Delivered")
          .reduce((sum, order) => sum + order.total, 0)

        setStats({
          totalProducts: products.filter((p) => !p.archived).length,
          totalOrders: orders.length,
          activeAdmins: admins.filter((a) => a.status === "Active").length,
          revenue: revenue,
        })
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      }
    }

    // Small delay to ensure localStorage is available
    setTimeout(checkAuth, 100)
  }, [router])

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalProducts}</div>
              <p className="text-xs text-muted-foreground">Active products</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">All time orders</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeAdmins}</div>
              <p className="text-xs text-muted-foreground">Active administrators</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₱{stats.revenue.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">From delivered orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Manage your café's product catalog, update prices, and track inventory.
              </p>
              <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary/90">
                <Link href="/admin/products">Manage Products</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                View and manage customer orders, update order status, and track deliveries.
              </p>
              <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary/90">
                <Link href="/admin/orders">Manage Orders</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Admin Management</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Manage admin accounts, permissions, and access controls.</p>
              <Button asChild className="w-full bg-brand-primary hover:bg-brand-primary/90">
                <Link href="/admin/admins">Manage Admins</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  )
}
