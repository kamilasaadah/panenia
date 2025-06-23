/**
 * Panenia Admin Dashboard JavaScript
 */

document.addEventListener("DOMContentLoaded", () => {
  // Toggle Sidebar
  const sidebarToggle = document.querySelector(".sidebar-toggle");
  const sidebar = document.querySelector(".sidebar");
  const mainContent = document.querySelector(".main-content");
  const mobileSidebarToggle = document.querySelector(".mobile-sidebar-toggle");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("collapsed");
      mainContent.classList.toggle("expanded");

      // Save sidebar state to localStorage
      const sidebarCollapsed = sidebar.classList.contains("collapsed");
      localStorage.setItem("sidebarCollapsed", sidebarCollapsed);
    });
  }

  // Enhanced Mobile Sidebar Toggle
  if (mobileSidebarToggle) {
    // Multiple event listeners for better mobile support
    mobileSidebarToggle.addEventListener("click", handleMobileSidebarToggle);
    mobileSidebarToggle.addEventListener("touchstart", handleMobileSidebarToggle);
    
    // Prevent default touch behaviors that might interfere
    mobileSidebarToggle.addEventListener("touchend", (e) => {
      e.preventDefault();
    });
    
    console.log("Mobile sidebar toggle initialized");
  }

  // Handle sidebar overlay clicks
  if (sidebarOverlay) {
    sidebarOverlay.addEventListener("click", closeMobileSidebar);
    sidebarOverlay.addEventListener("touchstart", closeMobileSidebar);
  }

  // Check sidebar state from localStorage
  const sidebarCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
  if (sidebarCollapsed) {
    sidebar.classList.add("collapsed");
    mainContent.classList.add("expanded");
  }

  // Enhanced sidebar active state management
  initializeSidebarActiveState();

  // Enhanced mobile sidebar close functionality
  document.addEventListener("click", (event) => {
    const isMobile = window.innerWidth < 992;
    if (isMobile && sidebar && sidebar.classList.contains("mobile-show")) {
      if (!sidebar.contains(event.target) && 
          !mobileSidebarToggle.contains(event.target)) {
        closeMobileSidebar();
      }
    }
  });

  // Handle escape key for mobile sidebar
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && sidebar && sidebar.classList.contains("mobile-show")) {
      closeMobileSidebar();
    }
  });

  // Initialize tooltips if Bootstrap is available
  const bootstrap = window.bootstrap;
  if (typeof bootstrap !== "undefined") {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map((popoverTriggerEl) => new bootstrap.Popover(popoverTriggerEl));
  }

  // Initialize DataTables if jQuery and DataTables are available
  const $ = window.$;
  if (typeof $ !== "undefined" && typeof $.fn.DataTable !== "undefined") {
    $(".datatable").DataTable({
      responsive: true,
      language: {
        search: "_INPUT_",
        searchPlaceholder: "Cari...",
        lengthMenu: "Tampilkan _MENU_ data per halaman",
        zeroRecords: "Tidak ada data yang ditemukan",
        info: "Menampilkan _START_ sampai _END_ dari _TOTAL_ data",
        infoEmpty: "Menampilkan 0 sampai 0 dari 0 data",
        infoFiltered: "(difilter dari _MAX_ total data)",
        paginate: {
          first: "Pertama",
          last: "Terakhir",
          next: "Selanjutnya",
          previous: "Sebelumnya",
        },
      },
    });
  } else {
    console.warn("DataTables or jQuery not available. Skipping DataTables initialization.");
  }

  // Initialize Select2 if jQuery and Select2 are available
  if (typeof $ !== "undefined" && typeof $.fn.select2 !== "undefined") {
    $(".select2").select2({
      placeholder: "Pilih opsi",
      allowClear: true,
    });
  } else {
    console.warn("Select2 or jQuery not available. Skipping Select2 initialization.");
  }

  // Initialize Daterangepicker if jQuery and daterangepicker are available
  if (typeof $ !== "undefined" && typeof $.fn.daterangepicker !== "undefined") {
    $(".daterange").daterangepicker({
      locale: {
        format: "DD/MM/YYYY",
        separator: " - ",
        applyLabel: "Terapkan",
        cancelLabel: "Batal",
        fromLabel: "Dari",
        toLabel: "Sampai",
        customRangeLabel: "Kustom",
        weekLabel: "M",
        daysOfWeek: ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"],
        monthNames: [
          "Januari",
          "Februari",
          "Maret",
          "April",
          "Mei",
          "Juni",
          "Juli",
          "Agustus",
          "September",
          "Oktober",
          "November",
          "Desember",
        ],
        firstDay: 1,
      },
    });
  } else {
    console.warn("Daterangepicker or jQuery not available. Skipping Daterangepicker initialization.");
  }

  // Initialize CKEditor if available
  const ClassicEditor = window.ClassicEditor;
  if (typeof ClassicEditor !== "undefined") {
    document.querySelectorAll(".ckeditor").forEach((editor) => {
      ClassicEditor.create(editor).catch((error) => {
        console.error("CKEditor initialization error:", error);
      });
    });
  } else {
    console.warn("CKEditor not available. Skipping CKEditor initialization.");
  }

  // Image Upload Preview
  const imageUploadInputs = document.querySelectorAll(".image-upload input");
  imageUploadInputs.forEach((input) => {
    input.addEventListener("change", function (e) {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        const uploadContainer = this.parentElement;
        const previewContainer = document.createElement("div");
        previewContainer.className = "image-preview";

        reader.onload = (event) => {
          previewContainer.innerHTML = `
            <img src="${event.target.result}" alt="Preview">
            <div class="remove-image">
              <i class="fas fa-times"></i>
            </div>
          `;

          uploadContainer.parentElement.insertBefore(previewContainer, uploadContainer);
          uploadContainer.style.display = "none";

          const removeButton = previewContainer.querySelector(".remove-image");
          removeButton.addEventListener("click", () => {
            uploadContainer.style.display = "flex";
            previewContainer.remove();
            input.value = "";
          });
        };

        reader.readAsDataURL(file);
      }
    });
  });

  // Form Validation
  const forms = document.querySelectorAll(".needs-validation");
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }
        form.classList.add("was-validated");
      },
      false,
    );
  });

  // Delete Confirmation
  const deleteButtons = document.querySelectorAll('[data-action="delete"]');
  deleteButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      const itemName = this.getAttribute("data-item-name") || "item";

      if (confirm(`Apakah Anda yakin ingin menghapus ${itemName} ini?`)) {
        // Proceed with deletion
        const deleteUrl = this.getAttribute("href") || this.getAttribute("data-url");
        if (deleteUrl) {
          window.location.href = deleteUrl;
        }
      }
    });
  });

  // Status Toggle
  const statusToggles = document.querySelectorAll(".status-toggle");
  statusToggles.forEach((toggle) => {
    toggle.addEventListener("change", function () {
      const itemId = this.getAttribute("data-id");
      const status = this.checked ? 1 : 0;
      const itemType = this.getAttribute("data-type") || "item";

      // Here you would typically make an AJAX request to update the status
      console.log(`Status for ${itemType} #${itemId} changed to ${status}`);

      // Show toast notification
      if (typeof window.showToast !== "undefined") {
        window.showToast(`Status ${itemType} berhasil diperbarui`, "success");
      }
    });
  });

  // Initialize Dashboard Charts if on dashboard page
  if (
    document.getElementById("salesChart") ||
    document.getElementById("productsChart") ||
    document.getElementById("usersChart")
  ) {
    console.log("Initializing dashboard charts...");
    initializeDashboardCharts();
  }
});

