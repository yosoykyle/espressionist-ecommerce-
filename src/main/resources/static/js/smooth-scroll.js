/**
 * Smooth scrolling functionality for Espressionist website
 * Handles smooth scrolling to anchor links
 */

document.addEventListener("DOMContentLoaded", () => {
  // Get all links that have hash (#) in them
  const anchorLinks = document.querySelectorAll('a[href^="#"]')

  // Add click event listener to each anchor link
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      // Get the target element
      const targetId = this.getAttribute("href")

      // Skip if it's just "#" (empty anchor)
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)

      // If target element exists
      if (targetElement) {
        e.preventDefault()

        // Scroll smoothly to the target
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })

        // Update URL without page reload (for better UX)
        history.pushState(null, null, targetId)
      }
    })
  })

  // Handle direct access to URL with hash
  if (window.location.hash) {
    // Wait a moment for the page to load
    setTimeout(() => {
      const targetElement = document.querySelector(window.location.hash)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    }, 100)
  }
})