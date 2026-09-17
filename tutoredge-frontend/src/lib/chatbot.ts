import apiClient from "./apiClient";

export interface ChatbotAskPayload {
  message: string;
  sessionId: string;
}

export interface ChatbotAskResponse {
  success: boolean;
  reply: string;
}

/**
 * Ask chatbot API
 */
export const askChatbot = async (
  payload: ChatbotAskPayload
): Promise<ChatbotAskResponse> => {
  const { data } = await apiClient.post<ChatbotAskResponse>(
    "/chatbot/ask",
    payload
  );

  return data;
};
