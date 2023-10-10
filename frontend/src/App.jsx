import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Landing, SignIn, SignUp, Home, Resources, PaymentPage, Profile, AnnouncementMobile, NotificationPage, ErrorPage, DepartmentalFees, EventsPage, AboutUsPage, BlogPage, AdminDashboard } from './pages';

export default function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' exact element={<Landing/>} />
      <Route path='/signin' element={<SignIn/>} />
      <Route path='/signup' element={<SignUp/>} />
      <Route path='/payment' element={<PaymentPage/>} />
      <Route path='/home' element={<Home/>} />
      <Route path='/resources' element={<Resources/>} />
      <Route path='/profile' element={<Profile/>}/>
      <Route path='/announcements' element={<AnnouncementMobile/>} />
      <Route path='/notifications' element={<NotificationPage/>}/>
      <Route path='/departmental-fees' element={<DepartmentalFees/>}/>
      <Route path='/events' element={<EventsPage/>}/>
      <Route path='*' element={<ErrorPage/>} />
      <Route path='/about-us' element={<AboutUsPage/>} />
      <Route path='/blog' element={<BlogPage/>} />
      <Route path='/admin' element={<AdminDashboard/>}/>
    </Routes>
    </BrowserRouter>    
  )
}