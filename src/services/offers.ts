import { api } from "../api/api";

export interface Offer {
  id: number;
  insuranceTypes: string[];
  createdAt: Date;
  updatedAt: Date;
  discount: number;
  ordersCount: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface OffersResponse {
  data: {
    data: Offer[];
    meta: PaginationMeta;
  };
}

export interface GetCarsParams {
  page?: number;
  size?: number;
}

/* ---------- Offer Forms ---------- */

export interface OfferForm {
  insuranceTypes: string[];
  discount: number;
}

export interface CreateOfferDto extends OfferForm {}

export interface UpdateOfferDto {
  insuranceTypes?: string[];
  discount?: number;
}

/* ---------- API ---------- */

export const getOffers = (params: GetCarsParams): Promise<OffersResponse> => {
  return api.get("/offers", { params });
};

export const deleteOffer = async (id: number | undefined) => {
  const response = await api.delete("/offers/" + id);
  return response.data;
};

export const createOffer = (data: CreateOfferDto) => {
  return api.post("/offers", data);
};

export const updateOffer = (id: number, data: UpdateOfferDto) => {
  return api.patch(`/offers/${id}`, data);
};
