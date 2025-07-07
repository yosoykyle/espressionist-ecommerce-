"use client"

import type React from "react"
import type { Product } from "@/lib/data-store"

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
  products: Product[] // Add products prop for duplicate check
}

const categories = ["Coffee & Tea", "Art & Merch", "Gift Set", "Gear"]

export function ProductFormDialog({ product, open, onOpenChange, onSave, products }: ProductFormDialogProps) {
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
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const [duplicateError, setDuplicateError] = useState<string>("")

  useEffect(() => {
    if (open) {
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
      setSelectedFile(null)
      setImagePreview(null)
      setErrors({})
      setHasChanges(false)
    }
  }, [product, open])

  // Helper to check if form has changes
  useEffect(() => {
    if (!product) {
      setHasChanges(
        formData.name.trim() !== "" ||
        formData.price.trim() !== "" ||
        formData.category !== "" ||
        formData.stock.trim() !== "" ||
        formData.description.trim() !== "" ||
        selectedFile !== null
      )
      return
    }
    const changed =
      formData.name.trim() !== (product.name || "") ||
      Number(formData.price) !== Number(product.price) ||
      (formData.category || "") !== (product.category || "") ||
      Number(formData.stock) !== Number(product.stock) ||
      formData.description.trim() !== (product.description || "") ||
      (selectedFile !== null)
    setHasChanges(changed)
  }, [formData, selectedFile, product])

  // Duplicate check effect
  useEffect(() => {
    const name = formData.name.trim().toLowerCase();
    const category = formData.category.trim().toLowerCase();
    if (!name || !category) {
      setDuplicateError("");
      return;
    }
    const isDuplicate = products.some((p) => {
      if (product && p.id === product.id) return false; // ignore self on update
      return (
        p.name.trim().toLowerCase() === name &&
        p.category.trim().toLowerCase() === category
      );
    });
    if (isDuplicate) {
      setDuplicateError(
        `A product named "${formData.name.trim()}" already exists in category "${formData.category.trim()}".`
      );
    } else {
      setDuplicateError("");
    }
  }, [formData.name, formData.category, products, product])

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
    e.preventDefault();
    if (duplicateError) return; // Prevent submit if duplicate
    if (!validateForm()) return;
    setUploading(true)
    let imageFilename = formData.image
    try {
      // If a file is selected, upload it first
      if (selectedFile) {
        if (product) {
          // Editing existing product, upload with productId
          imageFilename = await adminProductService.uploadProductImage(product.id, selectedFile)
        } else {
          // Creating new product: create product first, then upload image
          const tempProductData = {
            name: formData.name.trim(),
            price: Number(formData.price),
            category: formData.category,
            stock: Number(formData.stock),
            description: formData.description.trim(),
            image: '',
            archived: false,
          }
          const created = await adminProductService.saveProduct(tempProductData)
          imageFilename = await adminProductService.uploadProductImage(created.id, selectedFile)
          // Update product with image filename
          await adminProductService.saveProduct({ ...created, image: imageFilename })
          toast({
            title: "Product Created",
            description: `${tempProductData.name} has been created successfully.`,
          })
          onSave()
          setUploading(false)
          return
        }
      }
      // Save or update product with image filename
      const productData: any = { // Use 'any' for flexibility or define a more specific type
        name: formData.name.trim(),
        price: Number(formData.price),
        category: formData.category,
        stock: Number(formData.stock),
        description: formData.description.trim(),
        archived: false,
      }

      // Only include the image in the payload if a new file was selected and uploaded,
      // or if it's a new product and an image was uploaded.
      // For existing products, if no new file is selected, 'imageFilename' will hold the original image path from formData,
      // and we should not send it back unless it changed (i.e., selectedFile was present).
      if (selectedFile) {
        productData.image = imageFilename;
      } else if (!product) { // New product without an image explicitly selected
        productData.image = "/placeholder.svg?height=300&width=300";
      }
      // If 'selectedFile' is null and it's an existing product, 'image' field is omitted from productData.
      // The backend should interpret this as "do not update the image".

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
    } finally {
      setUploading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    // Prevent negative stock values
    if (name === "stock") {
      // Only allow numbers >= 0
      const numericValue = value.replace(/[^\d]/g, "");
      setFormData((prev) => ({ ...prev, [name]: numericValue }));
      if (errors[name]) {
        setErrors((prev) => ({ ...prev, [name]: "" }))
      }
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(file)
      // Do NOT set formData.image here!
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full p-0 border-none shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-brand-primary/5 px-8 py-6 border-b">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-brand-primary">
              {product ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-600 mt-1">
            {product ? "Edit the product details." : "Fill out the form to add a new product."}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-6 bg-white" aria-describedby="product-form-description">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className={errors.name || duplicateError ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              {duplicateError && <p className="text-red-500 text-sm mt-1">{duplicateError}</p>}
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
                  min="0"
                  inputMode="numeric"
                  value={formData.stock}
                  onChange={handleInputChange}
                  className={errors.stock ? "border-red-500" : ""}
                />
                {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="category">Category *</Label>
              <Select
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            <div>
              <Label htmlFor="image">Product Image</Label>
              <Input id="image" name="image" type="file" accept="image/*" onChange={handleFileChange} />
              <p className="text-sm text-gray-500 mt-1">Upload an image for the product</p>
            </div>
            {(imagePreview || formData.image) && (
              <div className="flex items-center gap-2">
                <img
                  src={(() => {
                    if (imagePreview) {
                      return imagePreview;
                    } else if (formData.image && (formData.image.startsWith('http') || formData.image.startsWith('/'))) {
                      return formData.image;
                    } else if (formData.image) {
                      return `/uploads/products/${formData.image}`;
                    } else {
                      return "/placeholder.svg";
                    }
                  })()}
                  alt="Preview"
                  className="h-24 w-24 object-cover rounded border"
                />
              </div>
            )}
          </div>
          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-brand-primary hover:bg-brand-primary/90" disabled={uploading || !!duplicateError || (product ? !hasChanges : false)}>
              {uploading ? "Uploading..." : product ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
