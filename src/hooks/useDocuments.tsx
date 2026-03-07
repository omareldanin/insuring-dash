import { useQuery } from "@tanstack/react-query";
import {
  getDocuments,
  getDocumentsRenews,
  type GetDocumentParams,
} from "../services/documents";
import { getDocumentsRefunds } from "../services/refunds";

export const useDocuments = (filters: GetDocumentParams) => {
  return useQuery({
    queryKey: ["documents", filters],
    queryFn: () => getDocuments(filters),
    refetchOnWindowFocus: true,
  });
};

export const useDocumentsRenews = (filters: {
  page?: number;
  size?: number;
  userId?: number;
  documentId?: number;
  confirmed?: boolean;
  paid?: boolean;
}) => {
  return useQuery({
    queryKey: ["renews", filters],
    queryFn: () => getDocumentsRenews(filters),
    refetchOnWindowFocus: true,
  });
};

export const useDocumentsRefunds = (filters: {
  page?: number;
  size?: number;
  userId?: number;
  documentId?: number;
  confirmed?: boolean;
  paid?: boolean;
}) => {
  return useQuery({
    queryKey: ["refunds", filters],
    queryFn: () => getDocumentsRefunds(filters),
    refetchOnWindowFocus: true,
  });
};
