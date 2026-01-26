import { api } from "../api/api";

export interface SignInRequest {
  identifier: string;
  password: string;
  fcm: string;
}

export interface SignInResponse {
  message: string;
  accessToken: string;
  refreshToken: string;
}

export const signInService = async (data: SignInRequest) => {
  const response = await api.post("auth/login-admin", data, {
    method: "post",
  });
  return response.data;
};
