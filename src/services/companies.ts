import { api } from "../api/api";

export interface OptionType {
  value: string;
  label: string;
}
export const companyOptions: OptionType[] = [
  {
    value: "SOLIDARITY",
    label: "تكافلي",
  },
  {
    value: "COMMERCIAL",
    label: "تجاري",
  },
];

export interface GetCompanyParams {
  search?: string;
  insuranceType?: string;
  companyType?: string;
  page?: number;
  size?: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  pages: number;
}
export interface Company {
  id: number;
  createdAt: Date;
  name: string;
  email: string;
  ruleType: string;
  companyType: "SOLIDARITY" | "COMMERCIAL";
  insuranceTypes: string[];
}

export const getCompanies = async (
  params: GetCompanyParams,
): Promise<{
  data: Company[];
  meta: PaginationMeta;
}> => {
  const res = await api.get("/insurance-companies/getAll", { params });
  return res.data;
};

export const deleteCompany = async (id: number | undefined) => {
  const respone = await api.delete("/insurance-companies/" + id);
  return respone.data;
};

export const createCompany = (data: any) => {
  return api.post("/insurance-companies/create", data);
};

export const getCompanyById = async (id: number) => {
  const res = await api.get(`/insurance-companies/${id}`);
  return res.data;
};

export const updateCompany = (id: number, data: any) => {
  return api.patch(`/insurance-companies/${id}`, data);
};
