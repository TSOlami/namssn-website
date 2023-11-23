import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
	// const { isAuthenticated } = useSelector((state) => state.auth);
	const { userInfo } = useSelector((state) => state.auth);
	return userInfo ? <Outlet /> : <Navigate to="/signin" replace />;
}

export default ProtectedRoutes