import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { StoreProvider } from './context/Store'
import Layout from './components/Layout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Categories from './pages/Categories'
import Rates from './pages/Rates'
import About from './pages/About'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import LegalPage from './pages/LegalPage'

const Admin = lazy(() => import('./pages/Admin'))

export default function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Layout>
          <Suspense fallback={<section className="section"><p>Opening…</p></section>}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:slug" element={<Shop />} />
              <Route path="/rates" element={<Rates />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/order" element={<Checkout />} />
              <Route path="/success" element={<Success />} />
              <Route path="/privacy" element={<LegalPage />} />
              <Route path="/terms" element={<LegalPage />} />
              <Route path="/shipping" element={<LegalPage />} />
              <Route path="/refunds" element={<LegalPage />} />
              <Route path="/admin" element={<Admin />} />
            </Routes>
          </Suspense>
        </Layout>
      </BrowserRouter>
    </StoreProvider>
  )
}
