/**
 * MITHAI MIXTURE INDIA PRIVATE LIMITED
 * Central Product Catalog & Local Fallback Data
 * Total 66 products across Sweets, Biscuits, Beverages, Mixtures, Pickles, Chocolates, Frozen Foods.
 */

const LOCAL_PRODUCTS = [
  // 1-28: TRADITIONAL SWEETS (EXACT RATE LIST WITH KG PRICING)
  {
    id: "MM-001",
    name: "Tripod Laddu",
    price: 480,
    cat: "Sweets",
    unit: "kg",
    img: "assets/tripod-laddu.webp",
    desc: "Signature festive laddu crafted with pure ghee, aromatic cardamom and gram flour.",
    featured: true
  },
  {
    id: "MM-002",
    name: "Dry Fruit Laddu",
    price: 480,
    cat: "Sweets",
    unit: "kg",
    img: "assets/dry-fruit-laddu.webp",
    desc: "Nutrient-rich royal laddu loaded with cashews, almonds, pistachios and raisins.",
    featured: true
  },
  {
    id: "MM-003",
    name: "White Kalakand",
    price: 440,
    cat: "Sweets",
    unit: "kg",
    img: "assets/white-kalakand.webp",
    desc: "Soft, granular milk delicacy slowly simmered to velvety, melt-in-mouth perfection.",
    featured: true
  },
  {
    id: "MM-004",
    name: "Rost Kalathihan",
    price: 460,
    cat: "Sweets",
    unit: "kg",
    img: "assets/rost-kalathihan.webp",
    desc: "Caramelized roasted milk sweet with deep nutty notes and rich golden crust."
  },
  {
    id: "MM-005",
    name: "All Kova Items",
    price: 360,
    cat: "Sweets",
    unit: "kg",
    img: "assets/all-kova-items.webp",
    desc: "Assorted traditional pure mawa (kova) delicacies hand-crafted with pure dairy milk."
  },
  {
    id: "MM-006",
    name: "Spl Kolakand",
    price: 500,
    cat: "Sweets",
    unit: "kg",
    img: "assets/spl-kolakand.webp",
    desc: "Special recipe kalakand garnished with slivered pistachios and fragrant green cardamom.",
    featured: true
  },
  {
    id: "MM-007",
    name: "Dry Fruit Halwa",
    price: 360,
    cat: "Sweets",
    unit: "kg",
    img: "assets/dry-fruit-halwa.webp",
    desc: "Glistening ghee halwa enriched with crunchy whole dry fruits and aromatic saffron."
  },
  {
    id: "MM-008",
    name: "Ice Cream Barfi",
    price: 360,
    cat: "Sweets",
    unit: "kg",
    img: "assets/ice-cream-barfi.webp",
    desc: "Delightfully chilled style creamy barfi with delicate vanilla and pista layers."
  },
  {
    id: "MM-009",
    name: "Kaju Barfi",
    price: 900,
    cat: "Sweets",
    unit: "kg",
    img: "assets/kaju-barfi.webp",
    desc: "Prime quality Mangalore cashew fudge, delicately rolled with pure edible silver vark.",
    featured: true
  },
  {
    id: "MM-010",
    name: "Arusulu",
    price: 220,
    cat: "Sweets",
    unit: "kg",
    img: "assets/arusulu.webp",
    desc: "Traditional South Indian heritage delicacy made of fresh rice flour, pure jaggery and ghee."
  },
  {
    id: "MM-011",
    name: "Salividi",
    price: 180,
    cat: "Sweets",
    unit: "kg",
    img: "assets/salividi.webp",
    desc: "Wholesome ceremonial sweet delicacy made from freshly ground rice flour and jaggery."
  },
  {
    id: "MM-012",
    name: "Kova Kajjikayalu",
    price: 260,
    cat: "Sweets",
    unit: "kg",
    img: "assets/kova-kajjikayalu.webp",
    desc: "Crisp golden crescent pastry stuffed with a rich, aromatic sweetened kova filling."
  },
  {
    id: "MM-013",
    name: "Sunnundalu",
    price: 340,
    cat: "Sweets",
    unit: "kg",
    img: "assets/sunnundalu.webp",
    desc: "Classic Andhra urad dal laddus roasted to golden aroma and bound with pure desi ghee."
  },
  {
    id: "MM-014",
    name: "Bhoondhi Laddu",
    price: 200,
    cat: "Sweets",
    unit: "kg",
    img: "assets/bhoondhi-laddu.webp",
    desc: "Soft, juicy pearl-shaped boondi laddus flavoured with cardamom, cloves and cashews."
  },
  {
    id: "MM-015",
    name: "Mysurpak",
    price: 200,
    cat: "Sweets",
    unit: "kg",
    img: "assets/mysurpak.webp",
    desc: "Traditional porous gram flour sweet cooked with pure ghee to crisp, airy delicacy."
  },
  {
    id: "MM-016",
    name: "Basan Laddu",
    price: 200,
    cat: "Sweets",
    unit: "kg",
    img: "assets/basan-laddu.webp",
    desc: "Aromatic roasted besan laddus with crunchy dry fruits and fine desi ghee fragrance."
  },
  {
    id: "MM-017",
    name: "Kaja",
    price: 180,
    cat: "Sweets",
    unit: "kg",
    img: "assets/kaja.webp",
    desc: "Multi-layered flaky sweet pastry soaked in cardamom-infused sugar syrup."
  },
  {
    id: "MM-018",
    name: "Badusha",
    price: 180,
    cat: "Sweets",
    unit: "kg",
    img: "assets/badusha.webp",
    desc: "Crisp outside, moist and flaky inside traditional Indian glazed doughnut sweet."
  },
  {
    id: "MM-019",
    name: "Gorri Mittai",
    price: 180,
    cat: "Sweets",
    unit: "kg",
    img: "assets/gorri-mittai.webp",
    desc: "Authentic crunchy sugar-coated traditional sweet bites, beloved across generations."
  },
  {
    id: "MM-020",
    name: "Jangiri",
    price: 200,
    cat: "Sweets",
    unit: "kg",
    img: "assets/jangiri.webp",
    desc: "Intricately piped urad dal swirls, deep fried and immersed in fragrant saffron sugar syrup."
  },
  {
    id: "MM-021",
    name: "Red Laddu",
    price: 220,
    cat: "Sweets",
    unit: "kg",
    img: "assets/red-laddu.webp",
    desc: "Festive celebration laddu prepared with rich boondi, warm spices and dry fruits."
  },
  {
    id: "MM-022",
    name: "Yellow Laddu",
    price: 200,
    cat: "Sweets",
    unit: "kg",
    img: "assets/yellow-laddu.webp",
    desc: "Golden yellow sweet laddu prepared fresh daily with gram pearls and pure ghee."
  },
  {
    id: "MM-023",
    name: "Milk Mysorepak",
    price: 280,
    cat: "Sweets",
    unit: "kg",
    img: "assets/milk-mysorepak.webp",
    desc: "Velvety, smooth modern Mysorepak prepared with rich condensed milk and desi ghee."
  },
  {
    id: "MM-024",
    name: "Cham Cham",
    price: 280,
    cat: "Sweets",
    unit: "kg",
    img: "assets/cham-cham.webp",
    desc: "Traditional Bengali sweet made from fresh paneer, poached in light syrup and rolled in coconut."
  },
  {
    id: "MM-025",
    name: "Hala Jamun",
    price: 260,
    cat: "Sweets",
    unit: "kg",
    img: "assets/hala-jamun.webp",
    desc: "Golden-brown soft mawa dumplings steeped in warm saffron sugar nectar."
  },
  {
    id: "MM-026",
    name: "Sooanpapdi",
    price: 200,
    cat: "Sweets",
    unit: "kg",
    img: "assets/sooanpapdi.webp",
    desc: "Flaky, crisp ribbon-like confection made from chickpea flour, ghee and crunchy pistas."
  },
  {
    id: "MM-027",
    name: "Gulab Jamun",
    price: 260,
    cat: "Sweets",
    unit: "kg",
    img: "assets/gulab-jamun.webp",
    desc: "Classic soft khoya dumplings soaked in rose water and cardamom scented sugar syrup.",
    featured: true
  },
  {
    id: "MM-028",
    name: "All Mixed Kova & Kalakanda Items",
    price: 460,
    cat: "Sweets",
    unit: "kg",
    img: "assets/mixed-kova-kalakanda.webp",
    desc: "Premium celebratory platter of diverse artisanal kova and kalakand sweets."
  },

  // 29-33: SWEET PACKS (PACKAGED GIFTS)
  {
    id: "MM-029",
    name: "Rasgulla (Pack)",
    price: null,
    cat: "Sweets",
    unit: "pack",
    img: "assets/rasgulla-pack.webp",
    desc: "Spongy, delicate chhena spheres in light syrup, packed fresh for lasting softness."
  },
  {
    id: "MM-030",
    name: "Gulab Jamun (Pack)",
    price: null,
    cat: "Sweets",
    unit: "pack",
    img: "assets/gulab-jamun-pack.webp",
    desc: "Sealed gift tin of succulent gulab jamuns, ideal for festive gifting and family gatherings."
  },
  {
    id: "MM-031",
    name: "Motichoor Ladoo (Pack)",
    price: null,
    cat: "Sweets",
    unit: "pack",
    img: "assets/motichoor-ladoo-pack.webp",
    desc: "Fine pearl-sized motichoor ladoos beautifully presented in protective gift packaging."
  },
  {
    id: "MM-032",
    name: "Kaju Katli (Pack)",
    price: null,
    cat: "Sweets",
    unit: "pack",
    img: "assets/kaju-katli-pack.webp",
    desc: "Handcrafted diamond-cut kaju katlis sealed in luxury Mithai Mixture presentation boxes."
  },
  {
    id: "MM-033",
    name: "Pista Barfi (Pack)",
    price: null,
    cat: "Sweets",
    unit: "pack",
    img: "assets/pista-barfi-pack.webp",
    desc: "Pure pistachio mawa barfi with natural green color and rich nutty texture in a gift pack."
  },

  // 34-37: BISCUITS
  {
    id: "MM-034",
    name: "Mithai Biscuit",
    price: null,
    cat: "Biscuits",
    unit: "pack",
    img: "assets/mithai-biscuit.webp",
    desc: "Our signature bakery biscuit with a rich buttery crumb and subtle sweetness.",
    featured: true
  },
  {
    id: "MM-035",
    name: "Osmania Biscuit",
    price: null,
    cat: "Biscuits",
    unit: "pack",
    img: "assets/osmania-biscuit.webp",
    desc: "Heritage Hyderabadi tea biscuit with the classic sweet and subtle salty balance."
  },
  {
    id: "MM-036",
    name: "Jeera Biscuit",
    price: null,
    cat: "Biscuits",
    unit: "pack",
    img: "assets/jeera-biscuit.webp",
    desc: "Crisp savoury tea-time biscuits infused with roasted cumin seeds."
  },
  {
    id: "MM-037",
    name: "Marie Biscuit",
    price: null,
    cat: "Biscuits",
    unit: "pack",
    img: "assets/marie-biscuit.webp",
    desc: "Light, crisp and wholesome golden-baked biscuits ideal for daily dipping."
  },

  // 38: BEVERAGE
  {
    id: "MM-038",
    name: "Mithai Badam 350ml",
    price: null,
    cat: "Beverages",
    unit: "bottle",
    img: "assets/mithai-badam.webp",
    desc: "Creamy, chilled almond beverage flavoured with royal Kashmiri saffron and green cardamom.",
    featured: true
  },

  // 39-43: MIXTURES
  {
    id: "MM-039",
    name: "Khatta Meetha Mixture",
    price: null,
    cat: "Mixtures",
    unit: "pack",
    img: "assets/khatta-meetha-mixture.webp",
    desc: "Irresistible tangy-sweet medley of crispy sev, fried green peas, nuts and spices.",
    featured: true
  },
  {
    id: "MM-040",
    name: "Moong Dal Mixture",
    price: null,
    cat: "Mixtures",
    unit: "pack",
    img: "assets/moong-dal-mixture.webp",
    desc: "Golden fried, salted split green gram — light, crunchy and protein-packed."
  },
  {
    id: "MM-041",
    name: "Navratan Mixture",
    price: null,
    cat: "Mixtures",
    unit: "pack",
    img: "assets/navratan-mixture.webp",
    desc: "Nine-ingredient royal savoury blend of crispy lentils, roasted nuts and spicy sev."
  },
  {
    id: "MM-042",
    name: "Punjabi Tadka Mixture",
    price: null,
    cat: "Mixtures",
    unit: "pack",
    img: "assets/punjabi-tadka-mixture.webp",
    desc: "Fiery, robust North Indian spiced potato & gram sev with distinctive garlic-chilli tadka."
  },
  {
    id: "MM-043",
    name: "Bombay Mixture",
    price: null,
    cat: "Mixtures",
    unit: "pack",
    img: "assets/bombay-mixture.webp",
    desc: "Zesty street-style crispy mix with peanuts, curry leaves and classic Mumbai spices."
  },

  // 44-51: PICKLES
  {
    id: "MM-044",
    name: "Mango Pickle",
    price: null,
    cat: "Pickles",
    unit: "jar",
    img: "assets/mango-pickle.webp",
    desc: "Traditional Avakaya style raw mango chunks cured in cold-pressed oil, mustard and red chilli.",
    featured: true
  },
  {
    id: "MM-045",
    name: "Lime Pickle",
    price: null,
    cat: "Pickles",
    unit: "jar",
    img: "assets/lime-pickle.webp",
    desc: "Sun-cured tart and tangy juicy limes with aromatic fenugreek and asafoetida."
  },
  {
    id: "MM-046",
    name: "Chilli Pickle",
    price: null,
    cat: "Pickles",
    unit: "jar",
    img: "assets/chilli-pickle.webp",
    desc: "Fiery green chilli pickle spiced with crushed mustard seeds and lemon juice."
  },
  {
    id: "MM-047",
    name: "Garlic Pickle",
    price: null,
    cat: "Pickles",
    unit: "jar",
    img: "assets/garlic-pickle.webp",
    desc: "Whole peeled garlic cloves preserved in spicy, tangy and fragrant Indian pickle gravy."
  },
  {
    id: "MM-048",
    name: "Chicken Pickle",
    price: null,
    cat: "Pickles",
    unit: "jar",
    img: "assets/chicken-pickle.webp",
    desc: "Gourmet boneless tender chicken marinated in spicy Andhra masala and sesame oil."
  },
  {
    id: "MM-049",
    name: "Mutton Pickle",
    price: null,
    cat: "Pickles",
    unit: "jar",
    img: "assets/mutton-pickle.webp",
    desc: "Succulent pieces of spiced mutton cooked to perfection and preserved in rich aromatic oil."
  },
  {
    id: "MM-050",
    name: "Prawn Pickle",
    price: null,
    cat: "Pickles",
    unit: "jar",
    img: "assets/prawn-pickle.webp",
    desc: "Fresh coastal prawns infused with fiery ginger-garlic, curry leaves and ground spices."
  },
  {
    id: "MM-051",
    name: "Fish Pickle",
    price: null,
    cat: "Pickles",
    unit: "jar",
    img: "assets/fish-pickle.webp",
    desc: "Firm coastal fish fillets cured in tangy vinegar, roasted spices and sesame oil."
  },

  // 52-57: CHOCOLATES
  {
    id: "MM-052",
    name: "Dark Chocolate",
    price: null,
    cat: "Chocolates",
    unit: "box",
    img: "assets/dark-chocolate.webp",
    desc: "Rich 70% cocoa single-origin dark chocolate bar with deep bittersweet notes.",
    featured: true
  },
  {
    id: "MM-053",
    name: "Milk Chocolate",
    price: null,
    cat: "Chocolates",
    unit: "box",
    img: "assets/milk-chocolate.webp",
    desc: "Silky, smooth European style milk chocolate crafted with whole dairy cream."
  },
  {
    id: "MM-054",
    name: "Premium Assorted Chocolates",
    price: null,
    cat: "Chocolates",
    unit: "box",
    img: "assets/premium-assorted-chocolates.webp",
    desc: "Luxury gift box combining dark, milk, nutty and fruit-filled chocolate masterpieces.",
    featured: true
  },
  {
    id: "MM-055",
    name: "Chocolate Truffles",
    price: null,
    cat: "Chocolates",
    unit: "box",
    img: "assets/chocolate-truffles.webp",
    desc: "Velvety cocoa ganache truffles hand-rolled in pure cocoa powder and hazelnut crisps."
  },
  {
    id: "MM-056",
    name: "Filled Chocolates",
    price: null,
    cat: "Chocolates",
    unit: "box",
    img: "assets/filled-chocolates.webp",
    desc: "Decadent chocolate bonbons filled with salted caramel, berry compote and almond praline."
  },
  {
    id: "MM-057",
    name: "Nut Chocolates",
    price: null,
    cat: "Chocolates",
    unit: "box",
    img: "assets/nut-chocolates.webp",
    desc: "Crunchy roasted California almonds and pistachios smothered in creamy chocolate."
  },

  // 58-66: FROZEN FOODS
  {
    id: "MM-058",
    name: "Samosa",
    price: null,
    cat: "Frozen Foods",
    unit: "pack",
    img: "assets/samosa.webp",
    desc: "Golden, crispy triangular pastries stuffed with spiced potatoes and green peas.",
    featured: true
  },
  {
    id: "MM-059",
    name: "Veg Momos",
    price: null,
    cat: "Frozen Foods",
    unit: "pack",
    img: "assets/veg-momos.webp",
    desc: "Steamed or fried Himalayan style dumplings filled with seasoned farm-fresh vegetables."
  },
  {
    id: "MM-060",
    name: "Chicken Nuggets",
    price: null,
    cat: "Frozen Foods",
    unit: "pack",
    img: "assets/chicken-nuggets.webp",
    desc: "Tender, juicy chicken bites with a golden crispy crumb coating. Ready to fry or air-fry."
  },
  {
    id: "MM-061",
    name: "Paneer Snacks",
    price: null,
    cat: "Frozen Foods",
    unit: "pack",
    img: "assets/paneer-snacks.webp",
    desc: "Crumb-coated malai paneer cutlets with fresh herbs and spices. Perfect for parties."
  },
  {
    id: "MM-062",
    name: "Chicken Seekh Kebab",
    price: null,
    cat: "Frozen Foods",
    unit: "pack",
    img: "assets/chicken-seekh-kebab.webp",
    desc: "Authentic tandoori spiced minced chicken skewers infused with mint, coriander and ginger."
  },
  {
    id: "MM-063",
    name: "French Fries",
    price: null,
    cat: "Frozen Foods",
    unit: "pack",
    img: "assets/french-fries.webp",
    desc: "Extra-crispy premium potato fries, pre-cut and flash-frozen for rapid crisp frying."
  },
  {
    id: "MM-064",
    name: "Spring Rolls",
    price: null,
    cat: "Frozen Foods",
    unit: "pack",
    img: "assets/spring-rolls.webp",
    desc: "Delicate, crispy wonton rolls filled with shredded crunchy vegetables and mild spices."
  },
  {
    id: "MM-065",
    name: "Paneer Paratha",
    price: null,
    cat: "Frozen Foods",
    unit: "pack",
    img: "assets/paneer-paratha.webp",
    desc: "Homestyle whole wheat layered flatbread generously stuffed with spiced grated paneer."
  },
  {
    id: "MM-066",
    name: "Paneer Tikka",
    price: null,
    cat: "Frozen Foods",
    unit: "pack",
    img: "assets/paneer-tikka.webp",
    desc: "Chargrilled marinated cottage cheese cubes with bell peppers and roasted tandoori masala."
  }
];

// Active products array (overridden dynamically if Google Sheets is connected)
let PRODUCTS = LOCAL_PRODUCTS.slice();
