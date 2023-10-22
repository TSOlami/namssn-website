import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Payment, PaymentHistory } from "./components";
import {
	LevelResources,
	Search,
	Landing,
	SignIn,
	SignUp,
	Home,
	Resources,
	PaymentPage,
	Profile,
	AnnouncementMobile,
	NotificationPage,
	ErrorPage,
	DepartmentalFees,
	EventsPage,
	AboutUsPage,
	BlogPage,
	AdminDashboard,
	AdminPayment,
	UserProfile,
	Comments,
	AdminEvents,
	AdminAnnouncement,
	VerifyUsers,
	VerifyEmail,
	AdminBlogs,
	ForgotPage,
	VerifyAccount,
} from "./pages";
import { PrivateRoutes } from "./components";
import { AnimatePresence } from "framer-motion";

export default function App() {
  return (
		<AnimatePresence mode="wait">
			<BrowserRouter>
				<ToastContainer />
				<Routes>
					<Route key={12} path="/" exact element={<Landing />} />
					<Route path="/signin" element={<SignIn />} />
					<Route path="/signup" element={<SignUp />} />
					{/* Private routes */}
					<Route path="" element={<PrivateRoutes />} />
					<Route path="/home" element={<Home />} />
					<Route path="/payments" element={<PaymentPage />} />
					<Route path="/payments/pay/:id" element={<Payment />} />
					<Route
						path="/payments/:userId"
						element={<PaymentHistory />}
					/>
					<Route path="/resources" element={<Resources />} />
					<Route path="/resources/:level" element={<LevelResources/>} />
					<Route path="/profile" element={<Profile />} />
					<Route path="/profile/:userId" element={<UserProfile />} />
					<Route
						path="/announcements"
						element={<AnnouncementMobile />}
					/>
					<Route
						path="/notifications"
						element={<NotificationPage />}
					/>
					<Route path="/admin" element={<AdminDashboard />} />
					<Route />
					<Route
						path="/departmental-fees"
						element={<DepartmentalFees />}
					/>
					<Route path="/events" element={<EventsPage />} />
					<Route path="*" element={<ErrorPage />} />
					<Route
						key={13}
						path="/about-us"
						element={<AboutUsPage />}
					/>
					<Route path="/blog" element={<BlogPage />} />
					<Route path="/admin" element={<AdminDashboard />} />
					<Route path="/admin/payment" element={<AdminPayment />} />
					<Route path="/comments/:postId" element={<Comments />} />
					<Route path="/admin/events" element={<AdminEvents />} />
					<Route path="/search" element={<Search/>} />
					<Route
						path="/admin/announcements"
						element={<AdminAnnouncement />}
					/>
					<Route path="/admin/users" element={<VerifyUsers />} />
					<Route path="/verify-account/:studentEmail" element={<VerifyAccount />} />
					<Route path="/verify-email" element={<VerifyEmail />} />
					<Route path="/forgot-password" element={<ForgotPage />} />
					<Route path="/admin/blogs" element={<AdminBlogs/>} />
				</Routes>
			</BrowserRouter>
		</AnimatePresence>
	);
}
