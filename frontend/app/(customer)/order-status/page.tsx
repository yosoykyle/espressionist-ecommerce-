"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { orderService } from "@/lib/api-service"
import type { Order } from "@/lib/data-store"

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Shipped: "bg-purple-100 text-purple-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
}

export default function OrderStatusPage() {
  const [orderCode, setOrderCode] = useState("")
  const [orderData, setOrderData] = useState<Order | null>(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!orderCode.trim()) {
      setError("Please enter an order code")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      const order = await orderService.getOrderStatus(orderCode.toUpperCase())

      if (order) {
        setOrderData(order)
        setError("")
      } else {
        setOrderData(null)
        setError("Order not found. Please check your order code and try again.")
      }
    } catch (error: any) {
      setOrderData(null)
      let errorMsg = ''
      if (typeof error === 'string') {
        errorMsg = error
      } else if (error instanceof Error) {
        errorMsg = error.message
      } else if (error && typeof error === 'object' && 'message' in error) {
        errorMsg = (error as any).message
      } else if (error && typeof error === 'object' && 'statusText' in error) {
        errorMsg = (error as any).statusText
      }
      if (errorMsg.includes('Order not found')) {
        setError("Order not found. Please check your order code and try again.")
        // Do not log expected 'Order not found' errors
      } else {
        setError("An error occurred while fetching the order. Please try again.")
        console.error("Error fetching order:", error)
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Track Your Order</h1>
          <p className="text-lg text-gray-600">Enter your order code to check the status of your order.</p>
        </div>

        {/* Search Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Order Lookup</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSearch} className="space-y-4">
              <div>
                <Label htmlFor="orderCode">Order Code</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    id="orderCode"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    placeholder="Enter your order code (e.g., ESP-123456)"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="bg-brand-primary hover:bg-brand-primary/90 w-full sm:w-auto"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    {isLoading ? "Searching..." : "Search"}
                  </Button>
                </div>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
            </form>
          </CardContent>
        </Card>

        {/* Order Results */}
        {orderData && (
          <>
            {/* Order Status Info Bento Box */}
            {(() => {
              const status = (orderData.status || "").toLowerCase();
              if (status === "pending") {
                return (
                  <div className="rounded-lg bg-yellow-50 border border-yellow-200 p-4 mb-4 flex items-center gap-3 text-sm text-yellow-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                    <span>Your order is pending. To request a cancellation, please email us at <a href="mailto:espressionist.ph@gmail.com" className="underline ml-1 text-yellow-900 hover:text-brand-primary">espressionist.ph@gmail.com</a>. We'll assist you as soon as possible.</span>
                  </div>
                );
              } else if (status === "processing") {
                return (
                  <div className="rounded-lg bg-blue-50 border border-blue-200 p-4 mb-4 flex items-center gap-3 text-sm text-blue-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                    <span>Your order is now being prepared. We'll notify you once it's shipped.</span>
                  </div>
                );
              } else if (status === "shipped") {
                return (
                  <div className="rounded-lg bg-purple-50 border border-purple-200 p-4 mb-4 flex items-center gap-3 text-sm text-purple-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                    <span>Your order is on the way! You’ll receive it soon.</span>
                  </div>
                );
              } else if (status === "delivered") {
                return (
                  <div className="rounded-lg bg-green-50 border border-green-200 p-4 mb-4 flex items-center gap-3 text-sm text-green-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                    <span>Your order has been delivered. Thank you for supporting Espressionist!</span>
                  </div>
                );
              } else if (status === "cancelled") {
                return (
                  <div className="rounded-lg bg-red-50 border border-red-200 p-4 mb-4 flex items-center gap-3 text-sm text-red-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 20a8 8 0 100-16 8 8 0 000 16z" /></svg>
                    <span>Your order has been cancelled. If you have any questions, feel free to contact us at <a href="mailto:espressionist.ph@gmail.com" className="underline ml-1 text-red-900 hover:text-brand-primary">espressionist.ph@gmail.com</a>.</span>
                  </div>
                );
              } else {
                return null;
              }
            })()}

            <div className="space-y-6">
              {/* Order Header */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Order Details</CardTitle>
                    <Badge className={statusColors[orderData.status as keyof typeof statusColors]}>
                      {orderData.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order Code</p>
                      <p className="font-semibold">{orderData.code}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-semibold">{new Date(orderData.date).toLocaleDateString('en-US')}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Total Amount</p>
                      <p className="font-semibold text-brand-primary">₱{orderData.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Order Items */}
                <Card>
                  <CardHeader>
                    <CardTitle>Items Ordered</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.isArray(orderData.items) && orderData.items.length > 0 ? (
                        orderData.items.map((item, idx) => (
                          <div key={item?.id || idx} className="flex items-center space-x-3">
                            <Image
                              src={item?.image ? `/uploads/products/${item.image}` : "/placeholder.svg"}
                              alt={item?.name || "Product image"}
                              width={50}
                              height={50}
                              className="rounded object-cover"
                            />
                            <div className="flex-1">
                              <p className="font-medium">{item?.name || "Unnamed Product"}</p>
                              <p className="text-sm text-gray-500">
                                ₱{item?.price ?? 0} × {item?.quantity ?? 0}
                              </p>
                            </div>
                            <p className="font-semibold">₱{((item?.price ?? 0) * (item?.quantity ?? 0)).toFixed(2)}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No items found in this order.</p>
                      )}

                      <hr />

                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>₱{orderData.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>VAT (12%)</span>
                          <span>₱{orderData.vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div className="flex justify-between font-semibold text-lg">
                          <span>Total</span>
                          <span className="text-brand-primary">₱{orderData.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shipping Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {orderData.customer ? (
                        <>
                          <div>
                            <p className="font-medium">{orderData.customer.name || "No name provided"}</p>
                            <p className="text-sm text-gray-600">{orderData.customer.email || "No email provided"}</p>
                            <p className="text-sm text-gray-600">{orderData.customer.phone || "No phone provided"}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">{orderData.customer.address || "No address provided"}</p>
                            <p className="text-sm text-gray-600">{orderData.customer.city || "No city"}, {orderData.customer.postalCode || "No postal code"}</p>
                          </div>
                          {orderData.customer.notes && (
                            <div>
                              <p className="font-medium text-sm">Order Notes:</p>
                              <p className="text-sm text-gray-600">{orderData.customer.notes}</p>
                            </div>
                          )}
                        </>
                      ) : (
                        <p className="text-sm text-red-600">Customer information is missing.</p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}