// Track Order functionality for Espressionist e-commerce site

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if there's a tracking code in the URL
  const trackingCode = getUrlParameter("order")

  // If tracking code exists in URL, fill the input and trigger search
  if (trackingCode) {
    document.getElementById("tracking-code").value = trackingCode
    trackOrder()
  }

  // Add event listener for track button
  document.getElementById("track-btn").addEventListener("click", trackOrder)

  // Add event listener for Enter key in tracking code input
  document.getElementById("tracking-code").addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      trackOrder()
    }
  })

  // Add event listener for ESC key to dismiss error messages
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const errorElement = document.getElementById("error-message")
      if (errorElement && errorElement.style.display === "block") {
        dismissError()
      }
    }
  })

  // Set up real-time validation for tracking code input
  setupTrackingCodeValidation()
})

// Update the setupTrackingCodeValidation function for better real-time validation
function setupTrackingCodeValidation() {
  const trackingCodeInput = document.getElementById("tracking-code")
  const trackForm = document.querySelector(".tracking-form")

  if (trackingCodeInput) {
    // Validate on input (as user types)
    trackingCodeInput.addEventListener("input", () => {
      validateTrackingCode(trackingCodeInput.value.trim())
    })

    // Also validate on blur (when user leaves the field)
    trackingCodeInput.addEventListener("blur", () => {
      validateTrackingCode(trackingCodeInput.value.trim())
    })
  }

  // Prevent form submission if validation fails
  if (trackForm) {
    trackForm.addEventListener("submit", (event) => {
      event.preventDefault()

      const trackingCode = trackingCodeInput.value.trim()
      const isValid = validateTrackingCode(trackingCode)

      if (isValid) {
        trackOrder()
      } else {
        // Focus the tracking code input
        trackingCodeInput.focus()
      }
    })
  }

  // Add event listener for track button
  document.getElementById("track-btn").addEventListener("click", (event) => {
    event.preventDefault()

    const trackingCode = trackingCodeInput.value.trim()
    const isValid = validateTrackingCode(trackingCode)

    if (isValid) {
      trackOrder()
    } else {
      // Focus the tracking code input
      trackingCodeInput.focus()
    }
  })
}

// Update the validateTrackingCode function to handle more edge cases
function validateTrackingCode(code) {
  // Hide any existing error messages
  document.getElementById("error-message").style.display = "none"

  // Get the tracking info element for feedback
  const trackingInfoElement = document.getElementById("tracking-info")
  const trackingCodeInput = document.getElementById("tracking-code")

  // Handle empty or undefined input
  if (!code) {
    // If empty, reset to default message
    trackingInfoElement.textContent = "Enter your order tracking code below to check the status of your order."
    trackingInfoElement.classList.remove("error", "success")
    trackingCodeInput.setAttribute("aria-invalid", "false")
    trackingCodeInput.classList.remove("invalid-input")
    return false
  }

  // Sanitize input - remove any potentially harmful characters
  const sanitizedCode = code.replace(/[^\w-]/g, "")

  // If sanitization changed the value, update the input
  if (sanitizedCode !== code) {
    trackingCodeInput.value = sanitizedCode
    code = sanitizedCode
  }

  // Basic format validation (can be customized based on your tracking code format)
  // For example, if your tracking codes always start with ESPR-
  if (code.startsWith("ESPR-") && code.length >= 11) {
    // ESPR- plus at least 6 characters
    trackingInfoElement.textContent = "Valid tracking code format."
    trackingInfoElement.classList.remove("error")
    trackingInfoElement.classList.add("success")
    trackingCodeInput.setAttribute("aria-invalid", "false")
    trackingCodeInput.classList.remove("invalid-input")
    return true
  } else {
    trackingInfoElement.textContent = "Tracking codes should start with ESPR- followed by 6 characters."
    trackingInfoElement.classList.add("error")
    trackingInfoElement.classList.remove("success")
    trackingCodeInput.setAttribute("aria-invalid", "true")
    trackingCodeInput.classList.add("invalid-input")
    return false
  }
}

