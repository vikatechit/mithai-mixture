/**
 * MITHAI MIXTURE INDIA PRIVATE LIMITED
 * Google Sheets Backend API Integration & Offline Fallback
 * Connects to Google Apps Script Web App for dynamic products, order storage & enquiries.
 */

const API = {
  async fetchProducts() {
    const statusBadge = document.getElementById("sheetStatusBadge");
    
    if (!CONFIG.googleScriptUrl || CONFIG.googleScriptUrl.trim() === "") {
      if (statusBadge) {
        statusBadge.innerHTML = '<span class="status-dot dot-local"></span> Local catalogue active';
      }
      window.PRODUCTS = LOCAL_PRODUCTS.slice();
      return window.PRODUCTS;
    }

    try {
      if (statusBadge) {
        statusBadge.innerHTML = '<span class="status-dot dot-sync"></span> Syncing with Google Sheets…';
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const res = await fetch(`${CONFIG.googleScriptUrl}?action=products&v=${Date.now()}`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const data = await res.json();
      if (data && data.ok && Array.isArray(data.products) && data.products.length > 0) {
        const localMap = new Map(LOCAL_PRODUCTS.map(p => [p.name, p]));
        
        window.PRODUCTS = data.products
          .filter(p => String(p.available || "YES").trim().toUpperCase() !== "NO")
          .map(p => {
            const local = localMap.get(p.name) || {};
            return {
              id: p.id || local.id || "MM-GEN",
              name: p.name,
              cat: p.cat || local.cat || "Sweets",
              price: p.price === "" || p.price == null ? (local.price ?? null) : Number(p.price),
              unit: p.unit || local.unit || "kg",
              img: p.img && p.img.trim() !== "" ? p.img : (local.img || "assets/logo.webp"),
              desc: p.desc || local.desc || "Handcrafted traditional Mithai Mixture delicacy.",
              featured: local.featured || false
            };
          });

        if (statusBadge) {
          statusBadge.innerHTML = '<span class="status-dot dot-live"></span> Live Google Sheets connected';
        }
        return window.PRODUCTS;
      } else {
        throw new Error("Invalid products payload from Google Sheets");
      }
    } catch (err) {
      console.warn("Mithai Mixture: Google Sheets catalogue unavailable, falling back to local data.", err);
      if (statusBadge) {
        statusBadge.innerHTML = '<span class="status-dot dot-local"></span> Local catalogue active';
      }
      window.PRODUCTS = LOCAL_PRODUCTS.slice();
      return window.PRODUCTS;
    }
  },

  async saveOrder(orderPayload) {
    const fallbackId = "MM-" + new Date().toISOString().replace(/\D/g, "").slice(0, 14);
    
    if (!CONFIG.googleScriptUrl || CONFIG.googleScriptUrl.trim() === "") {
      return { ok: true, orderId: fallbackId, offline: true };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const body = new URLSearchParams();
      body.set("action", "order");
      body.set("payload", JSON.stringify(orderPayload));

      const res = await fetch(CONFIG.googleScriptUrl, {
        method: "POST",
        body: body,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const json = await res.json();
      if (json && json.ok && json.order_id) {
        return { ok: true, orderId: json.order_id, offline: false };
      }
      return { ok: true, orderId: fallbackId, offline: true };
    } catch (e) {
      console.warn("Mithai Mixture: Could not log order to Google Sheets, continuing with WhatsApp checkout.", e);
      return { ok: true, orderId: fallbackId, offline: true };
    }
  },

  async submitEnquiry(enquiryPayload) {
    const fallbackId = "ENQ-" + Date.now().toString().slice(-6);
    
    if (!CONFIG.googleScriptUrl || CONFIG.googleScriptUrl.trim() === "") {
      return { ok: true, enquiryId: fallbackId, offline: true };
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      const body = new URLSearchParams();
      body.set("action", "enquiry");
      body.set("payload", JSON.stringify(enquiryPayload));

      const res = await fetch(CONFIG.googleScriptUrl, {
        method: "POST",
        body: body,
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const json = await res.json();
      return json && json.ok ? { ok: true, enquiryId: json.enquiry_id || fallbackId } : { ok: true, enquiryId: fallbackId, offline: true };
    } catch (e) {
      return { ok: true, enquiryId: fallbackId, offline: true };
    }
  }
};
