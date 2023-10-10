import { SignInForm } from "../components";
import { SignInImage } from "../assets";

const SignIn = () => {
	return (
		<div className="flex flex-row w-full overflow-hidden">
			<div className="container h-screen flex flex-col justify-center md:w-[50%] p-10 relative w-full">
				{/* Circular styling top */}
				<div className="w-40 h-40 border-[40px] border-primary rounded-full absolute top-[-5rem] right-[-5rem] z-[-1]"></div>

				{/* Circular styling bottom */}
				<div className="w-40 h-40 border-[40px] border-primary rounded-full absolute bottom-[-5rem] left-[-5rem]"></div>

				{/* Page content */}

				<h1 className="font-bold text-2xl text-center pb-2">
					Welcome Back To NAMSSN Website
				</h1>
				<div className="text-center font-medium">
					Enter your details to sign in
				</div>
				<SignInForm/>
			</div>

			{/* Vector image container */}

			<div className="w-[50%] h-full hidden md:block">
				<div
					className="bg-gradient-to-r from-cyan-500 to-blue-500 h-screen w-full flex items-center justify-center
"
				>
					<img src={SignInImage} alt="" />
				</div>
			</div>
		</div>
	);
};

export default SignIn;
