import { NavBar, Footer } from "../components"
import { Hero, AboutUs, Features, FAQs, ContactUs } from "../sections"

const Landing = () => {
  return (
    <main className="relative">
      <NavBar />
      <section className="xl:padding-1 wide:padding-r padding-b">
        <Hero />
      </section>
      <section className="padding">
        <AboutUs />
      </section>
      <section className="padding">
        <Features />
      </section>
      <section className="padding">
        <FAQs />
      </section>
      <section className="padding" id="contact-us">
        <ContactUs />
      </section>
      <section>
        <Footer />
      </section>
    </main>
  )
}

export default Landing