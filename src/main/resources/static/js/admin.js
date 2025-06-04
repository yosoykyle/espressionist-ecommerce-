// Admin Dashboard functionality for Espressionist e-commerce site

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Check if user is logged in
  checkLoginStatus()

  // Set up tab navigation
  setupTabs()

  // Set up modal functionality
  setupModals()

  // Set up product form
  setupProductForm()

  // Set up image upload preview
  setupImageUpload()

  // Set up delete confirmation
  setupDeleteConfirmation()
})

/**
 * Check if user is logged in
 */
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
  if (!isLoggedIn) {
    // Redirect to login page
    window.location.href = "admin-login.html"
    return
  }

  // Update navbar with admin username
  updateAdminNavbar()
}

/**
 * Update admin navbar with username
 */
function updateAdminNavbar() {
  // This function would be implemented if we had a custom admin navbar component
  // For now, we're using the standard navbar from components.js
}

/**
 * Set up tab navigation
 */
function setupTabs() {
  const tabButtons = document.querySelectorAll(".admin-tab-btn")
  const tabContents = document.querySelectorAll(".admin-tab-content")

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all tabs
      tabButtons.forEach((btn) => btn.classList.remove("active"))
      tabContents.forEach((content) => content.classList.remove("active"))

      // Add active class to clicked tab
      button.classList.add("active")
      const tabId = button.getAttribute("data-tab")
      document.getElementById(`${tabId}-tab`).classList.add("active")

      // Update URL hash
      window.location.hash = tabId
    })
  })

  // Check URL hash on page load
  const hash = window.location.hash.substring(1)
  if (hash && document.querySelector(`.admin-tab-btn[data-tab="${hash}"]`)) {
    document.querySelector(`.admin-tab-btn[data-tab="${hash}"]`).click()
  }
}

/**
 * Set up modal functionality
 */
function setupModals() {
  // Get all modals
  const modals = document.querySelectorAll(".admin-modal")

  // Get all modal triggers
  const addProductBtn = document.querySelector(".add-product-btn")
  if (addProductBtn) {
    addProductBtn.addEventListener("click", () => {
      openModal("product-modal")
      // Reset form for new product
      document.getElementById("product-form").reset()
      document.getElementById("product-modal-title").textContent = "Add New Product"
      document.getElementById("product-id").value = ""

      // Reset image preview
      const imagePreview = document.getElementById("image-preview")
      imagePreview.innerHTML = '<i class="fas fa-image"></i><span>No image selected</span>'
    })
  }

  // Get all close buttons
  const closeButtons = document.querySelectorAll(".admin-modal-close, .cancel-btn")
  closeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Find the parent modal
      const modal = button.closest(".admin-modal")
      if (modal) {
        closeModal(modal.id)
      }
    })
  })

  // Close modal when clicking outside
  modals.forEach((modal) => {
    modal.addEventListener("click", (event) => {
      if (event.target === modal) {
        closeModal(modal.id)
      }
    })
  })

  // Close modal with Escape key
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      const openModal = document.querySelector(".admin-modal[style*='display: block']")
      if (openModal) {
        closeModal(openModal.id)
      }
    }
  })
}

/**
 * Open a modal
 * @param {string} modalId - ID of the modal to open
 */
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "block"
    document.body.style.overflow = "hidden"

    // Focus the first input or button
    const firstInput = modal.querySelector("input, button:not(.admin-modal-close)")
    if (firstInput) {
      firstInput.focus()
    }
  }
}

/**
 * Close a modal
 * @param {string} modalId - ID of the modal to close
 */
function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = "none"
    document.body.style.overflow = ""
  }
}

/**
 * Set up product form
 */
function setupProductForm() {
  const productForm = document.getElementById("product-form")
  if (productForm) {
    productForm.addEventListener("submit", handleProductFormSubmit)
  }
}

/**
 * Handle product form submission
 * @param {Event} event - The form submission event
 */
function handleProductFormSubmit(event) {
  event.preventDefault()

  // Clear previous error messages
  clearErrors()

  // Get form values
  const productId = document.getElementById("product-id").value.trim()
  const productName = document.getElementById("product-name").value.trim()
  const productCategory = document.getElementById("product-category").value
  const productPrice = document.getElementById("product-price").value.trim()
  const productStock = document.getElementById("product-stock").value.trim()
  const productDescription = document.getElementById("product-description").value.trim()
  const productImage = document.getElementById("product-image").files[0]

  // Validate form
  let isValid = true

  if (!productName) {
    showError("product-name-error", "Product name is required")
    isValid = false
  }

  if (!productCategory) {
    showError("product-category-error", "Category is required")
    isValid = false
  }

  if (!productPrice) {
    showError("product-price-error", "Price is required")
    isValid = false
  } else if (isNaN(productPrice) || Number(productPrice) < 0) {
    showError("product-price-error", "Price must be a positive number")
    isValid = false
  }

  if (!productStock) {
    showError("product-stock-error", "Stock quantity is required")
    isValid = false
  } else if (isNaN(productStock) || Number(productStock) < 0 || !Number.isInteger(Number(productStock))) {
    showError("product-stock-error", "Stock must be a positive integer")
    isValid = false
  }

  if (!isValid) {
    return
  }

  // Show loading state
  const saveBtn = document.querySelector(".save-btn")
  saveBtn.disabled = true
  saveBtn.innerHTML = '<div class="button-spinner"></div> Saving...'

  // Simulate API call delay
  setTimeout(() => {
    // In a real application, this would be an API call to save the product
    console.log("Product saved:", {
      id: productId || `product-${Date.now()}`,
      name: productName,
      category: productCategory,
      price: Number(productPrice),
      stock: Number(productStock),
      description: productDescription,
      image: productImage ? productImage.name : null,
    })

    // Close modal
    closeModal("product-modal")

    // Show success message
    showToast("success", "Product Saved", "Product has been saved successfully.")

    // Reset form
    document.getElementById("product-form").reset()

    // Reset loading state
    saveBtn.disabled = false
    saveBtn.innerHTML = "Save Product"
  }, 1000)
}

