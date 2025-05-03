import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <section className="relative w-full h-[400px] md:h-[600px] lg:h-[750px] overflow-hidden ">
      <img
        src={assets.rabbitHero}
        alt=""
        className="w-full h-[400px] md:h-[600px] lg-[750px] object-cover  "
      />
      <div className="absolute inset-0  flex flex-col items-center justify-center   ">
        <div className="text-center text-white p-6">
          <h1 className="text-4xl md:text-9xl font-bold tracking-tighter uppercase mb-4 text-center">
            Vacation <br />
            Ready
          </h1>
          <p className=" tracking-tighter md:text-lg text-sm mb-6">
            Explore our vaction-ready outfits with fast worldwide shipping
          </p>
          <Link className="bg-white text-gray-900 text-lg px-6 py-2 rounded-sm font-semibold hover:bg-gray-200 transition-all">
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Hero;
