import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Fetch products from the API
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ category, limit, skip, search }) => {
    let url = `https://dummyjson.com/products`;

    if (search) {
      url = `https://dummyjson.com/products/search`;
    } else if (category) {
      url += `/category/${category}`;
    }

    const params = new URLSearchParams();

    if (search) {
      params.append('q', search); 
    }

    params.append('limit', limit);
    params.append('skip', skip);

    const finalUrl = `${url}?${params.toString()}`;
    const response = await axios.get(finalUrl);
    return { products: response.data.products, total: response.data.total }; // Return total products
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    totalProducts: 0, // Add totalProducts to the state
    status: 'idle',
  },
  reducers: {
    clearProducts: (state) => {
      state.items = []; 
      state.totalProducts = 0; // Reset total products when clearing
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = [...state.items, ...action.payload.products]; // Update items
        state.totalProducts = action.payload.total; // Update total products
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = 'failed';
      });
  },
});

export const { clearProducts } = productSlice.actions;
export default productSlice.reducer;
