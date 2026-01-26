import toast from "react-hot-toast";
import { api } from "../api/api";
import { authStore } from "../store/authStore";

export const refreshTokenService = async () => {
  try {
    const { data } = await api.post("auth/validate-token");
    return data;
  } catch (e) {
    authStore.getState().logout();
    toast.error("لقد انتهت صلاحية الجلسة الرجاء تسجيل الدخول مرة أخرى");
    throw e;
  }
};
