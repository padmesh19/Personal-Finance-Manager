import instance from "./instance";

const dashboardService = {
    fetchDashboardData: async () => {
        return await instance.get("/dashboard");
    },
};

export default dashboardService;