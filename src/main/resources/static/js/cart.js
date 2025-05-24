// cart.js - Client-side shopping cart logic using localStorage

const CART_KEY = 'espressionistCart';

// Function to get the cart from localStorage
function getCart() {
    const cartJson = localStorage.getItem(CART_KEY);
    return cartJson ? JSON.parse(cartJson) : [];
}

// Function to save the cart to localStorage
function saveCart(cart) {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

// Function to add an item to the cart
// item: { id, name, price, imageUrl, quantity }
function addItemToCart(item) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        if (item.quantity > 0) { // Ensure quantity is positive before adding
            cart.push(item);
        }
    }
    saveCart(cart);
    console.log('Item added to cart:', item, 'Current cart:', getCart());
    // Optionally, trigger an event or callback to update UI
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Function to update an item's quantity in the cart
function updateItemQuantity(productId, quantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(cartItem => cartItem.id === productId);

    if (itemIndex > -1) {
        if (quantity > 0) {
            cart[itemIndex].quantity = quantity;
        } else {
            // If quantity is 0 or less, remove the item
            cart.splice(itemIndex, 1);
        }
        saveCart(cart);
        console.log('Item quantity updated for product:', productId, 'New quantity:', quantity, 'Current cart:', getCart());
        document.dispatchEvent(new CustomEvent('cartUpdated'));
    }
}

// Function to remove an item from the cart
function removeItemFromCart(productId) {
    let cart = getCart();
    cart = cart.filter(cartItem => cartItem.id !== productId);
    saveCart(cart);
    console.log('Item removed from cart, product ID:', productId, 'Current cart:', getCart());
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Function to calculate the total price of the cart
function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Function to get the total number of items in the cart
function getCartItemCount() {
    const cart = getCart();
    return cart.reduce((count, item) => count + item.quantity, 0);
}

// Function to clear the cart
function clearCart() {
    localStorage.removeItem(CART_KEY);
    console.log('Cart cleared.');
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Example of how to make functions available if this were a module (optional for this project)
// export { getCart, addItemToCart, updateItemQuantity, removeItemFromCart, getCartTotal, clearCart, getCartItemCount };

// For simplicity in a non-module script, functions are global or can be attached to a global object.
// We'll assume global functions for now, to be included via <script> tag.

console.log('cart.js loaded');
