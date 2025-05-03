import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../../redux/slice/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  // const CartProducts = [
  //   {
  //     productId: 1,
  //     name: "T-Shirt",
  //     size: "M",
  //     color: "Red",
  //     quantity: 1,
  //     price: 100,
  //     image: "https://picsum.photos/200?random=1",
  //   },
  //   {
  //     productId: 2,
  //     name: "Pants",
  //     size: "M",
  //     color: "Blue",
  //     quantity: 1,
  //     price: 200,
  //     image: "https://picsum.photos/200?random=1",
  //   },
  // ];
  const dispatch = useDispatch();

  // handle adding or substraction to cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, size, color) => {
    dispatch(removeFromCart({ productId, size, color, guestId, userId }));
  };

  return (
    <div>
      {cart.products.map((product) => (
        <div
          key={product.productId}
          className="flex items-center justify-between py-4 border-b border-gray-200"
        >
          {/* Image */}
          <div className="flex items-center">
            <img
              src={product.image}
              alt={product.name}
              className="w-20 h-24 mr-4 rounded"
            />
            <div>
              <h3>{product.name}</h3>
              <p>
                size:{product.size} | color : {product.color}
              </p>
              <div className="flex items-center mt-2 space-x-1">
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      -1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  -
                </button>
                <span className="mx-4">{product.quantity}</span>
                <button
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    )
                  }
                  className="border rounded px-2 py-1 text-xl font-medium"
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="text-lg font-semibold">
              {product.price.toLocaleString()} $
            </p>
            <button
              onClick={() =>
                handleRemoveFromCart(
                  product.productId,
                  product.size,
                  product.color
                )
              }
              className="text-red-500 hover:text-red-700 mt-2"
            >
              <RiDeleteBin6Line className="text-2xl" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
