import { api } from "../api/api";

export type Role = "ADMIN" | "CLIENT" | "PARTNER";

export interface User {
  id: number;
  phone: string;
  name: string;
  email: string;
  gender: "male" | "female";
  avatar: string;
  role: Role;
  deleted: boolean;
  active: boolean;
  deletedAt: Date;
  birthDate: Date;
  createdAt: Date;
}

export interface UsersResponse {
  count: number;
  page: number;
  totalPages: number;
  results: User[];
}

export interface UserResponse {
  id: number;
  phone: string;
  name: string;
  email: string;
  gender: "male" | "female";
  avatar: string;
  role: Role;
  deleted: boolean;
  active: boolean;
  deletedAt: Date;
  birthDate: Date;
  createdAt: Date;
}

export interface GetUsersParams {
  page?: number;
  size?: number;
  role?: string; // ADMIN | VENDOR | DELIVERY
  name?: string;
  phone?: string;
  vendorId?: string;
}

export interface OptionType {
  value: string;
  label: string;
}
export const usersOptions: OptionType[] = [
  {
    value: "ADMIN",
    label: "مشرف",
  },
  {
    value: "CLIENT",
    label: "عميل",
  },
  {
    value: "PARTNER",
    label: "شريك نجاح",
  },
];

export const getUsers = async (
  params: GetUsersParams,
): Promise<UsersResponse> => {
  const response = await api.get("/users/getAll", { params });
  return response.data;
};

export const getUser = async (id: number): Promise<UserResponse> => {
  const response = await api.get("/users/" + id);
  return response.data;
};

export const getProfile = async (): Promise<UserResponse> => {
  const response = await api.get("/users/get-profile");
  return response.data;
};

export const deleteUser = async (id: number | undefined) => {
  const respone = await api.delete("users/delete/" + id);
  return respone.data;
};

export const updateUser = async (data: FormData, id: number) => {
  const respone = await api.patch<FormData>("users/" + id, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return respone.data;
};

export const updateProfile = async (data: FormData) => {
  const respone = await api.patch<FormData>("users/update-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return respone.data;
};

export const createUser = async (data: FormData) => {
  const respone = await api.post<FormData>("users/create-user", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return respone.data;
};
