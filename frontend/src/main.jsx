import React from 'react';
import ReactDOM from 'react-dom/client';
import { 
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App.jsx';
import './index.css';

import store from './redux/store/store';
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
	ResetPassword,
	VerifyUserPass,
} from "./pages";
import ProtectedRoutes from "./components/ProtectedRoutes";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} key={12} path="/" exact element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
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
      {/* Private routes */}
      <Route path='' element={<ProtectedRoutes />} >
      <Route path="/home" element={<Home />} />
      <Route path="/payments" element={<PaymentPage />} />
      <Route path="/payments/pay/:id" element={<Payment />} />
      <Route
        path="/payments/:userId"
        element={<PaymentHistory />}
      />
      <Route path="/resources" element={<Resources />} />
      <Route
        path="/resources/:level"
        element={<LevelResources />}
      />
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
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/payment" element={<AdminPayment />} />
      <Route path="/comments/:postId" element={<Comments />} />
      <Route path="/admin/events" element={<AdminEvents />} />
      <Route path="/search" element={<Search />} />
      <Route
        path="/admin/announcements"
        element={<AdminAnnouncement />}
      />
      <Route path="/admin/users" element={<VerifyUsers />} />
      <Route
        path="/verify-account/:studentEmail"
        element={<VerifyAccount />}
      />
      <Route path="/verify-user/:username" element={<VerifyUserPass />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/forgot-password" element={<ForgotPage />} />
      <Route path="/reset-password/:username" element={<ResetPassword />} />
      <Route path="/admin/blogs" element={<AdminBlogs />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <RouterProvider router={router} />
    </React.StrictMode>
  </Provider>,
);
