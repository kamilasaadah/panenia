// Wait for the DOM to be fully loaded
document.addEventListener("DOMContentLoaded", () => {
  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  var tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

  // Add to cart functionality
  const addToCartButtons = document.querySelectorAll('.btn-success:not([type="submit"])');
  let cartCount = 0;

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cartCount++;
      updateCartBadge(cartCount);

      // Show toast notification
      showToast("Produk ditambahkan ke keranjang!");
    });
  });

  // Function to update cart badge
  function updateCartBadge(count) {
    const badge = document.querySelector(".badge");
    if (badge) {
      badge.textContent = count;
    }
  }

  // Function to show toast notification
  function showToast(message) {
    // Create toast element if it doesn't exist
    if (!document.querySelector(".toast-container")) {
      const toastContainer = document.createElement("div");
      toastContainer.className = "toast-container position-fixed bottom-0 end-0 p-3";
      document.body.appendChild(toastContainer);

      const toastEl = document.createElement("div");
      toastEl.className = "toast";
      toastEl.setAttribute("role", "alert");
      toastEl.setAttribute("aria-live", "assertive");
      toastEl.setAttribute("aria-atomic", "true");

      toastEl.innerHTML = `
                <div class="toast-header">
                    <strong class="me-auto">Panénia</strong>
                    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            `;

      toastContainer.appendChild(toastEl);

      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    } else {
      const toastEl = document.querySelector(".toast");
      toastEl.querySelector(".toast-body").textContent = message;
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }

  // Newsletter subscription form
  const newsletterForm = document.querySelector("footer form");
  if (newsletterForm) {
    newsletterForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const emailInput = this.querySelector('input[type="email"]');
      if (emailInput.value.trim() !== "") {
        showToast("Terima kasih telah berlangganan newsletter kami!");
        emailInput.value = "";
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        });
      }
    });
  });

  // Infinite Loop Carousel functionality for product sections
  function setupCarousel(sectionId, leftBtnClass, rightBtnClass) {
    const section = document.getElementById(sectionId);
    if (!section) return; // Pastikan section ada

    const items = section.children;
    if (items.length === 0) return; // Pastikan ada item

    // Duplikat semua elemen untuk menciptakan efek infinite loop
    const originalItemsCount = items.length;
    for (let i = 0; i < originalItemsCount; i++) {
      const clone = items[i].cloneNode(true);
      section.appendChild(clone);
    }

    let scrollAmount = 0;
    const itemWidth = items[0].offsetWidth + parseInt(getComputedStyle(items[0]).marginRight); // Lebar item + margin
    let intervalId;

    // Fungsi untuk scroll otomatis
    function autoScroll() {
      scrollAmount += itemWidth;
      section.scrollTo({ left: scrollAmount, behavior: 'smooth' });

      // Jika sudah mencapai duplikat pertama (setelah elemen asli), reset ke elemen asli pertama
      if (scrollAmount >= itemWidth * originalItemsCount) {
        setTimeout(() => {
          section.scrollTo({ left: 0, behavior: 'instant' }); // Reset tanpa animasi
          scrollAmount = 0;
        }, 500); // Tunggu animasi selesai (sesuaikan dengan durasi scroll)
      }
    }

    // Mulai carousel otomatis setiap 3 detik
    intervalId = setInterval(autoScroll, 3000);

    // Hentikan carousel saat hover
    section.parentElement.addEventListener('mouseenter', () => {
      clearInterval(intervalId);
    });

    // Lanjutkan carousel saat mouse keluar
    section.parentElement.addEventListener('mouseleave', () => {
      intervalId = setInterval(autoScroll, 3000);
    });

    // Scroll manual dengan tombol
    const leftBtn = document.querySelector(`.${leftBtnClass}`);
    const rightBtn = document.querySelector(`.${rightBtnClass}`);

    if (leftBtn) {
      leftBtn.addEventListener('click', () => {
        clearInterval(intervalId); // Hentikan auto-scroll saat kontrol manual
        scrollAmount -= itemWidth;
        if (scrollAmount < 0) {
          scrollAmount = itemWidth * originalItemsCount;
          section.scrollTo({ left: scrollAmount, behavior: 'instant' });
          scrollAmount -= itemWidth;
        }
        section.scrollTo({ left: scrollAmount, behavior: 'smooth' });

        // Lanjutkan auto-scroll setelah kontrol manual
        intervalId = setInterval(autoScroll, 3000);
      });
    }

    if (rightBtn) {
      rightBtn.addEventListener('click', () => {
        clearInterval(intervalId); // Hentikan auto-scroll saat kontrol manual
        scrollAmount += itemWidth;
        if (scrollAmount >= itemWidth * (originalItemsCount + 1)) {
          scrollAmount = 0;
          section.scrollTo({ left: 0, behavior: 'instant' });
        }
        section.scrollTo({ left: scrollAmount, behavior: 'smooth' });

        // Lanjutkan auto-scroll setelah kontrol manual
        intervalId = setInterval(autoScroll, 3000);
      });
    }
  }

  // Setup carousel untuk setiap section
  setupCarousel('featured-products', 'scroll-left-featured', 'scroll-right-featured');
  setupCarousel('new-products', 'scroll-left-new', 'scroll-right-new');
  setupCarousel('promo-products', 'scroll-left-promo', 'scroll-right-promo');
});