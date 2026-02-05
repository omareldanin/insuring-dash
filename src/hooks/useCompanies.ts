import { useQuery } from "@tanstack/react-query";
import {
  getCompanies,
  type Company,
  type GetCompanyParams,
  type PaginationMeta,
} from "../services/companies";

export const useCompanies = (params: GetCompanyParams) => {
  return useQuery<{
    data: Company[];
    meta: PaginationMeta;
  }>({
    queryKey: ["companies", params],
    queryFn: () => getCompanies(params),
    refetchOnWindowFocus: false,
  });
};
