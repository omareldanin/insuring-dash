import { api } from "../api/api";
import type { Document } from "./documents";
export const DocumentStatusData = {
  processing: {
    name: "تحت المعالجة",
    className: "bg-amber-100 text-amber-700",
    icon: "⏳",
  },
  confirmed: {
    name: "تم الموافقة علي التعويض",
    className: "bg-green-100 text-green-700",
    icon: "✔",
  },
  canceled: {
    name: "تم الرفض",
    className: "bg-red-100 text-red-700",
    icon: "✖",
  },
} as const;

export type DocumentStatus = keyof typeof DocumentStatusData;

export interface DocumentRenew {
  id: number;
  status: DocumentStatus;
  carNumber: string;
  createdAt: Date;
  idImage: string;
  carLicence: string;
  driveLicence: string;
  description: string;
  insuranceDocument: Document;
}

export interface RefundsDocumentsResponse {
  data: {
    data: DocumentRenew[];
    total: number;
    page: number;
    size: number;
    totalPages: number;
  };
}

export const getDocumentsRefunds = (params: {
  page?: number;
  size?: number;
  userId?: number;
  documentId?: number;
  confirmed?: boolean;
  paid?: boolean;
}): Promise<RefundsDocumentsResponse> => {
  return api.get("/document/refund", { params });
};

export const updateRefund = async (
  id: number,
  data: {
    status?: string;
    description?: string;
  },
) => {
  const res = await api.patch(`/document/refund/${id}`, data);
  return res.data;
};
