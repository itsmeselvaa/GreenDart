import React, { useEffect } from "react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { registerUser } from "../../redux/slice/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { mergeCart } from "../../redux/slice/cartSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user, guestId, loading } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  // Get redirect parameter and check if its checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  const ischeckoutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if (user) {
      if (cart?.products.length > 0 && guestId) {
        dispatch(mergeCart({ guestId, user })).then(() => {
          navigate(ischeckoutRedirect ? "/checkout" : "/");
        });
      } else {
        navigate(ischeckoutRedirect ? "/checkout" : "/");
      }
    }
  }, [user, guestId, cart, navigate, ischeckoutRedirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    const userData = { name, email, password };
    dispatch(registerUser(userData));
    console.log("Form submitted:", { name, email, password });
  };
  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center mb-6 ">
            <h2 className="text-xl font-medium ">GreenDart</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Hey there!</h2>
          <p className="text-center mb-6">
            Create GreentDart Account to get started
          </p>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-sm font-semibold mb-2"
            >
              Username
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              className="w-full p-2 border rounded "
              placeholder="Enter your Username"
              required
              id="username"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-semibold mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              className="w-full p-2 border rounded "
              placeholder="Enter your email"
              required
              id="email"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-semibold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              className="w-full p-2 border rounded "
              placeholder="Enter your password"
              required
              id="password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-800"
          >
            {loading ? "loading" : "Sign Up"}
          </button>
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirect)}`}
              className="text-blue-500 "
            >
              Sign In
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-[700px] flex flex-col justify-center items-center">
          <img
            src={assets.register}
            alt="Login"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default Register;
