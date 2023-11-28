// import PaymentForm from "../components/Payment";
import { PaymentList, Sidebar } from "../components";
const PaymentPage = () => {
	const isFeatureIsActive = false;
	return (
		<div className="flex flex-row">
			<Sidebar />
			<div className="flex flex-row w-full h-full ">
				{isFeatureIsActive ? (
					<PaymentList />
				) : (
					<div className="flex flex-col items-center justify-center w-full h-full">
						<h1 className="text-3xl font-semibold text-gray-700">
							This feature is not available yet
						</h1>
						<p className="text-xl font-medium text-gray-500">
							Please check back later
						</p>
					</div>
				)}
			</div>
		</div>
	);
};
export default PaymentPage;
