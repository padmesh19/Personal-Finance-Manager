import mfaEnabled from "@/pages/Auth/MfaEnabled";
import instance from "./instance";

const authServices = {
  register: async (data) => {
    return await instance.post("/auth/register", data);
  },
  login: async (data) => {
    return await instance.post("/auth/login", data);
  },
  logout: async () => {
    return await instance.get("/auth/logout");
  },
  me: async () => {
    return await instance.get("/auth/user");
  },
  verifyOtp: async (email, otp) => {
    return await instance.post("/auth/verify-otp",{email, otp});
  },
  forgotPassword: async (email) => {
    return await instance.post("/auth/forget-password", {email})
  },
  resetPassword: async (resetToken, newPassword) => {
    return await instance.post("/auth/reset-password", {resetToken, newPassword})
  },
  mfaEnabled: async (email, mfaSecret) => {
    return await instance.post("auth/mfa-enabled", {email, mfaSecret})
  }
};

export default authServices;