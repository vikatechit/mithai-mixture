import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { CATALOG } from '../data/catalog'
import { BRAND, formatWhatsapp } from '../data/brand'
import { fetchOrders, fetchProducts, fetchSettings, postAction } from '../lib/sheets'
import { orderStamp, stepFor } from '../lib/format'

const StoreContext = createContext(null)

const K = {
  cart: 'mm_cart_v5',
  orders: 'mm_orders_v5',
  custom: 'mm_custom_products_v5',
  hidden: 'mm_hidden_v5',
  hash: 'mm_admin_hash_v5',
  script: 'mm_script_url_v5',
  enquiries: 'mm_enquiries_v5',
  whatsapp: 'mm_whatsapp_v5',
  addresses: 'mm_addresses_v5',
  social: 'mm_social_v5',
  email: 'mm_email_v5'
}

function shopEmail(value) {
  const email = String(value || '').trim()
  return email.toLowerCase() === 'vikatechit@gmail.com' ? '' : email
}

function shopInstagram(value) {
  const url = String(value || '').trim()
  return /instagram\.com\/vikatechit\/?$/i.test(url) ? '' : url
}

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

export async function sha256(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
}

function productKey(name) {
  const key = String(name || '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ')
  const aliases = {
    'rost kalathihan': 'rost kalakand',
    'rost kalakhand': 'rost kalakand',
    'spl kolakand': 'spl kalakand',
    'arusulu': 'ariselu',
    'basan laddu': 'besan laddu',
    'sooanpapdi': 'soanpapdi',
    'soan papdi': 'soanpapdi',
    'rasgulla pack': 'rasgulla',
    'gulab jamun pack': 'gulab jamun',
    'motichoor ladoo pack': 'motichoor ladoo',
    'kaju katli pack': 'kaju katli',
    'pista barfi pack': 'pista barfi',
    'mithai badam 350ml': 'mithai badam milk',
    'mithai badam': 'mithai badam milk',
    'chocolate truffles': 'truffles',
    'premium assorted chocolates': 'premium chocolate gift box'
  }
  return aliases[key] || key
}

function matchLocal(p) {
  const key = productKey(p.name)
  if (!key) return null
  return CATALOG.find(c => productKey(c.name) === key) || null
}

function sheetImage(src) {
  if (!src) return ''
  if (/^https?:/i.test(src) || src.startsWith('/')) return src
  return `/${String(src).replace(/^\.?\//, '')}`
}

