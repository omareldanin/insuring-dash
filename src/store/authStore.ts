import { create } from "zustand";
import { persist } from "zustand/middleware";
import { jwtDecode } from "jwt-decode";
import { queryClient } from "../main";
import type { SignInResponse } from "../services/auth";

interface IAuthStore {
  setAuth: (data: SignInResponse) => void;
  logout: () => void;
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role: string;
  token: string;
  superAdmin: boolean;
  refreshToken: string;
}

interface TokenPayload {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role: string;
  superAdmin: boolean;
}

export const authStore = create<IAuthStore>()(
  persist(
    (set) => ({
      token: "",
      refreshToken: "",
      id: "",
      name: "",
      role: "",
      avatar: "",
      phone: "",
      superAdmin: false,
      setAuth: (data: SignInResponse) => {
        const decodedToken = jwtDecode<TokenPayload>(data.accessToken);
        set({
          token: data.accessToken,
          id: decodedToken.id,
          name: decodedToken.name,
          refreshToken: data.refreshToken,
          phone: decodedToken.phone,
          role: decodedToken.role,
          superAdmin: decodedToken.superAdmin,
          avatar: decodedToken.avatar,
        });
        localStorage.setItem("token", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      },
      logout: () => {
        set({
          token: "",
          refreshToken: "",
          id: "",
          name: "",
          phone: "",
          role: "",
          superAdmin: false,
          avatar: "",
        });
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        queryClient.clear();
      },
    }),
    {
      name: "auth-storage",
    },
  ),
);

export const useAuth = () => authStore((state) => state);
