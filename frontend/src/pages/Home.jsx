import { mockTexts, mockTexts2 } from "../data";

import { Sidebar, Post, AnnouncementContainer } from "../components";
import { Wrapper, Avatar } from '../assets';
import HeaderComponent from "../components/HeaderComponent";
import { BottomNav } from "../components";
import { BsPlusLg } from "react-icons/bs";
import { useState } from "react";
import { FaXmark } from "react-icons/fa6";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
	const [isModalOpen, setIsModalOpen] = useState(false)
	const handleModalOepen = () => {
		setIsModalOpen(!isModalOpen)
	}
	const [ text, setText ] = useState('')
	const handleTextChange = (e) => {
		setText(e.target.value)
	}

	const handleSubmit = () => {
		if (text === '') return alert('Please enter a text')
		console.log(text)
		setText('')
		handleModalOepen()
		toast.success('Post created successfully', {
			position: "top-center",
			autoClose: 3000,
			hideProgressBar: true,
			closeOnClick: true,
			pauseOnHover: true,
			className: 'text-white font-semibold bg-primary'
		});
	}

	return (
		<div className="flex ">
			<Sidebar/>
			<div className="flex flex-col relative">
				<HeaderComponent title="Home"/>
				<Post upvotes="3224" downvotes="30" shares="5" comments="10" isAdmin={true} text={mockTexts} name="Ifedimeji Omoniyi" username= "@design_hashira" avatar={Wrapper}/>

				<Post upvotes="20" downvotes="300" shares="200" comments="150" isAdmin={false} text={mockTexts2} name="Bola Ahmed Tinubu" username= "@bobo chicago" avatar={Avatar}/>
				<Post upvotes="20" downvotes="300" shares="200" comments="150" isAdmin={false} text={mockTexts2} name="Bola Ahmed Tinubu" username= "@bobo chicago" avatar={Avatar}/>
				<Post upvotes="20" downvotes="300" shares="200" comments="150" isAdmin={false} text={mockTexts2} name="Bola Ahmed Tinubu" username= "@bobo chicago" avatar={Avatar}/>

				{/* Add post button */}

				<div onClick={handleModalOepen} className="fixed bottom-20 sm:bottom-16 text-3xl right-[7vw] md:right-[10vw] lg:right-[30vw] p-5 rounded-full text-white bg-primary cursor-pointer">
					<BsPlusLg/>
				</div>


				{/* Add post modal */}

				<div>
					{isModalOpen && (
						<div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center">
							<div className="bg-white rounded-lg w-[90%] max-w-[600px] h-[500px]">
								<div className="flex justify-between items-center p-5 border-b border-gray-200">
									<div className="text-2xl font-bold">Create Post</div>
									<div className="text-3xl cursor-pointer p-2" onClick={handleModalOepen}><FaXmark/></div>
								</div>
								<div className="p-5">
									<textarea className="w-full h-[300px] border border-gray-200 rounded-lg p-5" placeholder="What's on your mind?" value={text} onChange={handleTextChange}></textarea>
								</div>
								<div className="flex justify-between items-center p-5 border-t border-gray-200">
									<div className="flex items-center gap-2">
										<div className="bg-gray-200 w-8 h-8 rounded-full"></div>
										<div className="bg-gray-200 w-8 h-8 rounded-full"></div>
										<div className="bg-gray-200 w-8 h-8 rounded-full"></div>
									</div>
									<button onClick={handleSubmit} className={text === "" ? "bg-primary text-white px-5 py-2 rounded-lg disabled pointer-events-none opacity-70" : "bg-primary text-white px-5 py-2 rounded-lg"}>Post</button>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
			<AnnouncementContainer/>
			<BottomNav/>

			{/* Allows toast message to be displayed */}
			<ToastContainer />
		</div>
	);
};

export default Home;
