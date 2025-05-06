import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async Thunk: Fetch Products by Filters
export const fetchProductsByFilters = createAsyncThunk(
  "products/fetch",
  async ({
    collection,
    sizes,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
  }) => {
    const query = new URLSearchParams();
    if (collection) query.append("collection", collection);
    if (sizes) query.append("sizes", sizes);
    if (color) query.append("color", color);
    if (gender) query.append("gender", gender);
    if (minPrice) query.append("minPrice", minPrice);
    if (maxPrice) query.append("maxPrice", maxPrice);
    if (sortBy) query.append("sortBy", sortBy);
    if (search) query.append("search", search);
    if (category) query.append("category", category);
    if (material) query.append("material", material);
    if (brand) query.append("brand", brand);
    if (limit) query.append("limit", limit);

    const response = await axios.get(
      `${
        import.meta.env.VITE_BACKEND_URL
      }/api/products?${query.toString()}&page=1&size=20`
    );
    return response.data.products;
  }
);

// Async Thunk: Fetch Single Product by ID
export const fetchProductDetails = createAsyncThunk(
  "products/fetchProductDetails",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
    );
    return response.data;
  }
);

// Async Thunk: Update Product by ID
export const fetchUpdateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }) => {
    const response = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`,
      productData,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      }
    );
    return response.data;
  }
);

// Async Thunk: Fetch Similar Products
export const fetchSimilarProduct = createAsyncThunk(
  "products/fetchSimilar",
  async (id) => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
    );
    return response.data;
  }
);

// Initial State
const initialState = {
  products: [],
  selectedProduct: null,
  similarProducts: [],
  loading: false,
  error: null,
  filters: {
    category: "",
    sizes: "",
    color: "",
    gender: "",
    brand: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
    material: "",
    collection: "",
  },
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilter: (state) => {
      state.filters = {
        category: "",
        sizes: "",
        color: "",
        gender: "",
        brand: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        material: "",
        collection: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products by Filter
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        state.products = Array.isArray(action.payload) ? action.payload : [];
        state.error = null;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Single Product
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Update Product
      .addCase(fetchUpdateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUpdateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (product) => product._id === updatedProduct._id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
        state.error = null;
      })
      .addCase(fetchUpdateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // Fetch Similar Products
      .addCase(fetchSimilarProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = Array.isArray(action.payload)
          ? action.payload
          : [];
        state.error = null;
      })
      .addCase(fetchSimilarProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setFilters, clearFilter } = productsSlice.actions;
export default productsSlice.reducer;
