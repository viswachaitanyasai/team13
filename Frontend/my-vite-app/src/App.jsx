import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ErrorBoundary from './pages/ErrorBoundary';
import DashboardPage from './pages/TeacherDashboard';
import OTPVerification from './components/OTPVerification';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import CreateHackathon from './pages/CreateHackathon';
import Layout from './components/layouts/layout';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      {/* Toast Container for Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    <ErrorBoundary>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/teacher-login" element={<AuthPage/>} />
      <Route element={<Layout />}>
          <Route path="/dashboard" element={<DashboardPage/>} />
          <Route path="/create-hackathon" element={<CreateHackathon/>} />
          <Route path="/profile" element={<Profile/>} />
        </Route>
    
      <Route path="/otp-verification" element={<OTPVerification/>} />
    </Routes>
    </ErrorBoundary>
    </>
  )
}

export default App
