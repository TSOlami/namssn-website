import { useState } from "react";
import { Link } from "react-router-dom";
import { HeaderComponent, Sidebar } from "../components";
import { UserListSkeleton, TableSkeleton } from "../components/skeletons";
import {
	useGetAllUsersQuery,
	useMakeUserAdminMutation,
	useRemoveAdminMutation,
	useBlockUserMutation,
	useUnblockUserMutation,
} from "../redux";
import { toast } from "react-toastify";
import { ConfirmDialog } from "../components";

const AdminUsers = () => {
	const { data: users, isLoading } = useGetAllUsersQuery();
	const [makeAdmin] = useMakeUserAdminMutation();
	const [removeAdmin] = useRemoveAdminMutation();
	const [blockUserMutation] = useBlockUserMutation();
	const [unblockUserMutation] = useUnblockUserMutation();

	const [actionUser, setActionUser] = useState(null);
	const [actionType, setActionType] = useState(null); // 'block' | 'unblock' | 'makeAdmin' | 'removeAdmin'

	const handleBlock = (user) => {
		if (user.role === "admin") {
			toast.error("Cannot block an admin user.");
			return;
		}
		setActionUser(user);
		setActionType("block");
	};

	const handleUnblock = (user) => {
		setActionUser(user);
		setActionType("unblock");
	};

	const handleMakeAdmin = (user) => {
		setActionUser(user);
		setActionType("makeAdmin");
	};

	const handleRemoveAdmin = (user) => {
		setActionUser(user);
		setActionType("removeAdmin");
	};

	const handleConfirm = async () => {
		if (!actionUser) return;
		const userId = actionUser._id;
		try {
			if (actionType === "block") {
				await blockUserMutation(userId).unwrap();
				toast.success("User has been blocked.");
			} else if (actionType === "unblock") {
				await unblockUserMutation(userId).unwrap();
				toast.success("User has been unblocked.");
			} else if (actionType === "makeAdmin") {
				await makeAdmin(userId).unwrap();
				toast.success("User is now an admin.");
			} else if (actionType === "removeAdmin") {
				await removeAdmin(userId).unwrap();
				toast.success("Admin privileges removed.");
			}
		} catch (err) {
			const msg = err?.data?.message || err?.message || "Action failed.";
			toast.error(msg);
		}
		setActionUser(null);
		setActionType(null);
	};

	const getConfirmConfig = () => {
		if (!actionUser || !actionType) return { title: "", message: "" };
		const name = actionUser.name || actionUser.username || "This user";
		switch (actionType) {
			case "block":
				return {
					title: "Block user?",
					message: `${name} will not be able to sign in or use the app until unblocked.`,
					confirmLabel: "Block",
				};
			case "unblock":
				return {
					title: "Unblock user?",
					message: `${name} will be able to sign in and use the app again.`,
					confirmLabel: "Unblock",
				};
			case "makeAdmin":
				return {
					title: "Make admin?",
					message: `${name} will have full admin access.`,
					confirmLabel: "Make admin",
				};
			case "removeAdmin":
				return {
					title: "Remove admin?",
					message: `${name} will lose admin privileges.`,
					confirmLabel: "Remove admin",
				};
			default:
				return { title: "", message: "" };
		}
	};

	const config = getConfirmConfig();

	return (
		<div className="flex flex-row w-full">
			<Sidebar />
			<div className="w-full">
				<HeaderComponent title="Manage Users" back />
				<div className="p-4 overflow-x-auto">
					<p className="text-sm text-gray-600 mb-4">
						Blocked users cannot sign in. Only non-admin users can be blocked.
					</p>
					{isLoading ? (
						<TableSkeleton rows={10} columns={6} />
					) : users?.length === 0 ? (
						<div className="text-center py-12 text-gray-500">No users found.</div>
					) : (
						<table className="min-w-full shadow rounded-lg overflow-hidden border border-gray-200">
							<thead className="bg-gray-100">
								<tr>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">#</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Username</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Role</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
									<th className="px-3 py-2 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-200">
								{users?.map((user, index) => (
									<tr key={user._id} className="bg-white hover:bg-gray-50">
										<td className="px-3 py-2 text-sm">{index + 1}</td>
										<td className="px-3 py-2 text-sm font-medium">{user.name ?? "—"}</td>
										<td className="px-3 py-2 text-sm">{user.username ?? "—"}</td>
										<td className="px-3 py-2">
											<span className={`text-xs px-2 py-0.5 rounded ${user.role === "admin" ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-700"}`}>
												{user.role === "admin" ? "Admin" : "User"}
											</span>
										</td>
										<td className="px-3 py-2">
											{user.isBlocked ? (
												<span className="text-xs px-2 py-0.5 rounded bg-red-100 text-red-800">Blocked</span>
											) : (
												<span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-800">Active</span>
											)}
										</td>
										<td className="px-3 py-2">
											<div className="flex flex-wrap gap-1">
												<Link
													to={`/profile/${user._id}`}
													className="text-xs px-2 py-1 rounded bg-gray-200 hover:bg-gray-300"
												>
													View
												</Link>
												{user.isBlocked ? (
													<button
														onClick={() => handleUnblock(user)}
														className="text-xs px-2 py-1 rounded bg-green-200 hover:bg-green-300 text-green-800"
													>
														Unblock
													</button>
												) : user.role !== "admin" ? (
													<button
														onClick={() => handleBlock(user)}
														className="text-xs px-2 py-1 rounded bg-red-200 hover:bg-red-300 text-red-800"
													>
														Block
													</button>
												) : null}
												{user.role === "admin" ? (
													<button
														onClick={() => handleRemoveAdmin(user)}
														className="text-xs px-2 py-1 rounded bg-amber-200 hover:bg-amber-300 text-amber-800"
													>
														Remove admin
													</button>
												) : (
													<button
														onClick={() => handleMakeAdmin(user)}
														className="text-xs px-2 py-1 rounded bg-blue-200 hover:bg-blue-300 text-blue-800"
													>
														Make admin
													</button>
												)}
											</div>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>

			<ConfirmDialog
				isOpen={!!actionUser && !!actionType}
				onClose={() => { setActionUser(null); setActionType(null); }}
				onConfirm={handleConfirm}
				title={config.title}
				message={config.message}
				confirmLabel={config.confirmLabel}
			/>
		</div>
	);
};

export default AdminUsers;
