import { useQuery } from "@tanstack/react-query";
import {
  getProfile,
  getUser,
  getUsers,
  type GetUsersParams,
  type UserResponse,
  type UsersResponse,
} from "../services/users";

export const useUsers = (params: GetUsersParams) => {
  return useQuery<UsersResponse>({
    queryKey: ["users", params],
    queryFn: () => getUsers(params),
    refetchOnWindowFocus: false,
    refetchInterval: 10000,
  });
};

export const useUsersForMap = (params: GetUsersParams) => {
  return useQuery<UsersResponse>({
    queryKey: ["users-map", params],
    queryFn: () => getUsers(params),
    refetchOnWindowFocus: true,
    refetchInterval: 10000,
  });
};

export const useUser = (id: number) => {
  return useQuery<UserResponse>({
    queryKey: ["user", id],
    queryFn: () => getUser(id),
    refetchOnWindowFocus: false,
  });
};

export const useGetProfile = () => {
  return useQuery<UserResponse>({
    queryKey: ["user"],
    queryFn: () => getProfile(),
    refetchOnWindowFocus: false,
  });
};
