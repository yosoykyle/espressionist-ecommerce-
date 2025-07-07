"use client"

import { authService } from "@/lib/api-service"
import { adminProductService } from "@/lib/api-service"
import type { Admin } from "@/lib/data-store"
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
import { EditShippingFeesDialog } from "@/components/edit-shipping-fees-dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PRODUCTS_PER_PAGE = 10

export function AdminProductsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [products, setProducts] = useState<Product[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showArchived, setShowArchived] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isShippingDialogOpen, setIsShippingDialogOpen] = useState(false)
  const [currentAdmin, setCurrentAdmin] = useState<Admin | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const isLoggedIn = authService.isLoggedIn()
    if (!isLoggedIn) {
      router.push("/admin")
    } else {
      setIsAuthenticated(true)
      authService.getCurrentAdmin().then((admin) => {
        setCurrentAdmin(admin)
      })
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

  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  )

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

  // RBAC helpers
  const canEditProduct = currentAdmin && ["SUPER_ADMIN", "MANAGER"].includes(currentAdmin.role)
  const canArchiveProduct = canEditProduct
  const canAddProduct = canEditProduct
  const canEditShippingFees = canEditProduct

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, showArchived])

  if (!isAuthenticated) {
    return <div>Loading...</div>
  }

  return (
    <AdminLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
            <p className="text-gray-600">Manage your café's product catalog</p>
          </div>
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Button
              variant="outline"
              onClick={() => setShowArchived(!showArchived)}
            >
              {showArchived ? (
                <>
                  <Eye className="h-4 w-4 mr-2" /> Show Active
                </>
              ) : (
                <>
                  <EyeOff className="h-4 w-4 mr-2" /> Show Archived
                </>
              )}
            </Button>
            {canAddProduct && (
              <Button
                onClick={() => {
                  if (!canAddProduct) {
                    toast({
                      title: "Permission Denied",
                      description: "You do not have permission to add products.",
                      variant: "destructive",
                    })
                    return
                  }
                  handleCreate()
                }}
                className="flex-1 sm:flex-none bg-brand-primary hover:bg-brand-primary/90"
                disabled={!canAddProduct}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            )}
            {canEditShippingFees && (
              <Button
                variant="outline"
                onClick={() => setIsShippingDialogOpen(true)}
                className="flex-1 sm:flex-none"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Shipping Fees
              </Button>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Image</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Category</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No products found.
                      {searchTerm && (
                        <Button
                          variant="link"
                          onClick={() => setSearchTerm("")}
                          className="ml-2"
                        >
                          Clear search
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>
                        <div className="relative aspect-square w-16 overflow-hidden rounded-lg">
                          <Image
                            src={product.image && !product.image.startsWith('http') && !product.image.startsWith('/placeholder') 
                              ? `/uploads/products/${product.image}` 
                              : (product.image || "/placeholder.svg")}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="64px"
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {product.archived
                            ? (product.description.length > 30
                                ? product.description.slice(0, 30) + "..."
                                : product.description)
                            : product.description}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="secondary">{product.category}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        ₱{product.price.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant={product.stock === 0 ? "destructive" : "outline"}>
                          {product.stock}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        <Badge variant={product.archived ? "destructive" : "default"}>
                          {product.archived ? "Archived" : "Active"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              if (!canEditProduct) {
                                toast({
                                  title: "Permission Denied",
                                  description: "You do not have permission to edit products.",
                                  variant: "destructive",
                                })
                                return
                              }
                              handleEdit(product)
                            }}
                            title="Edit product"
                            disabled={!canEditProduct}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => {
                              if (!canArchiveProduct) {
                                toast({
                                  title: "Permission Denied",
                                  description: "You do not have permission to archive or restore products.",
                                  variant: "destructive",
                                })
                                return
                              }
                              handleArchiveToggle(product)
                            }}
                            title={product.archived ? "Restore product" : "Archive product"}
                            disabled={!canArchiveProduct}
                          >
                            {product.archived ? (
                              <ArchiveRestore className="h-4 w-4" />
                            ) : (
                              <Archive className="h-4 w-4" />
                            )}
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

        {/* Pagination Controls: Only show if more than 10 products */}
        {filteredProducts.length > 10 && (
          <div className="flex items-center justify-center gap-4 mt-6">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              variant="outline"
              className="px-4 py-2 rounded-lg"
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-gray-700">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              variant="outline"
              className="px-4 py-2 rounded-lg"
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}

        <ProductFormDialog
          product={selectedProduct}
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSave={handleSave}
          products={products} // Pass all products as a prop for duplicate check
        />
        <EditShippingFeesDialog
          open={isShippingDialogOpen}
          onOpenChange={setIsShippingDialogOpen}
          canEdit={!!canEditShippingFees}
        />
      </div>
    </AdminLayout>
  )
}

export default AdminProductsPage
