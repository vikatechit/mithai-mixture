export function money(n) {
  if (n == null || n === '' || Number.isNaN(Number(n))) return 'Price on request'
  return '₹' + Number(n).toLocaleString('en-IN', { maximumFractionDigits: 0 })
}

export function stepFor(unit) {
  return unit === 'kg' ? 0.25 : 1
}

export function qtyLabel(qty, unit) {
  const q = Number(qty)
  if (unit === 'kg') return `${q.toFixed(2)} kg`
  const plural = {
    pack: 'packs',
    jar: 'jars',
    bottle: 'bottles',
    box: 'boxes'
  }
  return `${q} ${q > 1 ? (plural[unit] || unit) : unit}`
}

export function orderStamp() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `MM-${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`
}
