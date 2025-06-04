/**
 * Cart functionality for Espressionist e-commerce site
 */

// Import API and utilities
import { cartApi } from './api.js';
import { formatting, notifications } from './utils.js';

// Loading state management
function showLoadingState() {
    document.getElementById('loading-overlay')?.classList.remove('hidden');
}

function hideLoadingState() {
    document.getElementById('loading-overlay')?.classList.add('hidden');
}

// Cart item rendering
function renderCartItems(cartItems) {
    const cartTableBody = document.getElementById('cart-items');
    cartTableBody.innerHTML = cartItems.map(item => `
        <tr>
            <td>${item.productName}</td>
            <td>
                <input type="number" value="${item.quantity}" min="1" max="99"
                    data-product-id="${item.productId}" class="quantity-input"/>
            </td>
            <td>${formatting.formatPrice(item.price)}</td>
            <td>${formatting.formatPrice(item.totalPrice)}</td>
            <td>
                <button class="remove-item" data-product-id="${item.productId}">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Cart totals update
function updateCartTotals(cartItems) {
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const vat = subtotal * 0.12; // 12% VAT
    const total = subtotal + vat;
    
    document.getElementById('subtotal').textContent = formatting.formatPrice(subtotal);
    document.getElementById('vat').textContent = formatting.formatPrice(vat);
    document.getElementById('total').textContent = formatting.formatPrice(total);
}

// Cart action handlers
async function handleQuantityUpdate(event) {
    const input = event.target;
    if (!input.matches('.quantity-input')) return;
    
    const productId = input.dataset.productId;
    const quantity = parseInt(input.value, 10);
    
    try {
        showLoadingState();
        await cartApi.updateQuantity(productId, quantity);
        const cartItems = await cartApi.getItems();
        renderCartItems(cartItems);
        updateCartTotals(cartItems);
        notifications.showSuccess('Cart updated');
    } catch (error) {
        console.error('Error updating quantity:', error);
        notifications.showError('Failed to update cart. Please try again.');
    } finally {
        hideLoadingState();
    }
}

async function handleRemoveItem(event) {
    const button = event.target.closest('.remove-item');
    if (!button) return;
    
    const productId = button.dataset.productId;
    
    try {
        showLoadingState();
        await cartApi.removeItem(productId);
        const cartItems = await cartApi.getItems();
        
        if (cartItems.length === 0) {
            location.reload(); // Reload to show empty cart state
            return;
        }
        
        renderCartItems(cartItems);
        updateCartTotals(cartItems);
        notifications.showSuccess('Item removed from cart');
    } catch (error) {
        console.error('Error removing item:', error);
        notifications.showError('Failed to remove item. Please try again.');
    } finally {
        hideLoadingState();
    }
}

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the cart
    loadCart();

    // Add event listeners for cart actions
    document.addEventListener('change', handleQuantityUpdate);
    document.addEventListener('click', handleRemoveItem);
});

/**
 * Load cart data from session and render it
 */
async function loadCart() {
    try {
        showLoadingState();
        
        const cartItems = await cartApi.getItems();
        
        // Update DOM with cart items
        const emptyCartElement = document.getElementById('empty-cart');
        const cartItemsContainer = document.getElementById('cart-items-container');
        
        if (!cartItems || cartItems.length === 0) {
          if (emptyCartElement) emptyCartElement.style.display = "block";
          if (cartItemsContainer) cartItemsContainer.style.display = "none";
          return;
        } else {
          if (emptyCartElement) emptyCartElement.style.display = "none";
          if (cartItemsContainer) cartItemsContainer.style.display = "block";
        }

        // Render cart items
        renderCartItems(cartItems);
        
        // Calculate and update totals
        updateCartTotals(cartItems);
        
        hideLoadingState();
    } catch (error) {
        console.error('Error loading cart:', error);
        notifications.showError('Failed to load cart. Please try again.');
        hideLoadingState();
    }
}

/**
 * Show loading state for cart
 */
function showLoadingState() {
  const loadingElement = document.getElementById("cart-loading")
  if (loadingElement) {
    loadingElement.style.display = "flex"
  }
}

/**
 * Hide loading state for cart
 */
function hideLoadingState() {
  const loadingElement = document.getElementById("cart-loading")
  if (loadingElement) {
    loadingElement.style.display = "none"
  }
}

/**
 * Render cart items in the cart table
 * @param {Array} cartItems - Array of cart items
 */
function renderCartItems(cartItems) {
  const cartItemsElement = document.getElementById("cart-items")
  // Clear previous content except loading element
  const loadingElement = document.getElementById("cart-loading")
  cartItemsElement.innerHTML = ""
  if (loadingElement) {
    cartItemsElement.appendChild(loadingElement)
  }

  // Create document fragment for better performance
  const fragment = document.createDocumentFragment()

  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity

    // Create cart row element
    const cartRow = document.createElement("div")
    cartRow.className = "cart-row"
    cartRow.dataset.id = item.id

    cartRow.innerHTML = `
      <div class="cart-cell product-cell">
        <div class="cart-product-info">
          <div class="cart-product-details">
            <h3 class="cart-product-name">${item.name}</h3>
          </div>
        </div>
      </div>
      <div class="cart-cell quantity-cell">
        <div class="cart-quantity">
          <button class="quantity-btn decrease-quantity" data-id="${item.id}" aria-label="Decrease quantity">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}" aria-label="Product quantity">
          <button class="quantity-btn increase-quantity" data-id="${item.id}" aria-label="Increase quantity">+</button>
        </div>
      </div>
      <div class="cart-cell price-cell" data-label="Price">${formatting.currency(item.price)}</div>
      <div class="cart-cell total-cell" data-label="Total">${formatting.currency(itemTotal)}</div>
      <div class="cart-cell action-cell">
        <button class="remove-btn" data-id="${item.id}" aria-label="Remove ${item.name} from cart">
          <i class="fas fa-trash-alt"></i>
          <span class="remove-text">Remove</span>
        </button>
      </div>
    `

    fragment.appendChild(cartRow)
  })

  cartItemsElement.appendChild(fragment)

  // Add event listeners for quantity inputs
  const quantityInputs = document.querySelectorAll(".quantity-input")
  quantityInputs.forEach((input) => {
    input.addEventListener("change", handleQuantityChange)
  })
}

/**
 * Handle cart actions (increase/decrease quantity, remove item)
 * @param {Event} event - The click event
 */
function handleCartActions(event) {
  const target = event.target;

  // Handle increase quantity button
  if (target.classList.contains("increase-quantity") || target.closest(".increase-quantity")) {
    const button = target.classList.contains("increase-quantity") ? target : target.closest(".increase-quantity");
    const itemId = button.getAttribute("data-id");
    if (itemId) {
      updateItemQuantity(itemId, 1);
    }
  }

  // Handle decrease quantity button
  if (target.classList.contains("decrease-quantity") || target.closest(".decrease-quantity")) {
    const button = target.classList.contains("decrease-quantity") ? target : target.closest(".decrease-quantity");
    const itemId = button.getAttribute("data-id");
    if (itemId) {
      updateItemQuantity(itemId, -1);
    }
  }

  // Handle remove button
  if (target.classList.contains("remove-btn") || target.closest(".remove-btn")) {
    const removeBtn = target.classList.contains("remove-btn") ? target : target.closest(".remove-btn");
    const itemId = removeBtn.getAttribute("data-id");

    if (itemId) {
      // Add loading state to the button
      removeBtn.classList.add("btn-loading");

      // Simulate network delay (remove in production)
      setTimeout(() => {
        removeCartItem(itemId);
      }, 300);
    }
  }
}

/**
 * Handle quantity input change
 * @param {Event} event - The change event
 */
function handleQuantityChange(event) {
  const input = event.target;
  if (!input.matches('.quantity-input')) return;
  
  const itemId = input.getAttribute('data-id');
  const newQuantity = parseInt(input.value, 10);

  if (!itemId || isNaN(newQuantity) || newQuantity < 1) {
    // Revert to previous value if invalid
    const cartItems = getCart();
    const item = cartItems.find(item => item.id === itemId);
    if (item) {
      input.value = item.quantity;
    }
    return;
  }

  // Show loading state
  const cartRow = input.closest('.cart-row');
  if (cartRow) {
    cartRow.classList.add('updating');
  }

  // Simulate network delay (remove in production)
  setTimeout(() => {
    updateCartItemQuantity(itemId, newQuantity);

    // Update the row total immediately for better UX
    if (cartRow) {
      const priceCell = cartRow.querySelector('.price-cell');
      const totalCell = cartRow.querySelector('.total-cell');
      if (priceCell && totalCell) {
        const priceText = priceCell.textContent.trim().replace(/[^\d.-]/g, '');
        const price = parseFloat(priceText);
        if (!isNaN(price)) {
          const newTotal = price * newQuantity;
          totalCell.textContent = formatting.currency(newTotal);
        }
      }
    }

    // Remove loading state
    if (cartRow) {
      cartRow.classList.remove('updating');
    }
  }, 300);
}

/**
 * Add event listener for quantity changes
 */
function initializeCartEvents() {
  document.addEventListener('change', handleQuantityChange);
  document.addEventListener('click', handleCartActions);
}

/**
 * Update item quantity in localStorage and reload the cart
 * @param {string} itemId - The item ID
 * @param {number} newQuantity - The new quantity
 */
function updateCartItemQuantity(itemId, newQuantity) {
  const cartItems = getCart();
  const itemIndex = cartItems.findIndex((item) => item.id === itemId);

  if (itemIndex !== -1) {
    if (newQuantity < 1) {
      cartItems.splice(itemIndex, 1);
    } else {
      cartItems[itemIndex].quantity = newQuantity;
    }

    // Update localStorage
    saveCart(cartItems);

    // Reload cart to reflect changes
    loadCart();
  }
}

/**
 * Update item quantity by increment/decrement
 * @param {string} itemId - The item ID
 * @param {number} change - The quantity change (1 or -1)
 */
function updateItemQuantity(itemId, change) {
  // Find the quantity button that was clicked
  const button = document.querySelector(
    `.quantity-btn[data-id="${itemId}"]${change > 0 ? ".increase-quantity" : ".decrease-quantity"}`,
  )

  // Add loading state to the button
  if (button) {
    button.classList.add("btn-loading")
  }

  // Simulate network delay (remove in production)
  setTimeout(() => {
    const cartItems = getCart()
    const itemIndex = cartItems.findIndex((item) => item.id === itemId)

    if (itemIndex !== -1) {
      cartItems[itemIndex].quantity += change

      // Ensure quantity is at least 1
      if (cartItems[itemIndex].quantity < 1) {
        cartItems[itemIndex].quantity = 1
      }

      // Update localStorage
      saveCart(cartItems)

      // Reload cart to reflect changes
      loadCart()
    }
  }, 300)
}

/**
 * Remove an item from the cart
 * @param {string} itemId - The item ID to remove
 */
function removeCartItem(itemId) {
  const cartItems = getCart()
  const itemToRemove = cartItems.find((item) => item.id === itemId)
  const itemName = itemToRemove ? itemToRemove.name : "Item"

  // Remove item from cart
  if (removeFromCart(itemId)) {
    // Show toast notification
    notifications.showToast(`${itemName} has been removed from your cart.`, "View Cart", "cart.html")
  }

  // Reload cart to reflect changes
  loadCart()
}

/**
 * Calculate and update cart totals
 * @param {Array} cartItems - Array of cart items
 */
function updateCartTotals(cartItems) {
  // Calculate totals using the utility function
  const { subtotal, tax, total } = cartUtils.calculateTotals(cartItems)

  // Update the DOM
  document.getElementById("cart-subtotal").textContent = formatting.currency(subtotal)
  document.getElementById("cart-tax").textContent = formatting.currency(tax)
  document.getElementById("cart-total").textContent = formatting.currency(total)
}
