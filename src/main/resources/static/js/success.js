// Success page functionality for Espressionist e-commerce site

// Import utility functions
import { getUrlParameter } from "./utils.js"

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Clear cart after successful order
  localStorage.removeItem('cart');
  
  // Get order details from URL params
  const urlParams = new URLSearchParams(window.location.search);
  const orderId = urlParams.get('orderId');
  
  if (orderId) {
      api.orders.getOrder(orderId)
          .then(order => {
              if (order) {
                  showOrderDetails(order);
              }
          })
          .catch(error => {
              console.error('Error fetching order details:', error);
              showError('Could not fetch order details. Please check your email for confirmation.');
          });
  }
});

function showOrderDetails(order) {
  const detailsDiv = document.getElementById('orderDetails');
  const details = `
      <div class="order-summary mt-4">
          <h4>Order Summary</h4>
          <p>Order Date: ${new Date(order.createdAt).toLocaleString()}</p>
          <p>Total Amount: $${order.total.toFixed(2)}</p>
          <p>Status: ${order.status}</p>
      </div>
  `;
  detailsDiv.insertAdjacentHTML('beforeend', details);
}
