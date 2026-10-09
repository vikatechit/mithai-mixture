import Seo from '../components/Seo'
import { RATE_GROUPS } from '../data/priceList'
import { money } from '../lib/format'

function unitLabel(unit) {
  if (unit === 'pc') return '/ pc'
  if (unit === 'jar') return '/ jar'
  if (unit === 'box') return '/ box'
  return '/ kg'
}

export default function Rates() {
  return (
    <section className="section">
      <Seo title="Rate List | Mithai Mixture" description="Official PLU rate list for Mithai Mixture India Private Limited." />
      <div className="section-head">
        <p className="kicker">Official rates</p>
        <h1>Rate list</h1>
        <p>GST as applicable. Confirm the item and weight on WhatsApp before packing.</p>
      </div>
      {RATE_GROUPS.map(group => (
        <div key={group.title} className="rate-block">
          <div className="rate-head">
            <h2>{group.title}</h2>
            <p>{group.note}</p>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>PLU</th>
                  <th>Rate</th>
                </tr>
              </thead>
              <tbody>
                {group.items.map(([name, code, price, unit = 'kg']) => (
                  <tr key={`${code}-${name}`}>
                    <td>{name}</td>
                    <td>{code}</td>
                    <td>{money(price)} {unitLabel(unit)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </section>
  )
}
