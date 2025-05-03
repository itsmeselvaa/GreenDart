import React from "react";
import { useState } from "react";
import { HiMagnifyingGlass, HiMiniXMark } from "react-icons/hi2";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchProductsByFilters,
  setFilters,
} from "../../../redux/slice/productSlice";

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearchToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setFilters({ search: searchTerm }));
    // Reset the search term after searching
    dispatch(fetchProductsByFilters({ search: searchTerm }));
    navigate(`/collection/all?search=${searchTerm}`);
    setSearchTerm("");
    // Close the search bar after searching
    setIsOpen(false);
  };

  return (
    <div
      className={` flex items-center justify-center w-full transition-all duration-300 ${
        isOpen ? "absolute top-0 left-0 w-full bg-white h-24 z-50" : "w-auto"
      }`}
    >
      {isOpen ? (
        <form
          className=" relative flex items-center justify-center space-x-2 w-full "
          onSubmit={handleSearch}
        >
          <div className="relative w-1/2 ">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search..."
              className="border border-gray-100 rounded-lg px-4 py-2 pl-2 pr-12 focus:outline-none  w-full bg-gray-100"
              autoFocus="true"
            />
            {/* searchIcon */}
            <button
              type="submit"
              className="absolute right-2 top-1/2 transform -translate-1/2 text-gray-500 hover:text-gray-800"
            >
              <HiMagnifyingGlass className="h-6 w-6" />
            </button>
          </div>
          {/* close button */}
          <button
            type="button"
            onClick={handleSearchToggle}
            className="absolute right-5 top-1/2 transform -translate-1/2 text-gray-500 hover:text-gray-800"
          >
            <HiMiniXMark className="h-6 w-6" />
          </button>
        </form>
      ) : (
        <button onClick={handleSearchToggle}>
          <HiMagnifyingGlass className="h-6 w-6  hover:text-gray-800 " />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
