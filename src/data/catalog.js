/** Deduped catalogue. Ghee-sweet repeats of the same names were removed. */
const item = (id, name, price, cat, unit, img, file, desc, featured = false) => {
  const photo = /^https?:/i.test(img)
    ? `/assets/products/${file}.jpg`
    : `/assets/products/${file}.webp`
  return {
    id,
    name,
    price,
    cat,
    unit,
    img: photo,
    fallback: photo,
    desc,
    featured
  }
}

export const CATALOG = [
  item('MM-001', 'Tripod Laddu', null, 'Sweets', 'kg', 'https://i.pinimg.com/736x/c0/94/14/c094147e5d9522de87100b915b795115.jpg', 'tripod-laddu', 'Festive laddu made with ghee, cardamom and gram flour.', true),
  item('MM-002', 'Dry Fruit Laddu', 800, 'Sweets', 'kg', 'https://i.pinimg.com/736x/c7/f3/00/c7f300578007bdc76737919d663916f9.jpg', 'dry-fruit-laddu', 'Royal laddu loaded with cashews, almonds, pistachios and raisins.', true),
  item('MM-003', 'White Kalakand', null, 'Sweets', 'kg', 'https://i.pinimg.com/736x/a0/cb/84/a0cb847441d44ef673e5f3f0cf48236d.jpg', 'white-kalakand', 'Soft milk kalakand simmered to a fine, melt-in-mouth grain.'),
  item('MM-004', 'Rost Kalakand', 680, 'Sweets', 'kg', 'https://i.pinimg.com/736x/26/52/d8/2652d87fc0dcabc75b4c2fe565abadde.jpg', 'rost-kalathihan', 'Roasted kalakand with a caramel crust and deep nutty milk flavour.'),
  item('MM-005', 'All Kova Items', 640, 'Sweets', 'kg', 'https://i0.wp.com/sakalavarisyamfoods.com/wp-content/uploads/2022/12/Kova-Varieties.jpg?fit=1080%2C1080&ssl=1', 'all-kova-items', 'Assorted traditional kova sweets prepared from slow-reduced milk.'),
  item('MM-006', 'Spl. Kalakand', 680, 'Sweets', 'kg', 'https://i.pinimg.com/736x/45/19/5f/45195fb15d11d92f9fee64d4025089eb.jpg', 'spl-kolakand', 'Special kalakand finished with pistachio and cardamom.', true),
  item('MM-007', 'Dry Fruit Halwa', 700, 'Sweets', 'kg', 'https://i.pinimg.com/736x/73/2f/b5/732fb57a855f37488d57f175c79300b3.jpg', 'dry-fruit-halwa', 'Ghee halwa studded with dry fruits and saffron.'),
  item('MM-008', 'Ice Cream Barfi', 640, 'Sweets', 'kg', 'https://i.pinimg.com/1200x/56/11/21/561121ac6dc87a5a0c9317b35983c08a.jpg', 'ice-cream-barfi', 'Creamy layered barfi with a cool vanilla and pista finish.'),
  item('MM-009', 'Kaju Barfi', 1080, 'Sweets', 'kg', 'https://i.pinimg.com/736x/03/26/10/032610d7d9602bc9279c782df8f0978e.jpg', 'kaju-barfi', 'Cashew barfi rolled smooth from prime kaju.', true),
  item('MM-010', 'Ariselu', 320, 'Sweets', 'kg', 'https://i.pinimg.com/1200x/2a/23/a4/2a23a4cf58e86764c9b83fdca5963787.jpg', 'arusulu', 'Rice-flour and jaggery discs fried in ghee, an Andhra classic.'),
  item('MM-011', 'Salividi', 400, 'Sweets', 'kg', 'https://m.media-amazon.com/images/I/51JmVpRkvKL.jpg', 'salividi', 'Ceremonial rice-flour and jaggery sweet.'),
  item('MM-012', 'Kova Kajjikayalu', 320, 'Sweets', 'kg', 'https://i.pinimg.com/736x/14/69/e2/1469e2de5b27a9bd57738399b68e5fdd.jpg', 'kova-kajjikayalu', 'Crescent pastry filled with sweetened kova.'),
  item('MM-013', 'Sunnundalu', 640, 'Sweets', 'kg', 'https://i.pinimg.com/1200x/56/2c/41/562c41b2daa2201692cb758afb0c5bdc.jpg', 'sunnundalu', 'Urad dal laddus roasted and bound with desi ghee.'),
  item('MM-014', 'Bhoondhi Laddu', 320, 'Sweets', 'kg', 'https://i.pinimg.com/736x/d3/bc/54/d3bc54ed6d307408c1b9ec93ad4ea214.jpg', 'bhoondhi-laddu', 'Soft boondi laddus with cardamom, cloves and cashews.'),
  item('MM-015', 'Mysurpak', 320, 'Sweets', 'kg', 'https://i.pinimg.com/1200x/0e/bb/31/0ebb31ae8d83deb4a8011d18c77581f4.jpg', 'mysurpak', 'Porous ghee mysore pak with a crisp, airy bite.'),
  item('MM-016', 'Besan Laddu', 320, 'Sweets', 'kg', 'https://i.pinimg.com/736x/53/60/71/536071def94d430a104107ed4ab1ce94.jpg', 'basan-laddu', 'Roasted besan laddus with ghee and dry fruit.'),
  item('MM-017', 'Kaja', 320, 'Sweets', 'kg', 'https://i.pinimg.com/1200x/0a/94/12/0a9412ca0355287f76649e7d7b2ce767.jpg', 'kaja', 'Layered flaky pastry soaked in cardamom syrup.'),
  item('MM-018', 'Badusha', 320, 'Sweets', 'kg', 'https://i.pinimg.com/1200x/fa/9e/bf/fa9ebfb52b96d09815ca7ddbece76626.jpg', 'badusha', 'Crisp outside, soft inside, glazed with sugar syrup.'),
  item('MM-019', 'Gorri Mittai', 320, 'Sweets', 'kg', '', 'gorri-mittai', 'Crunchy sugar-coated traditional sweet bites.'),
  item('MM-020', 'Jangiri', 400, 'Sweets', 'kg', 'https://i.pinimg.com/1200x/73/40/26/73402632a106f108dc864c35a3c60601.jpg', 'jangiri', 'Piped urad swirls soaked in saffron sugar syrup.'),
  item('MM-021', 'Red Laddu', null, 'Sweets', 'kg', 'https://i.pinimg.com/1200x/9f/50/8a/9f508a64b1c70cf92603fb6d080a8bb3.jpg', 'red-laddu', 'Festive red laddu with warm spices and dry fruits.'),
  item('MM-022', 'Yellow Laddu', null, 'Sweets', 'kg', 'https://i.pinimg.com/1200x/2e/f4/a5/2ef4a542b1c790e14aba26b4a95408c4.jpg', 'yellow-laddu', 'Golden gram laddu prepared fresh with ghee.'),
  item('MM-023', 'Milk Mysorepak', 640, 'Sweets', 'kg', 'https://i.pinimg.com/736x/1e/47/c1/1e47c137709c6dca40d57e0b92c7cb01.jpg', 'milk-mysorepak', 'Soft milk mysore pak cooked in ghee.'),
  item('MM-024', 'Cham Cham', 440, 'Sweets', 'kg', 'https://i.pinimg.com/736x/1d/73/5b/1d735b3ad48d62fad5fe0469004eac2d.jpg', 'cham-cham', 'Chhena sweet in light syrup, finished with coconut.'),
  item('MM-025', 'Hala Jamun', null, 'Sweets', 'kg', 'https://i.pinimg.com/736x/f3/0c/12/f30c12b84adf1c35887b9aaca192eb9a.jpg', 'hala-jamun', 'Soft dumplings steeped in warm saffron syrup.'),
  item('MM-026', 'Soanpapdi', 440, 'Sweets', 'kg', 'https://i.pinimg.com/736x/1e/23/c4/1e23c4acee5aefc930e70cb6898ff9d2.jpg', 'sooanpapdi', 'Flaky soan papdi with ghee and pistachio.'),
  item('MM-027', 'Gulab Jamun', 440, 'Sweets', 'kg', 'https://i.pinimg.com/736x/d7/57/aa/d757aaadf9cb57a72ee0143984c7338b.jpg', 'gulab-jamun', 'Khoya dumplings in rose and cardamom syrup.', true),
  item('MM-028', 'All Mixed Kova & Kalakanda Items', 460, 'Sweets', 'kg', 'https://i.pinimg.com/1200x/b6/78/01/b678019eca73bc41ef9fe17219211c32.jpg', 'mixed-kova-kalakanda', 'Celebration mix of kova and kalakand varieties.'),
  item('MM-032', 'Rasgulla', 440, 'Sweets', 'pack', 'https://i.pinimg.com/736x/31/fb/61/31fb61d23d041061c567d304d80b36b2.jpg', 'rasgulla-pack', 'Spongy chhena balls in light syrup, packed for gifting.'),
  item('MM-033', 'Motichoor Ladoo', 320, 'Sweets', 'pack', 'https://i.pinimg.com/736x/12/e3/5a/12e35ad688e3e839b4d536535ea8bd5c.jpg', 'motichoor-ladoo-pack', 'Fine motichoor ladoos in a gift pack.'),
  item('MM-034', 'Kaju Katli', 1080, 'Sweets', 'pack', 'https://i.pinimg.com/736x/49/fb/ea/49fbea967f4ff2e347f5cdc3db76ff38.jpg', 'kaju-katli-pack', 'Diamond-cut kaju katli in a presentation box.'),
  item('MM-035', 'Pista Barfi', null, 'Sweets', 'pack', 'https://i.pinimg.com/736x/99/41/40/994140cd4c698fd697b0342581f70e14.jpg', 'pista-barfi-pack', 'Pistachio barfi with a rich nutty bite.'),
  item('MM-036', 'Mithai Biscuit', null, 'Biscuits', 'pack', 'https://i.pinimg.com/1200x/4d/9f/94/4d9f94bec45b168d977209f47a0f3c5c.jpg', 'mithai-biscuit', 'Signature buttery Mithai biscuit.', true),
  item('MM-037', 'Osmania Biscuit', null, 'Biscuits', 'pack', 'https://i.pinimg.com/1200x/f2/92/0d/f2920db180c23025533702f86ef8247b.jpg', 'osmania-biscuit', 'Hyderabadi tea biscuit with a sweet-salt finish.'),
  item('MM-038', 'Jeera Biscuit', 700, 'Biscuits', 'pack', 'https://i.pinimg.com/736x/4d/d5/89/4dd58957cd1a3ca4f02f1c2e1733237f.jpg', 'jeera-biscuit', 'Crisp cumin tea biscuits.'),
  item('MM-039', 'Marie Biscuit', null, 'Biscuits', 'pack', 'https://i.pinimg.com/736x/a7/83/b5/a783b50a020b86532149c13553a3f600.jpg', 'marie-biscuit', 'Light golden biscuits for everyday tea.'),
  item('MM-040', 'Mithai Badam Milk', 60, 'Beverages', 'bottle', 'https://i.pinimg.com/736x/93/7d/5b/937d5bea4cf5779ab94c4df043a3c819.jpg', 'mithai-badam', 'Chilled badam milk with saffron and cardamom.', true),
  item('MM-041', 'Khatta Meetha Mixture', null, 'Mixtures', 'pack', 'https://i.pinimg.com/736x/b4/ed/2e/b4ed2ea72798fe009ba2ffdaffe7307b.jpg', 'khatta-meetha-mixture', 'Tangy-sweet mix of sev, peas, nuts and spices.', true),
  item('MM-042', 'Moong Dal Mixture', 360, 'Mixtures', 'pack', 'https://i.pinimg.com/736x/2e/3d/00/2e3d00a34b52996a2533a6de1ab4f07a.jpg', 'moong-dal-mixture', 'Crunchy salted moong dal.'),
  item('MM-043', 'Navratan Mixture', 480, 'Mixtures', 'pack', 'https://i.pinimg.com/1200x/50/06/31/50063172a4faef73a00de6ba60032052.jpg', 'navratan-mixture', 'Nine-ingredient blend of lentils, nuts and sev.'),
  item('MM-044', 'Punjabi Tadka Mixture', null, 'Mixtures', 'pack', 'https://5.imimg.com/data5/SELLER/Default/2025/1/478441433/ZK/LI/NS/201933780/img20250104120326-500x500.jpeg', 'punjabi-tadka-mixture', 'Spiced North Indian mixture with a garlic-chilli tadka.'),
  item('MM-045', 'Bombay Mixture', 400, 'Mixtures', 'pack', 'https://i.pinimg.com/736x/7a/3f/2a/7a3f2a4a632e19aef1ec34e472128065.jpg', 'bombay-mixture', 'Street-style Bombay mix with peanuts and curry leaf.'),
  item('MM-046', 'Mango Pickle', 440, 'Pickles', 'jar', 'https://i.pinimg.com/736x/35/fa/49/35fa49c83bff731e8c85c6f04976b416.jpg', 'mango-pickle', 'Avakaya-style mango pickle in mustard and chilli oil.', true),
  item('MM-047', 'Lime Pickle', 440, 'Pickles', 'jar', 'https://i.pinimg.com/1200x/6a/65/78/6a657810b81bea9d435b4aeb519ad8f0.jpg', 'lime-pickle', 'Sun-cured lime pickle with fenugreek.'),
  item('MM-048', 'Chilli Pickle', 440, 'Pickles', 'jar', 'https://i.pinimg.com/1200x/cc/12/e9/cc12e90a86c1940df2c4ca770ff76ef4.jpg', 'chilli-pickle', 'Green chilli pickle with mustard and lemon.'),
  item('MM-049', 'Garlic Pickle', 440, 'Pickles', 'jar', 'https://i.pinimg.com/1200x/4f/e6/f3/4fe6f34c826faf30b3cf7e146d42236b.jpg', 'garlic-pickle', 'Whole garlic cloves in a spiced pickle gravy.'),
  item('MM-050', 'Chicken Pickle', null, 'Pickles', 'jar', 'https://i.pinimg.com/736x/45/ba/b8/45bab84c6275c39de96608149be808a5.jpg', 'chicken-pickle', 'Boneless chicken pickle in Andhra masala.'),
  item('MM-051', 'Mutton Pickle', null, 'Pickles', 'jar', 'https://i.pinimg.com/1200x/19/ca/9d/19ca9da3c868aa750867c4a9bcae9443.jpg', 'mutton-pickle', 'Spiced mutton pickle preserved in aromatic oil.'),
  item('MM-052', 'Prawn Pickle', null, 'Pickles', 'jar', 'https://i.pinimg.com/1200x/b4/bb/2e/b4bb2eb697dea4744f42f0affdbc5524.jpg', 'prawn-pickle', 'Coastal prawn pickle with ginger, garlic and curry leaf.'),
  item('MM-053', 'Fish Pickle', null, 'Pickles', 'jar', 'https://i.pinimg.com/736x/81/78/45/817845cd283eebbef19f2bf020064c1a.jpg', 'fish-pickle', 'Fish pickle cured with roasted spices and sesame oil.'),
  item('MM-054', 'Dark Chocolate', null, 'Chocolates', 'box', 'https://i.pinimg.com/1200x/75/a6/66/75a6662e6b639dd49f59132303b3e80c.jpg', 'dark-chocolate', 'Deep cocoa dark chocolate.', true),
  item('MM-055', 'Milk Chocolate', null, 'Chocolates', 'box', 'https://i.pinimg.com/736x/b7/e6/d8/b7e6d8ba9cf0297756f77af9c3be6ae6.jpg', 'milk-chocolate', 'Smooth milk chocolate.'),
  item('MM-056', 'Truffles', 100, 'Chocolates', 'box', 'https://i.pinimg.com/1200x/dd/d4/3a/ddd43af4b893931abfb04f2554e4e3ce.jpg', 'chocolate-truffles', 'Cocoa ganache truffles.'),
  item('MM-057', 'Filled Chocolates', null, 'Chocolates', 'box', 'https://i.pinimg.com/736x/4c/01/e4/4c01e4d5469f9963381d909ae5db1af1.jpg', 'filled-chocolates', 'Bonbons with caramel, fruit and praline centres.'),
  item('MM-058', 'Nut Chocolates', null, 'Chocolates', 'box', 'https://i.pinimg.com/736x/2a/b3/c6/2ab3c68361eef084d2f13112abb0592d.jpg', 'nut-chocolates', 'Chocolate with roasted almonds and pistachios.'),
  item('MM-059', 'Premium Chocolate Gift Box', null, 'Chocolates', 'box', 'https://i.pinimg.com/736x/48/26/cf/4826cf50143a857f57614d2d62b99288.jpg', 'premium-assorted-chocolates', 'Assorted chocolate gift box for celebrations.', true),
  item('MM-060', 'Samosa', 360, 'Frozen Foods', 'pack', 'https://i.pinimg.com/736x/b3/3d/b0/b33db040f8569cd69dcb43260ce4d3f8.jpg', 'samosa', 'Crispy potato and pea samosas, ready to fry.', true),
  item('MM-061', 'Veg Momos', null, 'Frozen Foods', 'pack', 'https://i.pinimg.com/736x/fe/c3/b3/fec3b34d5edb094554ed761c0d6f9d17.jpg', 'veg-momos', 'Vegetable momos, ready to steam or fry.'),
  item('MM-062', 'Chicken Nuggets', null, 'Frozen Foods', 'pack', 'https://i.pinimg.com/736x/c2/79/a7/c279a708b46d657853a2d6274f15a4c4.jpg', 'chicken-nuggets', 'Crumbed chicken nuggets, ready to fry or air-fry.'),
  item('MM-063', 'Paneer Snacks', null, 'Frozen Foods', 'pack', 'https://i.pinimg.com/1200x/0b/fd/26/0bfd26107710e56d5f30b726be18b8d5.jpg', 'paneer-snacks', 'Herb paneer snacks for parties.'),
  item('MM-064', 'Chicken Seekh Kebab', null, 'Frozen Foods', 'pack', 'https://i.pinimg.com/736x/94/72/5a/94725ab57b196ec9a012d34f33ed7a76.jpg', 'chicken-seekh-kebab', 'Spiced minced chicken seekh kebabs.'),
  item('MM-065', 'French Fries', null, 'Frozen Foods', 'pack', 'https://i.pinimg.com/736x/63/ca/c4/63cac4a1c2ba62a7db43c4cfc85ecbbb.jpg', 'french-fries', 'Crisp-cut fries, flash frozen.')
].map(p => ({ ...p, img: p.img || p.fallback, available: 'YES' }))

export const HERO_SLIDES = CATALOG.filter(p =>
  ['Tripod Laddu', 'Kaju Barfi', 'Gulab Jamun', 'Khatta Meetha Mixture', 'Mysurpak', 'Mango Pickle', 'Soanpapdi', 'Navratan Mixture'].includes(p.name)
)
