// Products page functionality for Espressionist e-commerce site

// Declare addToCart
const addToCart = async (product, quantity) => {
  try {
    const response = await fetch('/api/cart/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId: product.id, quantity })
    });
    
    if (!response.ok) {
      throw new Error('Failed to add to cart');
    }
    
    // Show success message
    notifications.showToast(
      'Product added to cart!',
      'View Cart',
      '/cart'
    );
    
    return true;
  } catch (error) {
    console.error('Error adding to cart:', error);
    notifications.showToast('Error adding to cart. Please try again.', null, null, 5000);
    return false;
  }
};

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Set up category tabs
  setupCategoryTabs()

  // Add event listeners to Add to Cart buttons
  setupAddToCartButtons()
})

/**
 * Set up category tabs functionality
 */
function setupCategoryTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Check if this is the Book a Spot button
      if (button.textContent.trim() === "Book a Spot") {
        // Navigate to the about section on index.html
        window.location.href = "index.html#about"
        return
      }

      // Remove active class from all tabs
      tabButtons.forEach((tab) => tab.classList.remove("active"))

      // Add active class to clicked tab
      button.classList.add("active")

      // In a real implementation, this would filter products by category
      // For now, we just show the empty state since we don't have product data
    })
  })
}

/**
 * Set up Add to Cart buttons
 */
function setupAddToCartButtons() {
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn")

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Get the product card
      const productCard = event.target.closest(".product-card")

      if (productCard) {
        // Get product details
        const productName = productCard.querySelector(".product-name").textContent
        const productPrice =
          Number.parseFloat(productCard.querySelector(".product-price").textContent.replace("₱", "")) || 0

        // Generate a unique ID for the product (in a real app, this would come from the database)
        const productId = `product-${Date.now()}`

        // Create product object
        const product = {
          id: productId,
          name: productName,
          price: productPrice,
        }

        // Add to cart using global addToCart function from storage.js
        const success = addToCart(product, 1)

        if (success) {
          // Show success message using the utility function from utils.js
          showAddToCartMessage(product, 1)
        }
      }
    })
  })
}

/**
 * Show a message when product is added to cart
 */
function showAddToCartMessage(product, quantity) {
  // Check if a message already exists
  let messageElement = document.querySelector(".add-to-cart-message")

  if (!messageElement) {
    // Create message element if it doesn't exist
    messageElement = document.createElement("div")
    messageElement.className = "add-to-cart-message"

    // Use innerHTML only once for better performance
    messageElement.innerHTML = `
      <i class="fas fa-check-circle"></i>
      Product added to cart!
      <a href="cart.html">View Cart</a>
    `

    // Add styles
    Object.assign(messageElement.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      backgroundColor: "#4caf50",
      color: "white",
      padding: "15px 20px",
      borderRadius: "5px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
      zIndex: "1000",
      display: "flex",
      alignItems: "center",
      gap: "10px",
    })

    // Style the link
    const link = messageElement.querySelector("a")
    Object.assign(link.style, {
      color: "white",
      fontWeight: "bold",
      marginLeft: "10px",
      textDecoration: "underline",
    })

    // Add to body
    document.body.appendChild(messageElement)

    // Remove after 3 seconds
    setTimeout(() => {
      messageElement.style.opacity = "0"
      messageElement.style.transition = "opacity 0.5s ease"
      setTimeout(() => {
        if (messageElement.parentNode) {
          messageElement.parentNode.removeChild(messageElement)
        }
      }, 500)
    }, 3000)
  }
}