function normalizeSheetProduct(p) {
  const local = matchLocal(p)
  const price = p.price === '' || p.price == null || Number.isNaN(Number(p.price)) ? (local?.price ?? null) : Number(p.price)
  return {
    id: p.id || local?.id || `MM-${Date.now()}`,
    name: p.name,
    price,
    cat: p.cat || local?.cat || 'Sweets',
    unit: p.unit || local?.unit || 'kg',
    img: local?.img || sheetImage(p.img) || BRAND.logo,
    fallback: local?.fallback || sheetImage(p.img) || BRAND.logo,
    desc: p.desc || local?.desc || 'Handcrafted Mithai Mixture speciality.',
    featured: local?.featured || false,
    available: p.available || 'YES'
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => read(K.cart, {}))
  const [custom, setCustom] = useState(() => read(K.custom, []))
  const [hidden, setHidden] = useState(() => read(K.hidden, []))
  const [orders, setOrders] = useState(() => read(K.orders, []))
  const [scriptUrl, setScriptUrlState] = useState(() => localStorage.getItem(K.script) || BRAND.scriptUrl)
  const [whatsapp, setWhatsappState] = useState(() => localStorage.getItem(K.whatsapp) || BRAND.whatsapp)
  const [addresses, setAddresses] = useState(() => read(K.addresses, []))
  const [social, setSocial] = useState(() => {
    const saved = read(K.social, { instagram: BRAND.instagram, facebook: BRAND.facebook, youtube: BRAND.youtube })
    return { ...saved, instagram: shopInstagram(saved.instagram) }
  })
  const [email, setEmail] = useState(() => shopEmail(localStorage.getItem(K.email) || BRAND.email))
  const [sheetProducts, setSheetProducts] = useState(null)
  const [sheetNote, setSheetNote] = useState('')
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('mm_admin_session_v5') === 'yes')
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => { localStorage.setItem(K.cart, JSON.stringify(cart)) }, [cart])
  useEffect(() => { localStorage.setItem(K.custom, JSON.stringify(custom)) }, [custom])
  useEffect(() => { localStorage.setItem(K.hidden, JSON.stringify(hidden)) }, [hidden])
  useEffect(() => { localStorage.setItem(K.orders, JSON.stringify(orders)) }, [orders])

  const phone = formatWhatsapp(whatsapp)

  useEffect(() => {
    if (!scriptUrl) return undefined
    let cancel = false
    fetchSettings(scriptUrl)
      .then(data => {
        if (cancel || !data?.ok) return
        if (data.whatsapp) {
          const next = formatWhatsapp(data.whatsapp)
          localStorage.setItem(K.whatsapp, next.whatsapp)
          setWhatsappState(next.whatsapp)
        }
        if (Array.isArray(data.addresses)) {
          localStorage.setItem(K.addresses, JSON.stringify(data.addresses))
          setAddresses(data.addresses)
        }
        const nextSocial = {
          instagram: shopInstagram(data.instagram ?? BRAND.instagram),
          facebook: data.facebook ?? '',
          youtube: data.youtube ?? ''
        }
        localStorage.setItem(K.social, JSON.stringify(nextSocial))
        setSocial(nextSocial)
        if (data.email != null) {
          const nextEmail = shopEmail(data.email || BRAND.email)
          localStorage.setItem(K.email, nextEmail)
          setEmail(nextEmail)
        }
      })
      .catch(() => {})
    return () => { cancel = true }
  }, [scriptUrl])

  const products = useMemo(() => {
    const base = (sheetProducts?.length ? sheetProducts : CATALOG).map(p => ({ ...p }))
    const ids = new Set(base.map(p => p.id))
    const names = new Set(base.map(p => p.name.toLowerCase()))
    custom.forEach(p => {
      if (!ids.has(p.id) && !names.has(String(p.name).toLowerCase())) base.unshift(p)
    })
    return base.filter(p => !hidden.includes(p.id) && String(p.available || 'YES').toUpperCase() !== 'NO')
  }, [sheetProducts, custom, hidden])

  useEffect(() => {
    if (!scriptUrl) {
      setSheetProducts(null)
      setSheetNote('Google Sheet is not connected. This browser is using the built-in catalogue.')
      return
    }
    let cancel = false
    setSheetNote('Reading products from Google Sheet…')
    fetchProducts(scriptUrl)
      .then(data => {
        if (cancel) return
        if (data?.ok && Array.isArray(data.products) && data.products.length) {
          setSheetProducts(data.products.map(normalizeSheetProduct))
          setSheetNote('Prices and items are live from your Google Sheet.')
        } else {
          setSheetProducts(null)
          setSheetNote('Sheet connected, but the Products tab is empty. The website catalogue is showing.')
        }
      })
      .catch(() => {
        if (cancel) return
        setSheetProducts(null)
        setSheetNote('Could not reach Google Sheet. The website catalogue is showing.')
      })
    return () => { cancel = true }
  }, [scriptUrl])

  const showToast = (msg) => {
    setToast(msg)
    window.clearTimeout(showToast._t)
    showToast._t = window.setTimeout(() => setToast(''), 2600)
  }

  const productById = (id) => products.find(p => p.id === id) || custom.find(p => p.id === id) || CATALOG.find(p => p.id === id)

  const lines = useMemo(() => {
    return Object.entries(cart).map(([id, qty]) => {
      const product = productById(id)
      if (!product) return null
      const price = product.price
      const lineTotal = price == null ? null : Math.round(Number(price) * Number(qty) * 100) / 100
      return { ...product, qty: Number(qty), lineTotal }
    }).filter(Boolean)
  }, [cart, products, custom])

  const subtotal = lines.reduce((sum, line) => sum + (line.lineTotal || 0), 0)
  const hasPriceOnRequest = lines.some(line => line.lineTotal == null)

  const add = (product, qty) => {
    const step = qty ?? stepFor(product.unit)
    setCart(c => ({ ...c, [product.id]: Number(((c[product.id] || 0) + step).toFixed(2)) }))
    setCartOpen(true)
    showToast(`${product.name} added to your order`)
  }

  const changeQty = (id, dir) => {
    const product = productById(id)
    if (!product) return
    const step = stepFor(product.unit)
    setCart(c => {
      const next = Number(((c[id] || 0) + dir * step).toFixed(2))
      const copy = { ...c }
      if (next <= 0) delete copy[id]
      else copy[id] = next
      return copy
    })
  }

  const remove = (id) => setCart(c => {
    const copy = { ...c }
    delete copy[id]
    return copy
  })

  const clearCart = () => setCart({})

  const placeOrder = async (customer) => {
    const id = orderStamp()
    const order = {
      id,
      date: new Date().toISOString(),
      name: customer.name,
      phone: customer.phone,
      address: customer.address,
      note: customer.note || '',
      items: lines.map(line => ({
        name: line.name,
        qty: line.qty,
        unit: line.unit,
        price: line.price,
        lineTotal: line.lineTotal,
        cat: line.cat
      })),
      total: subtotal,
      status: 'New'
    }
    setOrders(prev => [order, ...prev])
    clearCart()
    if (scriptUrl) {
      try {
        const data = await postAction(scriptUrl, 'order', {
          customer,
          items: order.items,
          total: order.total
        })
        if (data?.order_id) {
          setOrders(prev => prev.map(o => o.id === id ? { ...o, id: data.order_id, sheetId: data.order_id } : o))
          return { ...order, id: data.order_id }
        }
      } catch {
        /* local copy already saved */
      }
    }
    return order
  }

  const saveEnquiry = async (enquiry) => {
    const row = { id: `ENQ-${Date.now()}`, date: new Date().toISOString(), ...enquiry, status: 'New' }
    const all = read(K.enquiries, [])
    localStorage.setItem(K.enquiries, JSON.stringify([row, ...all]))
    if (scriptUrl) {
      try { await postAction(scriptUrl, 'enquiry', enquiry) } catch { /* ignore */ }
    }
    return row
  }

  const passwordMatches = async (password) => {
    if (scriptUrl) {
      try {
        const data = await fetchOrders(scriptUrl, password)
        if (data?.ok) return true
        if (data && data.ok === false) return false
      } catch {
        /* sheet unreachable, use this browser's saved password */
      }
    }
    const hash = await sha256(password)
    const saved = localStorage.getItem(K.hash)
    if (!saved) return hash === await sha256(BRAND.defaultPassword)
    return hash === saved
  }

  const login = async (password) => {
    const ok = await passwordMatches(password)
    if (!ok) return false
    localStorage.setItem(K.hash, await sha256(password))
    sessionStorage.setItem('mm_admin_session_v5', 'yes')
    sessionStorage.setItem('mm_admin_pw', password)
    setAuthed(true)
    return true
  }

  const logout = () => {
    sessionStorage.removeItem('mm_admin_session_v5')
    sessionStorage.removeItem('mm_admin_pw')
    setAuthed(false)
  }

  const changePassword = async (current, next) => {
    if (!(await passwordMatches(current))) return { ok: false, error: 'Current password is incorrect.' }
    if (!next || next.length < 6) return { ok: false, error: 'Use at least 6 characters.' }
    if (scriptUrl) {
      try {
        const data = await postAction(scriptUrl, 'password', { password: current, newPassword: next })
        if (!data?.ok) return { ok: false, error: data?.error || 'Google Sheet did not accept the new password.' }
      } catch {
        return { ok: false, error: 'Google Sheet could not be reached, so the password was not changed.' }
      }
    }
    localStorage.setItem(K.hash, await sha256(next))
    sessionStorage.setItem('mm_admin_pw', next)
    return { ok: true }
  }

  const setScriptUrl = (url) => {
    const clean = url.trim()
    localStorage.setItem(K.script, clean)
    setScriptUrlState(clean)
  }

  const syncOrders = async () => {
    if (!scriptUrl) return { ok: false, error: 'Paste the Google Apps Script URL in Settings first.' }
    const password = sessionStorage.getItem('mm_admin_pw') || ''
    const data = await fetchOrders(scriptUrl, password)
    if (!data?.ok) return { ok: false, error: data?.error || 'Sheet refused the request.' }
    const incoming = (data.orders || []).map(o => {
      let items = []
      try { items = typeof o.items === 'string' ? JSON.parse(o.items || '[]') : (o.items || []) } catch { items = [] }
      return { ...o, items, total: Number(o.total || 0), note: o.note || '', status: o.status || 'New' }
    }).sort((a, b) => String(b.date).localeCompare(String(a.date)))
    setOrders(incoming)
    return { ok: true, count: incoming.length }
  }

  const updateStatus = async (orderId, status) => {
    const previous = orders.find(o => o.id === orderId)?.status || 'New'
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o))
    if (!scriptUrl) return { ok: true }
    const password = sessionStorage.getItem('mm_admin_pw') || ''
    try {
      const data = await postAction(scriptUrl, 'status', { password, orderId, status })
      if (!data?.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: previous } : o))
        return { ok: false, error: data?.error || 'Could not save the status.' }
      }
    } catch {
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: previous } : o))
      return { ok: false, error: 'Could not reach Google Sheet.' }
    }
    return { ok: true }
  }

  const deleteOrder = async (orderId) => {
    if (!scriptUrl) return { ok: false, error: 'Google Sheet is not connected.' }
    const password = sessionStorage.getItem('mm_admin_pw') || ''
    try {
      const data = await postAction(scriptUrl, 'deleteorder', { password, orderId })
      if (!data?.ok) return { ok: false, error: data?.error || 'Could not delete that order.' }
    } catch {
      return { ok: false, error: 'Could not reach Google Sheet.' }
    }
    setOrders(prev => prev.filter(o => o.id !== orderId))
    return { ok: true }
  }

  const saveShop = async (patch) => {
    if (!scriptUrl) return { ok: false, error: 'Google Sheet is not connected.' }
    const password = sessionStorage.getItem('mm_admin_pw') || ''
    try {
      const data = await postAction(scriptUrl, 'shop', { password, ...patch })
      if (!data?.ok) return { ok: false, error: data?.error || 'Could not save those details.' }
    } catch {
      return { ok: false, error: 'Could not reach Google Sheet.' }
    }
    if (Array.isArray(patch.addresses)) {
      localStorage.setItem(K.addresses, JSON.stringify(patch.addresses))
      setAddresses(patch.addresses)
    }
    if (patch.email != null) {
      const nextEmail = shopEmail(patch.email)
      localStorage.setItem(K.email, nextEmail)
      setEmail(nextEmail)
    }
    if (patch.instagram != null || patch.facebook != null || patch.youtube != null) {
      const next = {
        instagram: shopInstagram(patch.instagram ?? social.instagram),
        facebook: patch.facebook ?? social.facebook,
        youtube: patch.youtube ?? social.youtube
      }
      localStorage.setItem(K.social, JSON.stringify(next))
      setSocial(next)
    }
    return { ok: true }
  }

  const addProduct = async (draft) => {
    const name = draft.name.trim()
    if (!name) return { ok: false, error: 'Item name is required.' }
    if (products.some(p => p.name.toLowerCase() === name.toLowerCase())) {
      return { ok: false, error: 'That item is already on the website.' }
    }
    const product = {
      id: `MM-${Date.now()}`,
      name,
      price: draft.price === '' || draft.price == null ? null : Number(draft.price),
      cat: draft.cat,
      unit: draft.unit,
      img: draft.img.trim() || BRAND.logo,
      fallback: BRAND.logo,
      desc: draft.desc.trim() || 'Newly added Mithai Mixture speciality.',
      featured: false,
      available: 'YES'
    }
    setCustom(prev => [product, ...prev])
    if (scriptUrl) {
      const password = sessionStorage.getItem('mm_admin_pw') || ''
      try {
        await postAction(scriptUrl, 'addproduct', { password, ...product })
      } catch {
        return { ok: true, warning: 'Added on this browser. Google Sheet could not be updated.' }
      }
    }
    return { ok: true, product }
  }

  const setWhatsapp = async (input) => {
    const next = formatWhatsapp(input)
    if (next.whatsapp.length < 12) return { ok: false, error: 'Enter a valid mobile number with country code, for example 8125213332.' }
    localStorage.setItem(K.whatsapp, next.whatsapp)
    setWhatsappState(next.whatsapp)
    if (!scriptUrl) {
      return { ok: true, warning: 'WhatsApp number updated in the header, footer, contact page and checkout. Connect the Google Sheet so every visitor sees it.' }
    }
    try {
      const password = sessionStorage.getItem('mm_admin_pw') || ''
      const data = await postAction(scriptUrl, 'whatsapp', { password, whatsapp: next.whatsapp })
      if (data && data.ok === false) return { ok: true, warning: 'Updated on this website. Google Sheet rejected the change: ' + (data.error || 'unknown') }
    } catch {
      return { ok: true, warning: 'Updated on this website. Google Sheet could not be updated.' }
    }
    return { ok: true }
  }

  const value = {
    products, lines, subtotal, hasPriceOnRequest, cartCount: lines.length,
    cartOpen, setCartOpen, toast, showToast, sheetNote, scriptUrl, setScriptUrl,
    whatsapp: phone.whatsapp, whatsappDisplay: phone.whatsappDisplay, setWhatsapp,
    add, changeQty, remove, clearCart, placeOrder, saveEnquiry,
    orders, authed, login, logout, changePassword, passwordMatches,
    syncOrders, updateStatus, deleteOrder, addProduct,
    addresses, social, email, saveShop
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  return useContext(StoreContext)
}
