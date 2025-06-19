"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/data-store"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onClick: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product)
  }

  const handleClick = () => {
    onClick(product)
  }

  return (
    <Card
      className="max-w-sm mx-auto w-full flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Image Section */}
      <div className="relative w-full h-48 sm:h-56 bg-gray-100 rounded-t-2xl overflow-hidden">
        <Image
          src={
            product.image && !product.image.startsWith("http") && !product.image.startsWith("/placeholder")
              ? `/uploads/products/${product.image}`
              : (product.image || "/placeholder.svg")
          }
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          priority
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Badge variant="destructive" className="text-xs px-2 py-0.5 bg-red-500/90">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="flex-1 flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {product.category}
          </Badge>
          <span className="text-base sm:text-lg font-bold text-[#f97316] whitespace-nowrap">
            ₱{product.price.toLocaleString()}
          </span>
        </div>
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 leading-tight line-clamp-2 sm:line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 sm:line-clamp-3">
          {product.description}
        </p>
        <div className="text-xs sm:text-sm text-gray-500">
          In Stock: {product.stock}
        </div>
      </CardContent>

      {/* Action Section */}
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full bg-[#f97316] hover:bg-[#ea680f] h-10 sm:h-11 text-sm sm:text-base gap-2 rounded-xl"
          onClick={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Plus className="h-4 w-4" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  )
}