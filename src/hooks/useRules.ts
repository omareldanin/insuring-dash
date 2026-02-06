import { useQuery } from "@tanstack/react-query";
import {
  getRules,
  type Car,
  type GetRulesParams,
  type Health,
  type Life,
} from "../services/rules";

export const useRules = (params?: GetRulesParams) => {
  return useQuery<{
    health: Health[];
    life: Life[];
    car: Car;
  }>({
    queryKey: ["rules", params],
    queryFn: () => getRules(params),
    refetchOnWindowFocus: false,
    enabled: !!params?.planId,
  });
};
