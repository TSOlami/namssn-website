import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, children }) => {
	return (
		<motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.8 }}
			className={`modal-overlay p-4 ${isOpen ? "modal-open" : ""}`}
		>
			{isOpen && (
				<div className="modal-content">
					<button
						className="modal-close-button p-2 rounded-lg text-white bg-red-500"
						onClick={onClose}
					>
						Close
					</button>
					{children}
				</div>
			)}
		</motion.div>
	);
};

export default Modal;