// Mobile Sidebar Functions
function handleMobileSidebarToggle(e) {
  e.preventDefault();
  e.stopPropagation();
  
  const sidebar = document.querySelector(".sidebar");
  
  if (sidebar) {
    const isOpen = sidebar.classList.contains("mobile-show");
    
    if (isOpen) {
      closeMobileSidebar();
    } else {
      openMobileSidebar();
    }
    
    console.log("Mobile sidebar toggled:", !isOpen);
  }
}

function openMobileSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");
  
  if (sidebar) {
    sidebar.classList.add("mobile-show");
    document.body.style.overflow = "hidden"; // Prevent background scrolling
  }
  
  if (sidebarOverlay) {
    sidebarOverlay.classList.add("show");
  }
}

function closeMobileSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const sidebarOverlay = document.querySelector(".sidebar-overlay");
  
  if (sidebar) {
    sidebar.classList.remove("mobile-show");
    document.body.style.overflow = ""; // Restore scrolling
  }
  
  if (sidebarOverlay) {
    sidebarOverlay.classList.remove("show");
  }
}

// Sidebar Active State Management Function
function initializeSidebarActiveState() {
  try {
    // Get current page name from URL
    const currentPage = window.location.pathname.split('/').pop().replace('.html', '') || 'index';
    
    // Remove all active classes
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
      link.classList.remove('active');
    });
    
    // Add active class to current page
    const currentLink = document.querySelector(`.sidebar-menu a[data-page="${currentPage}"]`);
    if (currentLink) {
      currentLink.classList.add('active');
      console.log(`Active sidebar item set for page: ${currentPage}`);
    } else {
      console.warn(`No sidebar link found for page: ${currentPage}`);
    }
    
    // Handle sidebar clicks
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
      link.addEventListener('click', function(e) {
        // Don't prevent default for external links or logout
        if (!this.href.includes('logout') && !this.href.includes('../user/')) {
          // Remove active from all
          document.querySelectorAll('.sidebar-menu a').forEach(l => l.classList.remove('active'));
          // Add active to clicked
          this.classList.add('active');
          
          // Optional: Save active state to localStorage for persistence
          const pageName = this.getAttribute('data-page');
          if (pageName) {
            localStorage.setItem('activeSidebarPage', pageName);
          }
        }
        
        // Close mobile sidebar when link is clicked
        const isMobile = window.innerWidth < 992;
        if (isMobile) {
          closeMobileSidebar();
        }
      });
    });

    // Add tooltip attributes for collapsed sidebar
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
      const spanText = link.querySelector('span');
      if (spanText) {
        link.setAttribute('data-tooltip', spanText.textContent.trim());
      }
    });

  } catch (error) {
    console.error('Error initializing sidebar active state:', error);
  }
}

