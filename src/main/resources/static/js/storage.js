/**
 * Storage utility functions for Espressionist e-commerce site
 * Handles localStorage operations for cart and orders
 */

/**
 * Storage keys used throughout the application
 */
const STORAGE_KEYS = {
  CART: "cart",
  ORDERS: "orders",
  ADMIN_LOGGED_IN: "adminLoggedIn",
  ADMIN_USERNAME: "adminUsername",
  ADMIN_LOGIN_TIME: "adminLoginTime",
}

/**
 * Get data from localStorage with error handling
 * @param {string} key - Storage key
 * @param {*} defaultValue - Default value if key doesn't exist or error occurs
 * @returns {*} Retrieved data or default value
 */
function getStorageItem(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : defaultValue
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error)
    return defaultValue
  }
}

/**
 * Save data to localStorage with error handling
 * @param {string} key - Storage key
 * @param {*} data - Data to save
 * @returns {boolean} True if saved successfully, false if error
 */
function setStorageItem(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
    return true
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
    return false
  }
}

/**
 * Remove item from localStorage with error handling
 * @param {string} key - Storage key to remove
 * @returns {boolean} True if removed successfully, false if error
 */
function removeStorageItem(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error)
    return false
  }
}

/**
 * Get cart items from localStorage
 * @returns {Array} Array of cart items
 */
function getCart() {
  return getStorageItem(STORAGE_KEYS.CART, [])
}

/**
 * Save cart items to localStorage
 * @param {Array} cartItems - Array of cart items to save
 * @returns {boolean} True if saved successfully
 */
function saveCart(cartItems) {
  const success = setStorageItem(STORAGE_KEYS.CART, cartItems)

  if (!success && typeof showToastMessage === "function") {
    showToastMessage("Failed to save your cart. Please try again.", "Retry", "", 5000)
  }

  return success
}

/**
 * Add item to cart
 * @param {Object} product - Product to add to cart
 * @param {number} quantity - Quantity to add
 * @returns {boolean} - True if added successfully, false if error
 */
function addToCart(product, quantity = 1) {
  try {
    const cart = getCart()

    // Check if product already exists in cart
    const existingItemIndex = cart.findIndex((item) => item.id === product.id)

    if (existingItemIndex !== -1) {
      // Update quantity if product already exists
      cart[existingItemIndex].quantity += quantity
    } else {
      // Add new product to cart
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: quantity,
      })
    }

    return saveCart(cart)
  } catch (error) {
    console.error("Error adding to cart:", error)
    return false
  }
}

/**
 * Update item quantity in cart
 * @param {string} productId - Product ID to update
 * @param {number} quantity - New quantity
 * @returns {boolean} - True if updated successfully, false if error
 */
function updateCartItemQuantity(productId, quantity) {
  try {
    const cart = getCart()
    const itemIndex = cart.findIndex((item) => item.id === productId)

    if (itemIndex !== -1) {
      cart[itemIndex].quantity = Math.max(1, quantity) // Ensure quantity is at least 1
      return saveCart(cart)
    }
    return false
  } catch (error) {
    console.error("Error updating cart item:", error)
    return false
  }
}

/**
 * Remove item from cart
 * @param {string} productId - Product ID to remove
 * @returns {boolean} - True if removed successfully, false if error
 */
function removeFromCart(productId) {
  try {
    const cart = getCart()
    const updatedCart = cart.filter((item) => item.id !== productId)
    return saveCart(updatedCart)
  } catch (error) {
    console.error("Error removing from cart:", error)
    return false
  }
}

/**
 * Clear the entire cart
 * @returns {boolean} - True if cleared successfully, false if error
 */
function clearCart() {
  return removeStorageItem(STORAGE_KEYS.CART)
}

/**
 * Get cart count (total number of items)
 * @returns {number} - Total number of items in cart
 */
function getCartCount() {
  const cart = getCart()
  return cart.reduce((total, item) => total + item.quantity, 0)
}

/**
 * Calculate cart total
 * @returns {Object} - Object with subtotal, tax, and total
 */
function calculateCartTotal() {
  const cart = getCart()
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const tax = subtotal * 0.12 // 12% VAT
  const total = subtotal + tax

  return {
    subtotal,
    tax,
    total,
  }
}

/**
 * Get orders from localStorage
 * @returns {Array} Array of orders
 */
function getOrders() {
  return getStorageItem(STORAGE_KEYS.ORDERS, [])
}

/**
 * Save order to localStorage
 * @param {Object} order - Order object to save
 * @returns {boolean} True if saved successfully
 */
function saveOrder(order) {
  const orders = getOrders()
  orders.push(order)
  return setStorageItem(STORAGE_KEYS.ORDERS, orders)
}

/**
 * Find order by ID
 * @param {string} orderId - Order ID to find
 * @returns {Object|null} Order object or null if not found
 */
function findOrder(orderId) {
  const orders = getOrders()
  return orders.find((order) => order.orderId === orderId) || null
}

// Export all functions
export {
  STORAGE_KEYS,
  getStorageItem,
  setStorageItem,
  removeStorageItem,
  getCart,
  saveCart,
  addToCart,
  updateCartItemQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
  calculateCartTotal,
  getOrders,
  saveOrder,
  findOrder,
}
