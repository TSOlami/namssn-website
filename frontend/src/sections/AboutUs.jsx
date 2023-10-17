import { Link } from 'react-router-dom';
import aboutIcon from '../assets/icons/about.svg';
import { BsArrowUpRight } from 'react-icons/bs';
const AboutUs = () => {
  return (
    <section id="about-us" className="flex lg:flex-row flex-col justify-center gap-8 max-container">
      <div className='relative flex items-center w-full gap-8'>
        <img
          src={aboutIcon}
          alt="About Us"
          width={70}
          height={70}
        /> <h1 className='header-text'>About Us</h1>
      </div>
      <div className='flex flex-col gap-5'>
        <p className="text-xl font-crimson">
        NAMSSN FUTMINNA Chapter is your one-stop destination for academic resources, knowledge sharing, and staying updated with all the exciting events and news happening on our campus. We've created this platform to empower our students, providing an easy and accessible way to enhance your educational journey.
        </p>
        <Link to='/about-us' className="text-container flex border-primary w-fit">
        Know more about us <BsArrowUpRight color='#17A1FA'/>
        </Link>
      </div>
      
    </section>
  )
}

export default AboutUs