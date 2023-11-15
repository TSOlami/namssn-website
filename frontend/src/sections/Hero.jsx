import { Link } from "react-router-dom";
import { polygon, heroImage } from "../assets";
import { Typewriter } from "react-simple-typewriter";

const Hero = () => {  
  return (
	<section
  id="hero"
  className="w-full flex lg:flex-row flex-col justify-center min-h-screen items-center gap-2 max-container"
  >
    <div className="relative lg:w-3/5 flex flex-col justify-center items-start w-full padding-x pt-28">
    <div className="text-container border-black">
      <span
        className="inline-block font-roboto text-sm md:text-lg lg:text-xl xl:text-2xl text-primary font-bold"
        aria-hidden
        >
        <Typewriter words={["Share", "Discuss", "Learn", "Grow"]} loop={true} cursor={true} />
        &nbsp;
      </span>
      <span><img src={polygon} alt="polygon" /></span>
      </div>
      
    <div className="header-text">
    NAMSSN <br />
    FUTMINNA Chapter
    </div>
    <div className="body-text">
    Are you a proud member of the National Association of Mathematical Science Students (NAMSSN) at the Federal University of Technology, Minna (FUTMINNA)? Welcome to your digital home – the NAMSSN FUTMINNA Chapter website.
    </div>
    <div className="flex flex-row w-full py-5 gap-4 md:justify-normal">
      <Link to='/signup' className="button-1">Sign Up</Link>
      <Link to='/signin' className="button-2">Log In</Link>
    </div>
    </div>
    <div className="pt-5 px-10">
      <img
      src={heroImage}
      alt="Hero"
      />
    </div>
  </section>
  )
}

export default Hero;
