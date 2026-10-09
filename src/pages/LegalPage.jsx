import { useLocation } from 'react-router-dom'
import Seo from '../components/Seo'

const PAGES = {
  privacy: {
    title: 'Privacy Policy',
    body: [
      'Mithai Mixture India Private Limited collects the name, phone number, delivery address and order details you submit so we can prepare and deliver your order.',
      'Order and enquiry records are stored in your browser and, when connected, in the company’s private Google Sheet. We do not sell personal information.',
      'WhatsApp is used to confirm orders. Messages you send there are handled by WhatsApp under its own terms.',
      'You may ask us to correct or delete an enquiry by writing to Mithaimixtureindia@gmail.com or on the WhatsApp number shown on this website.'
    ]
  },
  terms: {
    title: 'Terms & Conditions',
    body: [
      'The website is operated by Mithai Mixture India Private Limited. Product photographs show the style of each item. Handmade sweets can vary slightly in colour and finish.',
      'The published rate list is the current price for each named item. Piece, jar and box items are charged per unit. GST is charged as applicable.',
      'An order is accepted when we confirm it on WhatsApp. Weight for sweets moves in steps of 0.25 kg. Pack, jar, bottle and box items move in whole units.',
      'Please check the item list and address before you submit. Festival dates can change preparation time, which we will tell you at confirmation.'
    ]
  },
  shipping: {
    title: 'Shipping & Delivery',
    body: [
      'Delivery area, charges and time are confirmed on WhatsApp with each order. Fresh sweets are packed for the shortest practical journey.',
      'Please share a complete address and a working phone number. If we cannot reach you, the order may be held or rescheduled.',
      'Frozen foods should be kept frozen on arrival. Mixtures, biscuits and pickles should be stored as printed on the pack.',
      'We are not liable for delays caused by weather, traffic or an incorrect address.'
    ]
  },
  refunds: {
    title: 'Refunds & Cancellations',
    body: [
      'You may cancel before the order is packed. Once sweets are prepared or a sealed pack is dispatched, cancellation may not be possible.',
      'Opened edible goods cannot be taken back, in line with food-safety practice, unless the pack arrived damaged or the item is defective.',
      'If something arrives damaged, message us on WhatsApp the same day with a photograph. We will replace the item or refund the affected amount after we verify it.',
      'Refunds, when approved, are made to the original payment method or as agreed on WhatsApp.'
    ]
  }
}

export default function LegalPage() {
  const page = useLocation().pathname.replace('/', '')
  const doc = PAGES[page] || PAGES.terms
  return (
    <section className="section prose">
      <Seo title={`${doc.title} | Mithai Mixture`} description={`${doc.title} of Mithai Mixture India Private Limited.`} />
      <p className="kicker">Official</p>
      <h1>{doc.title}</h1>
      {doc.body.map(p => <p key={p}>{p}</p>)}
    </section>
  )
}
