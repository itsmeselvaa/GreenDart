import React, { useEffect } from "react";
import { useState } from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../../redux/slice/cartSlice";

const CartDrawer = ({ drawerOpen, toggleCartDrawer }) => {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const totalValue = cart?.products.reduce(
    (total, product) => total + product.price,
    0
  );
  const userId = user ? user._id : null;

  useEffect(() => {
    dispatch(fetchCart({ userId, guestId }));
  }, [user, dispatch, guestId]);

  const handleCheckout = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div
      className={`flex flex-col fixed top-0 right-0 w-3/4 h-full sm:w-[25rem] md:w-[30rem] ${
        drawerOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 bg-white shadow-lg z-50`}
    >
      <div className="flex justify-end p-4 ">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className=" h-6 w-6 text-gray-600" />
        </button>
      </div>
      {/* Content */}
      <div className=" flex-grow overflow-y-auto p-4">
        <h2 className="text-XL font-semibold ">Your Cart</h2>
        {cart && cart.products.length > 0 ? (
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p>Your cart is empty </p>
        )}
      </div>
      <div className="p-3 text-left flex gap-4 items-center">
        <p className="font-bold text-xl">Total</p>
        <p className="text-md">${totalValue.toFixed(2)}</p>
      </div>
      <div className="sticky bottom bg-white p-4 ">
        {cart && cart.products.length > 0 ? (
          <>
            {" "}
            <button
              onClick={handleCheckout}
              className="bg-black text-white w-full rounded-lg hover:bg-gray-800 py-2 px-4 font-semibold transition"
            >
              Checkout
            </button>
            <p className="text-sm  tracking-tighter text-center mt-2 text-gray-500">
              Shipping, taxes, and discount codes calculated at checkout
            </p>
          </>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
