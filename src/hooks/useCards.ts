import { useQuery } from "@tanstack/react-query";
import { getCards, type GetCardsParams } from "../services/card";

export const useCards = (filters: GetCardsParams) => {
  return useQuery({
    queryKey: ["cards", filters],
    queryFn: () => getCards(filters),
    refetchOnWindowFocus: true,
  });
};
