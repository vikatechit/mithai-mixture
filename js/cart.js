/**
 * MITHAI MIXTURE INDIA PRIVATE LIMITED
 * E-Commerce Shopping Cart Engine
 * Handles precise weight calculations (0.25 kg steps), pack counts,
 * localStorage persistence, drawer rendering, and WhatsApp checkout generation.
 */

const Cart = {
  storageKey: "mm_cart",
  
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || "{}");
    } catch (e) {
      return {};
    }
  },

  saveCart(cart) {
    localStorage.setItem(this.storageKey, JSON.stringify(cart));
    this.refreshBadges();
  },

  getProduct(name) {
    return (window.PRODUCTS || LOCAL_PRODUCTS).find(p => p.name === name);
  },

  getStep(product) {
    return (product && product.unit === "kg") ? 0.25 : 1;
  },

  formatQty(qty, unit) {
    const q = Number(qty);
    if (unit === "kg") {
      return q.toFixed(2) + " kg";
    }
    const label = q > 1 ? (unit === "box" ? "boxes" : unit === "pack" ? "packs" : unit === "jar" ? "jars" : unit === "bottle" ? "bottles" : unit) : unit;
    return q + " " + label;
  },

  formatMoney(num) {
    if (num == null || num === "" || isNaN(num)) return "Price on request";
    return "₹" + Number(num).toLocaleString("en-IN", { maximumFractionDigits: 0 });
  },

  escapeHtml(str) {
    return String(str ?? "").replace(/[&<>"']/g, c => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  },

  addItem(name, customQty = null) {
    const product = this.getProduct(name);
    if (!product) return;
    const step = this.getStep(product);
    const cart = this.getCart();
    const current = Number(cart[name] || 0);
    const addVal = customQty != null ? Number(customQty) : step;
    
    cart[name] = Number((current + addVal).toFixed(2));
    this.saveCart(cart);
    this.showToast(`Added ${this.formatQty(addVal, product.unit)} of ${name} to your order.`);
    this.open();
  },

  changeQty(name, dir) {
    const product = this.getProduct(name);
    if (!product) return;
    const step = this.getStep(product);
    const cart = this.getCart();
    const current = Number(cart[name] || 0);
    const newQty = Number((current + (dir * step)).toFixed(2));
    
    if (newQty <= 0) {
      delete cart[name];
      this.showToast(`Removed ${name} from your order.`);
    } else {
      cart[name] = newQty;
    }
    this.saveCart(cart);
    this.render();
  },

  removeItem(name) {
    const cart = this.getCart();
    delete cart[name];
    this.saveCart(cart);
    this.render();
    this.showToast(`Removed ${name} from your order.`);
  },

  clear() {
    localStorage.removeItem(this.storageKey);
    this.refreshBadges();
    this.render();
  },

  getItemCount() {
    const cart = this.getCart();
    return Object.keys(cart).length;
  },

  refreshBadges() {
    const count = this.getItemCount();
    document.querySelectorAll("[data-count]").forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? "inline-block" : "inline-block";
    });
  },

  calculateTotals() {
    const cart = this.getCart();
    let subtotal = 0;
    let hasPriceOnRequest = false;
    const items = [];

    Object.keys(cart).forEach(name => {
      const p = this.getProduct(name);
      if (!p) return;
      const qty = Number(cart[name]);
      let lineTotal = null;

      if (p.price != null && p.price !== "" && !isNaN(p.price)) {
        lineTotal = Math.round(Number(p.price) * qty * 100) / 100;
        subtotal += lineTotal;
      } else {
        hasPriceOnRequest = true;
      }

      items.push({
        name: p.name,
        qty: qty,
        unit: p.unit,
        price: p.price,
        lineTotal: lineTotal,
        img: p.img,
        cat: p.cat
      });
    });

    return { items, subtotal, hasPriceOnRequest };
  },

  open() {
    this.render();
    const overlay = document.getElementById("cartOverlay");
    if (overlay) {
      overlay.classList.add("show");
      document.body.style.overflow = "hidden";
    }
  },

  close() {
    const overlay = document.getElementById("cartOverlay");
    if (overlay) {
      overlay.classList.remove("show");
      document.body.style.overflow = "";
    }
  },

  render() {
    const { items, subtotal, hasPriceOnRequest } = this.calculateTotals();
    const container = document.getElementById("cartDrawerItems");
    const totalEl = document.getElementById("cartDrawerTotal");
    const noteEl = document.getElementById("cartDrawerNote");

    if (container) {
      if (items.length === 0) {
        container.innerHTML = `
          <div class="cart-empty-state">
            <div class="empty-icon">🛒</div>
            <h4>Your order is currently empty</h4>
            <p>Explore our royal traditional sweets, biscuits, beverages and savoury mixtures to begin.</p>
            <a href="shop.html" class="btn btn-gold btn-sm" onclick="Cart.close()">Browse Sweets &amp; Snacks</a>
          </div>
        `;
      } else {
        container.innerHTML = items.map(item => `
          <div class="cart-item-row">
            <img class="cart-item-thumb" src="${this.escapeHtml(item.img)}" alt="${this.escapeHtml(item.name)}" onerror="this.src='assets/logo.webp'">
            <div class="cart-item-details">
              <strong class="cart-item-title">${this.escapeHtml(item.name)}</strong>
              <div class="cart-item-rate">
                ${item.price != null ? this.formatMoney(item.price) + ' <span class="rate-unit">/ ' + this.escapeHtml(item.unit) + '</span>' : '<span class="por-badge">Price on request</span>'}
              </div>
              <div class="cart-item-controls">
                <div class="qty-stepper">
                  <button type="button" class="btn-qty" onclick="Cart.changeQty('${this.escapeHtml(item.name).replace(/'/g, "\\'")}', -1)" aria-label="Decrease quantity">−</button>
                  <span class="qty-display">${this.formatQty(item.qty, item.unit)}</span>
                  <button type="button" class="btn-qty" onclick="Cart.changeQty('${this.escapeHtml(item.name).replace(/'/g, "\\'")}', 1)" aria-label="Increase quantity">+</button>
                </div>
                <button type="button" class="btn-remove-item" onclick="Cart.removeItem('${this.escapeHtml(item.name).replace(/'/g, "\\'")}')">Remove</button>
              </div>
            </div>
            <div class="cart-item-total">
              ${item.lineTotal != null ? this.formatMoney(item.lineTotal) : '<em>Pending</em>'}
            </div>
          </div>
        `).join("");
      }
    }

    if (totalEl) {
      if (items.length === 0) {
        totalEl.textContent = "₹0";
      } else if (hasPriceOnRequest) {
        totalEl.textContent = subtotal > 0 ? `${this.formatMoney(subtotal)} + confirmation` : "Price on request";
      } else {
        totalEl.textContent = this.formatMoney(subtotal);
      }
    }

    if (noteEl) {
      noteEl.style.display = hasPriceOnRequest ? "block" : "none";
    }

    // Also update order review page container if present
    const reviewContainer = document.getElementById("orderReviewItems");
    const reviewTotalEl = document.getElementById("orderReviewTotal");
    if (reviewContainer) {
      if (items.length === 0) {
        reviewContainer.innerHTML = `
          <div class="cart-empty-state">
            <h4>No items in your order yet</h4>
            <p>Please add products to continue with checkout.</p>
            <a href="shop.html" class="btn btn-gold btn-sm">Explore Collection</a>
          </div>
        `;
      } else {
        reviewContainer.innerHTML = items.map(item => `
          <div class="cart-item-row">
            <img class="cart-item-thumb" src="${this.escapeHtml(item.img)}" alt="${this.escapeHtml(item.name)}" onerror="this.src='assets/logo.webp'">
            <div class="cart-item-details">
              <strong class="cart-item-title">${this.escapeHtml(item.name)}</strong>
              <div class="cart-item-rate">
                ${item.price != null ? this.formatMoney(item.price) + ' / ' + this.escapeHtml(item.unit) : '<span class="por-badge">Price on request</span>'}
              </div>
              <div class="cart-item-controls">
                <div class="qty-stepper">
                  <button type="button" class="btn-qty" onclick="Cart.changeQty('${this.escapeHtml(item.name).replace(/'/g, "\\'")}', -1)">−</button>
                  <span class="qty-display">${this.formatQty(item.qty, item.unit)}</span>
                  <button type="button" class="btn-qty" onclick="Cart.changeQty('${this.escapeHtml(item.name).replace(/'/g, "\\'")}', 1)">+</button>
                </div>
                <button type="button" class="btn-remove-item" onclick="Cart.removeItem('${this.escapeHtml(item.name).replace(/'/g, "\\'")}')">Remove</button>
              </div>
            </div>
            <div class="cart-item-total">
              ${item.lineTotal != null ? this.formatMoney(item.lineTotal) : '<em>Price on request</em>'}
            </div>
          </div>
        `).join("");
      }
    }
    if (reviewTotalEl) {
      if (items.length === 0) {
        reviewTotalEl.textContent = "₹0";
      } else if (hasPriceOnRequest) {
        reviewTotalEl.textContent = subtotal > 0 ? `${this.formatMoney(subtotal)} + confirmation` : "Price on request";
      } else {
        reviewTotalEl.textContent = this.formatMoney(subtotal);
      }
    }
  },

  showToast(msg) {
    let toast = document.getElementById("mmToast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "mmToast";
      toast.className = "mm-toast";
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("visible");
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove("visible");
    }, 2800);
  }
};
