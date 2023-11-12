import {
	FacebookIcon,
	TwitterIcon,
	LinkedinIcon,
	GithubIcon,
	WebIcon,
} from "../assets";

const TechTeam = ({
	image,
	facebook,
	twitter,
	linkedin,
	github,
	website,
	name,
	position,
}) => {
	return (
		<div className="flex flex-col w-[250px] relative gap-3 m-5 shadow-2xl">
			<a href={website}>
				<img
					src={image}
					alt=""
					className="w-[250px] h-[250px] object-cover rounded-2xl"
				/>
			</a>

			{/* empty styling div */}
			<div className="absolute block h-[65px] w-[114px] bg-white top-[197px]"></div>

			{/* empty styling div 2 */}

			<div className="absolute block h-[65px] w-[18px] bg-white top-[197px] right-[127px] rounded-xl rounded-br-none z-20"></div>

			<div className="bg-black flex flex-row flex-wrap items-center justify-center text-xl text-blue-400 absolute w-28 top-[190px] h-14 mt-5 rounded-tl-2xl pr-3 p-2 gap-x-4 gap-2">
				{facebook && (
					<a href={facebook} className="hover:scale-125">
						<img src={FacebookIcon} alt="facebook" />
					</a>
				)}

				{twitter && (
					<a href={twitter} className="hover:scale-125">
						<img src={TwitterIcon} alt="twitter" />
					</a>
				)}

				{linkedin && (
					<a href={linkedin} className="hover:scale-125">
						<img src={LinkedinIcon} alt="linkedin" />
					</a>
				)}

				{github && (
					<a href={github} className="hover:scale-125">
						<img src={GithubIcon} className="h-5 inline-block" alt="github" />
					</a>
				)}

				{website && (
					<a href={website} className="hover:scale-125">
						<img src={WebIcon} alt="website" />
					</a>
				)}
			</div>

			<div className="p-4 bg-black text-white rounded-b-2xl">
				<div className="font-semibold">{name}</div>
				<a href={website}>{position}</a>
			</div>
		</div>
	);
};

export default TechTeam;
