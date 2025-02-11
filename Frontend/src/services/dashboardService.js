import instance from "./instance";

const dashboardService = {
    fetchDashboardData: async (currentMonth, currentYear) => {
        return await instance.get(
            `/dashboard?month=${currentMonth}&year=${currentYear}`
        )
    },
}

export default dashboardService;