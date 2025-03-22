import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ErrorBoundary from './pages/ErrorBoundary';
import TeacherLogin from './pages/TeacherLogin';
import TeacherDashboard from './pages/TeacherDashboard';
import OTPVerification from './components/OTPVerification';
import Profile from './pages/Profile';
import AuthPage from './pages/AuthPage';
import CreateHackathon from './pages/CreateHackathon';


function App() {
  return (
    <ErrorBoundary>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/teacher-login" element={<AuthPage/>} />
      <Route path="/teacher-login/dashboard" element={<TeacherDashboard/>} />
      <Route path="/teacher-login/otp-verification/dashboard" element={<TeacherDashboard/>} />
      <Route path="/teacher-login/dashboard/create-hackathon" element={<CreateHackathon/>} />
      <Route path="/teacher-login/otp-verification" element={<OTPVerification/>} />
      <Route path="/teacher-login/otp-verification/dashboard/profile" element={<Profile/>} />
    </Routes>
    </ErrorBoundary>
  )
}

export default App
