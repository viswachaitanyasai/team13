import React from "react";
import { Link } from "react-router-dom";

function Slide({ heading, subheading, image, buttonHeading, buttonLink }) {
  return (
    <div
      className="relative w-full h-[600px] flex flex-col items-center justify-center bg-cover bg-center overflow-hidden"
      style={{ backgroundImage: `url(${image})` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20"></div>

      {/* Content Box */}
      <div className="relative z-10 text-center text-white p-10 bg-black/40 backdrop-blur-lg rounded-xl shadow-lg max-w-2xl">
        <h2 className="text-5xl md:text-4xl font-bold mb-4 drop-shadow-lg">{heading}</h2>
        <p className="text-lg md:text-lg mb-6 opacity-90">{subheading}</p>

        {buttonHeading && buttonLink && (
          <Link
            to={buttonLink}
            className="inline-block px-8 py-3 text-lg font-semibold text-white bg-indigo-500 rounded-full shadow-lg transition-all duration-300 hover:bg-gray-700 hover:scale-105 no-underline"
          >
            {buttonHeading}
          </Link>
        )}
      </div>
    </div>
  );
}

export default Slide;