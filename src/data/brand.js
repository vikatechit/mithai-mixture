export const BRAND = {
  name: 'Mithai Mixture India Private Limited',
  short: 'Mithai Mixture',
  tagline: 'Taste with Tradition',
  sub: 'Taste with Tradition',
  sheetUrl: 'https://docs.google.com/spreadsheets/d/1u1TgROpUB2EnJz69JowzsbssRnulDMlrHXMxv2IahEk/edit',
  scriptUrl: 'https://script.google.com/macros/s/AKfycbyNUuiuU2fVfmi3oi1mjFaXcS4cq1tlDUMLkiZ5ns9L26X14294849fHm-_xe9VQVtY/exec',
  whatsapp: '918125213332',
  whatsappDisplay: '+91 81252 13332',
  email: '',
  instagram: '',
  facebook: '',
  youtube: '',
  defaultPassword: 'Mithai@13332',
  logo: '/assets/logo.png'
}

export const CATEGORIES = [
  { slug: 'sweets', name: 'Traditional Sweets', short: 'Sweets', image: '/assets/categories/sweets.jpg', desc: 'Ghee laddus, kalakand, halwa, kova, barfi and festive sweet packs.' },
  { slug: 'mixtures', name: 'Signature Mixtures', short: 'Mixtures', image: '/assets/categories/mixtures.jpg', desc: 'Khatta Meetha, Moong Dal, Navratan, Punjabi Tadka and Bombay mixtures.' },
  { slug: 'biscuits', name: 'Premium Biscuits', short: 'Biscuits', image: '/assets/categories/biscuits.jpg', desc: 'Mithai, Osmania, Jeera and Marie biscuits for tea time.' },
  { slug: 'pickles', name: 'Traditional Pickles', short: 'Pickles', image: '/assets/categories/pickles.jpg', desc: 'Mango, lime, chilli, garlic and coastal non-veg pickles.' },
  { slug: 'beverages', name: 'Mithai Beverages', short: 'Beverages', image: '/assets/categories/beverages.jpg', desc: 'Chilled Mithai Badam milk with saffron and cardamom.' },
  { slug: 'chocolates', name: 'Premium Chocolates', short: 'Chocolates', image: '/assets/categories/chocolates.jpg', desc: 'Dark, milk, truffles, filled and nut chocolates, plus gift boxes.' },
  { slug: 'frozen-foods', name: 'Frozen Foods', short: 'Frozen Foods', image: '/assets/categories/frozen.jpg', desc: 'Samosa, momos, kebabs, nuggets, paneer snacks and fries.' }
]

export function categoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug === slug)
}

export function categoryByName(name) {
  return CATEGORIES.find(c => c.short === name || c.name === name)
}

export function formatWhatsapp(input) {
  let digits = String(input || '').replace(/\D/g, '')
  if (digits.length === 10) digits = `91${digits}`
  if (digits.length === 11 && digits.startsWith('0')) digits = `91${digits.slice(1)}`
  const display = digits.startsWith('91') && digits.length === 12
    ? `+91 ${digits.slice(2, 7)} ${digits.slice(7)}`
    : (digits ? `+${digits}` : BRAND.whatsappDisplay)
  return { whatsapp: digits || BRAND.whatsapp, whatsappDisplay: display }
}

export function waLink(text, number = BRAND.whatsapp) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`
}

export function cleanUrl(value) {
  const v = String(value || '').trim()
  if (!v) return ''
  if (/^https?:\/\//i.test(v)) return v
  return `https://${v}`
}

export function formatAddress(address) {
  const street = [address.line1, address.line2].filter(Boolean).join(', ')
  const place = [address.city, address.state].filter(Boolean).join(', ')
  return {
    street,
    place: [place, address.pin].filter(Boolean).join(' ')
  }
}
