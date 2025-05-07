import React, { useEffect, useRef, useCallback } from "react";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../../redux/slice/productSlice";

import FilterSideBar from "../components/Products/FilterSideBar";
import SortOption from "../components/Products/SortOption";
import ProductGrid from "../components/Products/ProductGrid";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error, totalPages } = useSelector(
    (state) => state.products
  );

  const sideBarRef = useRef(null);
  const filterRef = useRef(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  const page = parseInt(searchParams.get("page")) || 1;

  const queryParams = Object.fromEntries([...searchParams.entries()]);

  // Dispatch product fetch on param change
  useEffect(() => {
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  // Close sidebar on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sideBarRef.current &&
        filterRef.current &&
        !sideBarRef.current.contains(event.target) &&
        !filterRef.current.contains(event.target)
      ) {
        setIsSideBarOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Prevent scroll when nav drawer is open
  useEffect(() => {
    document.body.style.overflow = isSideBarOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isSideBarOpen]);

  // Pagination update
  const updatePageParam = useCallback(
    (newPage) => {
      const updatedParams = new URLSearchParams(queryParams);
      updatedParams.set("page", newPage);
      setSearchParams(updatedParams);
    },
    [queryParams, setSearchParams]
  );

  return (
    <>
      <div className="flex flex-col lg:flex-row mb-20">
        {/* Mobile Filter Toggle */}
        <button
          ref={filterRef}
          className="lg:hidden border-y  px-2 py-1 flex items-center justify-center mt-5"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        >
          <FaFilter className="mr-2" />
          Filter
        </button>

        {/* Sidebar */}
        <div
          ref={sideBarRef}
          className={`${
            isSideBarOpen ? "translate-x-0" : "-translate-x-full"
          } fixed z-30 top-25 left-0 w-80 h-full bg-white transition-transform  pb-20 duration-300 lg:static lg:translate-x-0 overflow-y-auto scrollbar-hidden `}
        >
          <FilterSideBar />
        </div>

        {/* Main Content */}
        <div className="flex-grow p-4 ">
          <div className="flex items-center justify-between px-4">
            <h2 className="text-2xl ">All Collections</h2>
            <SortOption />
          </div>
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="my-5  justify-center items-center space-x-2 hidden lg:flex">
          <button
            onClick={() => updatePageParam(page - 1)}
            disabled={page <= 1}
            className={`px-3 py-1 rounded-md ${
              page <= 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-3 py-1 rounded-md ${
                page === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-black"
              }`}
              onClick={() => updatePageParam(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => updatePageParam(page + 1)}
            disabled={page >= totalPages}
            className={`px-3 py-1 rounded-md ${
              page >= totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-gray-200 text-black hover:bg-gray-300"
            }`}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default CollectionPage;
