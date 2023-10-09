import { FacebookIcon, LinkedinIcon } from "../assets";

const Team = ({ image, facebook, linkedin, name, position }) => {
	return (
		<div className="flex flex-col w-[250px] relative gap-3 m-5 shadow-2xl">
			<div>
				<img src={image} alt="" className="w-[250px] h-[180px] object-cover rounded-2xl"/>
			</div>


      {/* empty styling div */}
      <div className="absolute block h-[65px] w-[114px] bg-white bottom-[80px]">
      </div>

      {/* empty styling div 2 */}

      <div className="absolute block h-[65px] w-[18px] bg-white bottom-[80px] right-[127px] rounded-xl rounded-br-none z-20">
      </div>

			<div className="bg-black flex flex-row items-center justify-center text-xl gap-4 text-blue-400 absolute w-28 bottom-[73px] h-14 mt-5 rounded-tl-2xl pr-4">
				<a href={facebook} className="hover:scale-125">
					<img src={FacebookIcon} alt="" />
				</a>
				<a href={linkedin} className="hover:scale-125">
					<img src={LinkedinIcon} alt="" />
				</a>
			</div>

      <div className="p-4 bg-black text-white rounded-b-2xl">
        <div className="font-semibold">{name}</div>
        <div>{position}</div>
      </div>
		</div>
	);
};

export default Team;
