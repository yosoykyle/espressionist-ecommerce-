/**
 * Admin Login functionality for Espressionist e-commerce site
 */

// Wait for DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener for login form submission
  const loginForm = document.getElementById("admin-login-form")
  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin)
  }

  // Add event listener for password toggle
  const togglePasswordBtn = document.getElementById("toggle-password")
  if (togglePasswordBtn) {
    togglePasswordBtn.addEventListener("click", togglePasswordVisibility)
  }

  // Check if user is already logged in
  checkLoginStatus()
})

/**
 * Check if user is already logged in
 */
function checkLoginStatus() {
  const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true"
  const loginTime = localStorage.getItem("adminLoginTime")

  // Check if login has expired (24 hours)
  const isExpired = loginTime && new Date().getTime() - new Date(loginTime).getTime() > 24 * 60 * 60 * 1000

  if (isLoggedIn && !isExpired) {
    // Redirect to admin dashboard
    window.location.href = "admin.html"
  } else if (isExpired) {
    // Clear expired login
    logout()
  }
}

/**
 * Log out the admin user
 */
function logout() {
  localStorage.removeItem("adminLoggedIn")
  localStorage.removeItem("adminUsername")
  localStorage.removeItem("adminLoginTime")
}

/**
 * Handle login form submission
 * @param {Event} event - The form submission event
 */
function handleLogin(event) {
  event.preventDefault()

  // Clear previous error messages
  clearErrors()

  // Get form values
  const username = document.getElementById("username").value.trim()
  const password = document.getElementById("password").value.trim()

  // Validate form
  let isValid = true

  if (!username) {
    showError("username-error", "Username is required")
    isValid = false
  }

  if (!password) {
    showError("password-error", "Password is required")
    isValid = false
  }

  if (!isValid) {
    return
  }

  // Show loading state
  const loginBtn = document.querySelector(".admin-login-btn")
  loginBtn.disabled = true
  loginBtn.innerHTML = '<span>Logging in...</span><div class="button-spinner"></div>'

  // Simulate API call delay
  setTimeout(() => {
    // Check credentials (hardcoded for now)
    // In a real application, this would be a server-side check
    const validUsername = "admin"
    const validPassword = "espressionist2025"

    if (username === validUsername && password === validPassword) {
      // Show success message
      showSuccessMessage("Login successful! Redirecting to dashboard...")

      // Set login status in localStorage
      localStorage.setItem("adminLoggedIn", "true")
      localStorage.setItem("adminUsername", username)
      localStorage.setItem("adminLoginTime", new Date().toISOString())

      // Redirect to admin dashboard after a short delay
      setTimeout(() => {
        window.location.href = "admin.html"
      }, 1000)
    } else {
      // Show error message
      showError("login-error", "Invalid username or password")

      // Reset loading state
      loginBtn.disabled = false
      loginBtn.innerHTML = '<span>Login</span><i class="fas fa-sign-in-alt"></i>'

      // Focus on the username field
      document.getElementById("username").focus()
    }
  }, 1000)
}

/**
 * Toggle password visibility
 */
function togglePasswordVisibility() {
  const passwordInput = document.getElementById("password")
  const toggleBtn = document.getElementById("toggle-password")

  if (passwordInput.type === "password") {
    // Show password
    passwordInput.type = "text"
    toggleBtn.innerHTML = '<i class="fas fa-eye-slash"></i>'
    toggleBtn.setAttribute("aria-label", "Hide password")
    toggleBtn.classList.add("active")

    // Announce for screen readers
    announcePasswordVisibility(true)
  } else {
    // Hide password
    passwordInput.type = "password"
    toggleBtn.innerHTML = '<i class="fas fa-eye"></i>'
    toggleBtn.setAttribute("aria-label", "Show password")
    toggleBtn.classList.remove("active")

    // Announce for screen readers
    announcePasswordVisibility(false)
  }
}

/**
 * Announce password visibility change for screen readers
 * @param {boolean} isVisible - Whether password is visible
 */
function announcePasswordVisibility(isVisible) {
  // Create or get the live region
  let liveRegion = document.getElementById("password-visibility-live-region")
  if (!liveRegion) {
    liveRegion = document.createElement("div")
    liveRegion.id = "password-visibility-live-region"
    liveRegion.setAttribute("aria-live", "polite")
    liveRegion.className = "sr-only"
    document.body.appendChild(liveRegion)
  }

  // Update the live region
  liveRegion.textContent = isVisible ? "Password is now visible" : "Password is now hidden"
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
 * Show success message
 * @param {string} message - Success message to display
 */
function showSuccessMessage(message) {
  // Check if success message element exists, if not create it
  let successElement = document.getElementById("login-success")
  if (!successElement) {
    successElement = document.createElement("div")
    successElement.id = "login-success"
    successElement.className = "success-message"

    // Insert after the form
    const form = document.getElementById("admin-login-form")
    form.parentNode.insertBefore(successElement, form.nextSibling)
  }

  // Update message and show
  successElement.textContent = message
  successElement.style.display = "block"

  // Announce for screen readers
  let liveRegion = document.getElementById("login-success-live-region")
  if (!liveRegion) {
    liveRegion = document.createElement("div")
    liveRegion.id = "login-success-live-region"
    liveRegion.setAttribute("aria-live", "assertive")
    liveRegion.className = "sr-only"
    document.body.appendChild(liveRegion)
  }
  liveRegion.textContent = message
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
  const inputElements = document.querySelectorAll("input")
  inputElements.forEach((element) => {
    element.classList.remove("invalid-input")
    element.removeAttribute("aria-invalid")
  })

  // Hide success message if exists
  const successElement = document.getElementById("login-success")
  if (successElement) {
    successElement.style.display = "none"
  }
}
