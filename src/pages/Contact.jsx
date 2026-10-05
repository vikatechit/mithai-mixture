import { useState } from 'react'
import Seo from '../components/Seo'
import { waLink, formatAddress } from '../data/brand'
import { useStore } from '../context/Store'

export default function Contact() {
  const { saveEnquiry, whatsapp, whatsappDisplay, email, addresses } = useStore()
  const [form, setForm] = useState({ name: '', phone: '', message: '' })
  const [done, setDone] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.phone.trim() || !form.message.trim()) return
    await saveEnquiry(form)
    setDone('Message noted. You can also send it on WhatsApp so the team sees it immediately.')
    setForm({ name: '', phone: '', message: '' })
  }

  return (
    <section className="section">
      <Seo title="Contact | Mithai Mixture" description="Contact Mithai Mixture India Private Limited on WhatsApp or by email." />
      <div className="split">
        <div>
          <p className="kicker">Talk to us</p>
          <h1>Contact</h1>
          <p>Orders and questions are handled on WhatsApp {whatsappDisplay}.</p>
          {email && <p><a className="gold" href={`mailto:${email}`}>{email}</a></p>}
          {addresses.map(item => {
            const formatted = formatAddress(item)
            return (
              <address key={item.id} className="shop-address">
                {item.label && <strong>{item.label}</strong>}
                <span>{formatted.street}</span>
                <span>{formatted.place}</span>
              </address>
            )
          })}
          <a className="btn glow" href={waLink('Hello Mithai Mixture, I would like to place an order.', whatsapp)} target="_blank" rel="noreferrer">Open WhatsApp</a>
        </div>
        <form className="form" onSubmit={onSubmit}>
          <label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required /></label>
          <label>Phone<input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} required inputMode="tel" /></label>
          <label>Message<textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} required rows={5} /></label>
          <button className="btn glow" type="submit">Send enquiry</button>
          {done && <p className="ok">{done}</p>}
        </form>
      </div>
    </section>
  )
}
