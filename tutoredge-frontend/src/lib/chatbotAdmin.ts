import apiClient from "./apiClient";

export const getChatbotLeads = async () => {
  const res = await apiClient.get("/leads");
  return res.data.data || res.data; // ✅ SAFE
};

export const getChatBySession = async (sessionId: string) => {
  const res = await apiClient.get(`/chat/${sessionId}`);
  return res.data.chats || []; // ✅ ALWAYS ARRAY
};

export const searchChatbotByPhone = async (phone: string) => {
  const res = await apiClient.get(`/search?phone=${phone}`);
  return res.data.data || res.data;
};
