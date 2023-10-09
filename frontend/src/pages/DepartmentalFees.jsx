import { Link } from "react-router-dom";
import { NavBar, Footer } from "../components";
import { Bro, FeesSVG, aboutIcon } from "../assets";

const DepartmentalFees = () => {
	return (
		<main>
			<NavBar />

			{/* Hero section */}

			<section className="flex md:flex-row flex-col justify-between p-8 pt-28 md:pt-10 w-full sm:h-screen items-center">
				<div className="flex basis-4/12 md:basis-6/12 flex-col gap-4 items-start min-w-[250px] p-2">
					<h1 className="lg:text-[38px] md:text-3xl font-bold text-2xl">
						Make Payments for your departmental dues.
					</h1>
					<div>
						Pay your departmental dues from the comfort of your
						room.
					</div>
					<Link className="button-2">
						Pay with Paystack
					</Link>
				</div>
				<div className="flex-1 p-2 pt-4 basis-6/12 self-center xl:pl-20">
					<img src={FeesSVG} alt="" />
				</div>
			</section>

			{/* Features section */}

			<section className="flex flex-row flex-wrap w-full gap-10 justify-evenly my-10 p-5">
				<div className="flex flex-row gap-8">
					<div>
						<img src={aboutIcon} alt="" />
					</div>
					<div>
						<h1 className="font-semibold text-[35px]">Make Payment</h1>
						<div>
							Let&apos;s help NAMSSN by paying our departmental
							dues on time.
						</div>
						<div>
							Ensure you use your matric number as the description
							for the transfer
						</div>
					</div>
				</div>

				<div className="bg-black rounded-3xl w-[300px] border-gray-400 border-2 shadow-md">
					<div className=" bg-white p-5 rounded-b-3xl border-t-0 rounded-3xl">
						<h3 className="text-2xl font-semibold text-center">
							Departmental dues
						</h3>
						<div>
							Let&apos;s help NAMSSN by paying our departmental
							dues on time.
						</div>
						<div>
							Ensure you use your matric number as the description
							for the transfer
						</div>
						<div className="text-center">
							<span className="block">Amount:</span>
							<span className="block font-semibold text-2xl">
								#5,000
							</span>
						</div>
					</div>
					<div className="p-5 flex flex-row items-center justify-center">
						<Link to='/signin' className=" button-1">
							Pay with Paystack
						</Link>
					</div>
				</div>
			</section>

			{/* Card */}

			<section className="flex md:flex-row flex-col items-center m-4 md:m-auto bg-tertiary rounded-3xl p-4 px-6 md:w-[70%] my-14 shadow-2xl">
				<div className="flex flex-col gap-4 justify-center">
					<h3 className="text-3xl font-semibold">Sign in to make other payments.</h3>
					<div>
						To make othr payments on this website, sign in now to
						ensure we allocate the right payment information to you
					</div>
					<div>
						<Link to='/signup' className="button-1 border-none mx-2">
							Sign up
						</Link>
						<Link to='/signin' className="button-2">
							Log in
						</Link>
					</div>
				</div>

				<div>
          <img src={Bro} alt="" />
        </div>
			</section>


      {/* Footer component here*/}
        <div className="pt-16">
		<Footer />
		</div>
		</main>
	);
};

export default DepartmentalFees;
