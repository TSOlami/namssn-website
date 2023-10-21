import { formatDateToTime } from "../utils";

const RecentPayments = ({
	email,
	matricNo,
	amount,
	reference,
	createdAt,
	category, // Add category to props
}) => {
	// Format the date
	const date = new Date(createdAt);
	return (
		<div
			className="flex flex-row items-center justify-between w-full p-4 rounded-xl border border-gray-200 my-4"
		>
			<div className="flex flex-col text-left">
				<div className="mb-2">
					<strong>Email:</strong> {email}
				</div>
				<div className="mb-2">
					<strong>Matric No:</strong> {matricNo}
				</div>
				<div className="mb-2">
					<strong>Reference:</strong> {reference}
				</div>
				<div className="mb-2">
					<strong>Category:</strong> {category}
				</div>
				<div className="mb-2">
					<strong>Date:</strong> {formatDateToTime(date)} ago
				</div>
				<div className="rounded-full bg-primary text-white px-4 py-1 text-lg mt-4">
					Amount: <span className="font-semibold">#{amount}</span>
				</div>
			</div>
		</div>
	);
};

export default RecentPayments;
