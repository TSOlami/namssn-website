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

	if (!isOpen) return null;

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50"
			role="dialog"
			aria-modal="true"
			aria-label="Modal"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div className="bg-white rounded-xl shadow-xl max-h-[90vh] overflow-y-auto max-w-lg w-full" ref={contentRef} onClick={(e) => e.stopPropagation()}>
				<button
					ref={closeButtonRef}
					type="button"
					className="modal-close-button p-2 rounded-lg text-white bg-red-500 hover:bg-red-600"
					onClick={onClose}
					aria-label="Close modal"
				>
					Close
				</button>
				{children}
			</div>
		</motion.div>
	);
};

export default Modal;
