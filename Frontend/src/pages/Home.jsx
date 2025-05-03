import React, { useEffect, useState } from "react";
import Hero from "../components/Layout/Hero";
import GenderCollection from "../components/Products/GenderCollection";
import NewArrivals from "../components/Products/NewArrivals";
import ProductDetails from "../components/Products/ProductDetails";
import ProductGrid from "../components/Products/ProductGrid";
import FeaturedCollection from "../components/Products/FeaturedCollection";
import Features from "../components/Products/Features";
import axios from "axios";

import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../../redux/slice/productSlice";

const Home = () => {
  const dispatch = useDispatch();
  const {
    products = [],
    loading,
    error,
  } = useSelector((state) => state.products);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);

  useEffect(() => {
    // Fetch products for a specific gender/category
    dispatch(
      fetchProductsByFilters({
        gender: "Women",
        category: "Bottom Wear",
        limit: 8,
      })
    );

    // Fetch best seller product
    const fetchBestSeller = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`
        );
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error("Failed to fetch best seller:", error);
      }
    };
    fetchBestSeller();
  }, [dispatch]);

  return (
    <>
      <Hero />
      <GenderCollection />
      <NewArrivals />

      {/* Best Seller */}
      <div className="my-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Best Seller</h2>
        {bestSellerProduct && bestSellerProduct._id ? (
          <ProductDetails productId={bestSellerProduct._id} />
        ) : (
          <p className="text-center text-gray-600">
            Loading Best Seller Product...
          </p>
        )}
      </div>

      {/* Top Wear Collection */}
      <div className="container mx-auto mb-20">
        <h2 className="text-3xl text-center font-bold mb-4">
          Top Wear's For Women
        </h2>
        <ProductGrid products={products} loading={loading} error={error} />
      </div>

      <FeaturedCollection />
      <Features />
    </>
  );
};

export default Home;
