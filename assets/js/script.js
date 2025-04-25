// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl))

  // Add to cart functionality
  const addToCartButtons = document.querySelectorAll('.btn-success:not([type="submit"])')
  let cartCount = 0

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cartCount++
      updateCartBadge(cartCount)

      // Show toast notification
      showToast("Produk ditambahkan ke keranjang!")
    })
  })

  // Function to update cart badge
  function updateCartBadge(count) {
    const badge = document.querySelector(".badge")
    if (badge) {
      badge.textContent = count
    }
  }

  // Function to show toast notification
  function showToast(message) {
    // Create toast element if it doesn't exist
    if (!document.querySelector(".toast-container")) {
      const toastContainer = document.createElement("div")
      toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3"
      document.body.appendChild(toastContainer)

      const toastEl = document.createElement("div")
      toastEl.className = "toast"
      toastEl.setAttribute("role", "alert")
      toastEl.setAttribute("aria-live", "assertive")
      toastEl.setAttribute("aria-atomic", "true")

      toastEl.innerHTML = `
                <div class="toast-header">
                    <strong class="me-auto">Panénia</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            `

      toastContainer.appendChild(toastEl)

      const toast = new bootstrap.Toast(toastEl)
      toast.show()
    } else {
      const toastEl = document.querySelector(".toast")
      toastEl.querySelector(".toast-body").textContent = message
      const toast = new bootstrap.Toast(toastEl)
      toast.show()
    }
  }

  // Newsletter subscription form
  const newsletterForm = document.querySelector("footer form")
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault()
      const emailInput = this.querySelector('input[type="email"]')
      if (emailInput.value.trim() !== "") {
        showToast("Terima kasih telah berlangganan newsletter kami!")
        emailInput.value = ""
      }
    })
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })
})
