"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Eye } from "lucide-react"
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
    const updated = await adminOrderService.updateOrderStatus(orderId, newStatus)
    if (updated) {
      loadOrders()
      toast({
        title: "Order Updated",
        description: `Order status changed to ${newStatus}.`,
      })
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-600">Manage customer orders and track deliveries</p>
          </div>
        </div>
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders by code, customer name, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select
                value={statusFilter}
                onValueChange={(value) => {
                  // If not showing archived and user selects Delivered or Cancelled, auto-enable showArchived
                  if (!showArchived && ["Delivered", "Cancelled"].includes(value)) {
                    setShowArchived(true)
                  }
                  setStatusFilter(value)
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {showArchived ? (
                    <>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="All">All Status</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Processing">Processing</SelectItem>
                      <SelectItem value="Shipped">Shipped</SelectItem>
                      <SelectItem value="Delivered">Delivered</SelectItem>
                      <SelectItem value="Cancelled">Cancelled</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setShowArchived(!showArchived)}>
                {showArchived ? "Hide Archived" : "Show Archived"}
              </Button>
            </div>
          </CardContent>
        </Card>
        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div>
                      <h3 className="font-semibold text-lg">{order.code}</h3>
                      <p className="text-sm text-gray-600">
                        {order.customer.name} • {order.customer.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString()} • ₱{order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={statusColors[order.status]}>{order.status}</Badge>
                    {order.archived && <Badge variant="secondary">Archived</Badge>}
                  </div>
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  {order.items.slice(0, 3).map((item) => (
                    <Image
                      key={item.id}
                      src={item.image ? `/uploads/products/${item.image}` : "/placeholder.svg"}
                      alt={item.name || "Product image"}
                      width={40}
                      height={40}
                      className="rounded object-cover"
                    />
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center text-sm text-gray-600">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                      <Eye className="h-4 w-4 mr-1" />
                      View Details
                    </Button>
                  </div>
                  {!order.archived && (
                    <div className="flex items-center space-x-2">
                      <label htmlFor={`status-${order.id}`} className="text-sm font-medium text-gray-700">
                        Status:
                      </label>
                      <Select
                        value={order.status}
                        onValueChange={async (value) => {
                          if (value !== order.status) {
                            await handleStatusChange(order.id, value as Order["status"]);
                            if (["Delivered", "Cancelled"].includes(value)) {
                              await adminOrderService.archiveOrder(order.id, true);
                              await loadOrders();
                              toast({
                                title: "Order Archived",
                                description: `Order ${order.code} has been archived due to status '${value}'.`,
                              });
                            } else {
                              await loadOrders();
                            }
                          }
                        }}
                      >
                        <SelectTrigger className="w-32" id={`status-${order.id}`}>
                          <SelectValue value={order.status}>{order.status}</SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Processing">Processing</SelectItem>
                          <SelectItem value="Shipped">Shipped</SelectItem>
                          <SelectItem value="Delivered">Delivered</SelectItem>
                          <SelectItem value="Cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">{showArchived ? "No archived orders found." : "No orders found."}</p>
          </div>
        )}
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