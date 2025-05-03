import React from "react";
import { Link } from "react-router-dom";
import { HiOutlineShoppingBag, HiOutlineUser } from "react-icons/hi";
import { HiBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layout/CartDrawer";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const cartItemCount = cart?.products.length;
  const { user } = useSelector((state) => state.auth);
  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };
  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  return (
    <>
      <nav className="container mx-auto flex justify-between items-center py-4 px-4 ">
        {/* Left - Logo */}
        <div>
          <Link
            to="/"
            className="text-2xl font-medium text-gray-700 hover:text-black"
          >
            GREENDART
          </Link>
        </div>
        {/*Center - Navigation Link  */}
        <div className="md:flex hidden space-x-6">
          <Link
            to="/collection/all?gender=Men"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Men
          </Link>
          <Link
            to="/collection/all?gender=Women"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Women
          </Link>
          <Link
            to="/collection/all?category=Top Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Top Wear
          </Link>
          <Link
            to="/collection/all?category=Bottom Wear"
            className="text-gray-700 hover:text-black text-sm font-medium uppercase"
          >
            Bottom Wear
          </Link>
        </div>
        {/* Right - Icons */}

        <div className="flex items-center space-x-4">
          {user && user.role === "admin" && (
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
          <button className="relative hover:text-black">
            <HiOutlineShoppingBag
              className="h-6 w-6 text-gray-700"
              onClick={toggleCartDrawer}
            />
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
          <button className="md:hidden" onClick={toggleNavDrawer}>
            <HiBars3BottomRight className="h-6 w-6 text-gray-700 " />
          </button>
        </div>
      </nav>
      <CartDrawer
        drawerOpen={drawerOpen}
        setDrawerOpen={setDrawerOpen}
        toggleCartDrawer={toggleCartDrawer}
      />
      {/* Mobile Navigation */}
      <div
        className={`fixed top-0 left-0 w-[15rem] sm:w-1/3 h-full bg-white shadow-lg transition-transform duration-300 z-50 ${
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
            <Link
              to="/collection/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block py-2 text-gray-600 hover:text-black"
            >
              Men
            </Link>
            <Link
              to="/collection/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block py-2 text-gray-600 hover:text-black"
            >
              Women
            </Link>
            <Link
              to="/collection/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="block py-2 text-gray-600 hover:text-black"
            >
              Top Wear
            </Link>
            <Link
              to="/collection/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="block py-2 text-gray-600 hover:text-black"
            >
              Bottom Wear
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
};

export default NavBar;
