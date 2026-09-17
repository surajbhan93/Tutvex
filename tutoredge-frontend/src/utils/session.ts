export const getSessionId = () => {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("chatbot_session_id");

  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem("chatbot_session_id", sessionId);
  }

  return sessionId;
};
