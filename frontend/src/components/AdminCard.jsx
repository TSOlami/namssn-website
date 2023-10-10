import { BsArrowUpRight } from "react-icons/bs";
import { Link } from "react-router-dom";

const AdminCard = ({ card, route, title, amount, bg }) => {
	return (
		<div className={bg + " p-4 rounded-xl w-[220px] "}>
			<div className="flex flex-row justify-between py-3">
				<span>
          {card === 'payment'? <img src="src/assets/images/Money.svg" className="" /> : null}

          {card === 'blog'? <img src="src/assets/images/Blog.svg" className="" /> : null}

          {card === 'events'? <img src="src/assets/images/Award.svg" className="" /> : null}

          {card === 'announcements'? <img src="src/assets/images/Mic.svg" className="" /> : null}
          </span>
				<span className="text-primary">
					<Link to={route}>
						View More <BsArrowUpRight className="inline"/>
					</Link>
				</span>
			</div>
      <div>{title}</div>
      <div className="font-semibold text-xl">{amount}</div>
		</div>
	);
};

export default AdminCard;
