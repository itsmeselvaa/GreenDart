import React, { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../../redux/slice/orderSlice";
const MyOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };
  if (loading) return <p>Loading..</p>;
  if (error) return <p>Error {error}</p>;
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm-text-2xl font-bold mb-6">My Orders</h2>
      <div className="relative shadow-md sm:rounded-lg overflow-hidded">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th scope="col" className="px-4 py-2 sm:py-3">
                Image
              </th>
              <th scope="col" className="px-4 py-2 sm:py-3">
                OrderID
              </th>
              <th scope="col" className="px-4 py-2 sm:py-3">
                Created
              </th>
              <th scope="col" className="px-4 py-2 sm:py-3">
                Shipping Address
              </th>
              <th scope="col" className="px-4 py-2 sm:py-3">
                Items
              </th>
              <th scope="col" className="px-4 py-2 sm:py-3">
                Price
              </th>
              <th scope="col" className="px-4 py-2 sm:py-3">
                status
              </th>
            </tr>
          </thead>
          <tbody>
            {orders?.length > 0 ? (
              orders?.map((order) => (
                <tr
                  key={order?._id}
                  className="border-b hover:border-gray-50 cursor-pointer"
                  onClick={() => handleRowClick(order._id)}
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      src={order?.orderItems[0].image}
                      alt={order?.orderItems[0].name}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 font-medium text-gray-800">
                    #{order?._id}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 ">
                    {new Date(order?.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })}
                    {""}{" "}
                    {new Date(order?.createdAt).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 ">
                    {order?.shippingAddress?.address
                      ? `${order?.shippingAddress.address},
                    ${order?.shippingAddress.city}, ${order?.shippingAddress.country}
                    ${order?.shippingAddress.postalCode}`
                      : "N/A"}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 text-center ">
                    {order?.orderItems.length}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 ">
                    ${order?.totalPrice}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4 ">
                    {order.isPaid ? (
                      <span className="text-green-700 bg-green-100  px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                        Paid
                      </span>
                    ) : (
                      <span className="text-red-500  bg-red-100 px-2 py-1 rounded-full text-xs sm:text-sm font-medium">
                        Pending
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="py-4 px-4 text-center">
                  You have no orders yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrderPage;