// Toast Notification Function
window.showToast = (message, type = "info") => {
  const toastContainer = document.querySelector(".toast-container") || createToastContainer();

  const toast = document.createElement("div");
  toast.className = `toast align-items-center text-white bg-${type} border-0`;
  toast.setAttribute("role", "alert");
  toast.setAttribute("aria-live", "assertive");
  toast.setAttribute("aria-atomic", "true");

  toast.innerHTML = `
    <div class="d-flex">
      <div class="toast-body">
        ${message}
      </div>
      <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

  toastContainer.appendChild(toast);

  const bootstrap = window.bootstrap;
  if (typeof bootstrap !== "undefined") {
    const bsToast = new bootstrap.Toast(toast, {
      autohide: true,
      delay: 3000,
    });
    bsToast.show();
  }

  // Remove toast from DOM after it's hidden
  toast.addEventListener("hidden.bs.toast", () => {
    toast.remove();
  });
};

function createToastContainer() {
  const container = document.createElement("div");
  container.className = "toast-container position-fixed top-0 end-0 p-3";
  container.style.zIndex = "1055";
  document.body.appendChild(container);
  return container;
}

// Dashboard Charts Initialization
function initializeDashboardCharts() {
  console.log("Dashboard charts initialization started");

  try {
    // Check if Chart.js is available
    const Chart = window.Chart;
    if (typeof Chart === "undefined") {
      console.error("Chart.js is not loaded. Please include Chart.js library.");
      return;
    }

    // Sales Chart
    if (document.getElementById("salesChart")) {
      console.log("Initializing sales chart...");
      const salesChartCtx = document.getElementById("salesChart").getContext("2d");
      const salesChart = new Chart(salesChartCtx, {
        type: "line",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"],
          datasets: [
            {
              label: "Penjualan 2023",
              data: [12, 19, 3, 5, 2, 3, 20, 33, 23, 12, 33, 10],
              backgroundColor: "rgba(25, 135, 84, 0.2)",
              borderColor: "#198754",
              borderWidth: 2,
              tension: 0.3,
              pointBackgroundColor: "#198754",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  return "Penjualan: Rp " + context.parsed.y.toLocaleString("id-ID");
                },
              },
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function(value) {
                  return "Rp " + value.toLocaleString("id-ID");
                },
              },
            },
          },
        },
      });
      console.log("Sales chart initialized successfully");
    }

    // Products Chart
    if (document.getElementById("productsChart")) {
      console.log("Initializing products chart...");
      const productsChartCtx = document.getElementById("productsChart").getContext("2d");
      const productsChart = new Chart(productsChartCtx, {
        type: "doughnut",
        data: {
          labels: ["Sayuran", "Buah-buahan", "Rempah-rempah", "Umbi-umbian", "Bahan Pokok", "Kacang-kacangan", "Tanaman Herbal", "Produk Olahan"],
          datasets: [
            {
              data: [35, 25, 15, 10, 15, 12, 8, 10],
              backgroundColor: ["#198754", "#20c997", "#0dcaf0", "#ffc107", "#fd7e14", "#6f42c1", "#d63384", "#6610f2"],
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      });
      console.log("Products chart initialized successfully");
    }

    // Users Chart
    if (document.getElementById("usersChart")) {
      console.log("Initializing users chart...");
      const usersChartCtx = document.getElementById("usersChart").getContext("2d");
      const usersChart = new Chart(usersChartCtx, {
        type: "bar",
        data: {
          labels: ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"],
          datasets: [
            {
              label: "Pengguna Baru",
              data: [12, 19, 3, 5, 2, 3],
              backgroundColor: "rgba(25, 135, 84, 0.7)",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
      console.log("Users chart initialized successfully");
    }
  } catch (error) {
    console.error("Error initializing charts:", error);
  }
}