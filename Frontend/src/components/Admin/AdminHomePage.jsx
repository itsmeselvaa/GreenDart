import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminProducts } from "../../../redux/slice/adminProductSlice";
import { fetchAllOrders } from "../../../redux/slice/adminOrderSlice";

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts);
  const {
    orders,
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: orderError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      {productsLoading || ordersLoading ? (
        <p>Loading..</p>
      ) : productsError ? (
        <p>Product Fetching Error:{productsError}</p>
      ) : orderError ? (
        <p>Order Fetching Error:{orderError}</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
            <div className="p-4 shadow-md rounded-lg text-center  space-y-3">
              <h2 className="text-xl font-semibold">Revenue</h2>
              <p className="text-2xl">${totalSales}</p>
            </div>
            <div className="p-4 shadow-md rounded-lg text-center space-y-3 md:block">
              <h2 className="text-xl font-semibold">Total Orders</h2>
              <p className="text-2xl">{totalOrders}</p>
              <Link
                to="/admin/orders"
                className="text-blue-500 hover:underline"
              >
                Manage Orders
              </Link>
            </div>
            <div className="p-4 shadow-md rounded-lg text-center space-y-3">
              <h2 className="text-xl font-semibold">Total Products</h2>
              <p className="text-2xl">{products.length}</p>
              <Link
                to="/admin/products"
                className="text-blue-500 hover:underline"
              >
                Manage Products
              </Link>
            </div>
          </div>
        </>
      )}
      <div className="mt-6">
        <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-gray-500">
            <thead className="bg-gray-100 text-xs uppercase text-gray-700">
              <tr className="text-center">
                <th className="py-3 px-4">Order ID</th>
                <th className="py-3 px-4">User</th>
                <th className="py-3 px-4">Total Price</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders?.length > 0 ? (
                orders?.map((order, index) => (
                  <tr
                    key={`${order.id}${index}`}
                    className="border-b hover:bg-gray-50 cursor-pointer text-center"
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order.user?.name}</td>
                    <td className="p-4">{order.totalPrice}</td>
                    <td className="p-4">{order.paymentStatus}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No recent orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminHomePage;
