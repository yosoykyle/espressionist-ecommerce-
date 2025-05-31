// Success page functionality for Espressionist e-commerce site

// Import utility functions
import { getUrlParameter } from "./utils.js"

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Extract order ID from URL using the utility function from utils.js
  const orderId = getUrlParameter("order")

  // All order display logic is now handled by Thymeleaf. No localStorage or DOM manipulation needed.
  // You may add UI enhancements here if required in the future.
})
