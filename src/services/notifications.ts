import { api } from "../api/api";

export interface SendBroadcastParams {
  title: string;
  content: string;
  role?: string; // optional: target only one role, omit for everyone
}

export const sendBroadcastNotification = async (data: SendBroadcastParams) => {
  const res = await api.post("/notification/broadcast", data);
  return res.data;
};
