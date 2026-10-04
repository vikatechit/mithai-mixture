/**
 * MITHAI MIXTURE INDIA PRIVATE LIMITED
 * Core Application UI & Interaction Controller
 * Manages product rendering, search, filters, quick-view modal, checkout & WhatsApp deep links.
 */

const App = {
  activeCategory: "All",
  searchQuery: "",
  sortBy: "featured",

  init() {
    this.setupNavigation();
    this.setupFooterYear();
    this.setupModal();
    this.setupDrawerTriggers();
    Cart.refreshBadges();
    Cart.render();

    // Trigger catalogue sync
    API.fetchProducts().then(() => {
      this.renderCurrentView();
    });
  },

  setupNavigation() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a, .bottom-nav a").forEach(link => {
      const href = link.getAttribute("href");
      if (href === currentPath || (currentPath === "" && href === "index.html")) {
        link.classList.add("active");
      }
    });
  },

  setupFooterYear() {
    const el = document.getElementById("currentYear");
    if (el) el.textContent = new Date().getFullYear();
  },

  setupDrawerTriggers() {
    const overlay = document.getElementById("cartOverlay");
    if (overlay) {
      overlay.addEventListener("click", e => {
        if (e.target === overlay) Cart.close();
      });
    }
    document.addEventListener("keydown", e => {
      if (e.key === "Escape") {
        Cart.close();
        this.closeModal();
      }
    });
  },

  setupModal() {
    let modal = document.getElementById("productModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "productModal";
      modal.className = "mm-modal-overlay";
      modal.innerHTML = `
        <div class="mm-modal-card" role="dialog" aria-modal="true">
          <button type="button" class="mm-modal-close" onclick="App.closeModal()" aria-label="Close modal">×</button>
          <div class="mm-modal-body" id="modalContent"></div>
        </div>
      `;
      document.body.appendChild(modal);
      modal.addEventListener("click", e => {
        if (e.target === modal) this.closeModal();
      });
    }
  },

  openModal(productName) {
    const product = (window.PRODUCTS || LOCAL_PRODUCTS).find(p => p.name === productName);
    if (!product) return;

    const modal = document.getElementById("productModal");
    const content = document.getElementById("modalContent");
    if (!modal || !content) return;

    const step = Cart.getStep(product);
    const initialQty = step;
    const isKg = product.unit === "kg";

    content.innerHTML = `
      <div class="modal-grid">
        <div class="modal-media">
          <img src="${Cart.escapeHtml(product.img)}" alt="${Cart.escapeHtml(product.name)}" onerror="this.src='assets/logo.webp'">
        </div>
        <div class="modal-info">
          <span class="product-badge">${Cart.escapeHtml(product.cat)}</span>
          <h2>${Cart.escapeHtml(product.name)}</h2>
          <div class="modal-price">
            ${product.price != null ? Cart.formatMoney(product.price) + ' <span class="unit">/ ' + Cart.escapeHtml(product.unit) + '</span>' : '<span class="por-badge">Price on request</span>'}
          </div>
          <p class="modal-desc">${Cart.escapeHtml(product.desc)}</p>
          
          <div class="modal-weight-selector">
            <label>Select Quantity (${isKg ? 'kg' : 'units'}):</label>
            <div class="modal-qty-row">
              <button type="button" class="btn-qty" onclick="App.adjustModalQty(-${step})">−</button>
              <input type="text" id="modalQtyInput" readonly value="${Cart.formatQty(initialQty, product.unit)}" data-raw="${initialQty}">
              <button type="button" class="btn-qty" onclick="App.adjustModalQty(${step})">+</button>
            </div>
            ${isKg ? '<small class="weight-hint">Available in 250g (0.25 kg) traditional portions</small>' : ''}
          </div>

          <div class="modal-actions">
            <button type="button" class="btn btn-gold btn-block" onclick="App.addFromModal('${Cart.escapeHtml(product.name).replace(/'/g, "\\'")}')">
              ADD TO ORDER
            </button>
            <button type="button" class="btn btn-whatsapp btn-block" onclick="App.orderDirectWhatsApp('${Cart.escapeHtml(product.name).replace(/'/g, "\\'")}')">
              ORDER DIRECT ON WHATSAPP
            </button>
          </div>
        </div>
      </div>
    `;

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
  },

  adjustModalQty(delta) {
    const input = document.getElementById("modalQtyInput");
    if (!input) return;
    const current = Number(input.dataset.raw || 1);
    const product = (window.PRODUCTS || LOCAL_PRODUCTS).find(p => p.name === input.closest(".modal-info").querySelector("h2").textContent);
    const step = Cart.getStep(product);
    let next = Number((current + delta).toFixed(2));
    if (next < step) next = step;
    input.dataset.raw = next;
    input.value = Cart.formatQty(next, product ? product.unit : "unit");
  },

  addFromModal(productName) {
    const input = document.getElementById("modalQtyInput");
    const qty = input ? Number(input.dataset.raw) : null;
    Cart.addItem(productName, qty);
    this.closeModal();
  },

  orderDirectWhatsApp(productName) {
    const product = (window.PRODUCTS || LOCAL_PRODUCTS).find(p => p.name === productName);
    if (!product) return;
    const input = document.getElementById("modalQtyInput");
    const qty = input ? Number(input.dataset.raw) : Cart.getStep(product);
    const formattedQty = Cart.formatQty(qty, product.unit);
    const priceText = product.price != null ? `${Cart.formatMoney(product.price)} / ${product.unit}` : "Price on request";
    const lineTotal = product.price != null ? ` = ${Cart.formatMoney(Math.round(product.price * qty * 100) / 100)}` : "";

    const msg = `MITHAI MIXTURE — DIRECT ORDER ENQUIRY\n\nTaste with Tradition ✨\n\nHello, I would like to order:\n• ${product.name} — ${formattedQty} (Rate: ${priceText}${lineTotal})\n\nPlease confirm product availability, packaging, delivery charges and payment instructions.\n\nThank you!`;
    
    window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(msg)}`, "_blank");
  },

  closeModal() {
    const modal = document.getElementById("productModal");
    if (modal) {
      modal.classList.remove("show");
      document.body.style.overflow = "";
    }
  },

  renderCurrentView() {
    const grid = document.getElementById("productGrid");
    if (grid) {
      this.renderProducts();
    }
    const rateRows = document.getElementById("rateRows");
    if (rateRows) {
      this.renderRateList();
    }
    const bestSellers = document.getElementById("bestSellersGrid");
    if (bestSellers) {
      this.renderBestSellers();
    }
  },

  setCategory(categoryName) {
    this.activeCategory = categoryName;
    document.querySelectorAll("[data-chip]").forEach(chip => {
      chip.classList.toggle("active", chip.dataset.chip === categoryName);
    });

    const meta = CONFIG.categories[categoryName] || CONFIG.categories.All;
    const bannerImg = document.getElementById("categoryBanner");
    const bannerTitle = document.getElementById("bannerTitle");
    const bannerDesc = document.getElementById("bannerDesc");

    if (bannerImg) bannerImg.src = meta.banner;
    if (bannerTitle) bannerTitle.textContent = meta.name;
    if (bannerDesc) bannerDesc.textContent = meta.desc;

    this.renderProducts();
  },

  renderProducts() {
    const grid = document.getElementById("productGrid");
    if (!grid) return;

    const searchInput = document.getElementById("searchBox");
    const sortSelect = document.getElementById("sortBox");
    const query = (searchInput ? searchInput.value : "").trim().toLowerCase();
    const sort = sortSelect ? sortSelect.value : "featured";

    let list = (window.PRODUCTS || LOCAL_PRODUCTS).filter(p => {
      const matchCat = this.activeCategory === "All" || p.cat === this.activeCategory;
      const matchSearch = p.name.toLowerCase().includes(query) || (p.desc && p.desc.toLowerCase().includes(query));
      return matchCat && matchSearch;
    });

    if (sort === "low") {
      list.sort((a, b) => (a.price ?? 999999) - (b.price ?? 999999));
    } else if (sort === "high") {
      list.sort((a, b) => (b.price ?? -1) - (a.price ?? -1));
    } else if (sort === "az") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === "featured") {
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    if (list.length === 0) {
      grid.innerHTML = `
        <div class="no-products-found">
          <div class="empty-icon">🔍</div>
          <h3>No matching delicacies found</h3>
          <p>Try searching for a different sweet, savoury snack, or reset the filters.</p>
          <button class="btn btn-outline-gold" onclick="App.resetSearch()">Show All Products</button>
        </div>
      `;
      return;
    }

    grid.innerHTML = list.map(p => `
      <article class="product-card">
        <div class="product-media" onclick="App.openModal('${Cart.escapeHtml(p.name).replace(/'/g, "\\'")}')">
          <img loading="lazy" src="${Cart.escapeHtml(p.img)}" alt="${Cart.escapeHtml(p.name)}" onerror="this.src='assets/logo.webp'">
          <span class="product-badge">${Cart.escapeHtml(p.cat)}</span>
        </div>
        <div class="product-body">
          <h3 class="product-title" onclick="App.openModal('${Cart.escapeHtml(p.name).replace(/'/g, "\\'")}')">${Cart.escapeHtml(p.name)}</h3>
          <p class="product-desc">${Cart.escapeHtml(p.desc || "Handcrafted traditional Mithai Mixture product.")}</p>
          <div class="product-meta">
            <div class="product-price">
              ${p.price != null ? Cart.formatMoney(p.price) + ' <span class="unit">/ ' + Cart.escapeHtml(p.unit) + '</span>' : '<span class="por-badge">Price on request</span>'}
            </div>
            <button type="button" class="btn-quick-add" onclick="Cart.addItem('${Cart.escapeHtml(p.name).replace(/'/g, "\\'")}')" aria-label="Add ${Cart.escapeHtml(p.name)} to order">
              ADD TO ORDER
            </button>
          </div>
        </div>
      </article>
    `).join("");
  },

  renderBestSellers() {
    const container = document.getElementById("bestSellersGrid");
    if (!container) return;

    const list = (window.PRODUCTS || LOCAL_PRODUCTS).filter(p => p.featured).slice(0, 8);
    container.innerHTML = list.map(p => `
      <article class="product-card">
        <div class="product-media" onclick="App.openModal('${Cart.escapeHtml(p.name).replace(/'/g, "\\'")}')">
          <img loading="lazy" src="${Cart.escapeHtml(p.img)}" alt="${Cart.escapeHtml(p.name)}" onerror="this.src='assets/logo.webp'">
          <span class="product-badge">${Cart.escapeHtml(p.cat)}</span>
        </div>
        <div class="product-body">
          <h3 class="product-title" onclick="App.openModal('${Cart.escapeHtml(p.name).replace(/'/g, "\\'")}')">${Cart.escapeHtml(p.name)}</h3>
          <p class="product-desc">${Cart.escapeHtml(p.desc)}</p>
          <div class="product-meta">
            <div class="product-price">
              ${p.price != null ? Cart.formatMoney(p.price) + ' <span class="unit">/ ' + Cart.escapeHtml(p.unit) + '</span>' : '<span class="por-badge">Price on request</span>'}
            </div>
            <button type="button" class="btn-quick-add" onclick="Cart.addItem('${Cart.escapeHtml(p.name).replace(/'/g, "\\'")}')">
              ADD TO ORDER
            </button>
          </div>
        </div>
      </article>
    `).join("");
  },

  renderRateList() {
    const box = document.getElementById("rateRows");
    if (!box) return;

    // The mandatory 28 traditional sweets sold by kg
    const list = (window.PRODUCTS || LOCAL_PRODUCTS).filter(p => p.cat === "Sweets" && p.unit === "kg" && p.price != null);

    box.innerHTML = list.map((p, index) => `
      <div class="rate-row">
        <div class="col-num">${index + 1}</div>
        <div class="col-img">
          <img src="${Cart.escapeHtml(p.img)}" alt="${Cart.escapeHtml(p.name)}" onerror="this.src='assets/logo.webp'" onclick="App.openModal('${Cart.escapeHtml(p.name).replace(/'/g, "\\'")}')">
        </div>
        <div class="col-title" onclick="App.openModal('${Cart.escapeHtml(p.name).replace(/'/g, "\\'")}')">
          <strong>${Cart.escapeHtml(p.name)}</strong>
          <small>${Cart.escapeHtml(p.desc)}</small>
        </div>
        <div class="col-price">
          <span class="rate-amount">${Cart.formatMoney(p.price)}</span>
          <span class="rate-unit">per kg</span>
        </div>
        <div class="col-action">
          <button type="button" class="btn-rate-add" onclick="Cart.addItem('${Cart.escapeHtml(p.name).replace(/'/g, "\\'")}')">
            + ADD
          </button>
        </div>
      </div>
    `).join("");
  },

  resetSearch() {
    const searchInput = document.getElementById("searchBox");
    if (searchInput) searchInput.value = "";
    this.setCategory("All");
  },

  async handleCheckout(e) {
    e.preventDefault();
    const cart = Cart.getCart();
    if (Object.keys(cart).length === 0) {
      alert("Your order is empty. Please add items before submitting.");
      return;
    }

    const nameInput = document.getElementById("checkoutName");
    const phoneInput = document.getElementById("checkoutPhone");
    const addressInput = document.getElementById("checkoutAddress");
    const notesInput = document.getElementById("checkoutNotes");
    const submitBtn = document.getElementById("btnSubmitOrder");

    const name = nameInput ? nameInput.value.trim() : "";
    const phone = phoneInput ? phoneInput.value.trim() : "";
    const address = addressInput ? addressInput.value.trim() : "";
    const notes = notesInput ? notesInput.value.trim() : "";

    if (!name || !phone || !address) {
      alert("Please provide your full name, 10-digit mobile number, and complete delivery address.");
      return;
    }

    // Phone validation (accepts 10 digits or with +91)
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      alert("Please enter a valid 10-digit mobile phone number.");
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "SAVING ORDER & PREPARING WHATSAPP…";
    }

    const { items, subtotal, hasPriceOnRequest } = Cart.calculateTotals();

    const orderPayload = {
      customer: { name, phone, address, notes },
      items: items.map(x => ({
        name: x.name,
        qty: x.qty,
        unit: x.unit,
        price: x.price,
        lineTotal: x.lineTotal
      })),
      total: subtotal
    };

    // Attempt saving to Google Sheets
    const result = await API.saveOrder(orderPayload);
    const orderId = result.orderId;

    // Construct WhatsApp Message
    const orderLines = items.map((item, idx) => {
      const qText = Cart.formatQty(item.qty, item.unit);
      const rateText = item.price != null ? `${Cart.formatMoney(item.price)} / ${item.unit}` : "Price on request";
      const lineText = item.lineTotal != null ? ` = ${Cart.formatMoney(item.lineTotal)}` : "";
      return `${idx + 1}. *${item.name}*\n   ${qText} × ${rateText}${lineText}`;
    }).join("\n\n");

    const totalText = hasPriceOnRequest
      ? (subtotal > 0 ? `${Cart.formatMoney(subtotal)} + confirmation` : "Price on request")
      : Cart.formatMoney(subtotal);

    const waMessage = 
`*MITHAI MIXTURE — ORDER REQUEST*
*“Taste with Tradition”* ✨

