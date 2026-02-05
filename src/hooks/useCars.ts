import { useQuery } from "@tanstack/react-query";
import {
  getCars,
  getMakes,
  getModels,
  type GetCarsParams,
} from "../services/cars";

export const useCars = (filters: GetCarsParams) => {
  return useQuery({
    queryKey: ["cars", filters],
    queryFn: () => getCars(filters),
  });
};

export const useMakes = () => {
  return useQuery({
    queryKey: ["makes"],
    queryFn: () => getMakes(),
  });
};

export const useModels = (makeId: number | null) => {
  return useQuery({
    queryKey: ["models", makeId],
    queryFn: () => getModels(makeId),
    enabled: !!makeId,
  });
};
