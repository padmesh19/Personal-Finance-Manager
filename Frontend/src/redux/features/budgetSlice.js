import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./api/api";

export const fetchBudget = createAsyncThunk("/fetchBudget", async () => {
  const response = await api.get("/budgets");
  return response.data;
});

export const addBudget = createAsyncThunk("/addBudget", async (data) => {
  const response = await api.post("/budgets", data);
  return response.data;
});

export const updateBudget = createAsyncThunk(
  "/updateBudget",
  async ({ id, data }) => {
    const response = await api.put(`/budgets/${id}`, data);
    return response.data;
  }
);

export const deleteBudget = createAsyncThunk("/deleteBudget", async (id) => {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
});

const budgetSlice = createSlice({
  name: "budgets",
  initialState: {
    budgets: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBudget.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchBudget.fulfilled, (state, action) => {
        state.isLoading = false;
        state.budgets = action.payload;
      })
      .addCase(fetchBudget.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addBudget.fulfilled, (state, action) => {
        state.budgets.unshift(action.payload);
      })
      .addCase(updateBudget.fulfilled, (state, action) => {
        const index = state.budgets.findIndex(
          (budget) => budget._id === action.payload._id
        );
        if (index !== -1) state.budgets[index] = action.payload;
      })
      .addCase(deleteBudget.fulfilled, (state, action) => {
        state.budgets = state.budgets.filter(
          (budget) => budget._id !== action.payload
        );
      });
  },
});

export default budgetSlice.reducer;
