/**
 * Product page functionality for Espressionist e-commerce site
 */

// Import utility functions
import { notifications, url } from "./utils.js"
import { addToCart } from "./storage.js"

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set up quantity controls
  setupQuantityControls()

  // Add event listener for Add to Cart button
  const addToCartBtn = document.querySelector(".add-to-cart-btn-large")
  if (addToCartBtn) {
    addToCartBtn.addEventListener("click", handleAddToCart)
  }

  // Simulate product loading
  simulateProductLoading()
})

/**
 * Simulate product loading with a loading state
 */
function simulateProductLoading() {
  // Create and show loading overlay
  const loadingOverlay = document.createElement("div")
  loadingOverlay.className = "loading-overlay"
  loadingOverlay.innerHTML = `
    <div class="loading-spinner"></div>
    <div class="loading-text">Loading product details...</div>
  `
  document.body.appendChild(loadingOverlay)

  // Simulate network delay (remove in production)
  setTimeout(() => {
    // Remove loading overlay
    loadingOverlay.classList.add("toast-exit")
    setTimeout(() => {
      loadingOverlay.remove()
    }, 300)
  }, 800)
}

/**
 * Set up quantity controls (increase/decrease buttons)
 */
function setupQuantityControls() {
  const quantityInput = document.getElementById("quantity")
  const decreaseBtn = document.querySelector(".quantity-btn:first-child")
  const increaseBtn = document.querySelector(".quantity-btn:last-child")

  if (quantityInput && decreaseBtn && increaseBtn) {
    // Add ARIA labels for accessibility
    decreaseBtn.setAttribute("aria-label", "Decrease quantity")
    increaseBtn.setAttribute("aria-label", "Increase quantity")
    quantityInput.setAttribute("aria-label", "Product quantity")

    decreaseBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value, 10)
      if (currentValue > 1) {
        quantityInput.value = currentValue - 1
        // Announce quantity change for screen readers
        announceQuantityChange(currentValue - 1)
      }
    })

    increaseBtn.addEventListener("click", () => {
      const currentValue = Number.parseInt(quantityInput.value, 10)
      quantityInput.value = currentValue + 1
      // Announce quantity change for screen readers
      announceQuantityChange(currentValue + 1)
    })

    // Ensure quantity is always at least 1
    quantityInput.addEventListener("change", () => {
      if (quantityInput.value < 1) {
        quantityInput.value = 1
        // Announce quantity change for screen readers
        announceQuantityChange(1)
      }
    })
  }
}

/**
 * Announce quantity change for screen readers
 * @param {number} quantity - The new quantity
 */
function announceQuantityChange(quantity) {
  // Create or get the live region
  let liveRegion = document.getElementById("quantity-live-region")
  if (!liveRegion) {
    liveRegion = document.createElement("div")
    liveRegion.id = "quantity-live-region"
    liveRegion.className = "sr-only"
    liveRegion.setAttribute("aria-live", "polite")
    document.body.appendChild(liveRegion)
  }

  // Update the live region
  liveRegion.textContent = `Quantity updated to ${quantity}`
}

/**
 * Handle Add to Cart button click
 */
function handleAddToCart() {
  // Get product details from the page
  const productName = document.querySelector(".product-title").textContent
  const productPrice = Number.parseFloat(document.querySelector(".product-price").textContent.replace("₱", "")) || 0
  const quantityValue = Number.parseInt(document.getElementById("quantity").value, 10) || 1

  // Show loading state on button
  const addToCartBtn = document.querySelector(".add-to-cart-btn-large")
  if (addToCartBtn) {
    addToCartBtn.classList.add("btn-loading")
    addToCartBtn.disabled = true
  }

  // Generate a unique ID for the product (in a real app, this would come from the database)
  const productId = url.getParameter("id") || `product-${Date.now()}`

  // Create product object
  const product = {
    id: productId,
    name: productName,
    price: productPrice,
  }

  // Simulate network delay (remove in production)
  setTimeout(() => {
    // Add to cart
    const success = addToCart(product, quantityValue)

    // Remove loading state
    if (addToCartBtn) {
      addToCartBtn.classList.remove("btn-loading")
      addToCartBtn.disabled = false
    }

    if (success) {
      // Show success message
      notifications.showAddToCartMessage(product, quantityValue)

      // Announce for screen readers
      announceAddedToCart(product.name, quantityValue)
    }
  }, 800)
}

/**
 * Announce added to cart for screen readers
 * @param {string} productName - The name of the product
 * @param {number} quantity - The quantity added
 */
function announceAddedToCart(productName, quantity) {
  // Create or get the live region
  let liveRegion = document.getElementById("cart-live-region")
  if (!liveRegion) {
    liveRegion = document.createElement("div")
    liveRegion.id = "cart-live-region"
    liveRegion.className = "sr-only"
    liveRegion.setAttribute("aria-live", "assertive")
    document.body.appendChild(liveRegion)
  }

  // Update the live region
  liveRegion.textContent = `Added ${quantity} ${quantity === 1 ? "item" : "items"} of ${productName} to your cart.`
}
