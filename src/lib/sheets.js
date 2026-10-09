async function parse(res) {
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    throw new Error('Google Sheet did not return data. Check the Apps Script web app URL.')
  }
}

export async function fetchProducts(url) {
  const u = new URL(url)
  u.searchParams.set('action', 'products')
  u.searchParams.set('v', String(Date.now()))
  const res = await fetch(u.toString())
  return parse(res)
}

export async function fetchSettings(url) {
  const u = new URL(url)
  u.searchParams.set('action', 'settings')
  u.searchParams.set('v', String(Date.now()))
  const res = await fetch(u.toString())
  return parse(res)
}

export async function fetchOrders(url, password) {
  const u = new URL(url)
  u.searchParams.set('action', 'orders')
  u.searchParams.set('password', password)
  u.searchParams.set('v', String(Date.now()))
  const res = await fetch(u.toString())
  return parse(res)
}

export async function checkPassword(url, password) {
  const u = new URL(url)
  u.searchParams.set('action', 'login')
  u.searchParams.set('password', password)
  u.searchParams.set('v', String(Date.now()))
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), 2500)
  try {
    const res = await fetch(u.toString(), { signal: ctrl.signal })
    return parse(res)
  } finally {
    clearTimeout(timer)
  }
}

export async function postAction(url, action, payload) {
  const body = new URLSearchParams()
  body.set('action', action)
  body.set('payload', JSON.stringify(payload))
  const res = await fetch(url, { method: 'POST', body })
  return parse(res)
}
