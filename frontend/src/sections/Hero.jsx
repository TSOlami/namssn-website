import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { polygon, heroImage } from "../assets"

const Hero = () => {
  const text = "Share, Discuss, Learn and Grow";

  const typingAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  
  return (
	<section
  id="hero"
  className="w-full flex lg:flex-row flex-col justify-center min-h-screen items-center gap-2 max-container"
  >
    <div className="relative lg:w-3/5 flex flex-col justify-center items-start w-full padding-x pt-28">
    <div className="text-container border-black">
      <span className="sr-only">{text}</span>
      <motion.span
      initial="hidden"
      animate="visible"
      transition={{ 
        staggerChildren: 0.1
      }}
      aria-hidden
      >
        {text.split(" ").map((word, index) => (
          <span key={index} className="inline-block">
            {word.split('').map((char, index) => (
              <motion.span 
              variants={typingAnimation} 
              className="inline-block" 
              key={index}>
                {char}
              </motion.span>
            ))}
            <span className="inline-block">&nbsp;</span>
          </span>
        ))}
      </motion.span>
      <span><img src={polygon} alt="polygon" /></span>
      </div>
    <div className="header-text">
    NAMSSN <br />
    FUTMINNA Chapter
    </div>
    <div className="body-text">
    Are you a proud member of the National Association of Mathematical Science Students (NAMSSN) at the Federal University of Technology, Minna (FUTMINNA)? Welcome to your digital home – the NAMSSN FUTMINNA Chapter website.
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

export default Hero;
