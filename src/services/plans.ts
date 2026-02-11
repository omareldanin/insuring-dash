import { api } from "../api/api";

export type InsuranceType = "CAR" | "HEALTH" | "LIFE";

export interface Plan {
  id: number;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  hint: string;
  description: string[];
  recommend: boolean;
  forHealthGroups: boolean;
  insuranceType: InsuranceType;
}

export interface PlansResponse {
  results: Plan[];
}

export const getPlans = async (params?: {
  type: InsuranceType;
}): Promise<PlansResponse> => {
  const response = await api.get("/insurance-plans/getAll", { params });
  return response.data;
};

export const deletePlan = async (id: number | undefined) => {
  const respone = await api.delete("/insurance-plans/" + id);
  return respone.data;
};

export const createPlan = (data: {
  name: string;
  arName: string;
  hint: string;
  arHint: string;
  recommend: boolean;
  forHealthGroups: boolean;
  insuranceType: string;
  description?: string[];
  arDescription?: string[];
}) => {
  return api.post("/insurance-plans/create", data);
};

export const getPlanById = (id: number) => {
  return api.get(`/insurance-plans/${id}`);
};

export const updatePlan = (
  id: number,
  data: {
    name: string;
    arName: string;
    hint: string;
    arHint: string;
    recommend: boolean;
    insuranceType: string;
    description?: string[];
    arDescription?: string[];
  },
) => {
  return api.patch(`/insurance-plans/${id}`, data);
};
