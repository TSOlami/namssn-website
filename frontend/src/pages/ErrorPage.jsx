import { Link } from "react-router-dom"
import { Error404 } from "../assets"

const ErrorPage = () => {
  return (
    <div className="w-full h-screen p-10 flex flex-col items-center justify-center">
      <div>
        <img src={Error404} alt="" />
      </div>
      <div className="text-3xl font-bold text-center">Error 404</div>
      <div className="text-center text-lg">Sorry, we can&apos;t find what you&apos;re looking for</div>
      <Link to='/' className="button-2 hover:opacity-75 m-10">Go to Homepage</Link>
    </div>
  )
}

export default ErrorPage