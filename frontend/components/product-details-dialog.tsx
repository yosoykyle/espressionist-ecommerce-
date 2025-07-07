"use client"

import Image from "next/image"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/data-store"
import { useRouter } from "next/navigation"
import { Plus } from "lucide-react"
import { useCart } from "@/components/cart-provider"

interface ProductDetailsDialogProps {
  product: Product | null
  open: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export function ProductDetailsDialog({ product, open, onClose, onAddToCart }: ProductDetailsDialogProps) {
  const router = useRouter();
  const { clearCart, addItem, items } = useCart();
  if (!product) return null
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className="w-full max-w-lg sm:max-w-xl md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-0 overflow-hidden m-0 sm:m-0 rounded-none sm:rounded-2xl flex flex-col max-h-screen h-screen sm:h-auto"
      >
        {/* Floating X button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="fixed top-4 right-4 z-50 bg-white/80 hover:bg-white shadow-lg rounded-full p-2 border border-gray-200 backdrop-blur-md transition sm:absolute sm:top-4 sm:right-4"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <div className="sticky top-0 z-20 bg-white">
          <DialogHeader className="p-4 pb-0">
            <DialogTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{product.name}</DialogTitle>
          </DialogHeader>
        </div>
        <div className="flex flex-col lg:flex-row gap-4 p-4 flex-1 overflow-y-auto">
          <div className="w-full lg:w-1/2 xl:w-[480px] aspect-square bg-gray-100 rounded-none sm:rounded-2xl overflow-hidden relative mx-0">
            <Image
              src={
                product.image && !product.image.startsWith("http") && !product.image.startsWith("/placeholder")
                  ? `/uploads/products/${product.image}`
                  : (product.image || "/placeholder.svg")
              }
              alt={product.name}
              fill
              className="object-contain"
              sizes="(min-width: 1280px) 480px, (min-width: 1024px) 384px, (min-width: 768px) 384px, 80vw"
              priority
            />
          </div>
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <Badge variant="secondary" className="w-fit text-xs px-2 py-0.5 mb-1">{product.category}</Badge>
            <div className="text-lg sm:text-xl md:text-2xl font-bold text-[#f97316]">₱{product.price.toLocaleString()}</div>
            <div className="text-gray-900 text-base sm:text-lg whitespace-pre-line overflow-y-auto max-h-40 md:max-h-64 pr-2 break-words">
              {product.description}
            </div>
            <div className="text-sm text-gray-500 mt-2">In Stock: {product.stock}</div>
          </div>
        </div>
        <div className="sticky bottom-0 z-20 flex gap-2 p-4 flex-row bg-white border-t border-gray-200">
          <Button
            className="flex-1 bg-brand-primary hover:bg-brand-primary/90 h-10 text-sm gap-2 rounded-xl"
            onClick={async () => {
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
            }}
            disabled={product.stock === 0}
            type="button"
          >
            Buy Now
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-10 w-10 rounded-xl border-gray-300"
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            aria-label="Add to Cart"
            title="Add to Cart"
            type="button"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
