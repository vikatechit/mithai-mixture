const SHEET_ID = '1u1TgROpUB2EnJz69JowzsbssRnulDMlrHXMxv2IahEk';

function book() {
  return SpreadsheetApp.openById(SHEET_ID);
}

const HEADERS = {
  Products: ['Product ID', 'Name', 'Category', 'Price', 'Unit', 'Pack Size', 'Image URL', 'Description', 'Available'],
  Orders: ['Order ID', 'Date', 'Customer Name', 'Phone', 'Address', 'Items JSON', 'Subtotal', 'Note'],
  Customers: ['Phone', 'Name', 'Address', 'First Order', 'Last Order', 'Orders Count'],
  Enquiries: ['Enquiry ID', 'Date', 'Name', 'Phone', 'Message', 'Status'],
  Settings: ['Key', 'Value'],
  Categories: ['Category', 'Display Order', 'Active']
};

const SEED = [
  ["MM-001", "Tripod Laddu", "Sweets", 480, "kg", "", "assets/tripod-laddu.webp", "Signature festive laddu crafted with pure ghee, aromatic cardamom and gram flour.", "YES"],
  ["MM-002", "Dry Fruit Laddu", "Sweets", 480, "kg", "", "assets/dry-fruit-laddu.webp", "Nutrient-rich royal laddu loaded with cashews, almonds, pistachios and raisins.", "YES"],
  ["MM-003", "White Kalakand", "Sweets", 440, "kg", "", "assets/white-kalakand.webp", "Soft, granular milk delicacy slowly simmered to velvety, melt-in-mouth perfection.", "YES"],
  ["MM-004", "Rost Kalathihan", "Sweets", 460, "kg", "", "assets/rost-kalathihan.webp", "Caramelized roasted milk sweet with deep nutty notes and rich golden crust.", "YES"],
  ["MM-005", "All Kova Items", "Sweets", 360, "kg", "", "assets/all-kova-items.webp", "Assorted traditional pure mawa (kova) delicacies hand-crafted with pure dairy milk.", "YES"],
  ["MM-006", "Spl Kolakand", "Sweets", 500, "kg", "", "assets/spl-kolakand.webp", "Special recipe kalakand garnished with slivered pistachios and fragrant green cardamom.", "YES"],
  ["MM-007", "Dry Fruit Halwa", "Sweets", 360, "kg", "", "assets/dry-fruit-halwa.webp", "Glistening ghee halwa enriched with crunchy whole dry fruits and aromatic saffron.", "YES"],
  ["MM-008", "Ice Cream Barfi", "Sweets", 360, "kg", "", "assets/ice-cream-barfi.webp", "Delightfully chilled style creamy barfi with delicate vanilla and pista layers.", "YES"],
  ["MM-009", "Kaju Barfi", "Sweets", 900, "kg", "", "assets/kaju-barfi.webp", "Prime quality Mangalore cashew fudge, delicately rolled with pure edible silver vark.", "YES"],
  ["MM-010", "Arusulu", "Sweets", 220, "kg", "", "assets/arusulu.webp", "Traditional South Indian heritage delicacy made of fresh rice flour, pure jaggery and ghee.", "YES"],
  ["MM-011", "Salividi", "Sweets", 180, "kg", "", "assets/salividi.webp", "Wholesome ceremonial sweet delicacy made from freshly ground rice flour and jaggery.", "YES"],
  ["MM-012", "Kova Kajjikayalu", "Sweets", 260, "kg", "", "assets/kova-kajjikayalu.webp", "Crisp golden crescent pastry stuffed with a rich, aromatic sweetened kova filling.", "YES"],
  ["MM-013", "Sunnundalu", "Sweets", 340, "kg", "", "assets/sunnundalu.webp", "Classic Andhra urad dal laddus roasted to golden aroma and bound with pure desi ghee.", "YES"],
  ["MM-014", "Bhoondhi Laddu", "Sweets", 200, "kg", "", "assets/bhoondhi-laddu.webp", "Soft, juicy pearl-shaped boondi laddus flavoured with cardamom, cloves and cashews.", "YES"],
  ["MM-015", "Mysurpak", "Sweets", 200, "kg", "", "assets/mysurpak.webp", "Traditional porous gram flour sweet cooked with pure ghee to crisp, airy delicacy.", "YES"],
  ["MM-016", "Basan Laddu", "Sweets", 200, "kg", "", "assets/basan-laddu.webp", "Aromatic roasted besan laddus with crunchy dry fruits and fine desi ghee fragrance.", "YES"],
  ["MM-017", "Kaja", "Sweets", 180, "kg", "", "assets/kaja.webp", "Multi-layered flaky sweet pastry soaked in cardamom-infused sugar syrup.", "YES"],
  ["MM-018", "Badusha", "Sweets", 180, "kg", "", "assets/badusha.webp", "Crisp outside, moist and flaky inside traditional Indian glazed doughnut sweet.", "YES"],
  ["MM-019", "Gorri Mittai", "Sweets", 180, "kg", "", "assets/gorri-mittai.webp", "Authentic crunchy sugar-coated traditional sweet bites, beloved across generations.", "YES"],
  ["MM-020", "Jangiri", "Sweets", 200, "kg", "", "assets/jangiri.webp", "Intricately piped urad dal swirls, deep fried and immersed in fragrant saffron sugar syrup.", "YES"],
  ["MM-021", "Red Laddu", "Sweets", 220, "kg", "", "assets/red-laddu.webp", "Festive celebration laddu prepared with rich boondi, warm spices and dry fruits.", "YES"],
  ["MM-022", "Yellow Laddu", "Sweets", 200, "kg", "", "assets/yellow-laddu.webp", "Golden yellow sweet laddu prepared fresh daily with gram pearls and pure ghee.", "YES"],
  ["MM-023", "Milk Mysorepak", "Sweets", 280, "kg", "", "assets/milk-mysorepak.webp", "Velvety, smooth modern Mysorepak prepared with rich condensed milk and desi ghee.", "YES"],
  ["MM-024", "Cham Cham", "Sweets", 280, "kg", "", "assets/cham-cham.webp", "Traditional Bengali sweet made from fresh paneer, poached in light syrup and rolled in coconut.", "YES"],
  ["MM-025", "Hala Jamun", "Sweets", 260, "kg", "", "assets/hala-jamun.webp", "Golden-brown soft mawa dumplings steeped in warm saffron sugar nectar.", "YES"],
  ["MM-026", "Sooanpapdi", "Sweets", 200, "kg", "", "assets/sooanpapdi.webp", "Flaky, crisp ribbon-like confection made from chickpea flour, ghee and crunchy pistas.", "YES"],
  ["MM-027", "Gulab Jamun", "Sweets", 260, "kg", "", "assets/gulab-jamun.webp", "Classic soft khoya dumplings soaked in rose water and cardamom scented sugar syrup.", "YES"],
  ["MM-028", "All Mixed Kova & Kalakanda Items", "Sweets", 460, "kg", "", "assets/mixed-kova-kalakanda.webp", "Premium celebratory platter of diverse artisanal kova and kalakand sweets.", "YES"],
  ["MM-029", "Rasgulla (Pack)", "Sweets", "", "pack", "", "assets/rasgulla-pack.webp", "Spongy, delicate chhena spheres in light syrup, packed fresh for lasting softness.", "YES"],
  ["MM-030", "Gulab Jamun (Pack)", "Sweets", "", "pack", "", "assets/gulab-jamun-pack.webp", "Sealed gift tin of succulent gulab jamuns, ideal for festive gifting and family gatherings.", "YES"],
  ["MM-031", "Motichoor Ladoo (Pack)", "Sweets", "", "pack", "", "assets/motichoor-ladoo-pack.webp", "Fine pearl-sized motichoor ladoos beautifully presented in protective gift packaging.", "YES"],
  ["MM-032", "Kaju Katli (Pack)", "Sweets", "", "pack", "", "assets/kaju-katli-pack.webp", "Handcrafted diamond-cut kaju katlis sealed in luxury Mithai Mixture presentation boxes.", "YES"],
  ["MM-033", "Pista Barfi (Pack)", "Sweets", "", "pack", "", "assets/pista-barfi-pack.webp", "Pure pistachio mawa barfi with natural green color and rich nutty texture in a gift pack.", "YES"],
  ["MM-034", "Mithai Biscuit", "Biscuits", "", "pack", "", "assets/mithai-biscuit.webp", "Our signature bakery biscuit with a rich buttery crumb and subtle sweetness.", "YES"],
  ["MM-035", "Osmania Biscuit", "Biscuits", "", "pack", "", "assets/osmania-biscuit.webp", "Heritage Hyderabadi tea biscuit with the classic sweet and subtle salty balance.", "YES"],
  ["MM-036", "Jeera Biscuit", "Biscuits", "", "pack", "", "assets/jeera-biscuit.webp", "Crisp savoury tea-time biscuits infused with roasted cumin seeds.", "YES"],
  ["MM-037", "Marie Biscuit", "Biscuits", "", "pack", "", "assets/marie-biscuit.webp", "Light, crisp and wholesome golden-baked biscuits ideal for daily dipping.", "YES"],
  ["MM-038", "Mithai Badam 350ml", "Beverages", "", "bottle", "", "assets/mithai-badam.webp", "Creamy, chilled almond beverage flavoured with royal Kashmiri saffron and green cardamom.", "YES"],
  ["MM-039", "Khatta Meetha Mixture", "Mixtures", "", "pack", "", "assets/khatta-meetha-mixture.webp", "Irresistible tangy-sweet medley of crispy sev, fried green peas, nuts and spices.", "YES"],
  ["MM-040", "Moong Dal Mixture", "Mixtures", "", "pack", "", "assets/moong-dal-mixture.webp", "Golden fried, salted split green gram — light, crunchy and protein-packed.", "YES"],
  ["MM-041", "Navratan Mixture", "Mixtures", "", "pack", "", "assets/navratan-mixture.webp", "Nine-ingredient royal savoury blend of crispy lentils, roasted nuts and spicy sev.", "YES"],
  ["MM-042", "Punjabi Tadka Mixture", "Mixtures", "", "pack", "", "assets/punjabi-tadka-mixture.webp", "Fiery, robust North Indian spiced potato & gram sev with distinctive garlic-chilli tadka.", "YES"],
  ["MM-043", "Bombay Mixture", "Mixtures", "", "pack", "", "assets/bombay-mixture.webp", "Zesty street-style crispy mix with peanuts, curry leaves and classic Mumbai spices.", "YES"],
  ["MM-044", "Mango Pickle", "Pickles", "", "jar", "", "assets/mango-pickle.webp", "Traditional Avakaya style raw mango chunks cured in cold-pressed oil, mustard and red chilli.", "YES"],
  ["MM-045", "Lime Pickle", "Pickles", "", "jar", "", "assets/lime-pickle.webp", "Sun-cured tart and tangy juicy limes with aromatic fenugreek and asafoetida.", "YES"],
  ["MM-046", "Chilli Pickle", "Pickles", "", "jar", "", "assets/chilli-pickle.webp", "Fiery green chilli pickle spiced with crushed mustard seeds and lemon juice.", "YES"],
  ["MM-047", "Garlic Pickle", "Pickles", "", "jar", "", "assets/garlic-pickle.webp", "Whole peeled garlic cloves preserved in spicy, tangy and fragrant Indian pickle gravy.", "YES"],
  ["MM-048", "Chicken Pickle", "Pickles", "", "jar", "", "assets/chicken-pickle.webp", "Gourmet boneless tender chicken marinated in spicy Andhra masala and sesame oil.", "YES"],
  ["MM-049", "Mutton Pickle", "Pickles", "", "jar", "", "assets/mutton-pickle.webp", "Succulent pieces of spiced mutton cooked to perfection and preserved in rich aromatic oil.", "YES"],
  ["MM-050", "Prawn Pickle", "Pickles", "", "jar", "", "assets/prawn-pickle.webp", "Fresh coastal prawns infused with fiery ginger-garlic, curry leaves and ground spices.", "YES"],
  ["MM-051", "Fish Pickle", "Pickles", "", "jar", "", "assets/fish-pickle.webp", "Firm coastal fish fillets cured in tangy vinegar, roasted spices and sesame oil.", "YES"],
  ["MM-052", "Dark Chocolate", "Chocolates", "", "box", "", "assets/dark-chocolate.webp", "Rich 70% cocoa single-origin dark chocolate bar with deep bittersweet notes.", "YES"],
  ["MM-053", "Milk Chocolate", "Chocolates", "", "box", "", "assets/milk-chocolate.webp", "Silky, smooth European style milk chocolate crafted with whole dairy cream.", "YES"],
  ["MM-054", "Premium Assorted Chocolates", "Chocolates", "", "box", "", "assets/premium-assorted-chocolates.webp", "Luxury gift box combining dark, milk, nutty and fruit-filled chocolate masterpieces.", "YES"],
  ["MM-055", "Chocolate Truffles", "Chocolates", "", "box", "", "assets/chocolate-truffles.webp", "Velvety cocoa ganache truffles hand-rolled in pure cocoa powder and hazelnut crisps.", "YES"],
  ["MM-056", "Filled Chocolates", "Chocolates", "", "box", "", "assets/filled-chocolates.webp", "Decadent chocolate bonbons filled with salted caramel, berry compote and almond praline.", "YES"],
  ["MM-057", "Nut Chocolates", "Chocolates", "", "box", "", "assets/nut-chocolates.webp", "Crunchy roasted California almonds and pistachios smothered in creamy chocolate.", "YES"],
  ["MM-058", "Samosa", "Frozen Foods", "", "pack", "", "assets/samosa.webp", "Golden, crispy triangular pastries stuffed with spiced potatoes and green peas.", "YES"],
  ["MM-059", "Veg Momos", "Frozen Foods", "", "pack", "", "assets/veg-momos.webp", "Steamed or fried Himalayan style dumplings filled with seasoned farm-fresh vegetables.", "YES"],
  ["MM-060", "Chicken Nuggets", "Frozen Foods", "", "pack", "", "assets/chicken-nuggets.webp", "Tender, juicy chicken bites with a golden crispy crumb coating. Ready to fry or air-fry.", "YES"],
  ["MM-061", "Paneer Snacks", "Frozen Foods", "", "pack", "", "assets/paneer-snacks.webp", "Crumb-coated malai paneer cutlets with fresh herbs and spices. Perfect for parties.", "YES"],
  ["MM-062", "Chicken Seekh Kebab", "Frozen Foods", "", "pack", "", "assets/chicken-seekh-kebab.webp", "Authentic tandoori spiced minced chicken skewers infused with mint, coriander and ginger.", "YES"],
  ["MM-063", "French Fries", "Frozen Foods", "", "pack", "", "assets/french-fries.webp", "Extra-crispy premium potato fries, pre-cut and flash-frozen for rapid crisp frying.", "YES"],
  ["MM-064", "Spring Rolls", "Frozen Foods", "", "pack", "", "assets/spring-rolls.webp", "Delicate, crispy wonton rolls filled with shredded crunchy vegetables and mild spices.", "YES"],
  ["MM-065", "Paneer Paratha", "Frozen Foods", "", "pack", "", "assets/paneer-paratha.webp", "Homestyle whole wheat layered flatbread generously stuffed with spiced grated paneer.", "YES"],
  ["MM-066", "Paneer Tikka", "Frozen Foods", "", "pack", "", "assets/paneer-tikka.webp", "Chargrilled marinated cottage cheese cubes with bell peppers and roasted tandoori masala.", "YES"]
];

