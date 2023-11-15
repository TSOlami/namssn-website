import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AnimatePresence } from "framer-motion";

export default function App() {
	return (
		<>
		<AnimatePresence mode="wait">
				<ToastContainer key="toast-container" />
				<Outlet key="outlet" />
		</AnimatePresence>
		</>
	);
}
