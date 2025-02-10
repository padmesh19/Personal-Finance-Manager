import authServices from "@/services/authServices";
import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    isLoading: true,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setIsLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, clearUser, setIsLoading } = userSlice.actions;

export const authLoader = () => async (dispatch) => {
  try {
    const response = await authServices.me();
    dispatch(setUser(response.data));
    dispatch(setIsLoading(false));
    return true;
  } catch (error) {
    dispatch(setIsLoading(false));
    return false;
  }
};

export const userState = (state) => state.user;

export default userSlice.reducer;
