"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Search, Plus, Edit, Archive, ArchiveRestore, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminLayout } from "@/components/admin-layout"
import { useToast } from "@/hooks/use-toast"
import { productStore, initializeData, type Product } from "@/lib/data-store"
import { ProductFormDialog } from "@/components/product-form-dialog"
import { authService } from "@/lib/api-service"
import { adminProductService } from "@/lib/api-service"

export default function AdminProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showArchived, setShowArchived] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const isLoggedIn = authService.isLoggedIn()
    if (!isLoggedIn) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      initializeData()
      loadProducts()
    }
  }, [router])

  const loadProducts = async () => {
    const allProducts = await productStore.getAll()
    setProducts(allProducts)
  }

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesArchived = showArchived ? product.archived : !product.archived
    return matchesSearch && matchesArchived
  })

  const handleArchiveToggle = async (product: Product) => {
    try {
      await adminProductService.archiveProduct(product.id, !product.archived)
      await loadProducts()
      toast({
        title: product.archived ? "Product Restored" : "Product Archived",
        description: `${product.name} has been ${product.archived ? "restored" : "archived"}.`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error?.message || "Failed to update product archive status.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsDialogOpen(true)
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    loadProducts()
    setIsDialogOpen(false)
    setSelectedProduct(null)
  }

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your café's product catalog</p>
          </div>
          <Button onClick={handleCreate} className="bg-brand-primary hover:bg-brand-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowArchived(!showArchived)}
                className="flex items-center gap-2"
              >
                {showArchived ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                {showArchived ? "Hide Archived" : "Show Archived"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className={`${product.archived ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="relative mb-4">
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                  {product.archived && (
                    <Badge variant="secondary" className="absolute top-2 right-2">
                      Archived
                    </Badge>
                  )}
                  {product.stock === 0 && !product.archived && (
                    <Badge variant="destructive" className="absolute top-2 right-2">
                      Out of Stock
                    </Badge>
                  )}
                </div>

                <div className="space-y-2">
                  <Badge variant="outline" className="text-xs">
                    {product.category}
                  </Badge>
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-brand-primary">₱{product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(product)} className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleArchiveToggle(product)} className="flex-1">
                    {product.archived ? (
                      <>
                        <ArchiveRestore className="h-4 w-4 mr-1" />
                        Restore
                      </>
                    ) : (
                      <>
                        <Archive className="h-4 w-4 mr-1" />
                        Archive
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              {showArchived ? "No archived products found." : "No products found."}
            </p>
          </div>
        )}

        <ProductFormDialog
          product={selectedProduct}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSave}
        />
      </div>
    </AdminLayout>
  )
}
