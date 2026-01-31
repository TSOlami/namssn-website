import React, { Suspense, lazy } from 'react';
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
import { ErrorBoundary } from "./components";
import PageLoader from './components/PageLoader';
import ProtectedRoutes from "./components/ProtectedRoutes";

// ============================================================
// LAZY LOADED PAGES - Code Splitting for Better Performance
// Each page is loaded only when the user navigates to it
// ============================================================

// Public Pages - Loaded on demand
const Landing = lazy(() => import('./pages/Landing'));
const SignIn = lazy(() => import('./pages/Signin'));
const SignUp = lazy(() => import('./pages/Signup'));
const DepartmentalFees = lazy(() => import('./pages/DepartmentalFees'));
const EventsPage = lazy(() => import('./pages/EventsPage'));
const AboutUsPage = lazy(() => import('./pages/AboutUsPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const ErrorPage = lazy(() => import('./pages/ErrorPage'));

// Auth Flow Pages
const ForgotPage = lazy(() => import('./pages/ForgotPage'));
const VerifyUserPass = lazy(() => import('./pages/VerifyUserPass'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

// Protected Pages - User Dashboard
const Home = lazy(() => import('./pages/Home'));
const Profile = lazy(() => import('./pages/Profile'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const NotificationPage = lazy(() => import('./pages/NotificationPage'));
const AnnouncementMobile = lazy(() => import('./pages/AnnouncementMobile'));
const Comments = lazy(() => import('./pages/Comments'));
const Search = lazy(() => import('./pages/Search'));

// Payment Pages
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const Payment = lazy(() => import('./components/Payment'));
const PaymentHistory = lazy(() => import('./components/PaymentHistory'));

// Resource Pages
const Resources = lazy(() => import('./pages/Resources'));
const LevelResources = lazy(() => import('./pages/LevelResources'));
const FilePreview = lazy(() => import('./pages/FilePreview'));

// Admin Pages - Only loaded for admins
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const AdminPayment = lazy(() => import('./pages/AdminPayment'));
const AdminEvents = lazy(() => import('./pages/AdminEvents'));
const AdminAnnouncement = lazy(() => import('./pages/AdminAnnouncement'));
const AdminBlogs = lazy(() => import('./pages/AdminBlogs'));
const VerifyUsers = lazy(() => import('./pages/VerifyUsers'));

// Verification Pages
const VerifyAccount = lazy(() => import('./pages/VerifyAccount'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));

// ============================================================
// SUSPENSE WRAPPER - Shows loading indicator during lazy load
// ============================================================
const SuspenseWrapper = ({ children }) => (
  <Suspense fallback={<PageLoader />}>
    {children}
  </Suspense>
);

// ============================================================
// ROUTER CONFIGURATION - With Code Splitting
// ============================================================
const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      {/* Public Routes */}
      <Route 
        index 
        element={
          <SuspenseWrapper>
            <Landing />
          </SuspenseWrapper>
        } 
      />
      <Route 
        path="/signin" 
        element={
          <SuspenseWrapper>
            <SignIn />
          </SuspenseWrapper>
        } 
      />
      <Route 
        path="/signup" 
        element={
          <SuspenseWrapper>
            <SignUp />
          </SuspenseWrapper>
        } 
      />
      <Route 
        path="/departmental-fees" 
        element={
          <SuspenseWrapper>
            <DepartmentalFees />
          </SuspenseWrapper>
        } 
      />
      <Route 
        path="/events" 
        element={
          <SuspenseWrapper>
            <EventsPage />
          </SuspenseWrapper>
        } 
      />
      <Route 
        path="/about-us" 
        element={
          <SuspenseWrapper>
            <AboutUsPage />
          </SuspenseWrapper>
        } 
      />
      <Route 
        path="/blog" 
        element={
          <SuspenseWrapper>
            <BlogPage />
          </SuspenseWrapper>
        } 
      />
      
      {/* Auth Flow Routes */}
      <Route 
        path="/forgot-password" 
        element={
          <SuspenseWrapper>
            <ForgotPage />
          </SuspenseWrapper>
        } 
      />
      <Route 
        path="/verify-user/:username" 
        element={
          <SuspenseWrapper>
            <VerifyUserPass />
          </SuspenseWrapper>
        } 
      />
      <Route 
        path="/reset-password/:username" 
        element={
          <SuspenseWrapper>
            <ResetPassword />
          </SuspenseWrapper>
        } 
      />

      {/* Protected Routes - Requires Authentication */}
      <Route element={<ProtectedRoutes />}>
        <Route 
          path="/home" 
          element={
            <SuspenseWrapper>
              <Home />
            </SuspenseWrapper>
          } 
        />
        
        {/* Payment Routes */}
        <Route 
          path="/payments" 
          element={
            <SuspenseWrapper>
              <PaymentPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/payments/pay/:id" 
          element={
            <SuspenseWrapper>
              <Payment />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/payments/:userId" 
          element={
            <SuspenseWrapper>
              <PaymentHistory />
            </SuspenseWrapper>
          } 
        />

        {/* Resource Routes */}
        <Route 
          path="/resources" 
          element={
            <SuspenseWrapper>
              <Resources />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/resources/:level" 
          element={
            <SuspenseWrapper>
              <LevelResources />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/resources/preview/:title" 
          element={
            <SuspenseWrapper>
              <FilePreview />
            </SuspenseWrapper>
          } 
        />

        {/* User Routes */}
        <Route 
          path="/profile" 
          element={
            <SuspenseWrapper>
              <Profile />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/profile/:userId" 
          element={
            <SuspenseWrapper>
              <UserProfile />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/announcements" 
          element={
            <SuspenseWrapper>
              <AnnouncementMobile />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/notifications" 
          element={
            <SuspenseWrapper>
              <NotificationPage />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/comments/:postId" 
          element={
            <SuspenseWrapper>
              <Comments />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/search" 
          element={
            <SuspenseWrapper>
              <Search />
            </SuspenseWrapper>
          } 
        />

        {/* Admin Routes */}
        <Route 
          path="/admin" 
          element={
            <SuspenseWrapper>
              <AdminDashboard />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/admin/payment" 
          element={
            <SuspenseWrapper>
              <AdminPayment />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/admin/events" 
          element={
            <SuspenseWrapper>
              <AdminEvents />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/admin/announcements" 
          element={
            <SuspenseWrapper>
              <AdminAnnouncement />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <SuspenseWrapper>
              <VerifyUsers />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/admin/blogs" 
          element={
            <SuspenseWrapper>
              <AdminBlogs />
            </SuspenseWrapper>
          } 
        />

        {/* Verification Routes */}
        <Route 
          path="/verify-account/:studentEmail" 
          element={
            <SuspenseWrapper>
              <VerifyAccount />
            </SuspenseWrapper>
          } 
        />
        <Route 
          path="/verify-email" 
          element={
            <SuspenseWrapper>
              <VerifyEmail />
            </SuspenseWrapper>
          } 
        />
      </Route>

      {/* 404 - Error Page */}
      <Route 
        path="*" 
        element={
          <SuspenseWrapper>
            <ErrorPage />
          </SuspenseWrapper>
        } 
      />
    </Route>
  )
);

// ============================================================
// RENDER APPLICATION
// ============================================================
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <React.StrictMode>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </React.StrictMode>
  </Provider>
);
