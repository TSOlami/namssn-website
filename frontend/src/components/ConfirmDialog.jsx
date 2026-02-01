import { useEffect, useRef } from "react";

export function ConfirmDialog({
	isOpen,
	onClose,
	onConfirm,
	title = "Are you sure?",
	message = "This action cannot be undone.",
	confirmLabel = "Delete",
	cancelLabel = "Cancel",
	variant = "danger",
}) {
	const confirmRef = useRef(null);

	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	useEffect(() => {
		if (isOpen) confirmRef.current?.focus();
	}, [isOpen]);

	if (!isOpen) return null;

	const handleConfirm = () => {
		onConfirm();
		onClose();
	};

	const isDanger = variant === "danger";

	return (
		<div
			className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/50"
			role="alertdialog"
			aria-modal="true"
			aria-labelledby="confirm-dialog-title"
			aria-describedby="confirm-dialog-desc"
			onClick={(e) => e.target === e.currentTarget && onClose()}
		>
			<div
				className="bg-white rounded-xl shadow-xl max-w-md w-full p-6"
				onClick={(e) => e.stopPropagation()}
			>
				<h2 id="confirm-dialog-title" className="text-lg font-semibold text-gray-900 mb-2">
					{title}
				</h2>
				<p id="confirm-dialog-desc" className="text-gray-600 mb-6">
					{message}
				</p>
				<div className="flex justify-end gap-3">
					<button
						type="button"
						onClick={onClose}
						className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
					>
						{cancelLabel}
					</button>
					<button
						ref={confirmRef}
						type="button"
						onClick={handleConfirm}
						className={`px-4 py-2 rounded-lg text-white ${isDanger ? "bg-red-600 hover:bg-red-700" : "bg-primary hover:opacity-90"}`}
					>
						{confirmLabel}
					</button>
				</div>
			</div>
		</div>
	);
}
