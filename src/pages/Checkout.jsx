import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Seo from '../components/Seo'
import { useStore } from '../context/Store'
import { money, qtyLabel } from '../lib/format'
import { waLink } from '../data/brand'

export default function Checkout() {
  const store = useStore()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', phone: '', address: '', note: '' })
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    if (!store.lines.length) return setError('Add at least one item before checkout.')
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) return setError('Name, phone and address are required.')
    const order = await store.placeOrder(form)
    const lines = order.items.map(item => `• ${item.name} — ${qtyLabel(item.qty, item.unit)}`).join('\n')
    const text = `Hello Mithai Mixture, I would like to confirm order ${order.id}.\n${form.name}\n${form.phone}\n${form.address}\n\n${lines}\n\nSubtotal: ${order.total ? money(order.total) : 'Price on request'}`
    sessionStorage.setItem('mm_last_order', JSON.stringify({ ...order, whatsapp: waLink(text) }))
    navigate('/success')
  }

  return (
    <section className="section">
      <Seo title="Checkout | Mithai Mixture" description="Review your Mithai Mixture order and send it on WhatsApp." />
      <h1>Checkout</h1>
      {store.lines.length === 0 ? (
        <p>Your order is empty. <Link to="/shop">Browse the shop</Link>.</p>
      ) : (
        <div className="split">
          <div className="panel">
            {store.lines.map(line => (
              <p key={line.id}><strong>{line.name}</strong> · {qtyLabel(line.qty, line.unit)} · {line.lineTotal != null ? money(line.lineTotal) : 'Price on request'}</p>
            ))}
            <p><strong>Subtotal:</strong> {store.hasPriceOnRequest ? `${money(store.subtotal)} + confirmation` : money(store.subtotal)}</p>
          </div>
          <form className="form" onSubmit={submit}>
            <label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
            <label>Phone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required inputMode="tel" /></label>
            <label>Delivery address<textarea value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} required rows={3} /></label>
            <label>Note<textarea value={form.note} onChange={e => setForm({ ...form, note: e.target.value })} rows={2} /></label>
            {error && <p className="err">{error}</p>}
            <button className="btn glow" type="submit">Place order</button>
          </form>
        </div>
      )}
    </section>
  )
}