function getAdminPassword() {
  const s = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Settings');
  const v = s.getDataRange().getValues();
  for (var i = 1; i < v.length; i++) {
    if (String(v[i][0]) === 'ADMIN_PASSWORD' && v[i][1]) return String(v[i][1]);
  }
  return 'Mithai@13332';
}

function passwordOk(value) {
  return String(value || '') === getAdminPassword();
}

function setup() {
  const ss = SpreadsheetApp.openById(SHEET_ID);
  Object.keys(HEADERS).forEach(n => {
    const s = ss.getSheetByName(n) || ss.insertSheet(n);
    if (s.getLastRow() === 0) {
      s.getRange(1, 1, 1, HEADERS[n].length).setValues([HEADERS[n]]);
    } else if (n === 'Orders') {
      var orderHeaders = s.getRange(1, 1, 1, Math.max(s.getLastColumn(), HEADERS.Orders.length)).getValues()[0].map(String);
      if (orderHeaders.indexOf('Note') === -1) {
        s.getRange(1, orderHeaders.length + 1).setValue('Note');
      }
    }
    s.setFrozenRows(1);
  });
  const settings = ss.getSheetByName('Settings');
  const vals = settings.getDataRange().getValues();
  var hasPass = false;
  for (var i = 1; i < vals.length; i++) {
    if (String(vals[i][0]) === 'ADMIN_PASSWORD') hasPass = true;
  }
  if (!hasPass) settings.appendRow(['ADMIN_PASSWORD', 'Mithai@13332']);
  var hasPhone = false;
  for (var k = 1; k < vals.length; k++) {
    if (String(vals[k][0]) === 'WHATSAPP') hasPhone = true;
  }
  if (!hasPhone) settings.appendRow(['WHATSAPP', '918125213332']);
  const p = ss.getSheetByName('Products');
  if (p.getLastRow() <= 1) {
    p.getRange(2, 1, SEED.length, SEED[0].length).setValues(SEED);
  }
}

