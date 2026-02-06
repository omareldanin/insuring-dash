import { api } from "../api/api";

export interface GetCarsParams {
  make?: string;
  model?: string;
  year?: number;
  page?: number;
  size?: number;
}

export interface CarMakeResponse {
  id: number;
  name: string;
}

export interface CarModelResponse {
  id: number;
  name: string;
  make: CarMakeResponse;
}

export interface CarResponse {
  id: number;
  year: number;
  minimumPrice?: number;
  createdAt: Date;
  model: CarModelResponse;
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CarsResponse {
  data: {
    data: CarResponse[];
    meta: PaginationMeta;
  };
}

export const getCars = (params: GetCarsParams): Promise<CarsResponse> => {
  return api.get("/cars/getAll", { params });
};

export const getMakes = async (): Promise<
  {
    id: number;
    name: string;
  }[]
> => {
  const res = await api.get("/cars/makes");
  return res.data;
};

export const getModels = async (
  makeId: number | null,
): Promise<
  {
    id: number;
    name: string;
  }[]
> => {
  const res = await api.get("/cars/models/" + makeId);
  return res.data;
};

export const getYears = async (
  modelId: number,
): Promise<
  {
    id: number;
    name: string;
  }[]
> => {
  const res = await api.get("/cars/years/" + modelId);
  return res.data;
};

export const deleteCar = async (id: number | undefined) => {
  const respone = await api.delete("/cars/" + id);
  return respone.data;
};

export const createCar = (data: {
  make: string;
  model: string;
  year: number;
  minimumPrice: number;
}) => {
  return api.post("/cars/full", data);
};

export const updateCar = (
  data: {
    make: string;
    model: string;
    year: number;
    minimumPrice: number;
  },
  id: number,
) => {
  return api.patch(`/cars/${id}`, data);
};

export const getCarById = async (id: number): Promise<CarResponse> => {
  const res = await api.get(`/cars/${id}`);
  return res.data;
};
