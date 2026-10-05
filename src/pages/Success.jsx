import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import { money, qtyLabel } from '../lib/format'

export default function Success() {
  const order = JSON.parse(sessionStorage.getItem('mm_last_order') || 'null')
  if (!order) {
    return (
      <section className="section">
        <h1>No recent order</h1>
        <Link to="/shop">Return to the shop</Link>
      </section>
    )
  }
  return (
    <section className="section prose">
      <Seo title="Order received | Mithai Mixture" description="Your Mithai Mixture order has been recorded." />
      <p className="kicker">Order received</p>
      <h1>{order.id}</h1>
      <p>Status: <strong>{order.status || 'Pending'}</strong>. Confirm the same order on WhatsApp so the kitchen can pack it.</p>
      <div className="panel">
        <p>{order.name} · {order.phone}</p>
        <p>{order.address}</p>
        {(order.items || []).map(item => (
          <p key={item.name}>{item.name} — {qtyLabel(item.qty, item.unit)} — {item.lineTotal != null ? money(item.lineTotal) : 'Price on request'}</p>
        ))}
        <p><strong>Subtotal:</strong> {order.total ? money(order.total) : 'Price on request'}</p>
      </div>
      <div className="btn-row">
        <a className="btn glow" href={order.whatsapp} target="_blank" rel="noreferrer">Send on WhatsApp</a>
        <Link className="btn btn-ghost glow" to="/shop">Continue shopping</Link>
      </div>
    </section>
  )
}
