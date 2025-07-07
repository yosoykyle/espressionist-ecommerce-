"use client"

import Image from "next/image"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/lib/data-store"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart-provider"

interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onClick: (product: Product) => void
}

export function ProductCard({ product, onAddToCart, onClick }: ProductCardProps) {
  const router = useRouter();
  const { clearCart, addItem, items } = useCart();
  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAddToCart(product)
  }

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const existingItem = items.find((item) => item.id === product.id);
    await clearCart();
    await addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
      category: product.category,
    });
    if (existingItem) {
      for (let i = 1; i < existingItem.quantity; i++) {
        await addItem({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          stock: product.stock,
          category: product.category,
        });
      }
    }
    router.push("/checkout");
  }

  const handleClick = () => {
    onClick(product)
  }

  return (
    <Card
      className="max-w-sm w-full flex flex-col rounded-2xl border border-gray-200 bg-white shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
      onClick={handleClick}
    >
      {/* Image Section - Reduced height for compactness */}
      <div className="relative aspect-square w-full bg-gray-100 rounded-t-2xl overflow-hidden">
        <Image
          src={
            product.image && !product.image.startsWith("http") && !product.image.startsWith("/placeholder")
              ? `/uploads/products/${product.image}`
              : (product.image || "/placeholder.svg")
          }
          alt={product.name}
          fill
          className="object-contain transition-transform duration-300" // Removed p-2 for full image display
          sizes="(min-width: 375px) 50vw, (min-width: 640px) 33vw, (min-width: 1024px) 25vw, 20vw"
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
      {/* Content Section - Reduced padding and gaps */}
      <CardContent className="flex-1 flex flex-col gap-2 min-[375px]:gap-3 p-3 min-[375px]:p-4">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            {product.category}
          </Badge>
          <span className="text-sm min-[375px]:text-base font-bold text-[#f97316] whitespace-nowrap">
            ₱{product.price.toLocaleString()}
          </span>
        </div>
        <h3 className="font-semibold text-sm min-[375px]:text-base text-gray-900 leading-tight line-clamp-2">
          {product.name}
        </h3>
        <p className="text-xs min-[375px]:text-sm text-gray-600 line-clamp-2">
          {product.description}
        </p>
        <div className="text-xs min-[375px]:text-sm text-gray-500">
          In Stock: {product.stock}
        </div>
      </CardContent>

      {/* Action Section - Reduced padding and button height */}
      <CardFooter className="p-3 pt-0 min-[375px]:p-4 min-[375px]:pt-0">
        <div className="flex gap-2 w-full flex-row">
          <Button
            className="flex-1 bg-brand-primary hover:bg-brand-primary/90 h-10 text-sm gap-2 rounded-xl"
            onClick={handleBuyNow}
            disabled={product.stock === 0}
            type="button"
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl border-gray-300"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            aria-label="Add to Cart"
            title="Add to Cart"
            type="button"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}