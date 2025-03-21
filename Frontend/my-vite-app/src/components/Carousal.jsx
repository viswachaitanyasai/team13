import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Slide from "./Slide"; // Import Slide component

// Import images
import img1 from "../assets/1.jpg";
import img2 from "../assets/6.jpg";
import img3 from "../assets/4.jpg";
import img4 from "../assets/5.jpg";

const slidesData = [
  {
    heading: "Transform Your Learning",
    subheading: "Master new skills with top mentors.",
    image: img1,
    buttonHeading: "Start Now",
    buttonLink: "/courses",
  },
  {
    heading: "Unlock Your Potential",
    subheading: "Industry-leading courses for future leaders.",
    image: img2,
    buttonHeading: "Explore",
    buttonLink: "/explore",
  },
  {
    heading: "Level Up Your Career",
    subheading: "Build a brighter future with expert guidance.",
    image: img3,
    buttonHeading: "Join Today",
    buttonLink: "/signup",
  },
  {
    heading: "Achieve Excellence",
    subheading: "Your journey to success begins here.",
    image: img4,
    buttonHeading: "Get Started",
    buttonLink: "/start",
  },
];

const Carousal = () => {
  return (
    <div className="relative w-full h-[600px]">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation={{
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop={true}
        effect="fade"
        className="w-full h-full"
      >
        {slidesData.map((slide, index) => (
          <SwiperSlide key={index}>
            <Slide {...slide} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom White Navigation Buttons */}
      <div className="swiper-button-prev !text-white !opacity-100"></div>
      <div className="swiper-button-next !text-white !opacity-100"></div>
    </div>
  );
};

export default Carousal;
