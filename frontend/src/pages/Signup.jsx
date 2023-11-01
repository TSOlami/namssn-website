import { SignUpForm } from "../components";
import { SignUpImage } from "../assets";

const SignUp = () => {
	return(
		<div className="flex md:flex-row flex-col bg-primary h-screen">
			{/* Vector image container */}
			<div className="bg-primary h-[20%] md:h-screen md:block w-full md:w-[40%]">
				<img
					src={SignUpImage}
					alt=""
					className="relative h-[140%] m-auto md:h-auto md:right-[-15%] md:top-[10%]"
				/>
			</div>

			<div className="w-full h-full md:w-[60%] md:rounded-l-[10%] md:rounded-r-none rounded-t-[10%] p-10 md:p-16 md:pl-36 bg-white flex flex-col justify-center">
				<h1 className="font-bold text-2xl text-center pt-5 md:p-10">
					Welcome To NAMSSN Website
				</h1>
				<SignUpForm/>
			</div>
		</div>
	);
};

export default SignUp