/**
 * Set up image upload preview
 */
function setupImageUpload() {
  const imageInput = document.getElementById("product-image")
  const uploadBtn = document.querySelector(".upload-btn")
  const imagePreview = document.getElementById("image-preview")

  if (imageInput && uploadBtn && imagePreview) {
    uploadBtn.addEventListener("click", () => {
      imageInput.click()
    })

    imageInput.addEventListener("change", () => {
      const file = imageInput.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          imagePreview.innerHTML = `<img src="${e.target.result}" alt="Product preview">`
        }
        reader.readAsDataURL(file)
      } else {
        imagePreview.innerHTML = '<i class="fas fa-image"></i><span>No image selected</span>'
      }
    })
  }
}

/**
 * Set up delete confirmation
 */
function setupDeleteConfirmation() {
  const cancelDeleteBtn = document.querySelector(".cancel-delete-btn")
  const confirmDeleteBtn = document.querySelector(".confirm-delete-btn")

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener("click", () => {
      closeModal("delete-modal")
    })
  }

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener("click", () => {
      // Get the item ID to delete
      const itemId = confirmDeleteBtn.getAttribute("data-id")
      const itemType = confirmDeleteBtn.getAttribute("data-type")

      // Simulate API call delay
      confirmDeleteBtn.disabled = true
      confirmDeleteBtn.innerHTML = '<div class="button-spinner"></div> Deleting...'

      setTimeout(() => {
        // In a real application, this would be an API call to delete the item
        console.log(`${itemType} deleted:`, itemId)

        // Close modal
        closeModal("delete-modal")

        // Show success message
        showToast("success", "Item Deleted", `${itemType} has been deleted successfully.`)

        // Reset button
        confirmDeleteBtn.disabled = false
        confirmDeleteBtn.innerHTML = "Delete"
        confirmDeleteBtn.removeAttribute("data-id")
        confirmDeleteBtn.removeAttribute("data-type")
      }, 1000)
    })
  }
}

/**
 * Show error message
 * @param {string} elementId - ID of the error element
 * @param {string} message - Error message to display
 */
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId)
  if (errorElement) {
    errorElement.textContent = message
    errorElement.style.display = "block"

    // Add error class to the input
    const inputId = elementId.replace("-error", "")
    const inputElement = document.getElementById(inputId)
    if (inputElement) {
      inputElement.classList.add("invalid-input")
      inputElement.setAttribute("aria-invalid", "true")
    }
  }
}

/**
 * Clear all error messages
 */
function clearErrors() {
  // Clear error messages
  const errorElements = document.querySelectorAll(".error-message")
  errorElements.forEach((element) => {
    element.textContent = ""
    element.style.display = "none"
  })

  // Remove error classes from inputs
  const inputElements = document.querySelectorAll("input, select, textarea")
  inputElements.forEach((element) => {
    element.classList.remove("invalid-input")
    element.removeAttribute("aria-invalid")
  })
}

/**
 * Show toast notification
 * @param {string} type - Type of toast (success, error, warning, info)
 * @param {string} title - Toast title
 * @param {string} message - Toast message
 */
function showToast(type, title, message) {
  // Check if toast container exists, if not create it
  let toastContainer = document.querySelector(".toast-container")
  if (!toastContainer) {
    toastContainer = document.createElement("div")
    toastContainer.className = "toast-container"
    document.body.appendChild(toastContainer)
  }

  // Create toast element
  const toast = document.createElement("div")
  toast.className = `toast toast-${type}`
  toast.innerHTML = `
    <div class="toast-icon">
      <i class="fas fa-${type === "success" ? "check-circle" : type === "error" ? "exclamation-circle" : type === "warning" ? "exclamation-triangle" : "info-circle"}"></i>
    </div>
    <div class="toast-content">
      <div class="toast-title">${title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" aria-label="Close notification">
      <i class="fas fa-times"></i>
    </button>
  `

  // Add toast to container
  toastContainer.appendChild(toast)

  // Add event listener to close button
  toast.querySelector(".toast-close").addEventListener("click", () => {
    toast.classList.add("toast-exit")
    setTimeout(() => {
      toast.remove()
    }, 300)
  })

  // Auto-remove toast after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add("toast-exit")
      setTimeout(() => {
        toast.remove()
      }, 300)
    }
  }, 5000)
}
