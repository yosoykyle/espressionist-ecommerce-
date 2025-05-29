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
// item: { id, name, price, imageUrl, quantity, originalStock }
function addItemToCart(item) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(cartItem => cartItem.id === item.id);

    if (existingItemIndex > -1) {
        const newProposedQuantity = cart[existingItemIndex].quantity + item.quantity;
        if (newProposedQuantity <= cart[existingItemIndex].originalStock) {
            cart[existingItemIndex].quantity = newProposedQuantity;
        } else {
            showToast('Cannot add more. Not enough stock available! Max stock: ' + cart[existingItemIndex].originalStock, 'error');
            return; // Do not save or dispatch event if quantity didn't change
        }
    } else {
        if (item.quantity > 0) {
            // Ensure originalStock is part of the item pushed to cart
            if (item.quantity <= item.originalStock) {
                cart.push(item); // item already has id, name, price, imageUrl, quantity, originalStock
            } else {
                showToast('Cannot add item. Requested quantity ('+ item.quantity +') exceeds stock! Stock: ' + item.originalStock, 'error');
                return;
            }
        } else {
            return; // Do not add if initial quantity is not positive
        }
    }
    saveCart(cart);
    console.log('Item added/updated in cart:', item, 'Current cart:', getCart());
    showToast(`'${item.name}' added to cart!`, 'success');
    document.dispatchEvent(new CustomEvent('cartUpdated'));
}

// Function to update an item's quantity in the cart
function updateItemQuantity(productId, newQuantity) {
    const cart = getCart();
    const itemIndex = cart.findIndex(cartItem => cartItem.id === productId);

    if (itemIndex > -1) {
        if (newQuantity > 0) {
            // Check stock only if increasing quantity
            if (newQuantity > cart[itemIndex].quantity) { // If trying to increase
                if (newQuantity <= cart[itemIndex].originalStock) {
                    cart[itemIndex].quantity = newQuantity;
                } else {
                    showToast('Cannot increase quantity further. Not enough stock available! Max stock: ' + cart[itemIndex].originalStock, 'error');
                    return; // Do not save or dispatch event if quantity didn't change
                }
            } else { // Decreasing quantity or setting to same is always fine (down to 1)
                cart[itemIndex].quantity = newQuantity;
            }
        } else {
            // If quantity is 0 or less, remove the item
            cart.splice(itemIndex, 1);
            showToast('Item removed from cart.', 'info'); // Specific toast for removal
        } else {
            showToast('Cart updated!', 'success'); // General success for quantity change
        }
        saveCart(cart);
        console.log('Item quantity updated for product:', productId, 'New quantity:', newQuantity, 'Current cart:', getCart());
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
