"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { adminProductService } from "@/lib/api-service"

interface ProductFormDialogProps {
  product: Product | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: () => void
}

const categories = ["Coffee & Tea", "Art & Merch", "Gift Set", "Voucher"]

export function ProductFormDialog({ product, open, onOpenChange, onSave }: ProductFormDialogProps) {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    image: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        price: product.price.toString(),
        category: product.category,
        stock: product.stock.toString(),
        description: product.description,
        image: product.image,
      })
    } else {
      setFormData({
        name: "",
        price: "",
        category: "",
        stock: "",
        description: "",
        image: "",
      })
    }
    setErrors({})
  }, [product, open])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Name is required"
    if (!formData.price.trim()) newErrors.price = "Price is required"
    else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Price must be a positive number"
    }
    if (!formData.category) newErrors.category = "Category is required"
    if (!formData.stock.trim()) newErrors.stock = "Stock is required"
    else if (isNaN(Number(formData.stock)) || Number(formData.stock) < 0) {
      newErrors.stock = "Stock must be a non-negative number"
    }
    if (!formData.description.trim()) newErrors.description = "Description is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    const productData = {
      name: formData.name.trim(),
      price: Number(formData.price),
      category: formData.category,
      stock: Number(formData.stock),
      description: formData.description.trim(),
      image: formData.image || "/placeholder.svg?height=300&width=300",
      archived: false,
    }

    try {
      // Use API service for create or update
      await (product
        ? adminProductService.saveProduct({ ...productData, id: product.id })
        : adminProductService.saveProduct(productData))
      toast({
        title: product ? "Product Updated" : "Product Created",
        description: `${productData.name} has been ${product ? "updated" : "created"} successfully.`,
      })
      onSave()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to save product. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      // For now, we'll use a placeholder
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, image: event.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{product ? "Edit Product" : "Add New Product"}</DialogTitle>
        </DialogHeader>
        <p id="product-form-description" className="sr-only">
          {product ? "Edit the product details." : "Fill out the form to add a new product."}
        </p>
        <form onSubmit={handleSubmit} className="space-y-4" aria-describedby="product-form-description">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">Price (₱) *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleInputChange}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
            </div>

            <div>
              <Label htmlFor="stock">Stock *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                className={errors.stock ? "border-red-500" : ""}
              />
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              id="category"
              name="category"
              value={formData.category}
              onValueChange={(value) => {
                setFormData((prev) => ({ ...prev, category: value }))
                if (errors.category) {
                  setErrors((prev) => ({ ...prev, category: "" }))
                }
              }}
            >
              <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          <div>
            <Label htmlFor="image">Product Image</Label>
            <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
            <p className="text-sm text-gray-500 mt-1">Upload an image for the product</p>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-brand-primary hover:bg-brand-primary/90">
              {product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
