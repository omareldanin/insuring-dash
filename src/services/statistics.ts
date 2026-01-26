// services/dashboardService.ts
import { api } from "../api/api";

export interface DashboardResponse {
  totalOrders: number;
  vendorCount: number;
  activeDeliveries: number;
  totalPaid: number;
  shipping: number;
  monthlySales: Record<
    string,
    {
      total: number;
      shipping: number;
    }
  >;
  statusCounts: Record<string, number>;
}

export const getDashboardStats = async (
  vendorId?: string
): Promise<DashboardResponse> => {
  const { data } = await api.get<DashboardResponse>("orders/statistics", {
    params: {
      vendorId: vendorId || undefined,
    },
  });
  return data;
};
