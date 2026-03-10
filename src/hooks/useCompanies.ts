import { useQuery } from "@tanstack/react-query";
import {
  getCompanies,
  getStatiscs,
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

export const useStatistics = () => {
  return useQuery<{
    totalUsers: number;
    totalPartners: number;
    totalCompanies: number;
    totalDocuments: number;
    totalConfirmed: number;
    totalNotConfirmed: number;
    companiesChart: {
      companyId: number;
      companyName: string;
      documents: number;
    }[];
  }>({
    queryKey: ["statistics"],
    queryFn: () => getStatiscs(),
    refetchOnWindowFocus: false,
  });
};
