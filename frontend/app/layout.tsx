import type React from "react" // Import React types for type safety
import type { Metadata } from "next" // Import Next.js Metadata type for static metadata
import { Inter } from "next/font/google" // Import the Inter font from Google Fonts
import "./globals.css" // Import global CSS styles
import { CartProvider } from "@/components/cart-provider" // Import the CartProvider for global cart state management
import { Toaster } from "@/components/ui/toaster" // Import the Toaster component for global toast notifications

// Initialize the Inter font with the Latin subset
const inter = Inter({ subsets: ["latin"] })

// Define static metadata for the app (title, description, generator, icon)
export const metadata: Metadata = {
  title: "espressionist - coffee. canvas. culture.",
  description: "Modern café experience combining coffee, art, and culture in Santa Rosa, Philippines",
  generator: 'v0.dev',
  icons: {
    icon: '/espressionist.png', // Use your logo file here
  },
}

// Export the RootLayout component, which wraps all pages
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Render the HTML structure with language set to English
  return (
    <html lang="en">
      {/* Apply the Inter font to the body */}
      <body className={inter.className}>
        {/* Wrap children with CartProvider for cart context */}
        <CartProvider>
          {/* Render the children (page content) */}
          {children}
          {/* Render the Toaster for notifications */}
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
