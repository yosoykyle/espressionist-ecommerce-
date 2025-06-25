"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/hooks/use-toast"
import { orderStore, initializeData, type Order } from "@/lib/data-store"
import { OrderDetailsDialog } from "@/components/order-details-dialog"
import { authService } from "@/lib/api-service"
import { adminOrderService } from "@/lib/api-service"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
}
export default function AdminOrdersPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [orders, setOrders] = useState<Order[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [showArchived, setShowArchived] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  useEffect(() => {
    const isLoggedIn = authService.isLoggedIn()
    if (!isLoggedIn) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      initializeData()
      loadOrders()
    }
  }, [router])
  const loadOrders = async () => {
    const allOrders = await orderStore.getAll()
    allOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setOrders(allOrders)
  }
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    // Normalize status for comparison
    const normalizedStatus = order.status.toLowerCase()
    const normalizedFilter = statusFilter.toLowerCase()
    let matchesStatus = normalizedFilter === "all" || normalizedStatus === normalizedFilter
    let matchesArchived
    if (["delivered", "cancelled"].includes(normalizedFilter)) {
      matchesArchived = normalizedStatus === normalizedFilter // show all archived and non-archived with this status
      matchesStatus = normalizedStatus === normalizedFilter
    } else if (showArchived) {
      matchesArchived = order.archived
    } else {
      matchesArchived = !order.archived
    }
    return matchesSearch && matchesStatus && matchesArchived
  })
  const handleStatusChange = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const updated = await adminOrderService.updateOrderStatus(orderId, newStatus)
      if (updated) {
        loadOrders()
        // Reset statusFilter if moving from Cancelled/Delivered to active
        if (newStatus !== "Cancelled" && newStatus !== "Delivered") {
          setStatusFilter("All")
        }
        toast({
          title: "Order Updated",
          description: `Order status changed to ${newStatus}.`,
        })
      }
    } catch (error: any) {
      if (error?.message?.includes("Record has changed since last read")) {
        toast({
          title: "Order Updated Elsewhere",
          description: "Order was updated by another admin. Reloading latest data...",
          variant: "destructive",
        });
        loadOrders();
      } else {
        toast({
          title: "Error",
          description: error?.message || "Failed to update order.",
          variant: "destructive",
        });
      }
    }
  }
  const handleArchiveToggle = async (order: Order) => {
    const updated = await adminOrderService.archiveOrder(order.id, !order.archived)
    if (updated) {
      loadOrders()
      toast({
        title: order.archived ? "Order Restored" : "Order Archived",
        description: `Order ${order.code} has been ${order.archived ? "restored" : "archived"}.`,
      })
    }
  }
  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDialogOpen(true)
  }
  if (!isAuthenticated) {
    return <div>Loading...</div>
  }
  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">Track and manage customer orders</p>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowArchived(!showArchived)}
          >
            {showArchived ? (
              <>
                <Eye className="h-4 w-4 mr-2" /> Show Active Orders
              </>
            ) : (
              <>
                <EyeOff className="h-4 w-4 mr-2" /> Show Archived Orders
              </>
            )}
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Orders</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order Code</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="hidden lg:table-cell">Items</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No orders found.
                      {(searchTerm || statusFilter !== "All") && (
                        <Button
                          variant="link"
                          onClick={() => {
                            setSearchTerm("")
                            setStatusFilter("All")
                          }}
                          className="ml-2"
                        >
                          Clear filters
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>
                        <div className="font-medium">{order.code}</div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{order.customer.name}</div>
                        <div className="text-sm text-gray-500">{order.customer.email}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8">
                            <Image
                              src={order.items[0].image ? `/uploads/products/${order.items[0].image}` : "/placeholder.svg"}
                              alt={order.items[0].name}
                              fill
                              className="object-cover rounded"
                              sizes="32px"
                            />
                          </div>
                          <span className="text-sm text-gray-500">
                            {order.items.length > 1 ? `+${order.items.length - 1} more` : order.items[0].name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={statusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₱{order.total.toLocaleString()}
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(order)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        <OrderDetailsDialog
          order={selectedOrder}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onStatusChange={handleStatusChange}
        />
      </div>
    </AdminLayout>
  )
}