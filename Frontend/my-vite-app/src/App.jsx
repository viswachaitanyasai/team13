import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutHackathons from "./components/AboutHackathons";
import CreateHackathonForm2 from "./components/CreateHackathonForm2";
import OTPVerification from "./components/OTPVerification";
import Statistics from "./components/Statistics";
import Layout from "./components/layouts/layout";
import "./index.css";
import AuthPage from "./pages/AuthPage";
import CreateHackathon from "./pages/CreateHackathon";
import ErrorBoundary from "./pages/ErrorBoundary";
import Landing from "./pages/Landing";
import Profile from "./pages/Profile";
import SubmissionAnalysis from "./pages/SubmissionAnalysis";
import DashboardPage from "./pages/TeacherDashboard";
import ViewSubmissions from "./pages/ViewSubmissions";
import ViewEvaluation from "./pages/viewEvaluation";
import SecuredRoute from "./components/SecuredRoute";
import OngoingHackathons from "./components/OngoingHackathons";
import UpcomingHackathons from "./components/UpcomingHackathons";
import PastHackathons from "./components/PastHackathons";
function App() {
  return (
    <>
      {/* Toast Container for Notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <ErrorBoundary>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/teacher-login" element={<AuthPage />} />
          <Route path="/otp-verification" element={<OTPVerification />} />

          <Route element={<SecuredRoute />}>
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/create-hackathon" element={<CreateHackathon />} />
            <Route
              path="/create-hackathon2"
              element={<CreateHackathonForm2 />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/hackathons" element={<AboutHackathons />} />
            <Route path="/hackathons/past" element={<PastHackathons />} />
            <Route path="/hackathons/ongoing" element={<OngoingHackathons />} />
            <Route path="/hackathons/upcoming" element={<UpcomingHackathons />} />
            <Route path="/statistics" element={<Statistics />} />
            {/* <Route path="/submission" element={<ViewSubmissions />} /> */}
            <Route path="/submission/:hackathonId" element={<ViewSubmissions />} />
            <Route path="/evaluation" element={<ViewEvaluation />} />
            <Route path="/analysis" element={<SubmissionAnalysis/>} />

          </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
