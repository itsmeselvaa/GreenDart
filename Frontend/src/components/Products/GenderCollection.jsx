import React from "react";
import { assets } from "../../assets/assets";
import { Link } from "react-router-dom";

const GenderCollection = () => {
  return (
    <section className=" py-16 md:py-5 px-4">
      <div className="container mx-auto flex flex-col md:flex-row gap-8">
        {/* Womens Collection */}
        <div className="relative flex-1 rounded-md overflow-hidden">
          <img
            src={assets.womensCollection}
            alt="womenCollections"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-8 left-8 p-6 bg-white/90 rounded-md shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Women's Collection
            </h2>
            <Link
              to="/collections/all?gender=Women"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
        <div className="relative flex-1 rounded-md overflow-hidden">
          {/* Mens Collection */}
          <img
            src={assets.mensCollection}
            alt="womenCollections"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute bottom-8 left-8 p-6 bg-white/90 rounded-md shadow-lg">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              Men's Collection
            </h2>
            <Link
              to="/collections/all?gender=Men"
              className="text-gray-900 underline"
            >
              Shop Now
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GenderCollection;
