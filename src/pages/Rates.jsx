import Seo from '../components/Seo'
import { useStore } from '../context/Store'
import { money } from '../lib/format'

export default function Rates() {
  const { products, add } = useStore()
  const rows = products.filter(p => p.cat === 'Sweets' && p.unit === 'kg')
  return (
    <section className="section">
      <Seo title="Sweet Rate List | Mithai Mixture" description="Per kilogram rate list for Mithai Mixture traditional sweets." />
      <div className="section-head left">
        <p className="kicker">Transparent pricing</p>
        <h1>Sweet rate list</h1>
        <p>Prices are per kilogram. GST as applicable. Items without a printed rate are confirmed on WhatsApp.</p>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr><th>Sweet</th><th>Rate / kg</th><th></th></tr>
          </thead>
          <tbody>
            {rows.map(p => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td>{p.price != null ? money(p.price) : 'On request'}</td>
                <td><button type="button" className="btn btn-small glow" onClick={() => add(p, 0.25)}>+ 0.25 kg</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
