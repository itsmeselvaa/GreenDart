import React, { useState, useEffect, useRef } from "react";
import { NavLink, Link, useLocation, useSearchParams } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineUser } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const cartItemCount = cart?.products.length;
  const navRef = useRef(null);
  const navButtoRef = useRef(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(window.location.search);

  // Close nav drawer on route change
  useEffect(() => {
    setNavDrawerOpen(false);
  }, [location]);

  useEffect(() => {
    console.log("queryParams", queryParams.get("category"));
  }, [window.location.search]);

  // Prevent scroll when nav drawer is open
  useEffect(() => {
    document.body.style.overflow = navDrawerOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [navDrawerOpen]);

  const toggleNavDrawer = () => {
    setNavDrawerOpen((prev) => !prev);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navRef.current &&
        navButtoRef &&
        !navRef.current.contains(event.target) &&
        !navButtoRef.current.contains(event.target)
      ) {
        setNavDrawerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="container mx-auto flex justify-between items-center py-4 px-4">
        {/* Left - Logo */}
        <div>
          <Link
            to="/"
            className="text-2xl font-bold uppercase tracking-wide text-gray-700 hover:text-black"
          >
            GREENDART
          </Link>
        </div>

        {/* Center - Desktop Navigation */}
        <div className="md:flex hidden space-x-6">
          {["Men", "Women"].map((gender) => (
            <NavLink
              key={gender}
              to={`/collection/all?gender=${gender}`}
              className={`text-sm font-medium uppercase ${
                queryParams.get("gender") == gender
                  ? "text-primary font-bold"
                  : "text-gray-700 hover:text-black"
              }`}
            >
              {gender}
            </NavLink>
          ))}
          {["Top Wear", "Bottom Wear"].map((category) => (
            <NavLink
              key={category}
              to={`/collection/all?category=${category}`}
              className={`text-sm font-medium uppercase ${
                queryParams.get("category") === category
                  ? "text-primary font-bold "
                  : "text-gray-700 hover:text-black"
              }`}
            >
              {category}
            </NavLink>
          ))}
        </div>

        {/* Right - Icons */}
        <div className="flex items-center space-x-4">
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black px-2 py-1 rounded text-sm text-white"
            >
              Admin
            </Link>
          )}

          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700" />
          </Link>

          {/* Cart Icon Button */}
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-4 w-4 flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>

          {/* Search */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>

          {/* Mobile Nav Toggle */}
          <button
            className="md:hidden"
            onClick={toggleNavDrawer}
            ref={navButtoRef}
          >
            <HiBars3BottomRight className="h-6 w-6 text-gray-700" />
          </button>
        </div>
      </nav>

      {/* Cart Drawer */}
      <CartDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        toggleCartDrawer={toggleCartDrawer}
      />

      {/* Mobile Navigation Drawer */}
      <div
        ref={navRef}
        className={`fixed top-0 left-0 w-[15rem] sm:w-1/3 h-full bg-white shadow-lg transition-transform duration-300 z-50 md:hidden ${
          navDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4">Menu</h2>
          <nav className="space-y-2">
            {["Men", "Women"].map((gender) => (
              <NavLink
                key={gender}
                to={`/collection/all?gender=${gender}`}
                onClick={toggleNavDrawer}
                className={`text-sm font-medium uppercase ${
                  queryParams.get("gender") == gender
                    ? "text-primary font-extrabold"
                    : "text-gray-700 hover:text-black"
                } block py-2`}
              >
                {gender}
              </NavLink>
            ))}
            {["Top Wear", "Bottom Wear"].map((category) => (
              <NavLink
                key={category}
                to={`/collection/all?category=${category}`}
                onClick={toggleNavDrawer}
                className={`text-sm font-medium uppercase ${
                  queryParams.get("category") == category
                    ? "text-primary font-extrabold"
                    : "text-gray-700 hover:text-black"
                } block py-2`}
              >
                {category}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavBar;
