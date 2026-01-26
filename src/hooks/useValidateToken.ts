import { useQuery } from "@tanstack/react-query";
import { refreshTokenService } from "../services/refreshTokenService";

export const useValidateToken = () => {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["validateToken"],
    queryFn: refreshTokenService,
    enabled: !!token,
    staleTime: 1000 * 60, // 1 minute
    retry: false,
  });
};
