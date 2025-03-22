import React from "react";
import Header from "../components/Header";
import Carousal from "../components/Carousal";
import Promotion from "../components/promotion";
import Footer from "../components/Footer";
import FeedbackForm from "../components/FeedBack";
import FeaturesSection from "../components/Features";
import CustomizableParameters from "../components/paramSection";
import StudentVoice from "../components/student";
function Landing() {
  return (
    <>
      <Header />
      <Carousal />
      <FeaturesSection /> <StudentVoice />
      <CustomizableParameters />
      <Footer />
    </>
  );
}

export default Landing;
