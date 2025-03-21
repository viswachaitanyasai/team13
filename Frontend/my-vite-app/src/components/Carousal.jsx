import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import Slide from "./slide";
import Banner from "./Banner";
import img1 from "../assets/1.jpg"; 
import img2 from "../assets/6.jpg";
import img3 from "../assets/4.jpg";
import img4 from "../assets/5.jpg";

const Carousal = () => {
  return (
    <div className="relative">
      {/* Swiper Carousel */}
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000, disableOnInteraction: false }}
        loop={true}
        effect="fade"
        className="w-full h-[500px]" // Adjust height as needed
      >
        <SwiperSlide >
          {/* <Slide heading="Hello"/> */}
          <img src={img1} className="w-full h-full object-cover" alt="Slide 1" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img2} className="w-full h-full object-cover" alt="Slide 2" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img3} className="w-full h-full object-cover" alt="Slide 3" />
        </SwiperSlide>
        <SwiperSlide>
          <img src={img4} className="w-full h-full object-cover" alt="Slide 4" />
        </SwiperSlide>
      </Swiper>

      {/* Banner Overlay */}
     
    </div>
  );
};

export default Carousal;
