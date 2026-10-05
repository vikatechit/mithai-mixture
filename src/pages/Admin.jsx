import { useEffect, useMemo, useState } from 'react'
import Seo from '../components/Seo'
import { BRAND, CATEGORIES } from '../data/brand'
import { useStore } from '../context/Store'
import { money } from '../lib/format'
import { downloadOrdersExcel } from '../lib/excel'

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

  const login = async (e) => {
    e.preventDefault()
    const ok = await store.login(password)
    setError(ok ? '' : 'Incorrect password.')
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
      <section className="section narrow">
        <Seo title="Admin | Mithai Mixture" description="Private admin sign-in for Mithai Mixture." noindex />
        <p className="kicker">Private</p>
        <h1>Admin</h1>
        <p>Password access for orders, the sales dashboard and new items.</p>
        <form className="form" onSubmit={login}>
          <label>Password<input type="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" required /></label>
          {error && <p className="err">{error}</p>}
          <button className="btn glow" type="submit">Enter dashboard</button>
        </form>
      </section>
    )
  }

  return (
    <section className="section">
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
                <tr><th>Order</th><th>Customer</th><th>Items</th><th>Total</th></tr>
              </thead>
              <tbody>
                {store.orders.length === 0 && <tr><td colSpan={4}>No orders yet. Orders placed on any phone appear here after the Google Sheet is connected.</td></tr>}
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
        <div className="settings-grid">
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
          <form className="form panel" onSubmit={(e) => { e.preventDefault(); store.setScriptUrl(sheet); setNotice('Google Sheet URL saved on this browser.') }}>
            <h2>Google Sheet connection</h2>
            <label>Apps Script web app URL
              <input value={sheet} onChange={e => setSheet(e.target.value)} placeholder="https://script.google.com/macros/s/…/exec" />
            </label>
            <button className="btn glow" type="submit">Save URL</button>
          </form>
          <form className="form panel" onSubmit={async (e) => {
            e.preventDefault()
            const result = await store.changePassword(pwForm.current, pwForm.next)
            setError(result.ok ? '' : result.error)
            setNotice(result.ok ? (result.warning || 'Password updated.') : '')
            if (result.ok) setPwForm({ current: '', next: '' })
          }}>
            <h2>Change password</h2>
            <label>Current<input type="password" value={pwForm.current} onChange={e => setPwForm({ ...pwForm, current: e.target.value })} required /></label>
            <label>New<input type="password" value={pwForm.next} onChange={e => setPwForm({ ...pwForm, next: e.target.value })} required /></label>
            {error && <p className="err">{error}</p>}
            <button className="btn glow" type="submit">Update password</button>
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
            <label>Admin password<input type="password" value={gatePw} onChange={e => setGatePw(e.target.value)} required /></label>
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
