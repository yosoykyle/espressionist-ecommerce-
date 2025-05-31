/**
 * Shared component loader for Espressionist website
 * Handles loading of shared components like navbar and footer
 */

// Component definitions
const COMPONENTS = {
  navbar: {
    html: `
      <div class="logo">
        <a href="index.html">espressionist</a>
      </div>
      <nav class="nav">
        <ul>
          <li><a href="products.html" id="nav-shop">Shop</a></li>
          <li><a href="cart.html" id="nav-cart">Cart</a></li>
          <li><a href="track.html" id="nav-track">Track Order</a></li>
          <li><a href="index.html#about" id="nav-about">About</a></li>
        </ul>
      </nav>
    `,
    init: (element) => {
      const currentPage = window.location.pathname.split("/").pop() || "index.html"

      // Clear any existing active classes
      element.querySelectorAll(".nav a").forEach((link) => {
        link.classList.remove("active")
      })

      // Set active class based on current page
      switch (currentPage) {
        case "products.html":
          element.querySelector("#nav-shop")?.classList.add("active")
          break
        case "cart.html":
        case "checkout.html":
        case "success.html":
          element.querySelector("#nav-cart")?.classList.add("active")
          break
        case "track.html":
          element.querySelector("#nav-track")?.classList.add("active")
          break
        case "index.html":
        case "":
          // Only set About as active if the hash is #about
          if (window.location.hash === "#about") {
            element.querySelector("#nav-about")?.classList.add("active")
          }
          break
      }
    },
  },

  "admin-navbar": {
    html: `
      <div class="logo">
        <a href="admin.html">espressionist admin</a>
      </div>
      <nav class="nav">
        <ul>
          <li><a href="admin.html#inventory" id="nav-inventory">Inventory</a></li>
          <li><a href="admin.html#customers" id="nav-customers">Customers</a></li>
          <li><a href="admin.html#orders" id="nav-orders">Orders</a></li>
          <li><a href="#" id="nav-logout">Logout</a></li>
        </ul>
      </nav>
    `,
    init: (element) => {
      const currentHash = window.location.hash.substring(1) || "inventory"

      // Clear any existing active classes
      element.querySelectorAll(".nav a").forEach((link) => {
        link.classList.remove("active")
      })

      // Set active class based on current hash
      const navLink = element.querySelector(`#nav-${currentHash}`)
      if (navLink) {
        navLink.classList.add("active")
      }

      // Add logout functionality
      const logoutLink = element.querySelector("#nav-logout")
      if (logoutLink) {
        logoutLink.addEventListener("click", (e) => {
          e.preventDefault()
          // Redirect to login page
          window.location.href = "admin-login.html"
        })
      }
    },
  },

  footer: {
    html: `
      <div class="footer-content">
        <div class="footer-nav">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="index.html">Home</a></li>
            <li><a href="products.html">Shop</a></li>
            <li><a href="cart.html">Cart</a></li>
            <li><a href="track.html">Track Order</a></li>
            <li><a href="index.html#about">About</a></li>
            <li><a href="admin-login.html">Admin</a></li>
          </ul>
        </div>
        
        <div class="footer-social">
          <h3>Connect With Us</h3>
          <p>Instagram: <a href="https://instagram.com/espressionist.ph" target="_blank" rel="noopener noreferrer">@espressionist.ph</a></p>
          <p>Facebook: <a href="https://www.facebook.com/espressionist.ph" target="_blank" rel="noopener noreferrer">facebook.com/espressionist.ph</a></p>
          <p>Linktree: <a href="https://linktr.ee/espressionist.ph" target="_blank" rel="noopener noreferrer">linktr.ee/espressionist.ph</a></p>
          <p>Email: <a href="mailto:espressionist.ph@gmail.com">espressionist.ph@gmail.com</a></p>
          <p>Phone: <a href="tel:+639959659332">0995 965 9332</a></p>  
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; <span id="current-year">2025</span> Espressionist</p>
      </div>
    `,
    init: (element) => {
      const yearElement = element.querySelector("#current-year")
      if (yearElement) {
        yearElement.textContent = new Date().getFullYear()
      }
    },
  },
}

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load all components marked for inclusion
  loadComponents()
})

/**
 * Load components into their respective placeholders
 */
function loadComponents() {
  // Find all elements with data-component attribute
  document.querySelectorAll("[data-component]").forEach((element) => {
    const componentName = element.getAttribute("data-component")
    const component = COMPONENTS[componentName]

    if (component) {
      // Insert the component HTML
      element.innerHTML = component.html

      // Initialize the component if it has an init function
      if (typeof component.init === "function") {
        component.init(element)
      }
    } else {
      console.warn(`Component "${componentName}" not found`)
    }
  })

  // Dispatch event when all components are loaded
  document.dispatchEvent(new CustomEvent("componentsLoaded"))
  console.log("All components loaded successfully")
}
