import { api } from "../api/api";

export interface Card {
  user: {
    name: string;
    id: number;
    phone: string;
  };
  id: number;
  name: string;
  idNumber: string;
  idImage: string;
  startDate: Date | null;
  endDate: Date | null;
  confirmed: boolean;
  paid: boolean;
  paidKey: string | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CardsResponse {
  data: {
    data: Card[];
    meta: PaginationMeta;
  };
}

export interface GetCardsParams {
  page?: number;
  size?: number;
  confirmed?: boolean;
  paid?: boolean;
}

export const getCards = (params: GetCardsParams): Promise<CardsResponse> => {
  return api.get("/discount-cards/getAll", { params });
};

export const confirmCard = async (
  id: number,
  data: {
    startDate: string;
    endDate: string;
    confirmed: boolean;
  },
) => {
  const res = await api.patch(`/discount-cards/${id}`, data);
  return res.data;
};
