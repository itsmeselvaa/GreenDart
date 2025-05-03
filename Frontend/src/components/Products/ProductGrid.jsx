import React from "react";
import { Link } from "react-router-dom";

const ProductGrid = ({ products, loading, error }) => {
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error getting Product...{error}</p>;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product._id}
          to={`/products/${product._id}`}
          className="block"
        >
          <div className="bg-white  rounded-lg p-4  transition-transform hover:scale-[102%] duration-500 my-5">
            <div className="w-full h-90 ">
              <img
                src={product.images[0].url}
                alt={product.images[0].alt || product.name}
                className="w-full h-full object-cover rounded-lg "
              />
              <div className="px-2 mt-2">
                <h3 className="text-sm mb-2 ">{product.name}</h3>
                <p className="text-gray-500 font-medium text-sm tracking-tighter">
                  ${product.price}
                </p>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProductGrid;
