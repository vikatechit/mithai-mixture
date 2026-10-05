export const BRAND = {
  name: 'Mithai Mixture India Private Limited',
  short: 'Mithai Mixture',
  tagline: 'Taste with Tradition',
  sub: 'Sweets • Snacks • Happiness',
  whatsapp: '918125213332',
  whatsappDisplay: '+91 81252 13332',
  email: 'care@mithaimixture.com',
  defaultPassword: 'Mithai@13332',
  logo: '/assets/logo.png'
}

export const CATEGORIES = [
  { slug: 'sweets', name: 'Traditional Sweets', short: 'Sweets', image: '/assets/sweets.webp', desc: 'Ghee laddus, kalakand, halwa, kova, barfi and festive sweet packs.' },
  { slug: 'mixtures', name: 'Signature Mixtures', short: 'Mixtures', image: '/assets/mixtures.webp', desc: 'Khatta Meetha, Moong Dal, Navratan, Punjabi Tadka and Bombay mixtures.' },
  { slug: 'biscuits', name: 'Premium Biscuits', short: 'Biscuits', image: '/assets/biscuits.webp', desc: 'Mithai, Osmania, Jeera and Marie biscuits for tea time.' },
  { slug: 'pickles', name: 'Traditional Pickles', short: 'Pickles', image: '/assets/pickles.webp', desc: 'Mango, lime, chilli, garlic and coastal non-veg pickles.' },
  { slug: 'beverages', name: 'Mithai Beverages', short: 'Beverages', image: '/assets/beverages.webp', desc: 'Chilled Mithai Badam milk with saffron and cardamom.' },
  { slug: 'chocolates', name: 'Premium Chocolates', short: 'Chocolates', image: '/assets/chocolates.webp', desc: 'Dark, milk, truffles, filled and nut chocolates, plus gift boxes.' },
  { slug: 'frozen-foods', name: 'Frozen Foods', short: 'Frozen Foods', image: '/assets/products/samosa.webp', desc: 'Samosa, momos, kebabs, nuggets, paneer snacks and fries.' }
]

export function categoryBySlug(slug) {
  return CATEGORIES.find(c => c.slug === slug)
}

export function categoryByName(name) {
  return CATEGORIES.find(c => c.short === name || c.name === name)
}

export function waLink(text) {
  return `https://wa.me/${BRAND.whatsapp}?text=${encodeURIComponent(text)}`
}
