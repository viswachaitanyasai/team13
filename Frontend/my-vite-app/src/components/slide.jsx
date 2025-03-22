import React from "react";
import { Link } from "react-router-dom";

function Slide({ heading, subheading, image, buttonHeading, buttonLink }) {
  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Dark Gradient Overlay for Depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/90"></div>

      {/* Content Box with Glassmorphism */}
      <div className="relative z-10 text-center p-10  rounded-xl shadow-lg max-w-2xl">
        <h2 className="text-[40px] md:text-5xl font-bold text-gray-100 mb-3">
          {heading}
        </h2>
        <p className="text-lg md:block hidden font-semibold text-gray-300 mb-6 leading-relaxed">
          {subheading}
        </p>

        {buttonHeading && buttonLink && (
          <Link
            to={buttonLink}
            className="inline-block mt-4 md:mt-0 no-underline px-6 py-2 text-lg font-semibold text-white bg-cyan-600 rounded-xl shadow-lg border-black  transition-all duration-300 hover:bg-cyan-300 hover:shadow-lg"
          >
            {buttonHeading}
          </Link>
        )}
      </div>
    </div>
  );
}

export default Slide;
