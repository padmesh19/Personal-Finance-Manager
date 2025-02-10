import instance from "./instance";

const userServices = {
  getProfile: async () => {
    return await instance.get("/users/profile");
  },
  updateProfile: async (data) => {
    return await instance.put(`/users/profile`, data);
  },
  deleteProfile: async () => {
    return await instance.delete(`/users/profile`);
  },
};

export default userServices;
