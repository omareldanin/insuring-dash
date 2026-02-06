import { api } from "../api/api";
import type { InsuranceType } from "./plans";

export interface GetRulesParams {
  insuranceCompanyId?: string;
  planId?: string;
}

export interface Health {
  planId: number | null;
  insuranceCompanyId: number | null;
  id: number;
  from: number;
  to: number;
  gender: "male" | "femail";
  insuranceType: InsuranceType;
  price: number;
  createdAt: Date;
}

export interface Life {
  insuranceCompanyId: number | null;
  id: number;
  from: number;
  to: number;
  gender: "male" | "female";
  insuranceType: InsuranceType;
  createdAt: Date;
  planId: number | null;
  persitage: number;
}

export interface Car {
  new?: {
    range: {
      id: number;
      from: number;
      to: number;
      persitage: number;
      createdAt: Date;
      type: string;
    }[];
    groups: {
      id: number;
      persitage: number;
      createdAt: Date;
      type: string;

      groups: {
        groupName: string;
        cars: {
          makeId: number;
          modelId: number;
          year: number;
          years: number[];

          make: {
            name: string;
          };
          model: {
            name: string;
          };
        }[];
      }[];
    }[];
  };
  used?: {
    range: {
      id: number;
      from: number;
      to: number;
      persitage: number;
      createdAt: Date;
      type: string;
    }[];
    groups: {
      id: number;
      persitage: number;
      createdAt: Date;
      type: string;

      groups: {
        groupName: string;
        cars: {
          makeId: number;
          modelId: number;
          year: number;
          years: number[];
          make: {
            name: string;
          };
          model: {
            name: string;
          };
        }[];
      }[];
    }[];
  };
}

export const getRules = async (
  params?: GetRulesParams,
): Promise<{
  health: Health[];
  life: Life[];
  car: Car;
}> => {
  const res = await api.get("/rules/getRules", { params });
  return res.data;
};

export const deleteHealth = async (ids: number[]) => {
  const res = await api.post("/rules/health/delete", { ids });
  return res.data;
};

export const deleteLife = async (ids: number[]) => {
  const res = await api.post("/rules/life/delete", { ids });
  return res.data;
};

export const deleteCar = async (ids: number[]) => {
  const res = await api.post("/rules/car/delete", { ids });
  return res.data;
};

export const deleteCars = async (ids: number[]) => {
  const res = await api.post("/rules/cars/delete", { ids });
  return res.data;
};

export const upsertHealthRules = async (data: any) => {
  const res = await api.post("/rules/health", data);
  return res.data;
};

export const upsertLifeRules = async (data: any) => {
  const res = await api.post("/rules/life", data);
  return res.data;
};

export const upsertCarRules = async (data: any) => {
  const res = await api.post("/rules/car", data);
  return res.data;
};
