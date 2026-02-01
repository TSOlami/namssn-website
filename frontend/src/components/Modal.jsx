import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, onClose, children }) => {
	const closeButtonRef = useRef(null);
	const contentRef = useRef(null);

	useEffect(() => {
		if (!isOpen) return;
		closeButtonRef.current?.focus();

		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
			if (e.key !== "Tab") return;
			const el = contentRef.current;
			if (!el) return;
			const focusable = el.querySelectorAll(
				'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
			);
			const first = focusable[0];
			const last = focusable[focusable.length - 1];
			if (e.shiftKey) {
				if (document.activeElement === first) {
					e.preventDefault();
					last?.focus();
				}
			} else {
				if (document.activeElement === last) {
					e.preventDefault();
					first?.focus();
				}
			}
		};

		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	return (
		<motion.div
			initial={{ opacity: 0, height: 0 }}
			animate={{ opacity: 1, height: "auto" }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.8 }}
			className={`modal-overlay p-4 ${isOpen ? "modal-open" : ""}`}
			role="dialog"
			aria-modal="true"
			aria-label="Modal"
		>
			{isOpen && (
				<div className="modal-content" ref={contentRef}>
					<button
						ref={closeButtonRef}
						type="button"
						className="modal-close-button p-2 rounded-lg text-white bg-red-500"
						onClick={onClose}
						aria-label="Close modal"
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
