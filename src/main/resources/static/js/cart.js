// cart.js - Client-side shopping cart logic using localStorage

/**
 * The key used to store the cart data in localStorage.
 * @constant {string}
 */
const CART_KEY = 'espressionistCart';

/**
 * Retrieves the shopping cart from localStorage.
 * The cart is an array of items. Each item typically has:
 * { 
 *   id: string, 
 *   name: string, 
 *   price: number, 
 *   imageUrl: string, 
 *   quantity: number, 
 *   originalStock: number 
 * }
 * @returns {Array<Object>} The cart array, or an empty array if no cart is found.
 */
function getCart() {
    const cartJson = localStorage.getItem(CART_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
}

/**
 * Saves the shopping cart to localStorage.
 * @param {Array<Object>} cart - The cart array to save.
 */
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    // Dispatch a custom event to notify other parts of the application that the cart has been updated.
    // This allows UI components (like the cart page or a navbar cart icon) to refresh their display.
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

/**
 * Adds an item to the shopping cart or updates its quantity if it already exists.
 * Checks against available stock before adding/updating.
 * Notifies the user with a toast message (success or error).
 * @param {Object} item - The item to add. Expected structure: 
 *                        { id, name, price, imageUrl, quantity (to add), originalStock }
 */
function addItemToCart(item) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) { // Item already in cart, update quantity
        const newProposedQuantity = cart[existingItemIndex].quantity + item.quantity;
        if (newProposedQuantity <= cart[existingItemIndex].originalStock) {
            cart[existingItemIndex].quantity = newProposedQuantity;
            saveCart(cart); // Save and dispatch event
            showToast(`'${item.name}' quantity updated in cart!`, 'success');
        } else {
            // Not enough stock to add the desired additional quantity
            showToast('Cannot add more. Not enough stock available! Max stock: ' + cart[existingItemIndex].originalStock, 'error');
            return; // Do not proceed if quantity cannot be updated
        }
    } else { // New item, add to cart
        if (item.quantity > 0) {
            // Check if the initial quantity to add is within stock limits
            if (item.quantity <= item.originalStock) {
                cart.push(item); // Add the new item
                saveCart(cart); // Save and dispatch event
                showToast(`'${item.name}' added to cart!`, 'success');
            } else {
                // Initial quantity requested exceeds available stock
                showToast('Cannot add item. Requested quantity ('+ item.quantity +') exceeds stock! Stock: ' + item.originalStock, 'error');
                return; // Do not add if stock is insufficient
            }
        } else {
            // Do not add if initial quantity is not positive (e.g., 0 or negative)
            return; 
        }
    }
    console.log('Item added/updated in cart:', item, 'Current cart:', getCart());
    // Note: 'cartUpdated' event is now dispatched by saveCart()
}

/**
 * Updates the quantity of a specific item in the cart.
 * If the new quantity is 0 or less, the item is removed.
 * Checks against available stock when increasing quantity.
 * Notifies the user with a toast message.
 * @param {string} productId - The ID of the product to update.
 * @param {number} newQuantity - The new quantity for the item.
 */
function updateItemQuantity(productId, newQuantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(cartItem => cartItem.id === productId);

    if (itemIndex > -1) { // Item found in cart
        const item = cart[itemIndex];
        if (newQuantity > 0) {
            // If trying to increase quantity, check against stock
            if (newQuantity > item.quantity) { 
                if (newQuantity <= item.originalStock) {
                    item.quantity = newQuantity;
                    showToast(`'${item.name}' quantity updated!`, 'success');
                } else {
                    // Not enough stock to increase to the new quantity
                    showToast('Cannot increase quantity further. Not enough stock available! Max stock: ' + item.originalStock, 'error');
                    return; // Do not save or dispatch event
                }
            } else { 
                // Decreasing quantity or setting to the same quantity (but > 0) is always fine
                item.quantity = newQuantity;
                showToast(`'${item.name}' quantity updated!`, 'success');
            }
        } else {
            // If newQuantity is 0 or less, remove the item from the cart
            cart.splice(itemIndex, 1);
            showToast(`'${item.name}' removed from cart.`, 'info'); 
        }
        saveCart(cart); // Save changes and dispatch 'cartUpdated' event
        console.log('Item quantity updated for product:', productId, 'New quantity:', newQuantity, 'Current cart:', getCart());
    }
}

/**
 * Removes an item completely from the cart.
 * @param {string} productId - The ID of the product to remove.
 */
function removeItemFromCart(productId) {
    let cart = getCart();
    const item = cart.find(ci => ci.id === productId); // Get item for toast message
    cart = cart.filter(cartItem => cartItem.id !== productId);
    saveCart(cart); // Save changes and dispatch 'cartUpdated' event
    if (item) { // Show toast only if item was actually found and removed
        showToast(`'${item.name}' removed from cart.`, 'info');
    }
    console.log('Item removed from cart, product ID:', productId, 'Current cart:', getCart());
}

/**
 * Calculates the total price of all items in the cart.
 * @returns {number} The total price.
 */
function getCartTotal() {
    const cart = getCart();
    // Sum of (price * quantity) for each item
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

/**
 * Calculates the total number of individual items in the cart (sum of quantities).
 * @returns {number} The total count of items.
 */
function getCartItemCount() {
    const cart = getCart();
    // Sum of quantities for each item
    return cart.reduce((count, item) => count + item.quantity, 0);
}

/**
 * Clears all items from the shopping cart.
 */
function clearCart() {
    localStorage.removeItem(CART_KEY); // Remove the cart from localStorage
    saveCart([]); // Effectively clears and dispatches event, though localStorage is already cleared
    showToast('Cart cleared!', 'info');
    console.log('Cart cleared.');
    // Note: 'cartUpdated' event is dispatched by saveCart([])
}

// Example of how to make functions available if this were a module (optional for this project)
// export { getCart, addItemToCart, updateItemQuantity, removeItemFromCart, getCartTotal, clearCart, getCartItemCount };

// For simplicity in a non-module script, functions are global or can be attached to a global object.
// We'll assume global functions for now, to be included via <script> tag.
// The 'cartUpdated' CustomEvent is dispatched on document, allowing any part of the page to listen for cart changes.

console.log('cart.js loaded and initialized.');
