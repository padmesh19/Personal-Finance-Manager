import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./api/api";

export const fetchCategory = createAsyncThunk("/fetchCategory", async () => {
    const response = await api.get("/categories");
    return response.data;
});

export const addCategory = createAsyncThunk("/addCategory", async (data) => {
  const response = await api.post("/categories", data);
  return response.data;
});

export const updateCategory = createAsyncThunk(
  "/updateCategory",
  async ({ id, data }) => {
    const response = await api.put(`/categories/${id}`, data);
    return response.data;
  }
);

export const deleteCategory = createAsyncThunk("/deleteCategory", async (id) => {
  const response = await api.delete(`/categories/${id}`);
  return response.data;
});

const categorySlice = createSlice({
  name: "categories",
  initialState: {
    categories: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCategory.fulfilled, (state, action) => {
        state.isLoading = false;
          state.categories = action.payload;
      })
      .addCase(fetchCategory.rejected, (state, action) => {
        state.isLoading = false;
          state.error = action.error.message;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.categories.unshift(action.payload);
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.categories.findIndex(
          (category) => category._id === action.payload._id
        );
        if (index !== -1) state.categories[index] = action.payload;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.categories = state.categories.filter(
          (category) => category._id !== action.payload
        );
      });
  },
});

export const categoryState = (state) => state.category;

export default categorySlice.reducer;
