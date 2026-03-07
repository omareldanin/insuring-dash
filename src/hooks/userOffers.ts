import { useQuery } from "@tanstack/react-query";
import type { GetCarsParams } from "../services/cars";
import { getOffers } from "../services/offers";

export const useOffers = (filters: GetCarsParams) => {
  return useQuery({
    queryKey: ["offers", filters],
    queryFn: () => getOffers(filters),
  });
};
