import "@fortawesome/fontawesome-free/css/all.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AboutHackathons from "./components/AboutHackathons";
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
import ViewSubmission from "./pages/ViewSubmissions";
import ViewEvaluation from "./pages/ViewEvaluation";
import SecuredRoute from "./components/SecuredRoute";
import OngoingHackathons from "./components/OngoingHackathons";
import UpcomingHackathons from "./components/UpcomingHackathons";
import PastHackathons from "./components/PastHackathons";
import ViewHackathon from "./pages/ViewHackathonDetails";
import EditHackathon from "./pages/EditHackathon";

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
            <Route path="/create-hackathon" element={<CreateHackathon />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/hackathons" element={<AboutHackathons />} />
            <Route path="/hackathon/:hackathonId" element={<ViewHackathon />} />
            <Route path="/hackathons/past" element={<PastHackathons />} />
            <Route path="/hackathons/ongoing" element={<OngoingHackathons />} />
            <Route path="/hackathons/upcoming" element={<UpcomingHackathons />} />
            <Route path="/statistics" element={<Statistics />} />
            {/* <Route path="/submission" element={<ViewSubmissions />} /> */}
            <Route path="/summary/:hackathonId" element={<ViewSubmission />} />
            {/* <Route path="/submissions" element={View}></Route> */}
            <Route path="/submissions/:hackathonId" element={<ViewEvaluation />} />
            <Route path="/analysis/:evaluation_id" element={<SubmissionAnalysis/>} />
            <Route path="/edit-hackathon/:hackathonId" element={<EditHackathon/>} />

            

          </Route>
          </Route>
        </Routes>
      </ErrorBoundary>
    </>
  );
}

export default App;
