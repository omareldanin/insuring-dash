import { useQuery } from "@tanstack/react-query";
import {
  getPlans,
  type InsuranceType,
  type PlansResponse,
} from "../services/plans";

export const usePlans = (params?: { type: InsuranceType }) => {
  return useQuery<PlansResponse>({
    queryKey: ["plans", params],
    queryFn: () => getPlans(params),
    refetchOnWindowFocus: false,
  });
};

import { getPlanById } from "../services/plans";

export const usePlan = (id?: number) => {
  return useQuery({
    queryKey: ["plan", id],
    queryFn: () => getPlanById(id as number),
    enabled: !!id,
  });
};
