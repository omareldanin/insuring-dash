import { api } from "../api/api";
import type { InsuranceType } from "./plans";

export interface Document {
  id: number;
  insuranceType: InsuranceType;
  startDate?: Date;
  endDate?: Date;
  confirmed: boolean;
  paid: boolean;
  paidKey?: string;
  documentNumber?: string;
  createdAt: Date;
  user: {
    id: number;
    name: string;
    phone: string;
  };
  company: {
    id: number;
    name: string;
    email: string;
    logo?: string;
    link?: string;
  };
  plan: {
    id: number;
    name: string;
    arName: string;
  };
  carInfo: {
    persitage: number;
    price: number;
    finalPrice: number;
    idImage: string;
    carLicence: string;
    driveLicence: string;
    carYear: {
      year: number;
      model: {
        name: string;
        make: {
          name: string;
        };
      };
    };
  };
  lifeInfo: {
    persitage: number;
    price: number;
    finalPrice: number;
    idImage: string;
  };
  healthInfo: {
    type: string;
    totalPrice: number;
    groupName: string;
    companyTaxRegister: string;
    companyCommercialRegister: string;
    members: {
      id: number;
      age: number;
      gender: "male" | "female";
      price: number;
      image: string;
      idImage: string;
    }[];
  };
}

export interface DocumentRenew {
  id: number;
  confirmed: boolean;
  paid: boolean;
  paidKey: string;
  createdAt: Date;
  insuranceDocument: {
    id: number;
    insuranceType: InsuranceType;
    startDate: Date;
    endDate: Date;
    documentNumber: string;
    user: {
      id: number;
      name: string;
      phone: string;
    };
    company: {
      id: number;
      name: string;
      email: string;
      logo?: string;
      link?: string;
    };
  };
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface DocumentsResponse {
  data: {
    data: Document[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}

export interface RenewDocumentsResponse {
  data: {
    data: DocumentRenew[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}
export interface GetDocumentParams {
  page?: number;
  size?: number;
  companyId?: number;
  planId?: number;
  userId?: number;
  confirmed?: boolean;
  insuranceType?: InsuranceType;
}

export const getDocuments = (
  params: GetDocumentParams,
): Promise<DocumentsResponse> => {
  return api.get("/document/getAll", { params });
};

export const getDocumentsRenews = (params: {
  page?: number;
  size?: number;
  userId?: number;
  documentId?: number;
  confirmed?: boolean;
  paid?: boolean;
}): Promise<RenewDocumentsResponse> => {
  return api.get("/document/renew", { params });
};

export const getDocumentById = async (id: number): Promise<Document> => {
  const res = await api.get(`/document/${id}`);
  return res.data;
};

export const confirmDocument = async (
  id: number,
  data: {
    documentNumber: string;
    startDate: string;
    endDate: string;
    link?: string;
  },
) => {
  const res = await api.patch(`/document/confirm/${id}`, data);
  return res.data;
};

export const confirmRenew = async (id: number) => {
  const res = await api.patch(`/document/renew/confirm/${id}`);
  return res.data;
};
