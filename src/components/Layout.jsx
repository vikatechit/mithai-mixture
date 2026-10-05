import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { BRAND, formatAddress } from '../data/brand'
import { useStore } from '../context/Store'
import { money, qtyLabel } from '../lib/format'
import SmartImg from './SmartImg'

function InstagramMark() {
  return (
    <span className="ig-mark" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="14" height="14">
        <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.8" />
        <circle cx="17.4" cy="6.6" r="1" fill="currentColor" />
      </svg>
    </span>
  )
}

const LINKS = [
  ['/', 'Home'],
  ['/categories', 'Categories'],
  ['/shop', 'Shop'],
  ['/rates', 'Rate List'],
  ['/about', 'About'],
  ['/contact', 'Contact']
]

export default function Layout({ children }) {
  const store = useStore()
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="announcement">
        <strong>{BRAND.tagline}</strong>
        <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp {store.whatsappDisplay}</a>
      </div>
      <header className="header">
        <div className="nav-wrap">
          <Link to="/" className="brand" aria-label="Mithai Mixture home">
            <img src={BRAND.logo} alt="Mithai Mixture logo" />
            <span>
              <strong>Mithai Mixture</strong>
              <em>{BRAND.sub}</em>
            </span>
          </Link>
          <button type="button" className="menu-btn glow" aria-label="Menu" onClick={() => setOpen(v => !v)}>
            {open ? 'Close' : 'Menu'}
          </button>
          <nav className={open ? 'open' : ''}>
            {LINKS.map(([to, label]) => (
              <NavLink key={to} to={to} end={to === '/'} onClick={() => setOpen(false)}>{label}</NavLink>
            ))}
          </nav>
          <button type="button" className="cart-btn glow" onClick={() => store.setCartOpen(true)}>
            Your Order <b>{store.cartCount}</b>
          </button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="footer">
        <div className="footer-brand">
          <img className="footer-logo" src={BRAND.logo} alt="Mithai Mixture logo" />
          <p className="tagline-lg">{BRAND.tagline}</p>
          <p className="footer-name">{BRAND.name}</p>
          {store.social.instagram && (
            <a className="shop-insta" href={store.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
              <InstagramMark />
            </a>
          )}
        </div>
        <div className="footer-grid">
          <div className="footer-col">
            <h3>Visit</h3>
            <Link to="/about">Our Story</Link>
            <Link to="/shop">Shop All</Link>
            <Link to="/rates">Sweet Rate List</Link>
            <Link to="/contact">Contact</Link>
          </div>
          <div className="footer-col">
            <h3>Policies</h3>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/shipping">Shipping</Link>
            <Link to="/refunds">Refunds</Link>
          </div>
          {store.addresses.length > 0 && (
            <div className="footer-col">
              <h3>Visit us</h3>
              {store.addresses.map(item => {
                const formatted = formatAddress(item)
                return (
                  <address key={item.id} className="shop-address">
                    {item.label && <strong>{item.label}</strong>}
                    <span>{formatted.street}</span>
                    <span>{formatted.place}</span>
                  </address>
                )
              })}
            </div>
          )}
          <div className="footer-col">
            <h3>Orders</h3>
            <a href={`https://wa.me/${store.whatsapp}`} target="_blank" rel="noreferrer">{store.whatsappDisplay}</a>
            {store.email && <a href={`mailto:${store.email}`}>{store.email}</a>}
          </div>
        </div>
        <div className="footer-bottom">
          <p className="fine">FSSAI licensed & hygienic preparation · © {new Date().getFullYear()} {BRAND.name}</p>
          <p className="dev-credit">
            <span>Developed by <a href="https://www.instagram.com/vikatechit/" target="_blank" rel="noreferrer"><strong>Vikatech</strong></a></span>
            <span className="dev-dot" aria-hidden="true">·</span>
            <span>Mail: <a href="mailto:vikatechit@gmail.com">vikatechit@gmail.com</a></span>
            <span className="dev-dot" aria-hidden="true">·</span>
            <a className="dev-insta" href="https://www.instagram.com/vikatechit/" target="_blank" rel="noreferrer">
              <InstagramMark />
              Instagram
            </a>
          </p>
        </div>
      </footer>

      <div className={`drawer-bg ${store.cartOpen ? 'show' : ''}`} onClick={() => store.setCartOpen(false)} />
      <aside className={`drawer ${store.cartOpen ? 'show' : ''}`} aria-label="Your order">
        <header>
          <h2>Your Order</h2>
          <button type="button" onClick={() => store.setCartOpen(false)} aria-label="Close">×</button>
        </header>
        <div className="drawer-body">
          {store.lines.length === 0 && <p className="muted">Your tray is empty. Add a sweet or a mixture to begin.</p>}
          {store.lines.map(line => (
            <article key={line.id} className="line">
              <SmartImg src={line.img} fallback={line.fallback} alt="" />
              <div>
                <strong>{line.name}</strong>
                <span>{line.price != null ? `${money(line.price)} / ${line.unit}` : 'Price on request'}</span>
                <div className="stepper">
                  <button type="button" onClick={() => store.changeQty(line.id, -1)} aria-label="Decrease">−</button>
                  <em>{qtyLabel(line.qty, line.unit)}</em>
                  <button type="button" onClick={() => store.changeQty(line.id, 1)} aria-label="Increase">+</button>
                </div>
                <button type="button" className="text-btn" onClick={() => store.remove(line.id)}>Remove</button>
              </div>
              <b>{line.lineTotal != null ? money(line.lineTotal) : 'On request'}</b>
            </article>
          ))}
        </div>
        <footer>
          <div className="total-row">
            <span>Subtotal</span>
            <strong>
              {store.lines.length === 0 ? '₹0' : store.hasPriceOnRequest ? `${money(store.subtotal)} + confirmation` : money(store.subtotal)}
            </strong>
          </div>
          <Link to="/order" className="btn glow" onClick={() => store.setCartOpen(false)}>Continue to checkout</Link>
        </footer>
      </aside>
      {store.toast && <div className="toast" role="status">{store.toast}</div>}
    </>
  )
}
