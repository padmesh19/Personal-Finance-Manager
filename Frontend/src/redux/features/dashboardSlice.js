import { createSlice } from "@reduxjs/toolkit";

import dashboardService from "@/services/dashboardService";

const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: {
        dashboard: null,
        isLoading: true,
    },
    reducers: {
        setDashboard: (state, action) => {
            state.dashboard = action.payload;
        },
        setIsLoading: (state, action) => {
            state.isLoading = action.payload;
        },
    },
});

export const { setDashboard, setIsLoading } = dashboardSlice.actions;

export const fetchData = () => async (dispatch) => {
    try {
        const response = await dashboardService.fetchDashboardData();
        console.log(response)
        dispatch(setDashboard(response.data));
        dispatch(setIsLoading(false));
        return true;
    } catch {
        dispatch(setIsLoading(false));
        return false;
    }
};

export const dashboardState = (state) => state.dashboard;

export default dashboardSlice.reducer;
