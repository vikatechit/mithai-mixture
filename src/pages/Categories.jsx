import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import SmartImg from '../components/SmartImg'
import { CATEGORIES } from '../data/brand'

export default function Categories() {
  return (
    <section className="section">
      <Seo title="Categories | Mithai Mixture" description="Browse Mithai Mixture sweets, mixtures, biscuits, beverages, pickles, chocolates and frozen foods." />
      <div className="section-head left">
        <p className="kicker">Departments</p>
        <h1>Categories</h1>
        <p>Each card uses a photograph from that department — sweets, mixtures, pickles and the rest of the house range.</p>
      </div>
      <div className="cat-grid">
        {CATEGORIES.map(cat => (
          <Link key={cat.slug} to={`/shop/${cat.slug}`} className="cat-card tall">
            <SmartImg src={cat.image} alt={cat.name} />
            <span>
              <strong>{cat.name}</strong>
              <em>{cat.desc}</em>
            </span>
          </Link>
        ))}
      </div>
    </section>
  )
}
