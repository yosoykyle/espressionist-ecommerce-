"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-provider"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const { items } = useCart()

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)

  // Close menu on navigation
  useEffect(() => {
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    // Add event listener for route changes
    window.addEventListener('popstate', handleRouteChange)

    return () => {
      window.removeEventListener('popstate', handleRouteChange)
    }
  }, [])

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/products", label: "Products" },
    { href: "/order-status", label: "Order Status" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Mobile Menu Button - Left aligned */}
          <div className="flex items-center md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="p-3 -ml-3 hover:bg-gray-100 active:bg-gray-200 transition-colors"
                  aria-label="Toggle menu"
                >
                  {isOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className="w-[280px] sm:w-[350px] flex flex-col"
              >
                <SheetHeader className="border-b pb-4 mb-4">
                  <SheetTitle className="text-left text-2xl font-logo text-brand-primary">
                    espressionist
                  </SheetTitle>
                </SheetHeader>

                <nav className="flex-1">
                  <div className="space-y-1">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center h-[44px] px-4 text-base font-medium text-gray-700 hover:text-brand-primary hover:bg-gray-50 rounded-md transition-colors"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-logo text-brand-primary">espressionist</div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-brand-primary transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Cart */}
          <div className="flex items-center">
            <Link href="/cart" className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative h-[44px] w-[44px]"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-brand-primary hover:bg-brand-primary"
                  >
                    {totalItems}
                  </Badge>
                )}
                <span className="sr-only">Shopping cart</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
