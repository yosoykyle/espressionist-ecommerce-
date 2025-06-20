"use client"

import { useState, useMemo, useEffect } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/cart-provider"
import { useToast } from "@/hooks/use-toast"
import { productService } from "@/lib/api-service"
import type { Product } from "@/lib/data-store"
import { ProductCard } from "@/components/product-card"
import { ScrollArea } from "@/components/ui/scroll-area"

const categories = ["All", "Coffee & Tea", "Art & Merch", "Gift Set", "Gear"]

export default function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { addItem } = useCart()
  const { toast } = useToast()

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setIsLoading(true)
        const data = await productService.getAllProducts()
        setProducts(data)
      } catch (error) {
        console.error("Failed to load products:", error)
        // Set empty array as fallback
        setProducts([])
        toast({
          title: "Error",
          description: "Failed to load products. Please refresh the page.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadProducts()
  }, [toast])

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  const handleAddToCart = (product: Product) => {
    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This item is currently out of stock.",
        variant: "destructive",
      })
      return
    }

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    })

    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    })
  }

  return (
    <div className="container max-w-[1600px] mx-auto px-4 space-y-6">
      {/* Header - More compact on mobile */}
      <div className="text-center space-y-2 pt-4 sm:pt-6 lg:pt-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">Our Products</h1>
        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Discover our carefully curated selection of premium coffee, artisanal merchandise, and unique gift sets.
        </p>
      </div>

      {/* Search and Filters - Sticky on scroll */}
      <div className="sticky top-16 z-50 w-full border-b bg-white">
        <div className="py-4 shadow-sm space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Categories */}
          <div className="overflow-x-auto scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
            <div className="flex space-x-2 justify-start md:justify-center min-w-full pb-2 snap-x snap-mandatory md:max-w-2xl md:mx-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap px-4 py-2 rounded-lg snap-start min-w-[110px] text-sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Loading State - More appealing spinner */}
      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-12 min-h-[300px]">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-full h-full border-4 border-brand-primary rounded-full animate-spin border-t-transparent"></div>
          </div>
          <p className="mt-4 text-gray-600 animate-pulse">Loading products...</p>
        </div>
      ) : (
        <>
          {/* Products Grid - Better responsive layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleAddToCart}
                onClick={setSelectedProduct}
              />
            ))}
          </div>

          {/* No Results - Better empty state */}
          {filteredProducts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 min-h-[300px] text-center">
              <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-lg font-medium text-gray-900 mb-2">No products found</p>
              <p className="text-sm text-gray-600 mb-4">Try adjusting your search or filters</p>
              <Button
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("All")
                }}
                variant="outline"
                size="sm"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  )
}