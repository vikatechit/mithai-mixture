import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import DepthCarousel from '../components/DepthCarousel'
import SmartImg from '../components/SmartImg'
import { BRAND, CATEGORIES } from '../data/brand'
import { HERO_SLIDES } from '../data/catalog'
import { useStore } from '../context/Store'
import { money } from '../lib/format'

const slides = HERO_SLIDES.map(p => ({
  image: p.fallback,
  alt: p.name
}))

function heroCardSize() {
  if (typeof window === 'undefined') return { w: 300, h: 380, stage: 540 }
  if (window.innerWidth < 720) return { w: 200, h: 260, stage: 380 }
  if (window.innerWidth < 980) return { w: 240, h: 310, stage: 460 }
  return { w: 300, h: 380, stage: 540 }
}

export default function Home() {
  const { products, add } = useStore()
  const featured = products.filter(p => p.featured).slice(0, 8)
  const [card, setCard] = useState(heroCardSize)
  useEffect(() => {
    const onResize = () => setCard(heroCardSize())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      <Seo
        title="Mithai Mixture India Private Limited | Taste with Tradition"
        description="Traditional Indian sweets, mixtures, biscuits, pickles, chocolates and frozen foods from Mithai Mixture India Private Limited."
      />
      <section className="hero">
        <div className="hero-copy">
          <p className="kicker">{BRAND.name}</p>
          <h1>{BRAND.tagline}</h1>
          <p className="lede">Premium Indian flavours, prepared for celebrations, gifting and the family table. Pure ghee sweets, crisp mixtures and festive favourites.</p>
          <div className="btn-row">
            <Link className="btn glow" to="/categories">Explore collection</Link>
            <Link className="btn btn-ghost glow" to="/shop">Shop all</Link>
            <Link className="btn btn-ghost glow" to="/rates">Rate list</Link>
          </div>
        </div>
        <div className="hero-stage" style={{ height: card.stage }}>
          <DepthCarousel
            items={slides}
            depth={220}
            spread={card.w < 260 ? 72 : 160}
            tilt={22}
            tiltDirection="right"
            perspective={1400}
            visibleCards={4}
            falloff={0.2}
            blur={1.5}
            autoplay
            loop
            cardWidth={card.w}
            cardHeight={card.h}
            radius={18}
            tint="#05060a"
            duration={700}
            ease="power3.out"
            autoplayDelay={3200}
            showControls
            showIndicators
          />
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <p className="kicker">Curated range</p>
          <h2>Signature categories</h2>
          <p>Every category is photographed around the sweets, mixtures and snacks we actually prepare.</p>
        </div>
        <div className="cat-grid">
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} to={`/shop/${cat.slug}`} className="cat-card">
              <SmartImg src={cat.image} alt={cat.name} />
              <span>
                <strong>{cat.name}</strong>
                <em>{cat.desc}</em>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section section-alt">
        <div className="section-head">
          <p className="kicker">Customer favourites</p>
          <h2>Best sellers</h2>
        </div>
        <div className="product-grid">
          {featured.map(p => (
            <article key={p.id} className="product-card">
              <SmartImg src={p.img} fallback={p.fallback} alt={p.name} />
              <div>
                <p className="eyebrow">{p.cat}</p>
                <h3>{p.name}</h3>
                <p>{p.price != null ? `${money(p.price)} / ${p.unit}` : 'Price on request'}</p>
                <button type="button" className="btn glow" onClick={() => add(p)}>Add</button>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="promise-grid">
          {[
            ['Finest ingredients', 'Pure ghee, selected nuts, milk and spices in every batch.'],
            ['Hygienic kitchens', 'Prepared under FSSAI food-safety practice.'],
            ['Celebration ready', 'Packed for weddings, festivals, gifts and daily tea.'],
            ['Direct orders', 'Place the order on the website and confirm on WhatsApp.']
          ].map(([title, copy]) => (
            <article key={title} className="promise">
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="band">
        <h2>{BRAND.tagline}</h2>
        <p>Heritage recipes, presented with the care of an official house brand.</p>
        <Link className="btn glow" to="/about">Read our story</Link>
      </section>
    </>
  )
}
