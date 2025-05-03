import React, { useEffect } from "react";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSideBar from "../components/Products/FilterSideBar";
import { useRef } from "react";
import SortOption from "../components/Products/SortOption";
import ProductGrid from "../components/Products/ProductGrid";
import { useParams, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../../redux/slice/productSlice";

const CollectionPage = () => {
  const { collection } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);
  const sideBarRef = useRef(null);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);

  useEffect(() => {
    console.log(queryParams);
    dispatch(fetchProductsByFilters({ collection, ...queryParams }));
  }, [dispatch, collection, searchParams]);

  const handleSideBarToggle = () => {
    setIsSideBarOpen(!isSideBarOpen);
  };

  const handleOutsideClick = (event) => {
    if (sideBarRef.current && !sideBarRef.current.contains(event.target)) {
      setIsSideBarOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  // useEffect(() => {
  //   setTimeout(() => {
  //     const mockProducts = [
  //       {
  //         _id: "1",
  //         name: "Stylish Jacket",
  //         price: 120,
  //         image: [
  //           {
  //             url: "https://picsum.photos/200/300?random=1",
  //             alt: "Stylish Jacket",
  //           },
  //         ],
  //       },
  //       {
  //         _id: "2",
  //         name: "Stylish Jacket",
  //         price: 120,
  //         image: [
  //           {
  //             url: "https://picsum.photos/200/300?random=2",
  //             alt: "Stylish Jacket",
  //           },
  //         ],
  //       },
  //       {
  //         _id: "3",
  //         name: "Stylish Jacket",
  //         price: 120,
  //         image: [
  //           {
  //             url: "https://picsum.photos/200/300?random=3",
  //             alt: "Stylish Jacket",
  //           },
  //         ],
  //       },
  //       {
  //         _id: "4",
  //         name: "Stylish Jacket",
  //         price: 120,
  //         image: [
  //           {
  //             url: "https://picsum.photos/200/300?random=4",
  //             alt: "Stylish Jacket",
  //           },
  //         ],
  //       },
  //       {
  //         _id: "5",
  //         name: "Stylish Jacket",
  //         price: 120,
  //         image: [
  //           {
  //             url: "https://picsum.photos/200/300?random=5",
  //             alt: "Stylish Jacket",
  //           },
  //         ],
  //       },
  //       {
  //         _id: "6",
  //         name: "Stylish Jacket",
  //         price: 120,
  //         image: [
  //           {
  //             url: "https://picsum.photos/200/300?random=6",
  //             alt: "Stylish Jacket",
  //           },
  //         ],
  //       },
  //       {
  //         _id: "7",
  //         name: "Stylish Jacket",
  //         price: 120,
  //         image: [
  //           {
  //             url: "https://picsum.photos/200/300?random=7",
  //             alt: "Stylish Jacket",
  //           },
  //         ],
  //       },
  //       {
  //         _id: "8",
  //         name: "Stylish Jacket",
  //         price: 120,
  //         image: [
  //           {
  //             url: "https://picsum.photos/200/300?random=8",
  //             alt: "Stylish Jacket",
  //           },
  //         ],
  //       },
  //     ];
  //     setProdcuts(mockProducts);
  //   }, 1000);
  // }, []);
  return (
    <div className="flex flex-col lg:flex-row">
      {/* Mobile Filter Button */}
      <button
        className="lg:hidden border p-2 flex justify-center items-center"
        onClick={handleSideBarToggle}
      >
        <FaFilter className="mr-2" />
      </button>
      {/* filter sideBar */}
      <div
        ref={sideBarRef}
        className={`${
          isSideBarOpen ? "translate-x-0" : "-translate-x-full"
        } fixed z-50 top-0 left-0 w-64 h-full bg-white overflow-y-auto transition-transform duration-300 lg:static lg:translate-x-0  inset-y-0 scrollbar-hidden `}
      >
        <FilterSideBar />
      </div>
      {/* Products Section */}
      <div className="flex-grow p-4 mb-10">
        <h2 className="text-2xl mb-4 ">All Collections</h2>
        {/* Sort Option */}
        <SortOption />
        {/* Product Grid */}
        <ProductGrid products={products} loading={loading} error={error} />
      </div>
    </div>
  );
};

export default CollectionPage;
