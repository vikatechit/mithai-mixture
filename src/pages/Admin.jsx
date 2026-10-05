import { useEffect, useMemo, useState } from 'react'
import Seo from '../components/Seo'
import { BRAND, CATEGORIES, cleanUrl } from '../data/brand'
import { useStore } from '../context/Store'
import { money } from '../lib/format'
import { downloadOrdersExcel } from '../lib/excel'

const STATUSES = ['New', 'Confirmed', 'Preparing', 'Packed', 'Out for delivery', 'Delivered', 'Cancelled']
const EMPTY_ADDRESS = { id: '', label: '', line1: '', line2: '', city: '', state: '', pin: '' }

function PasswordField({ label, value, onChange, autoComplete }) {
  const [show, setShow] = useState(false)
  return (
    <label>{label}
      <span className="pw-field">
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} autoComplete={autoComplete} required />
        <button type="button" className="text-btn" onClick={() => setShow(v => !v)}>{show ? 'Hide' : 'Show'}</button>
      </span>
    </label>
  )
}

export default function Admin() {
  const store = useStore()
  const [tab, setTab] = useState('overview')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [gate, setGate] = useState(false)
  const [gatePw, setGatePw] = useState('')
  const [draft, setDraft] = useState({ name: '', cat: 'Sweets', price: '', unit: 'kg', img: '', desc: '' })
  const [pwForm, setPwForm] = useState({ current: '', next: '' })
  const [sheet, setSheet] = useState(store.scriptUrl)
  const [waInput, setWaInput] = useState(store.whatsappDisplay)
  const [emailInput, setEmailInput] = useState(store.email)
  const [socialForm, setSocialForm] = useState(store.social)
  const [addressForm, setAddressForm] = useState(EMPTY_ADDRESS)
  const [busy, setBusy] = useState(false)

  const stats = useMemo(() => {
    const byCat = {}
    let sales = 0
    store.orders.forEach(order => {
      sales += Number(order.total || 0)
      ;(order.items || []).forEach(item => {
        const value = Number(item.lineTotal || 0)
        byCat[item.cat || 'Other'] = (byCat[item.cat || 'Other'] || 0) + value
      })
    })
    return { sales, byCat }
  }, [store.orders])

  useEffect(() => {
    if (!store.authed) return undefined
    let cancel = false
    store.syncOrders().then(result => {
      if (cancel || !result.ok) return
      setNotice(`Loaded ${result.count} orders from the Google Sheet.`)
    })
    return () => { cancel = true }
  }, [store.authed])

  useEffect(() => { setEmailInput(store.email) }, [store.email])
  useEffect(() => { setSocialForm(store.social) }, [store.social])

  const login = async (e) => {
    e.preventDefault()
    setBusy(true)
    const ok = await store.login(password)
    setBusy(false)
    setError(ok ? '' : 'Incorrect password.')
  }

  const saveAddress = async (e) => {
    e.preventDefault()
    if (!/^[1-9][0-9]{5}$/.test(addressForm.pin.trim())) {
      setError('Enter a 6-digit PIN code.')
      return
    }
    const next = {
      id: addressForm.id || `addr-${Date.now()}`,
      label: addressForm.label.trim(),
      line1: addressForm.line1.trim(),
      line2: addressForm.line2.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      pin: addressForm.pin.trim()
    }
    const list = addressForm.id
      ? store.addresses.map(item => item.id === next.id ? next : item)
      : [...store.addresses, next]
    setBusy(true)
    const result = await store.saveShop({ addresses: list })
    setBusy(false)
    setError(result.ok ? '' : result.error)
    setNotice(result.ok ? 'Shop address saved. It is now in the footer.' : '')
    if (result.ok) setAddressForm(EMPTY_ADDRESS)
  }

  const download = async (e) => {
    e.preventDefault()
    const ok = await store.passwordMatches(gatePw)
    if (!ok) {
      setError('Password did not match. The Excel file was not created.')
      return
    }
    downloadOrdersExcel(store.orders)
    setGate(false)
    setGatePw('')
    setError('')
    setNotice('Excel file downloaded.')
  }

  if (!store.authed) {
    return (
      <section className="section narrow admin-page">
        <Seo title="Admin | Mithai Mixture" description="Private admin sign-in for Mithai Mixture." noindex />
        <p className="kicker">Private</p>
        <h1>Admin</h1>
        <p>Password access for orders, the sales dashboard and new items.</p>
        <form className="form" onSubmit={login}>
          <PasswordField label="Password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
          {error && <p className="err">{error}</p>}
          <button className="btn glow" type="submit" disabled={busy}>{busy ? 'Checking…' : 'Enter dashboard'}</button>
        </form>
      </section>
    )
  }

  return (
    <section className="section admin-page">
      <Seo title="Dashboard | Mithai Mixture Admin" description="Mithai Mixture order and sales dashboard." noindex />
      <div className="admin-top">
        <div>
          <p className="kicker">Admin</p>
          <h1>Dashboard</h1>
          <p className="muted">{store.sheetNote}</p>
        </div>
        <button type="button" className="btn btn-ghost glow" onClick={store.logout}>Log out</button>
      </div>
      <div className="tabs">
        {['overview', 'orders', 'catalogue', 'settings', 'where'].map(id => (
          <button key={id} type="button" className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{id}</button>
        ))}
      </div>
      {notice && <p className="ok">{notice}</p>}
      {error && tab !== 'catalogue' && !gate && <p className="err">{error}</p>}

      {tab === 'overview' && (
        <>
          <div className="kpi-grid">
            <article><span>Orders</span><strong>{store.orders.length}</strong></article>
            <article><span>Sales recorded</span><strong>{money(stats.sales)}</strong></article>
          </div>
          <div className="panel">
            <h2>Sales by category</h2>
            <Bars rows={Object.entries(stats.byCat).map(([label, value]) => ({ label, value }))} format={money} empty="Place or sync an order to draw this chart." />
          </div>
          <button type="button" className="btn glow" onClick={async () => {
            const result = await store.syncOrders()
            setNotice(result.ok ? `Synced ${result.count} orders from Google Sheet.` : result.error)
          }}>Refresh from Google Sheet</button>
        </>
      )}

      {tab === 'orders' && (
        <>
          <div className="btn-row">
            <button type="button" className="btn glow" onClick={() => { setGate(true); setError('') }}>Download Excel</button>
            <button type="button" className="btn btn-ghost glow" onClick={async () => {
              const result = await store.syncOrders()
              setNotice(result.ok ? `Synced ${result.count} orders from Google Sheet.` : result.error)
            }}>Sync sheet</button>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th></tr>
              </thead>
              <tbody>
                {store.orders.length === 0 && <tr><td colSpan={5}>No orders yet. Orders placed on any phone appear here after the Google Sheet is connected.</td></tr>}
                {store.orders.map(order => (
                  <tr key={order.id}>
                    <td data-label="Order">{order.id}<br /><span className="muted">{order.date ? new Date(order.date).toLocaleString('en-IN') : ''}</span></td>
                    <td data-label="Customer">
                      <strong>{order.name}</strong><br />
                      {order.phone}<br />
                      {order.address}
                      {order.note ? <><br /><span className="muted">{order.note}</span></> : null}
                    </td>
                    <td data-label="Items">{(order.items || []).map(item => `${item.name} × ${item.qty} ${item.unit || ''}`).join(', ')}</td>
                    <td data-label="Total">{money(order.total || 0)}</td>
                    <td data-label="Status">
                      <div className="order-actions">
                        <select value={order.status || 'New'} onChange={async (e) => {
                          const result = await store.updateStatus(order.id, e.target.value)
                          setNotice(result.ok ? `Status saved for ${order.id}.` : '')
                          setError(result.ok ? '' : result.error)
                        }}>
                          {STATUSES.map(status => <option key={status}>{status}</option>)}
                        </select>
                        <button type="button" className="text-btn" onClick={async () => {
                          if (!window.confirm(`Delete order ${order.id}? This removes it from the Google Sheet.`)) return
                          const result = await store.deleteOrder(order.id)
                          setNotice(result.ok ? `Deleted ${order.id}.` : '')
                          setError(result.ok ? '' : result.error)
                        }}>Delete order</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      {tab === 'catalogue' && (
        <div className="split">
          <form className="form" onSubmit={async (e) => {
            e.preventDefault()
            const result = await store.addProduct(draft)
            setNotice(result.ok ? `${draft.name} is now on the website. ${result.warning || ''}` : '')
            setError(result.ok ? '' : result.error)
            if (result.ok) setDraft({ name: '', cat: 'Sweets', price: '', unit: 'kg', img: '', desc: '' })
          }}>
            <h2>Add item</h2>
            <label>Name<input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} required /></label>
            <label>Category
              <select value={draft.cat} onChange={e => setDraft({ ...draft, cat: e.target.value })}>
                {CATEGORIES.map(c => <option key={c.short}>{c.short}</option>)}
              </select>
            </label>
            <label>Price (leave blank if on request)<input value={draft.price} onChange={e => setDraft({ ...draft, price: e.target.value })} inputMode="decimal" /></label>
            <label>Unit
              <select value={draft.unit} onChange={e => setDraft({ ...draft, unit: e.target.value })}>
                {['kg', 'pack', 'jar', 'bottle', 'box'].map(u => <option key={u}>{u}</option>)}
              </select>
            </label>
            <label>Image URL<input value={draft.img} onChange={e => setDraft({ ...draft, img: e.target.value })} placeholder="https://…" /></label>
            <label>Description<textarea value={draft.desc} onChange={e => setDraft({ ...draft, desc: e.target.value })} rows={3} /></label>
            {error && tab === 'catalogue' && <p className="err">{error}</p>}
            <button className="btn glow" type="submit">Publish on website</button>
          </form>
          <div className="panel">
            <h2>Live menu</h2>
            <ul className="plain">
              {store.products.map(p => <li key={p.id}><strong>{p.name}</strong> · {p.cat} · {p.price != null ? money(p.price) : 'On request'}</li>)}
            </ul>
          </div>
        </div>
      )}

      {tab === 'settings' && (
        <div className="settings-stack">
          <form className="form panel" onSubmit={async (e) => {
            e.preventDefault()
            const result = await store.setWhatsapp(waInput)
            setError(result.ok ? '' : result.error)
            setNotice(result.ok ? (result.warning || 'WhatsApp number updated across the website.') : '')
            if (result.ok) setWaInput(store.whatsappDisplay)
          }}>
            <h2>Order WhatsApp number</h2>
            <p className="muted">This number is used in the top bar, footer, contact page and checkout.</p>
            <label>WhatsApp number
              <input value={waInput} onChange={e => setWaInput(e.target.value)} placeholder="8125213332" inputMode="tel" required />
            </label>
            <button className="btn glow" type="submit">Save number</button>
          </form>

          <form className="form panel" onSubmit={async (e) => {
            e.preventDefault()
            const result = await store.saveShop({ email: emailInput.trim() })
            setError(result.ok ? '' : result.error)
            setNotice(result.ok ? 'Email updated in the footer and contact page.' : '')
          }}>
            <h2>Contact email</h2>
            <label>Email
              <input type="email" value={emailInput} onChange={e => setEmailInput(e.target.value)} placeholder="Add when the shop email is ready" />
            </label>
            <button className="btn glow" type="submit">Save email</button>
          </form>

          <div className="panel">
            <h2>Shop addresses</h2>
            <p className="muted">Add every shop with the full address and PIN code. Each one appears in the website footer.</p>
            <div className="address-list">
              {store.addresses.length === 0 && <p className="muted">No shop address yet.</p>}
              {store.addresses.map(item => (
                <article key={item.id} className="address-card">
                  <strong>{item.label || 'Shop'}</strong>
                  <span>{item.line1}{item.line2 ? `, ${item.line2}` : ''}</span>
                  <span>{item.city}, {item.state} {item.pin}</span>
                  <div className="btn-row">
                    <button type="button" className="btn btn-ghost" onClick={() => { setAddressForm(item); setError('') }}>Edit</button>
                    <button type="button" className="text-btn" onClick={async () => {
                      if (!window.confirm('Remove this shop address from the website?')) return
                      const result = await store.saveShop({ addresses: store.addresses.filter(a => a.id !== item.id) })
                      setNotice(result.ok ? 'Address removed.' : '')
                      setError(result.ok ? '' : result.error)
                      if (result.ok && addressForm.id === item.id) setAddressForm(EMPTY_ADDRESS)
                    }}>Delete</button>
                  </div>
                </article>
              ))}
            </div>
            <form className="form" onSubmit={saveAddress}>
              <h3>{addressForm.id ? 'Edit address' : 'Add address'}</h3>
              <label>Shop name<input value={addressForm.label} onChange={e => setAddressForm({ ...addressForm, label: e.target.value })} placeholder="Main shop" /></label>
              <label>Address line<input value={addressForm.line1} onChange={e => setAddressForm({ ...addressForm, line1: e.target.value })} placeholder="Door no., street" required /></label>
              <label>Area / landmark<input value={addressForm.line2} onChange={e => setAddressForm({ ...addressForm, line2: e.target.value })} placeholder="Area, landmark" /></label>
              <div className="address-grid">
                <label>City<input value={addressForm.city} onChange={e => setAddressForm({ ...addressForm, city: e.target.value })} required /></label>
                <label>State<input value={addressForm.state} onChange={e => setAddressForm({ ...addressForm, state: e.target.value })} required /></label>
                <label>PIN code<input value={addressForm.pin} onChange={e => setAddressForm({ ...addressForm, pin: e.target.value })} inputMode="numeric" maxLength={6} placeholder="500001" required /></label>
              </div>
              <div className="btn-row">
                <button className="btn glow" type="submit" disabled={busy}>{addressForm.id ? 'Save address' : 'Add address'}</button>
                {addressForm.id && <button type="button" className="btn btn-ghost" onClick={() => setAddressForm(EMPTY_ADDRESS)}>Cancel</button>}
              </div>
            </form>
          </div>

          <form className="form panel" onSubmit={async (e) => {
            e.preventDefault()
            const result = await store.saveShop({
              instagram: cleanUrl(socialForm.instagram),
              facebook: cleanUrl(socialForm.facebook),
              youtube: cleanUrl(socialForm.youtube)
            })
            setError(result.ok ? '' : result.error)
            setNotice(result.ok ? 'Social links updated. The icons in the footer open these profiles.' : '')
            if (result.ok) setSocialForm({
              instagram: cleanUrl(socialForm.instagram),
              facebook: cleanUrl(socialForm.facebook),
              youtube: cleanUrl(socialForm.youtube)
            })
          }}>
            <h2>Social profiles</h2>
            <p className="muted">Add these when the shop profiles are ready. The footer shows only the Instagram icon.</p>
            <label>Instagram<input value={socialForm.instagram} onChange={e => setSocialForm({ ...socialForm, instagram: e.target.value })} placeholder="https://www.instagram.com/…" /></label>
            <label>Facebook<input value={socialForm.facebook} onChange={e => setSocialForm({ ...socialForm, facebook: e.target.value })} placeholder="https://www.facebook.com/…" /></label>
            <label>YouTube<input value={socialForm.youtube} onChange={e => setSocialForm({ ...socialForm, youtube: e.target.value })} placeholder="https://www.youtube.com/…" /></label>
            <button className="btn glow" type="submit">Save social links</button>
          </form>

          <form className="form panel" onSubmit={async (e) => {
            e.preventDefault()
            setBusy(true)
            const result = await store.changePassword(pwForm.current, pwForm.next)
            setBusy(false)
            setError(result.ok ? '' : result.error)
            setNotice(result.ok ? 'Password updated. Use it on every phone and laptop.' : '')
            if (result.ok) setPwForm({ current: '', next: '' })
          }}>
            <h2>Change password</h2>
            <PasswordField label="Current password" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} autoComplete="current-password" />
            <PasswordField label="New password" value={pwForm.next} onChange={e => setPwForm({ ...pwForm, next: e.target.value })} autoComplete="new-password" />
            <button className="btn glow" type="submit" disabled={busy}>{busy ? 'Saving…' : 'Update password'}</button>
          </form>

          <form className="form panel" onSubmit={(e) => { e.preventDefault(); store.setScriptUrl(sheet); setNotice('Google Sheet URL saved on this browser.') }}>
            <h2>Google Sheet connection</h2>
            <label>Apps Script web app URL
              <input value={sheet} onChange={e => setSheet(e.target.value)} placeholder="https://script.google.com/macros/s/…/exec" />
            </label>
            <button className="btn glow" type="submit">Save URL</button>
          </form>
        </div>
      )}

      {tab === 'where' && (
        <div className="prose panel">
          <h2>Where the Google Sheet lives</h2>
          <p>Orders, customer details and items are stored in this Google Sheet. An order placed on any phone or laptop appears in this dashboard after you open it and sign in. There is no Google Form and no OTP.</p>
          <p><a className="gold" href={BRAND.sheetUrl} target="_blank" rel="noreferrer">Open the Mithai Mixture order sheet</a></p>
          <p>The website is already connected to that sheet. If the connection is ever replaced, paste the new Apps Script web app URL under Settings.</p>
          <p>The sheet tabs are:</p>
          <ul>
            <li><strong>Orders</strong> — order id, date, customer name, phone, address, note, items and subtotal.</li>
            <li><strong>Customers</strong> — phone, name and address, updated as orders arrive.</li>
            <li><strong>Products</strong> — item name, category, price, unit, image and description.</li>
            <li><strong>Enquiries</strong> — messages from the contact page.</li>
            <li><strong>Settings</strong> — sheet password and WhatsApp number.</li>
          </ul>
          <p>The Excel download is a copy of the orders currently loaded in this dashboard, including the customer details.</p>
        </div>
      )}

      {gate && (
        <div className="modal-bg" onClick={() => setGate(false)}>
          <form className="form modal" onClick={e => e.stopPropagation()} onSubmit={download}>
            <h2>Confirm password to download</h2>
            <PasswordField label="Admin password" value={gatePw} onChange={e => setGatePw(e.target.value)} autoComplete="current-password" />
            {error && <p className="err">{error}</p>}
            <button className="btn glow" type="submit">Download orders.xls</button>
          </form>
        </div>
      )}
    </section>
  )
}

function Bars({ rows, format, empty }) {
  const max = Math.max(...rows.map(r => r.value), 0)
  if (!max) return <p className="muted">{empty}</p>
  return (
    <div className="bars">
      {rows.filter(r => r.value > 0).map(r => (
        <div key={r.label} className="bar-row">
          <span>{r.label}</span>
          <div className="bar-track"><i style={{ width: `${(r.value / max) * 100}%` }} /></div>
          <b>{format ? format(r.value) : r.value}</b>
        </div>
      ))}
    </div>
  )
}