*Order ID:* ${orderId}
*Customer Name:* ${name}
*Phone:* ${phone}
*Delivery Address:* ${address}${notes ? `\n*Notes:* ${notes}` : ""}

---------------------------------
*ORDER ITEMS*
---------------------------------
${orderLines}

---------------------------------
*ESTIMATED TOTAL:* ${totalText}
---------------------------------

Please confirm product availability, pack sizes, delivery charges and final payable amount.

Thank you for choosing Mithai Mixture!`;

    const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waMessage)}`;

    // Store in sessionStorage for success page
    sessionStorage.setItem("mm_last_order", JSON.stringify({
      orderId,
      customer: { name, phone, address, notes },
      items,
      subtotal,
      totalText,
      waUrl,
      createdAt: new Date().toISOString()
    }));

    // Clear cart
    Cart.clear();

    // Open WhatsApp in new tab and redirect current page to success.html
    window.open(waUrl, "_blank");
    window.location.href = "success.html";
  },

  async handleEnquiry(e) {
    e.preventDefault();
    const name = document.getElementById("enqName")?.value.trim();
    const phone = document.getElementById("enqPhone")?.value.trim();
    const message = document.getElementById("enqMessage")?.value.trim();
    const btn = document.getElementById("enqSubmitBtn");

    if (!name || !phone || !message) {
      alert("Please fill in all fields before sending your enquiry.");
      return;
    }

    if (btn) {
      btn.disabled = true;
      btn.textContent = "Sending…";
    }

    const payload = { name, phone, message, date: new Date().toISOString() };
    await API.submitEnquiry(payload);

    const waMsg = `*MITHAI MIXTURE — CUSTOMER ENQUIRY*\n\n*Name:* ${name}\n*Phone:* ${phone}\n\n*Message:*\n${message}\n\nThank you!`;
    const waUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(waMsg)}`;

    alert("Thank you! Your enquiry has been recorded. Opening WhatsApp for direct assistance.");
    window.open(waUrl, "_blank");
    if (btn) {
      btn.disabled = false;
      btn.textContent = "Send Message";
    }
    e.target.reset();
  }
};

// Global shortcuts for inline HTML attributes
window.openCart = () => Cart.open();
window.closeCart = () => Cart.close();
window.addToCart = name => Cart.addItem(name);
window.setCategory = cat => App.setCategory(cat);

document.addEventListener("DOMContentLoaded", () => {
  App.init();
});
