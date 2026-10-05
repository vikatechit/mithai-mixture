import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import Seo from '../components/Seo'
import SmartImg from '../components/SmartImg'
import { CATEGORIES, categoryBySlug } from '../data/brand'
import { useStore } from '../context/Store'
import { money } from '../lib/format'

export default function Shop() {
  const { slug } = useParams()
  const category = slug ? categoryBySlug(slug) : null
  const { products, add } = useStore()
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('featured')
  const [cat, setCat] = useState(category?.short || 'All')

  const activeCat = category?.short || cat

  const list = useMemo(() => {
    let rows = products.filter(p => {
      const hit = !q || `${p.name} ${p.cat} ${p.desc}`.toLowerCase().includes(q.toLowerCase())
      const inCat = activeCat === 'All' || p.cat === activeCat
      return hit && inCat
    })
    if (sort === 'price-asc') rows = [...rows].sort((a, b) => (a.price ?? 99999) - (b.price ?? 99999))
    if (sort === 'price-desc') rows = [...rows].sort((a, b) => (b.price ?? -1) - (a.price ?? -1))
    if (sort === 'name') rows = [...rows].sort((a, b) => a.name.localeCompare(b.name))
    if (sort === 'featured') rows = [...rows].sort((a, b) => Number(b.featured) - Number(a.featured))
    return rows
  }, [products, q, sort, activeCat])

  return (
    <section className="section">
      <Seo
        title={`${category ? category.name : 'Shop'} | Mithai Mixture`}
        description={category?.desc || 'Shop the full Mithai Mixture collection of sweets, mixtures, biscuits, pickles, chocolates and frozen foods.'}
      />
      <div className="section-head left">
        <p className="kicker">{category ? 'Category' : 'The collection'}</p>
        <h1>{category ? category.name : 'Shop all'}</h1>
        <p>{category ? category.desc : 'Search the deduplicated menu. Repeated ghee-sweet names were removed so each item appears once.'}</p>
      </div>
      {category && <SmartImg className="banner" src={category.image} alt={category.name} />}
      <div className="filters">
        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search laddus, mixtures, pickles…" aria-label="Search products" />
        {!category && (
          <select value={activeCat} onChange={e => setCat(e.target.value)} aria-label="Category">
            <option>All</option>
            {CATEGORIES.map(c => <option key={c.slug}>{c.short}</option>)}
          </select>
        )}
        <select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort">
          <option value="featured">Featured</option>
          <option value="name">Name</option>
          <option value="price-asc">Price: low to high</option>
          <option value="price-desc">Price: high to low</option>
        </select>
      </div>
      <p className="count">{list.length} items</p>
      <div className="product-grid">
        {list.map(p => (
          <article key={p.id} className="product-card">
            <SmartImg src={p.img} fallback={p.fallback} alt={p.name} />
            <div>
              <p className="eyebrow">{p.cat}</p>
              <h3>{p.name}</h3>
              <p className="desc">{p.desc}</p>
              <p>{p.price != null ? `${money(p.price)} / ${p.unit}` : 'Price on request'}</p>
              <button type="button" className="btn glow" onClick={() => add(p)}>Add</button>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
