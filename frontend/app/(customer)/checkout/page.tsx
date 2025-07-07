"use client"

import React from "react"
import Image from "next/image"
import type { CartItem } from "@/components/cart-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"
import { orderService, productService, shippingFeeService } from "@/lib/api-service"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Minus, Plus, Trash2 } from "lucide-react"

export default function CheckoutPage() {
  const { items, total, clearCart, updateQuantity, removeItem } = useCart()
  const { toast } = useToast()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    notes: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [shippingFees, setShippingFees] = useState<Record<string, { baseFee: number; additionalFee: number }> | null>(null)
  const [shippingFeeBreakdown, setShippingFeeBreakdown] = useState<any[]>([])
  const [shippingFeeExplanation] = useState<string>(
    "Shipping fee is calculated as follows: For each order, the category with the highest base shipping fee is charged as the base. Each additional category in the order is charged its respective additional fee. Only the following categories are valid: Coffee & Tea, Art & Merch, Gift Set, Gear. Shipping fees are never negative and are set by the store admin."
  )

  // Fetch shipping fees on mount
  useEffect(() => {
    shippingFeeService.getAllShippingFees().then(setShippingFees).catch(() => setShippingFees(null))
  }, [])

  // Calculate shipping fee breakdown whenever items or shippingFees change
  useEffect(() => {
    if (!shippingFees || !items.length) {
      setShippingFeeBreakdown([])
      return
    }
    // Use product category label directly for lookup
    const categories = Array.from(new Set(items.map((item) => item.category)))
    const fees = categories
      .map((cat) => ({ category: cat, ...shippingFees[cat] }))
      .filter((f) => f.baseFee !== undefined)
      .sort((a, b) => b.baseFee - a.baseFee)
    const breakdown: any[] = []
    if (fees.length) {
      breakdown.push({ category: fees[0].category, type: 'base', fee: fees[0].baseFee })
      for (let i = 1; i < fees.length; i++) {
        breakdown.push({ category: fees[i].category, type: 'additional', fee: fees[i].additionalFee })
      }
    }
    setShippingFeeBreakdown(breakdown)
  }, [items, shippingFees])

  // Calculate shipping fee total
  const shippingFeeTotal = shippingFeeBreakdown.reduce((sum, fee) => sum + Number(fee.fee || 0), 0)
  // VAT is now only on the item subtotal (not including shipping fee)
  const vat = total * 0.12
  const totalWithVat = total + shippingFeeTotal + vat

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid"
    if (!formData.phone.trim()) newErrors.phone = "Phone is required"
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.postalCode.trim()) newErrors.postalCode = "Postal code is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStock = async () => {
    // Check if all items are still available and in stock
    for (const item of items) {
      const product = await productService.getProductById(item.id)
      if (!product) {
        toast({
          title: "Product Unavailable",
          description: `${item.name} is no longer available.`,
          variant: "destructive",
        })
        return false
      }
      if (product.archived) {
        toast({
          title: "Product Unavailable",
          description: `${item.name} has been discontinued.`,
          variant: "destructive",
        })
        return false
      }
      if (product.stock < item.quantity) {
        toast({
          title: "Insufficient Stock",
          description: `Only ${product.stock} units of ${item.name} are available.`,
          variant: "destructive",
        })
        return false
      }
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    try {
      const stockValid = await validateStock()
      if (!stockValid) {
        setIsLoading(false)
        return
      }

      // Generate order code
      const orderCode = `ESP-${Date.now().toString().slice(-6)}`

      // Create order object
      const orderData = {
  customerName: formData.name,
  customerEmail: formData.email,
  customerPhone: formData.phone,
  customerAddress: formData.address,
  customerCity: formData.city,
  customerPostalCode: formData.postalCode,
  customerNotes: formData.notes,
  items: items.map((item) => ({
  productId: Number(item.id),
  quantity: item.quantity,
})),
}

      // Place order
      const newOrder = await orderService.placeOrder(orderData)

      // Store order data for success page - ensure it's properly serialized
      try {
        localStorage.setItem("last-order", JSON.stringify(newOrder))
        console.log("Order stored for success page:", newOrder.code) // Debug log
      } catch (error) {
        console.error("Error storing order data:", error)
      }

      // Clear cart
      clearCart()

      // Show success message
      toast({
        title: "Order Placed Successfully!",
        description: `Your order ${newOrder.code} has been placed.`,
      })

      // Navigate to success page with a small delay to ensure localStorage is written
      setTimeout(() => {
        console.log("Navigating to success page") // Debug log
        router.push("/order-success")
      }, 200)
    } catch (error: any) {
      console.error("Error placing order:", error)
      if (error?.isStockConflict || (typeof error?.message === "string" && error.message.includes("conflict"))) {
        toast({
          title: "Stock Conflict",
          description: "The item stock changed while you were checking out. Please review your cart and try again.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Order Failed",
          description: "There was an error processing your order. Please try again.",
          variant: "destructive",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  // Move navigation out of render phase
  useEffect(() => {
    if (items.length === 0) {
      router.push("/cart")
    }
  }, [items.length, router])

  // Defensive check: ensure items is always an array before mapping
  if (!Array.isArray(items)) {
    console.error("Cart items is not an array!", items)
    return <div className="text-red-500">Cart error: items is not an array. Please clear your cart and try again.</div>
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Shipping Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className={errors.name ? "border-red-500" : ""}
                      required
                    />
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? "border-red-500" : ""}
                      required
                    />
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? "border-red-500" : ""}
                    required
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                </div>

                <div>
                  <Label htmlFor="address">Street Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className={errors.address ? "border-red-500" : ""}
                    required
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? "border-red-500" : ""}
                      required
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                  </div>

                  <div>
                    <Label htmlFor="postalCode">Postal Code *</Label>
                    <Input
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className={errors.postalCode ? "border-red-500" : ""}
                      required
                    />
                    {errors.postalCode && <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>}
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Any special instructions for your order..."
                    rows={3}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-brand-primary hover:bg-brand-primary/90"
                  size="lg"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing Order...
                    </>
                  ) : (
                    `Place Order - ₱${totalWithVat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => {
                  let imagePath = '/placeholder.svg';
                  if (typeof item.image === 'string' && item.image) {
                    imagePath = item.image.startsWith('http') || item.image.startsWith('/uploads/')
                      ? item.image
                      : `/uploads/products/${item.image}`;
                  }
                  return (
                    <div key={item.id} className="flex items-center space-x-3">
                      <Image
                        src={imagePath}
                        alt={item.name}
                        width={50}
                        height={50}
                        className="rounded object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="w-8 h-8"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.stock}
                            aria-label="Increase quantity"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 w-8 h-8"
                            onClick={() => removeItem(item.id)}
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm font-semibold">₱{(item.price * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                  );
                })}
              </div>

              <hr />

              {/* Totals */}
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₱{total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                {shippingFeeBreakdown.length > 0 && (
                  <>
                    <div className="flex justify-between">
                      <span>Shipping Fee</span>
                      <span>₱{shippingFeeTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    </div>
                    <details className="mt-2 group">
                      <summary className="font-semibold text-orange-700 mb-2 flex items-center cursor-pointer select-none">
                        <svg className="h-5 w-5 mr-2 text-orange-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6.293 7.293a1 1 0 011.414 0L10 9.586l2.293-2.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                        Shipping Fee Breakdown
                      </summary>
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mt-2">
                        <ul className="text-sm text-orange-800 ml-2 space-y-1 mb-2">
                          {shippingFeeBreakdown.map((fee, idx) => (
                            <li key={idx} className="flex items-center gap-2">
                              <span className={fee.type === 'base' ? 'font-bold text-orange-700' : 'text-orange-800'}>
                                {fee.type === 'base' ? 'Base category' : 'Additional category'}:
                              </span>
                              <span className="font-medium">{fee.category}</span>
                              <span className="text-orange-500">(₱{Number(fee.fee).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
                            </li>
                          ))}
                        </ul>
                        <div className="bg-orange-100 rounded p-2 text-xs text-orange-700 border border-orange-200">
                          Shipping fee is calculated as follows: For each order, the category with the highest base shipping fee is charged as the base. Each additional category in the order is charged its respective additional fee. Only the following categories are valid: Coffee & Tea, Art & Merch, Gift Set, Gear. Shipping fees are never negative and are set by the store admin.
                        </div>
                      </div>
                    </details>
                  </>
                )}
                <div className="flex justify-between">
                  <span>VAT (12%)</span>
                  <span>₱{vat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
                <hr />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span className="text-brand-primary">₱{totalWithVat.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}