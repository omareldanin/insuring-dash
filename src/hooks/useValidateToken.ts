import { useQuery } from "@tanstack/react-query";
import { refreshTokenService } from "../services/refreshTokenService";

export const useValidateToken = () => {
  const token = localStorage.getItem("token");
  return useQuery({
    queryKey: ["validateToken"],
    queryFn: refreshTokenService,
    enabled: !!token,
    refetchOnMount: false,
    refetchOnWindowFocus: true,
    retry: false,
  });
};
