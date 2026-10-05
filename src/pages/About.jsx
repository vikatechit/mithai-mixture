import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import SmartImg from '../components/SmartImg'
import { BRAND } from '../data/brand'

export default function About() {
  return (
    <section className="section prose">
      <Seo title="Our Story | Mithai Mixture" description="About Mithai Mixture India Private Limited, a house of traditional Indian sweets and savouries." />
      <p className="kicker">Heritage</p>
      <h1>{BRAND.tagline}</h1>
      <div className="split">
        <div>
          <p>{BRAND.name} prepares traditional sweets and savouries for celebrations, gifting and everyday hospitality. The house stands on recipes that families already know by taste: ghee laddus, kalakand, kova, mixtures and pickles.</p>
          <p>Sweets in Indian life are shared at weddings, festivals, temple offerings and ordinary good news. We treat that responsibility seriously — clean preparation, clear rates, and a direct line on WhatsApp.</p>
          <div className="btn-row">
            <Link className="btn glow" to="/shop">Explore the collection</Link>
            <Link className="btn btn-ghost glow" to="/contact">Contact</Link>
          </div>
        </div>
        <SmartImg src="/assets/sweets.webp" alt="Traditional Mithai Mixture sweets" />
      </div>
      <div className="promise-grid">
        {[
          ['Purity', 'Ghee, milk, nuts and spices chosen for flavour, not for show.'],
          ['Craft', 'Laddus, barfis, mixtures and pickles finished in small batches.'],
          ['Clarity', 'The sweet rate list is published per kilogram. Other rates are confirmed before packing.'],
          ['Care', 'Orders are checked on WhatsApp so weight, pack size and delivery stay accurate.']
        ].map(([t, d]) => (
          <article key={t} className="promise"><h3>{t}</h3><p>{d}</p></article>
        ))}
      </div>
    </section>
  )
}
