import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./api/api";
import moment from "moment";

export const fetchTransaction = createAsyncThunk(
  "/fetchTransaction",
  async (filters) => {
    let url = "/transactions?";
    if (filters) {
      const { start_date, end_date, transaction_type, category_id } = filters;
      if (start_date) url += `start_date=${start_date}&`;
      if (end_date) url += `end_date=${end_date}&`;
      if (transaction_type) url += `transaction_type=${transaction_type}&`;
      if (category_id) url += `category_id=${category_id}&`;
    }
    url = url.slice(0, -1);
    const response = await api.get(url);
    return response.data;
  }
);

export const exportTransactions = createAsyncThunk(
  "/exportTransactions",
  async (filters) => {
    try {
      let url = "/transactions/download?";
      if (filters) {
        const { start_date, end_date, transaction_type, category_id } = filters;
        if (start_date) url += `start_date=${start_date}&`;
        if (end_date) url += `end_date=${end_date}&`;
        if (transaction_type) url += `transaction_type=${transaction_type}&`;
        if (category_id) url += `category_id=${category_id}&`;
      }
      url = url.slice(0, -1);

      const response = await api.get(url, { responseType: 'blob' });

      const blob = new Blob([response.data], {
        type: 'application/pdf',
      });

      const file_url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = file_url;
      a.download = 'transactions.pdf';
      document.body.appendChild(a);
      a.click();

      window.URL.revokeObjectURL(file_url);


      return true;
    } catch (error) {
      console.log(error)
    }
  }
);

export const addTransaction = createAsyncThunk(
  "/addTransaction",
  async (data) => {
    const response = await api.post("/transactions", data);
    return response.data;
  }
);

export const updateTransaction = createAsyncThunk(
  "/updateTransaction",
  async ({ id, data }) => {
    const response = await api.put(`/transactions/${id}`, data);
    return response.data;
  }
);

export const deleteTransaction = createAsyncThunk(
  "/deleteTransaction",
  async (id) => {
    const response = await api.delete(`/transactions/${id}`);
    return response.data;
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    transactions: [],
    isLoading: false,
    isExport: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransaction.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchTransaction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransaction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(exportTransactions.pending, (state) => {
        state.isExport = true
      })
      .addCase(exportTransactions.fulfilled, (state) => {
        state.isExport = false
      })
      .addCase(exportTransactions.rejected, (state, action) => {
        state.error = action.error.message;
        state.isExport = false
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        const { date } = action.payload;
        const transaction_date = moment(date).format("YYYY-MM-DD");
        const transaction = { ...action.payload, date: transaction_date };
        state.transactions.unshift(transaction);
      })
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const index = state.transactions.findIndex(
          (transaction) => transaction._id === action.payload._id
        );
        if (index !== -1) state.transactions[index] = action.payload;
      })
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.transactions = state.transactions.filter(
          (transaction) => transaction._id !== action.payload
        );
      });
  },
});

export const transactionState = (state) => state.transaction;

export default transactionSlice.reducer;
