import { useState } from 'react'
import { AppProviders } from './i18n'
import { CartProvider } from './cart'
import Header from './components/Header'
import Hero from './components/Hero'
import { TrustBar, Categories, Offers, About, Location, CtaBanner } from './components/Sections'
import Products from './components/Products'
import CartDrawer from './components/CartDrawer'
import Checkout from './components/Checkout'
import Footer from './components/Footer'
import { FloatingWhatsApp, Toast } from './components/Overlays'

function Site() {
  const [activeFilter, setActiveFilter] = useState('all')

  const goToShop = (cat) => {
    setActiveFilter(cat)
    setTimeout(() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <TrustBar />
        <Categories onSelect={goToShop} />
        <Products activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        <Offers />
        <About />
        <Location />
        <CtaBanner />
      </main>
      <Footer />
      <CartDrawer />
      <Checkout />
      <FloatingWhatsApp />
      <Toast />
    </>
  )
}

export default function App() {
  return (
    <AppProviders>
      <CartProvider>
        <Site />
      </CartProvider>
    </AppProviders>
  )
}
