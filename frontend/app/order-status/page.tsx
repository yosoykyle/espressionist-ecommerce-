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
    } catch (error) {
      console.error("Error fetching order:", error)
      setOrderData(null)
      setError("An error occurred while fetching the order. Please try again.")
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
                <div className="flex space-x-2">
                  <Input
                    id="orderCode"
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    placeholder="Enter your order code (e.g., ESP-123456)"
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading} className="bg-brand-primary hover:bg-brand-primary/90">
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
                    <p className="font-semibold">{new Date(orderData.date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Amount</p>
                    <p className="font-semibold text-brand-primary">₱{orderData.total.toFixed(2)}</p>
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
                    {orderData.items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-3">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-gray-500">
                            ₱{item.price} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-semibold">₱{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}

                    <hr />

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal</span>
                        <span>₱{orderData.subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>VAT (12%)</span>
                        <span>₱{orderData.vat.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Total</span>
                        <span className="text-brand-primary">₱{orderData.total.toFixed(2)}</span>
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
                    <div>
                      <p className="font-medium">{orderData.customer.name}</p>
                      <p className="text-sm text-gray-600">{orderData.customer.email}</p>
                      <p className="text-sm text-gray-600">{orderData.customer.phone}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">{orderData.customer.address}</p>
                      <p className="text-sm text-gray-600">
                        {orderData.customer.city}, {orderData.customer.postalCode}
                      </p>
                    </div>

                    {orderData.customer.notes && (
                      <div>
                        <p className="font-medium text-sm">Order Notes:</p>
                        <p className="text-sm text-gray-600">{orderData.customer.notes}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
