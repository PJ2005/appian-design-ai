import Header from './components/header'
import Hero from './components/hero'
import Features from './components/features'
import Demonstration from './components/demonstration'
import Footer from './components/footer'

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <Hero />
        <Features />
        <Demonstration />
      </main>
      <Footer />
    </div>
  )
}

