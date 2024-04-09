import { Ellipse1, Ellipse2, contactUs } from "../assets"
import ContactForm from "../components/forms/ContactForm"

const ContactUs = () => {
  return (
	<section>
    <h1 className="header-text text-center max-w-xl mx-auto">Contact Us</h1>
    <div className="flex flex-row justify-center items-center">
      <img src={contactUs} alt="" className="rounded-2xl shadow-lg max-lg:hidden" />
      <div className="relative w-[40rem] h-[50rem] bg-white rounded-2xl border z-10 lg:-ml-10 shadow-xl">
        <ContactForm />
        <img src={Ellipse1} alt="" className="absolute bottom-0 left-0 md:w-32 w-24 md:h-32 h-24"/>
        <img src={Ellipse2} alt="" className="absolute top-0 right-0 md:w-32 w-24 md:h-32 h-24" />
      </div>
    </div>
  </section>
  )
}

export default ContactUs