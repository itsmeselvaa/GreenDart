import React, { useEffect } from "react";
import { useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProduct,
} from "../../../redux/slice/productSlice";
import { addToCart } from "../../../redux/slice/cartSlice";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

// const selectedProduct = {
//   name: "Stylish Jacket",
//   price: 120,
//   originalPrice: 150,
//   description: "A stylish jacket for all occasions.",
//   brand: "Fashion Brand",
//   material: "Leather",
//   size: ["S", "M", "L", "XL"],
//   color: ["Red", "Blue", "Green"],
//   images: [
//     {
//       url: "https://picsum.photos/200/300?random=1",
//       alt: "Stylish Jacket",
//     },
//     {
//       url: "https://picsum.photos/200/300?random=2",
//       alt: "Stylish Jacket",
//     },
//   ],
// };

// const similarProducts = [
//   {
//     _id: "1",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=1",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
//   {
//     _id: "2",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=2",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
//   {
//     _id: "3",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=3",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
//   {
//     _id: "4",
//     name: "Stylish Jacket",
//     price: 120,
//     image: [
//       {
//         url: "https://picsum.photos/200/300?random=4",
//         alt: "Stylish Jacket",
//       },
//     ],
//   },
// ];
const ProductDetails = ({ productId }) => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedProduct, loading, error, similarProducts } = useSelector(
    (state) => state.products
  );
  const [mainImage, setMainImage] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { user, guestId } = useSelector((state) => state.auth);

  const productFetchId = productId ? productId : id;

  const location = useLocation();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [location.pathname]);

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProduct(productFetchId));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProduct?.images?.length > 0) {
      setMainImage(selectedProduct.images[0].url);
    }
  }, [selectedProduct]);

  const handleQuantityChange = (action) => {
    if (action === "plus") {
      setQuantity((prev) => prev + 1);
    }
    if (action === "minus" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      toast.error("Please select size and color before adding to cart.", {
        duration: 1000,
      });
      return;
    }
    setIsButtonDisabled(true);
    console.log({
      productFetchId,
      quantity,
      size: selectedSize,
      color: selectedColor,
      guestId,
      userId: user?._id,
    });
    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        size: selectedSize,
        color: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product Added to the Cart", {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsButtonDisabled(false);
      });
  };
  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>Error...{error}</p>;
  }
  return (
    <div className="p-6">
      {selectedProduct && (
        <div className="max-w-5xl mx-auto bg-white p-8 ">
          <div className="flex flex-col md:flex-row">
            {/* Left thumbnail */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProduct.images.map((image, index) => (
                <img
                  key={index + 1}
                  src={image.url}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  onClick={() => setMainImage(image.url)}
                  className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
                />
              ))}
            </div>
            {/* Main image */}
            <div className="md:w-1/2">
              <div className="mb-4">
                <img
                  src={mainImage ? mainImage : selectedProduct.images[0].url}
                  alt="Main Product"
                  className="w-full h-auto object-cover rounded-lg"
                />
              </div>
              {/* Mobile Thumbnail */}
              <div className="md:hidden flex overflow-x-scroll scrollbar-hidden space-x-4 mb-4 ">
                {selectedProduct.images.map((image, index) => (
                  <img
                    key={index + 1}
                    src={image.url}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    className="w-20 h-20 object-cover rounded-lg cursor-pointer border"
                  />
                ))}
              </div>
            </div>
            {/* Product Details */}
            <div className="md:w-1/2 md:ml-10 text-left">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProduct.name}
              </h1>
              <p className="text-lg text-gray-600 mb-1 line-through">
                {selectedProduct.originalPrice &&
                  `$${selectedProduct.originalPrice}`}
              </p>
              <p className="text-xl text-gray-500 mb-2">
                ${selectedProduct.price && `${selectedProduct.price}`}
              </p>
              <p className="text-gray-600 mb-4">
                {selectedProduct.description}
              </p>
              <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-8 h-8 rounded-full border  ${
                        selectedColor === color
                          ? "border-3 border-black "
                          : "border-gray-300"
                      }`}
                      style={{
                        backgroundColor: color.toLowerCase(),
                        filter: "brightness(0.5)",
                      }}
                    ></button>
                  ))}
                </div>
              </div>
              {/* Size */}
              <div className="mb-4">
                <p className="text-gray-700">Size:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      onClick={() => setSelectedSize(size)}
                      key={size}
                      className={`px-4 py-2  rounded border ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "hover:bg-gray-200  border-gray-300 "
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
              {/* Quantity */}
              <div className="mb-6 ">
                <p className="text-gray-700 mb-2">Quantity:</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => handleQuantityChange("minus")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    -
                  </button>
                  <span className="text-lg">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange("plus")}
                    className="px-2 py-1 bg-gray-200 rounded text-lg"
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className={`bg-black text-white py-2 px-6 rounded w-full mb-4 ${
                  isButtonDisabled
                    ? "cursor-not-allowed opacity-50"
                    : "hover:bg-gray-800"
                }`}
                disabled={isButtonDisabled}
              >
                {isButtonDisabled ? "Adding..." : "Add to Cart"}
              </button>
              <div className="mt-10 text-gray-700 ">
                <h3 className="text-xl font-bold mb-4 ">Charateristics:</h3>
                <table className="w-full text-left text-sm text-gray-600">
                  <tbody>
                    <tr className="">
                      <td className="py-2 font-semibold">Brand:</td>
                      <td className="py-2">{selectedProduct.brand}</td>
                    </tr>
                    <tr className="">
                      <td className="py-2 font-semibold">Material:</td>
                      <td className="py-2">{selectedProduct.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="mt-20">
            <h2 className="text-2xl text-center font-medium mb-4">
              You May Also Like
            </h2>
            <ProductGrid
              products={similarProducts}
              loading={loading}
              error={error}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
