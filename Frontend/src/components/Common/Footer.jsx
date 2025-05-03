import React from "react";
import { IoLogoInstagram } from "react-icons/io";
import { RiTwitterXLine } from "react-icons/ri";
import { TbBrandMeta } from "react-icons/tb";
import { Link } from "react-router-dom";
import { FiPhoneCall } from "react-icons/fi";
const Footer = () => {
  return (
    <footer className="border-t py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-4  ">
        <div className="col-span-4 md:col-span-1">
          <h3 className="text-lg text-gray-800 mb-4">NewsLetter</h3>
          <p className="text-gray-500 mb-4 text-sm">
            Be the first to hear about new products, exclusive events, and
            online Offers
          </p>
          <p className="font-medium text-sm text-gray-600 mb-6">
            Sign up and get 10% off on your first Order
          </p>

          {/* NewsLetter Form */}
          <form className="flex items-center ">
            <input
              type="email"
              placeholder="Enter your Email"
              className="p-3 border-t border-l border-b border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-gray-500 transition-all w-full text-sm"
            />
            <button
              type="submit"
              className="border h-[46px] rounded-r-md text-sm bg-black text-white px-5 py-3  hover:bg-gray-800 transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
        {/* Shop Links */}
        <div className="place-items-center">
          <h3 className="text-lg text-gray-800 mb-4">Shop</h3>
          <ul className="space-y-2 text-gray-600 place-items-center">
            <li className="hover:text-gray-500 transition-all">
              <Link to="/">Men's Top Wear</Link>
            </li>
            <li className="hover:text-gray-500 transition-all">
              <Link to="/">Women's Top Wear</Link>
            </li>
            <li className="hover:text-gray-500 transition-all">
              <Link to="/">Men's Bottom Wear</Link>
            </li>
            <li className="hover:text-gray-500 transition-all">
              <Link to="/">Women's Bottom Wear</Link>
            </li>
          </ul>
        </div>
        {/* Supper Links */}
        <div className="place-items-center">
          <h3 className="text-lg text-gray-800 mb-4">Support</h3>
          <ul className="space-y-2 text-gray-600 place-items-center">
            <li className="hover:text-gray-500 transition-all">
              <Link to="/">Contact Us</Link>
            </li>
            <li className="hover:text-gray-500 transition-all">
              <Link to="/">About Us</Link>
            </li>
            <li className="hover:text-gray-500 transition-all">
              <Link to="/">FAQ</Link>
            </li>
            <li className="hover:text-gray-500 transition-all">
              <Link to="/">Features</Link>
            </li>
          </ul>
        </div>
        {/* Follow us */}
        <div className="place-items-center">
          <h3 className="text-lg text-gray-800 mb-4">Follow Us</h3>
          <div className="flex items-center space-x-4 mb-6 ">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer "
              className="hover:text-gray-300 transition-all"
            >
              <TbBrandMeta className="h-5 w-5" />
            </a>
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer "
              className="hover:text-gray-300 transition-all"
            >
              <IoLogoInstagram className="h-5 w-5" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer "
              className="hover:text-gray-300 transition-all"
            >
              <RiTwitterXLine className="h-4 w-4" />
            </a>
          </div>
          <div className="text-center">
            <p className="text-gray-500">Call Us</p>
            <a
              href="tel:01234567890"
              className="text-gray-600 hover:text-gray-800"
            >
              <FiPhoneCall className="inline-block mr-2" />
              0123-456-7890
            </a>
          </div>
        </div>
      </div>
      {/* Footer Bottom */}
      <div className="container mx-auto mt-12 text-center border-t border-gray-200 pt-10 px-4 lg:px-0">
        <p className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} Your Company. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
