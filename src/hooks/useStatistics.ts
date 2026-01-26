// hooks/useDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { getDashboardStats } from "../services/statistics";

export const useDashboard = (vendorId?: string) => {
  return useQuery({
    queryKey: ["dashboardStats", vendorId],
    queryFn: () => getDashboardStats(vendorId),
    refetchOnWindowFocus: false,
  });
};