function rememberCustomer(ss, customer) {
  if (!customer) return;
  var phone = String(customer.phone || '').trim();
  if (!phone) return;
  var sheet = ss.getSheetByName('Customers');
  var rows = sheet.getDataRange().getValues();
  var now = new Date();
  for (var i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === phone) {
      var count = Number(rows[i][5] || 0) + 1;
      sheet.getRange(i + 1, 2, 1, 5).setValues([[
        customer.name || rows[i][1],
        customer.address || rows[i][2],
        rows[i][3] || now,
        now,
        count
      ]]);
      return;
    }
  }
  sheet.appendRow([phone, customer.name || '', customer.address || '', now, now, 1]);
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  setup();
  const action = (e.parameter.action || '').toLowerCase();
  
  if (action === 'settings') {
    const s = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Settings');
    const rows = s.getDataRange().getValues();
    var phone = '918125213332';
    for (var n = 1; n < rows.length; n++) {
      if (String(rows[n][0]) === 'WHATSAPP' && rows[n][1]) phone = String(rows[n][1]).replace(/\D/g, '');
    }
    return json({ ok: true, whatsapp: phone });
  }

  if (action === 'orders') {
    if (!passwordOk(e.parameter.password)) return json({ ok: false, error: 'Unauthorized' });
    const o = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Orders');
    const rows = o.getDataRange().getValues();
    return json({
      ok: true,
      orders: rows.slice(1).filter(r => String(r[0] || '').trim()).map(r => ({
        id: String(r[0]),
        date: r[1] instanceof Date ? r[1].toISOString() : String(r[1] || ''),
        name: String(r[2] || ''),
        phone: String(r[3] || ''),
        address: String(r[4] || ''),
        items: String(r[5] || '[]'),
        total: Number(r[6] || 0),
        note: String(r[7] || '')
      }))
    });
  }

  if (action === 'products') {
    const p = SpreadsheetApp.openById(SHEET_ID).getSheetByName('Products');
    const v = p.getDataRange().getValues();
    return json({
      ok: true,
      products: v.slice(1).filter(r => String(r[1] || '').trim()).map(r => ({
        id: String(r[0] || ''),
        name: String(r[1]),
        cat: String(r[2] || 'Sweets'),
        price: r[3] === '' || r[3] == null ? null : Number(r[3]),
        unit: String(r[4] || 'kg'),
        packSize: String(r[5] || ''),
        img: String(r[6] || ''),
        desc: String(r[7] || ''),
        available: String(r[8] || 'YES')
      })).filter(x => x.available.toUpperCase() !== 'NO')
    });
  }
  
  return json({
    ok: true,
    brand: "Mithai Mixture India Private Limited",
    tagline: "Taste with Tradition",
    whatsapp: "+91 81252 13332",
    message: "Mithai Mixture Backend API ready"
  });
}

