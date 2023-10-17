import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Payment } from './components';
import { Landing, SignIn, SignUp, Home, Resources, PaymentPage, Profile, AnnouncementMobile, NotificationPage, ErrorPage, DepartmentalFees, EventsPage, AboutUsPage, BlogPage, AdminDashboard, AdminPayment, UserProfile, Comments, AdminEvents, AdminAnnouncements } from './pages';
import { PrivateRoutes } from './components';

export default function App() {
  return (
    <BrowserRouter>
    <ToastContainer />
    <Routes>
      <Route path='/' exact element={<Landing/>} />
      <Route path='/signin' element={<SignIn/>} />
      <Route path='/signup' element={<SignUp/>} />
      {/* Private routes */}
      <Route path='' element={<PrivateRoutes />} />
        <Route path='/home' element={<Home/>} />
        <Route path='/payments' element={<PaymentPage/>} />
        <Route path='/payments/pay/:id' element={<Payment/>} />
        <Route path='/resources' element={<Resources/>} />
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/profile/:userId' element={<UserProfile/>}/>
        <Route path='/announcements' element={<AnnouncementMobile/>} />
        <Route path='/notifications' element={<NotificationPage/>}/>
        <Route path='/admin' element={<AdminDashboard/>}/>
      <Route/>
      <Route path='/departmental-fees' element={<DepartmentalFees/>}/>
      <Route path='/events' element={<EventsPage/>}/>
      <Route path='*' element={<ErrorPage/>} />
      <Route path='/about-us' element={<AboutUsPage/>} />
      <Route path='/blog' element={<BlogPage/>} />
      <Route path='/admin' element={<AdminDashboard/>}/>
      <Route path='/admin/payment' element={<AdminPayment/>} />
      <Route path='/comments/:postId' element={<Comments/>} />
      <Route path='/admin/events' element={<AdminEvents/>} />
      <Route path='/admin/announcements' element={<AdminAnnouncements/>} />
    </Routes>
    </BrowserRouter>    
  )
}