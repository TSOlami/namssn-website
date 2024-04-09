import { LinkedinIcon, GithubIcon, WebIcon } from "../assets";

const TechTeam = ({ image, linkedin, github, website, name, position }) => {
	return (
		<div className="flex flex-col w-[250px] relative gap-3 m-5 shadow-2xl">
			<a href={website}>
			<img src={image} alt="" className="w-[250px] h-[250px] object-cover rounded-2xl"/>
			</a>


      {/* empty styling div */}
      <div className="absolute block h-[65px] w-[114px] bg-white top-[197px]">
      </div>

      {/* empty styling div 2 */}

      <div className="absolute block h-[65px] w-[18px] bg-white top-[197px] right-[127px] rounded-xl rounded-br-none z-20">
      </div>

			<div className="bg-black flex flex-row items-center justify-center text-xl gap-4 text-blue-400 absolute w-28 top-[190px] h-14 mt-5 rounded-tl-2xl pr-4">
				<a href={github} className="hover:scale-125">
					<img src={GithubIcon} alt="github" className="object-cover" />
				</a>
				<a href={linkedin} className="hover:scale-125">
					<img src={LinkedinIcon} alt="linkedin" className="object-cover" />
				</a>
				<a href={website}className="hover:scale-125">
					<img src={WebIcon} alt="website" className="object-cover" />
				</a>
			</div>

      <div className="p-4 bg-black text-white rounded-b-2xl">
        <div className="font-semibold">{name}</div>
        <a href={website}>{position}</a>
      </div>
		</div>
	);
};

export default TechTeam;