import '@fortawesome/fontawesome-free/css/all.min.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import './index.css';
import { Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import ErrorBoundary from './pages/ErrorBoundary';
import TeacherLogin from './pages/TeacherLogin';
import DashBoard from './pages/DashBoard';
import CreateHackathon from './pages/CreateHackathon';
import OTPVerification from './components/OTPVerification';


function App() {
  return (
    <ErrorBoundary>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/teacher-login" element={<TeacherLogin/>} />
      <Route path="/teacher-login/otp-verification/dashboard" element={<DashBoard/>} />
      <Route path="/teacher-login/otp-verification/dashboard/create-hackathon" element={<CreateHackathon/>} />
      <Route path="/teacher-login/otp-verification" element={<OTPVerification/>} />
    </Routes>
    </ErrorBoundary>
  )
}

export default App
