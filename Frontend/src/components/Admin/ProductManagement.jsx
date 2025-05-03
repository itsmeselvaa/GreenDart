import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deleteProduct,
  fetchAdminProducts,
} from "../../../redux/slice/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProducts
  );
  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure want to delete the product?")) {
      dispatch(deleteProduct(id));
    }
  };

  if (loading) return <p>Loading..</p>;
  if (error) return <p>Error...{error}</p>;
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      <div className="overflow-x-auto shadow-md sm:rounded-lg">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                    {product.name}
                  </td>
                  <td className="p-4 font-medium">${product.price}</td>
                  <td className="p-4 font-medium">{product.sku}</td>
                  <td className="p-4 font-medium">
                    <button className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600">
                      <Link to={`/admin/products/${product._id}/edit`}>
                        Edit
                      </Link>
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 px-2 py-1 rounded  text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr colSpan={4} className="p-4 text-center text-gray-400">
                No Products Found
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