function doPost(e) {
  setup();
  try {
    const action = (e.parameter.action || '').toLowerCase();
    const payload = JSON.parse(e.parameter.payload || '{}');
    const ss = SpreadsheetApp.openById(SHEET_ID);
    const tz = Session.getScriptTimeZone() || 'Asia/Kolkata';

    if (action === 'order') {
      const orderId = 'MM-' + Utilities.formatDate(new Date(), tz, 'yyyyMMdd-HHmmss');
      ss.getSheetByName('Orders').appendRow([
        orderId,
        new Date(),
        payload.customer?.name || '',
        payload.customer?.phone || '',
        payload.customer?.address || '',
        JSON.stringify(payload.items || []),
        Number(payload.total || 0),
        payload.customer?.note || ''
      ]);
      rememberCustomer(ss, payload.customer);
      return json({ ok: true, order_id: orderId });
    }

    if (action === 'addproduct') {
      if (!passwordOk(payload.password)) return json({ ok: false, error: 'Unauthorized' });
      ss.getSheetByName('Products').appendRow([
        payload.id || ('MM-' + Date.now()),
        payload.name || '',
        payload.cat || 'Sweets',
        payload.price == null ? '' : payload.price,
        payload.unit || 'kg',
        '',
        payload.img || '',
        payload.desc || '',
        'YES'
      ]);
      return json({ ok: true });
    }

    if (action === 'status') {
      return json({ ok: true });
    }

    if (action === 'password') {
      if (!passwordOk(payload.password)) return json({ ok: false, error: 'Unauthorized' });
      const settings = ss.getSheetByName('Settings');
      const rows = settings.getDataRange().getValues();
      for (var j = 1; j < rows.length; j++) {
        if (String(rows[j][0]) === 'ADMIN_PASSWORD') {
          settings.getRange(j + 1, 2).setValue(payload.newPassword || '');
          return json({ ok: true });
        }
      }
      settings.appendRow(['ADMIN_PASSWORD', payload.newPassword || '']);
      return json({ ok: true });
    }

    if (action === 'whatsapp') {
      if (!passwordOk(payload.password)) return json({ ok: false, error: 'Unauthorized' });
      const settings = ss.getSheetByName('Settings');
      const rows = settings.getDataRange().getValues();
      const phone = String(payload.whatsapp || '').replace(/\D/g, '');
      for (var w = 1; w < rows.length; w++) {
        if (String(rows[w][0]) === 'WHATSAPP') {
          settings.getRange(w + 1, 2).setValue(phone);
          return json({ ok: true, whatsapp: phone });
        }
      }
      settings.appendRow(['WHATSAPP', phone]);
      return json({ ok: true, whatsapp: phone });
    }

    if (action === 'enquiry') {
      const enquiryId = 'ENQ-' + Utilities.formatDate(new Date(), tz, 'yyyyMMdd-HHmmss');
      ss.getSheetByName('Enquiries').appendRow([
        enquiryId,
        new Date(),
        payload.name || '',
        payload.phone || '',
        payload.message || '',
        'New'
      ]);
      return json({ ok: true, enquiry_id: enquiryId });
    }

    return json({ ok: false, error: 'Unknown action' });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function onOpen() {
  setup();
}
