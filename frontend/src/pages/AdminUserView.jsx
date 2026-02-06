import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { FaArrowLeft, FaEnvelope, FaUser, FaCreditCard } from "react-icons/fa6";
import {
	useGetUserQuery,
	useMakeUserAdminMutation,
	useRemoveAdminMutation,
	useBlockUserMutation,
	useUnblockUserMutation,
	useSendUserMailMutation,
	useUserPaymentsQuery,
} from "../redux";
import { Sidebar, HeaderComponent, ConfirmDialog, SendPersonalMailModal, RecentPayments } from "../components";
import { ProfileImg } from "../assets";
import { toast } from "react-toastify";
import { ProfileSkeleton } from "../components/skeletons";
import { ErrorPage } from "../pages";

const TAB_OVERVIEW = "overview";
const TAB_PAYMENTS = "payments";

const AdminUserView = () => {
	const { userId } = useParams();
	const [activeTab, setActiveTab] = useState(TAB_OVERVIEW);
	const [showRemoveAdminConfirm, setShowRemoveAdminConfirm] = useState(false);
	const [showBlockConfirm, setShowBlockConfirm] = useState(false);
	const [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
	const [showMakeAdminConfirm, setShowMakeAdminConfirm] = useState(false);
	const [showSendMailModal, setShowSendMailModal] = useState(false);

	const { data: user, isLoading: userLoading, refetch: refetchUser } = useGetUserQuery({ _id: userId });
	const { data: payments = [], isLoading: paymentsLoading } = useUserPaymentsQuery({ _id: userId }, { skip: !userId });

	const [makeUserAdmin] = useMakeUserAdminMutation();
	const [removeAdmin] = useRemoveAdminMutation();
	const [blockUserMutation] = useBlockUserMutation();
	const [unblockUserMutation] = useUnblockUserMutation();

	const name = user?.name;
	const username = user?.username;
	const email = user?.email;
	const studentEmail = user?.studentEmail;
	const matricNumber = user?.matricNumber;
	const level = user?.level;
	const bio = user?.bio;
	const avatar = user?.profilePicture;
	const coverPhoto = user?.coverPhoto;
	const isAdmin = user?.role === "admin";
	const isBlocked = user?.isBlocked;
	const createdAt = user?.createdAt;
	const joinedDate = createdAt
		? new Date(createdAt).toLocaleDateString("en", { day: "numeric", month: "long", year: "numeric" })
		: null;

	const handleBlockUser = async () => {
		try {
			await blockUserMutation(userId).unwrap();
			toast.success(`${name} has been blocked.`);
			refetchUser();
		} catch (err) {
			toast.error(err?.data?.message || "Failed to block user.");
		}
		setShowBlockConfirm(false);
	};

	const handleUnblockUser = async () => {
		try {
			await unblockUserMutation(userId).unwrap();
			toast.success(`${name} has been unblocked.`);
			refetchUser();
		} catch (err) {
			toast.error(err?.data?.message || "Failed to unblock user.");
		}
		setShowUnblockConfirm(false);
	};

	const handleMakeUserAdmin = async () => {
		try {
			await makeUserAdmin(userId).unwrap();
			toast.success(`${name} is now an admin`);
			refetchUser();
		} catch (err) {
			toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error);
		}
		setShowMakeAdminConfirm(false);
	};

	const handleRemoveAdmin = async () => {
		try {
			await removeAdmin(userId).unwrap();
			toast.success(`${name} is no longer an admin`);
			refetchUser();
		} catch (err) {
			toast.error(err?.error?.response?.data?.message || err?.data?.message || err?.error);
		}
		setShowRemoveAdminConfirm(false);
	};

	if (!userLoading && !user) {
		return <ErrorPage />;
	}

	const tabClass = (tab) =>
		`px-4 py-2.5 rounded-t-lg font-medium text-sm transition-colors ${
			activeTab === tab
				? "bg-white text-primary border border-b-0 border-gray-200 shadow-sm"
				: "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
		}`;

	return (
		<div className="flex flex-row w-full">
			<Sidebar />
			<div className="w-full">
				<HeaderComponent title="User details" back />
				{userLoading ? (
					<div className="p-4">
						<ProfileSkeleton />
					</div>
				) : (
					<>
						<div className="p-4 border-b border-gray-200 bg-gray-50">
							<Link
								to="/admin/users"
								className="inline-flex items-center gap-2 text-sm text-primary hover:underline font-medium mb-4"
							>
								<FaArrowLeft /> Back to Manage Users
							</Link>
							{coverPhoto && (
								<div className="w-full h-24 rounded-lg overflow-hidden mb-4 bg-gray-200">
									<img src={coverPhoto} alt="Cover" className="w-full h-full object-cover" />
								</div>
							)}
							<div className="flex flex-wrap items-center gap-4">
								<img
									src={avatar || ProfileImg}
									alt=""
									className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
								/>
								<div>
									<h1 className="text-xl font-semibold text-gray-900">{name}</h1>
									<p className="text-sm text-gray-600">@{username}</p>
									<div className="flex flex-wrap gap-2 mt-2">
										<span
											className={`text-xs px-2 py-0.5 rounded ${isAdmin ? "bg-blue-100 text-blue-800" : "bg-gray-200 text-gray-700"}`}
										>
											{isAdmin ? "Admin" : "User"}
										</span>
										<span
											className={`text-xs px-2 py-0.5 rounded ${isBlocked ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}
										>
											{isBlocked ? "Blocked" : "Active"}
										</span>
									</div>
								</div>
								<div className="ml-auto flex flex-wrap gap-2">
									{isAdmin ? (
										<button
											onClick={() => setShowRemoveAdminConfirm(true)}
											className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
										>
											Remove Admin
										</button>
									) : (
										<>
											{isBlocked ? (
												<button
													onClick={() => setShowUnblockConfirm(true)}
													className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700"
												>
													Unblock
												</button>
											) : (
												<button
													onClick={() => setShowBlockConfirm(true)}
													className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
												>
													Block user
												</button>
											)}
											<button
												onClick={() => setShowMakeAdminConfirm(true)}
												className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-green-50 hover:border-green-200 hover:text-green-700"
											>
												Make Admin
											</button>
										</>
									)}
									<button
										onClick={() => setShowSendMailModal(true)}
										className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700"
									>
										<FaEnvelope /> Send mail
									</button>
									<Link
										to={`/profile/${userId}`}
										className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50"
									>
										View profile
									</Link>
								</div>
							</div>
						</div>

						{/* Tabs */}
						<div className="px-4 pt-2 border-b border-gray-200">
							<button
								type="button"
								onClick={() => setActiveTab(TAB_OVERVIEW)}
								className={tabClass(TAB_OVERVIEW)}
							>
								<FaUser className="inline mr-2" />
								Overview
							</button>
							<button
								type="button"
								onClick={() => setActiveTab(TAB_PAYMENTS)}
								className={tabClass(TAB_PAYMENTS)}
							>
								<FaCreditCard className="inline mr-2" />
								Payments {payments.length > 0 && `(${payments.length})`}
							</button>
						</div>

						<div className="p-4">
							{activeTab === TAB_OVERVIEW && (
								<div className="max-w-2xl">
									{bio && <p className="text-sm text-gray-600 mb-4">{bio}</p>}
									<dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3 text-sm">
										{email && (
											<>
												<dt className="text-gray-500">Email</dt>
												<dd className="font-medium text-gray-900">{email}</dd>
											</>
										)}
										{studentEmail && (
											<>
												<dt className="text-gray-500">Student email</dt>
												<dd className="font-medium text-gray-900">{studentEmail}</dd>
											</>
										)}
										{matricNumber && (
											<>
												<dt className="text-gray-500">Matric number</dt>
												<dd className="font-medium text-gray-900">{matricNumber}</dd>
											</>
										)}
										{level && (
											<>
												<dt className="text-gray-500">Level</dt>
												<dd className="font-medium text-gray-900">{level}</dd>
											</>
										)}
										{joinedDate && (
											<>
												<dt className="text-gray-500">Joined</dt>
												<dd className="font-medium text-gray-900">{joinedDate}</dd>
											</>
										)}
									</dl>
								</div>
							)}

							{activeTab === TAB_PAYMENTS && (
								<div>
									{paymentsLoading ? (
										<div className="py-8 text-center text-gray-500">Loading payments…</div>
									) : !payments || payments.length === 0 ? (
										<div className="py-12 text-center text-gray-500 rounded-lg border border-gray-200 bg-gray-50">
											No payments recorded for this user.
										</div>
									) : (
										<div className="space-y-4">
											{payments.map((payment) => (
												<RecentPayments
													key={payment._id}
													email={payment.user?.email ?? user?.email}
													matricNo={payment.user?.matricNumber ?? user?.matricNumber}
													createdAt={payment.createdAt}
													amount={payment.category?.amount}
													reference={payment.transactionReference}
													category={payment.category?.name}
												/>
											))}
										</div>
									)}
								</div>
							)}
						</div>
					</>
				)}
			</div>

			<ConfirmDialog
				isOpen={showRemoveAdminConfirm}
				onClose={() => setShowRemoveAdminConfirm(false)}
				onConfirm={handleRemoveAdmin}
				title="Remove admin?"
				message={`Remove admin privileges from ${name || "this user"}? They will no longer have admin access.`}
				confirmLabel="Remove Admin"
			/>
			<ConfirmDialog
				isOpen={showBlockConfirm}
				onClose={() => setShowBlockConfirm(false)}
				onConfirm={handleBlockUser}
				title="Block user?"
				message={`${name || "This user"} will not be able to sign in or use the app until unblocked.`}
				confirmLabel="Block"
			/>
			<ConfirmDialog
				isOpen={showUnblockConfirm}
				onClose={() => setShowUnblockConfirm(false)}
				onConfirm={handleUnblockUser}
				title="Unblock user?"
				message={`${name || "This user"} will be able to sign in and use the app again.`}
				confirmLabel="Unblock"
			/>
			<ConfirmDialog
				isOpen={showMakeAdminConfirm}
				onClose={() => setShowMakeAdminConfirm(false)}
				onConfirm={handleMakeUserAdmin}
				title="Make admin?"
				message={`${name || "This user"} will have full admin access and privileges.`}
				confirmLabel="Make admin"
			/>
			<SendPersonalMailModal
				isOpen={showSendMailModal}
				onClose={() => setShowSendMailModal(false)}
				userId={userId}
				userName={name || username}
			/>
		</div>
	);
};

export default AdminUserView;
