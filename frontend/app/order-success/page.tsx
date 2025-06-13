"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import type { Order } from "@/lib/data-store"

export default function OrderSuccessPage() {
  const [orderData, setOrderData] = useState<Order | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    console.log("Loading order data from localStorage") // Debug log

    try {
      const savedOrder = localStorage.getItem("last-order")
      console.log("Raw saved order data:", savedOrder) // Debug log

      if (savedOrder) {
        const order = JSON.parse(savedOrder) as Order
        console.log("Parsed order:", order) // Debug log
        setOrderData(order)
      } else {
        console.log("No saved order found") // Debug log
        // Redirect to home if no order data
        setTimeout(() => {
          window.location.href = "/"
        }, 3000)
      }
    } catch (error) {
      console.error("Error loading order data:", error)
      // Redirect to home on error
      setTimeout(() => {
        window.location.href = "/"
      }, 3000)
    }
  }, [])

  const copyOrderCode = () => {
    if (orderData) {
      navigator.clipboard.writeText(orderData.code)
      toast({
        title: "Copied!",
        description: "Order code copied to clipboard.",
      })
    }
  }

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading order details...</p>
          <p className="text-sm text-gray-500 mt-2">
            If this takes too long, you may have been redirected here by mistake.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-lg text-gray-600">Thank you for your order. We'll process it shortly.</p>
        </div>

        {/* Order Code */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Order Code
              <Button variant="outline" size="sm" onClick={copyOrderCode} className="ml-2">
                <Copy className="h-4 w-4 mr-1" />
                Copy
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-2xl font-mono font-bold text-brand-primary text-center">{orderData.code}</p>
            </div>
            <p className="text-sm text-gray-600 mt-2 text-center">Please save this code to track your order status.</p>
          </CardContent>
        </Card>

        {/* Order Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Items */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
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

          {/* Shipping Info */}
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

                <div>
                  <p className="text-sm text-gray-500">Order Date: {new Date(orderData.date).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <Button asChild className="bg-brand-primary hover:bg-brand-primary/90">
            <Link href="/order-status">Track Your Order</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/products">Continue Shopping</Link>
          </Button>
        </div>

        {/* Note about backend-powered order details */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            NOTE: This page currently loads order data from localStorage after checkout.
            <br />
            For full backend persistence, consider fetching order details from the backend using the order code.
          </p>
        </div>
      </div>
    </div>
  )
}