// Update the trackOrder function to use validation and focus management
function trackOrder() {
  // Hide previous results and error messages
  document.getElementById("order-results").style.display = "none"
  document.getElementById("error-message").style.display = "none"

  // Get tracking code from input
  const trackingCodeInput = document.getElementById("tracking-code")
  const trackingCode = trackingCodeInput.value.trim()

  // Validate tracking code
  if (!validateTrackingCode(trackingCode)) {
    showTrackError("Please enter a valid tracking code")

    // Focus the input field for better UX
    trackingCodeInput.focus()
    return
  }

  // Find order in localStorage using the utility function from utils.js
  const order = findOrder(trackingCode)

  if (order) {
    // Display order information
    displayOrderInfo(order)
    document.getElementById("order-results").style.display = "block"

    // Add success message
    const trackingInfoElement = document.getElementById("tracking-info")
    trackingInfoElement.textContent = "Order found! Details are displayed below."
    trackingInfoElement.classList.add("success")
    trackingInfoElement.classList.remove("error")

    // Create a live region for screen readers
    let liveRegion = document.getElementById("track-success-live-region")
    if (!liveRegion) {
      liveRegion = document.createElement("div")
      liveRegion.id = "track-success-live-region"
      liveRegion.setAttribute("aria-live", "assertive")
      liveRegion.className = "sr-only"
      document.body.appendChild(liveRegion)
      liveRegion.textContent = "Order found! Details are displayed below."
    }

    // Scroll to results and focus on the first result
    const orderResults = document.getElementById("order-results")
    orderResults.scrollIntoView({ behavior: "smooth", block: "start" })

    // Focus on the results header after scrolling
    setTimeout(() => {
      const resultsHeader = orderResults.querySelector(".results-header h2")
      if (resultsHeader) {
        resultsHeader.setAttribute("tabindex", "-1")
        resultsHeader.focus()
      }
    }, 500)
  } else {
    // Show error message using the utility function from utils.js
    showTrackError("We couldn't find an order with that tracking code. Please check and try again.")

    // Update tracking info text
    const trackingInfoElement = document.getElementById("tracking-info")
    trackingInfoElement.textContent = "No order found with this tracking code. Please try again."
    trackingInfoElement.classList.add("error")
    trackingInfoElement.classList.remove("success")

    // Focus back on the input field
    trackingCodeInput.focus()
  }
}

/**
 * Display order information
 * @param {Object} order - Order object
 */
function displayOrderInfo(order) {
  // Set order ID
  document.getElementById("result-order-id").textContent = order.orderId

  // Set order status with appropriate class
  const statusElement = document.getElementById("order-status")
  statusElement.textContent = order.status
  statusElement.className = "status-badge status-" + order.status.toLowerCase()

  // Set order date using the utility function from utils.js
  document.getElementById("order-date").textContent = formatDate(new Date(order.date))

  // Set order total using the utility function from utils.js
  document.getElementById("order-total").textContent = formatCurrency(order.total)

  // Set shipping information
  document.getElementById("shipping-name").textContent = order.shipping.name
  document.getElementById("shipping-phone").textContent = order.shipping.phone
  document.getElementById("shipping-address").textContent = order.shipping.address

  // Set shipping note if exists
  const noteRow = document.getElementById("shipping-note-row")
  if (order.shipping.note && order.shipping.note.trim() !== "") {
    document.getElementById("shipping-note").textContent = order.shipping.note
    noteRow.style.display = "flex"
  } else {
    noteRow.style.display = "none"
  }
}

/**
 * Format date to a readable string
 * @param {Date} date - Date object
 * @returns {string} - Formatted date string
 */
function formatDate(date) {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  return date.toLocaleDateString("en-US", options)
}

/**
 * Format number to currency string
 * @param {number} number - Number to format
 * @returns {string} - Formatted currency string
 */
function formatCurrency(number) {
  return `₱${number.toFixed(2)}`
}

/**
 * Get URL parameter by name
 * @param {string} name - Parameter name
 * @returns {string|null} - Parameter value
 */
function getUrlParameter(name) {
  name = name.replace(/[[]/, "\\[").replace(/[\]]/, "\\]")
  const regex = new RegExp("[\\?&]" + name + "=([^&#]*)")
  const results = regex.exec(location.search)
  return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "))
}

/**
 * Show track error message
 * @param {string} message - Error message to display
 */
function showTrackError(message) {
  const errorElement = document.getElementById("error-message")

  // If a custom message is provided, update the paragraph text
  if (message) {
    const errorParagraph = errorElement.querySelector("p")
    if (errorParagraph) {
      errorParagraph.textContent = message
    }
  }

  // Remove any existing fade-out class and display the error
  errorElement.classList.remove("fade-out")
  errorElement.style.display = "block"

  // Add close button if it doesn't exist
  if (!errorElement.querySelector(".close-btn")) {
    const closeBtn = document.createElement("button")
    closeBtn.className = "close-btn"
    closeBtn.innerHTML = '<i class="fas fa-times"></i>'
    closeBtn.setAttribute("aria-label", "Close error message")
    closeBtn.onclick = () => {
      dismissError()
    }
    errorElement.appendChild(closeBtn)
  }

  // Set aria-invalid on the input
  document.getElementById("tracking-code").setAttribute("aria-invalid", "true")

  // Scroll to error message
  errorElement.scrollIntoView({ behavior: "smooth", block: "center" })
}

/**
 * Dismiss error message with animation
 */
function dismissError() {
  const errorElement = document.getElementById("error-message")
  errorElement.classList.add("fade-out")

  // Remove from DOM after animation completes
  setTimeout(() => {
    errorElement.style.display = "none"
    errorElement.classList.remove("fade-out")
  }, 300) // Match the animation duration
}

/**
 * Find order in localStorage by tracking code
 * @param {string} trackingCode - Tracking code to search for
 * @returns {Object|null} - Order object or null if not found
 */
function findOrder(trackingCode) {
  const orders = JSON.parse(localStorage.getItem("orders")) || []
  return orders.find((order) => order.orderId === trackingCode) || null
}
