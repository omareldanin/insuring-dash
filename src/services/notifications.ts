import { api } from "../api/api";

export interface SendBroadcastParams {
  title?: string;
  content: string;
  type?: "push" | "whatsapp";
  role?: string;
  userIds?: number[];
}

export interface SendBroadcastResponse {
  message: "success" | "partial_success" | "failed";
  channel: "push" | "whatsapp";
  sentTo: number;
  skippedCount: number;
  successCount: number;
  failureCount: number;
  saved: number;
}

export const sendBroadcastNotification = async (
  data: SendBroadcastParams,
): Promise<SendBroadcastResponse> => {
  const res = await api.post<SendBroadcastResponse>(
    "/notification/broadcast",
    data,
  );
  return res.data;
};
