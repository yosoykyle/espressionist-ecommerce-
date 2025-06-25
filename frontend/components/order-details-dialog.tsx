"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order } from "@/lib/data-store"
import { useToast } from "@/hooks/use-toast"

interface OrderDetailsDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onStatusChange: (orderId: string, status: Order["status"]) => void
}

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
}

export function OrderDetailsDialog({ order, open, onOpenChange, onStatusChange }: OrderDetailsDialogProps) {
  const { toast } = useToast();
  if (!order) return null

  async function handleStatusChangeWithReload(value: string) {
    if (!order) return;
    try {
      const { adminOrderService } = await import("@/lib/api-service");
      // Update status first
      await adminOrderService.updateOrderStatus(order.id, value as Order["status"]);
      // Archive or unarchive based on new status
      if (["Cancelled", "Delivered"].includes(value)) {
        await adminOrderService.archiveOrder(order.id, true);
      } else {
        await adminOrderService.archiveOrder(order.id, false);
      }
      // After all changes, reload parent
      onStatusChange(order.id, value as Order["status"]);
      // Close the dialog
      onOpenChange(false);
    } catch (error: any) {
      if (error?.message?.includes("Record has changed since last read")) {
        toast({
          title: "Order Updated Elsewhere",
          description: "Order was updated by another admin. Reloading latest data...",
          variant: "destructive",
        });
        // Optionally, reload the page or close dialog
        window.location.reload();
      } else {
        toast({
          title: "Error",
          description: error?.message || "Failed to update order.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-4xl xl:max-w-5xl 2xl:max-w-6xl p-0 overflow-hidden m-0 rounded-none sm:rounded-2xl flex flex-col max-h-screen h-screen sm:h-auto">
        {/* Floating X button */}
        <button
          onClick={() => onOpenChange(false)}
          aria-label="Close"
          className="fixed top-4 right-4 z-50 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 border border-gray-200 backdrop-blur-md transition sm:absolute sm:top-4 sm:right-4"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <DialogHeader className="p-6 pb-0 bg-white sticky top-0 z-20 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="flex items-center gap-4">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-900">Order Details - {order.code}</DialogTitle>
              <Badge className={statusColors[order.status]}>{order.status}</Badge>
            </div>
          </div>
        </DialogHeader>
        <div className="flex flex-col lg:flex-row gap-8 p-6 flex-1 overflow-y-auto bg-gray-50">
          {/* Left: Customer & Order Info */}
          <div className="w-full lg:w-1/2 xl:w-[480px] space-y-6">
            {/* Order Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-semibold">{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Amount</p>
                <p className="font-semibold text-brand-primary">
                  ₱{order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
            </div>
            {/* Customer Info */}
            <div>
              <h3 className="font-semibold mb-3">Customer Information</h3>
              <div className="bg-white p-4 rounded-lg shadow space-y-2">
                <p><span className="font-medium">Name:</span> {order.customer.name}</p>
                <p><span className="font-medium">Email:</span> {order.customer.email}</p>
                <p><span className="font-medium">Phone:</span> {order.customer.phone}</p>
                <p><span className="font-medium">Address:</span> {order.customer.address}</p>
                <p><span className="font-medium">City:</span> {order.customer.city}, {order.customer.postalCode}</p>
                {order.customer.notes && (
                  <p><span className="font-medium">Notes:</span> {order.customer.notes}</p>
                )}
              </div>
            </div>
            {/* Order Summary */}
            <div className="bg-white p-4 rounded-lg shadow">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₱{order.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (12%)</span>
                  <span>₱{order.vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-brand-primary">₱{order.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>
          {/* Right: Order Items & Status */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Order Items */}
            <div>
              <h3 className="font-semibold mb-3">Order Items</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow">
                    <Image
                      src={item.image ? `/uploads/products/${item.image}` : "/placeholder.svg"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        ₱{item.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} × {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold">
                      ₱{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            {/* Status Update */}
            <div className="flex items-center justify-between pt-4 border-t bg-white p-4 rounded-lg shadow">
              <span className="font-medium">Update Status:</span>
              <Select
                value={order.status}
                onValueChange={handleStatusChangeWithReload}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
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
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
