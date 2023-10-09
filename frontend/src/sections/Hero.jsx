import { Link } from "react-router-dom"
import { polygon, heroImage } from "../assets"

const Hero = () => {
  return (
	<section
  id="hero"
  className="w-full flex lg:flex-row flex-col justify-center min-h-screen items-center gap-2 max-container"
  >
    <div className="relative lg:w-3/5 flex flex-col justify-center items-start w-full padding-x pt-28">
    <div className="text-container border-black">
    Unlock the World of Mathematics <span><img src={polygon} alt="polygon" /></span>
    </div>
    <div className="header-text">
    NAMSSN <br />
    FUTMINNA Chapter
    </div>
    <div className="body-text">
    Mathematics Department is hard like mad and i dont see wy a person would want a website designed for it. But i  would try to make it beautiful sha. Using Illustratons and images 
    </div>
    <div className="flex flex-row justify-around w-full py-5 gap-4 md:justify-normal">
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

export default Hero