import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "./api/api";
import moment from "moment";

export const fetchGoal = createAsyncThunk("/fetchGoal", async () => {
  const response = await api.get("/goals");
  return response.data;
});

export const addGoal = createAsyncThunk("/addGoal", async (data) => {
  const response = await api.post("/goals", data);
  return response.data;
});

export const updateGoal = createAsyncThunk(
  "/updateGoal",
  async ({ id, data }) => {
    const response = await api.put(`/goals/${id}`, data);
    return response.data;
  }
);

export const deleteGoal = createAsyncThunk("/deleteGoal", async (id) => {
  const response = await api.delete(`/goals/${id}`);
  return response.data;
});

const goalSlice = createSlice({
  name: "goals",
  initialState: {
    goals: [],
    isLoading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoal.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchGoal.fulfilled, (state, action) => {
        state.isLoading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoal.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(addGoal.fulfilled, (state, action) => {
        const { deadline } = action.payload;
        const deadline_date = moment(deadline).format("YYYY-MM-DD");
        const goal = { ...action.payload, deadline: deadline_date };
        console.log(goal)
        state.goals.unshift(goal);
      })
      .addCase(updateGoal.fulfilled, (state, action) => {
        const index = state.goals.findIndex(
          (goal) => goal._id === action.payload._id
        );
        const { deadline } = action.payload;
        const deadline_date = moment(deadline).format("YYYY-MM-DD");
        const goal = { ...action.payload, deadline: deadline_date };
        if (index !== -1) state.goals[index] = goal;
      })
      .addCase(deleteGoal.fulfilled, (state, action) => {
        state.goals = state.goals.filter((goal) => goal._id !== action.payload);
      });
  },
});

export const goalState = (state) => state.goal;

export default goalSlice.reducer;
