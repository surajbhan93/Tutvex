import { useEffect, useState } from "react";
import {
  getChatbotLeads,
  getChatBySession,
  searchChatbotByPhone,
} from "@/lib/chatbotAdmin";

import LeadsTable from "@/components/admin-chatbot/LeadsTable";
import ChatViewer from "@/components/admin-chatbot/ChatViewer";
import PhoneSearch from "@/components/admin-chatbot/PhoneSearch";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
export default function AdminChatbotPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadLeads();
  }, []);

  const loadLeads = async () => {
    const data = await getChatbotLeads();
    setLeads(data);
  };

  const openChat = async (sessionId: string) => {
    setLoading(true);
    const data = await getChatBySession(sessionId);
    setChats(data);
    setLoading(false);
  };

  const searchByPhone = async (phone: string) => {
    const data = await searchChatbotByPhone(phone);
    setLeads(data);
  };

  return (
    <AdminDashboardLayout>
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-semibold">🤖 Chatbot Admin Panel</h1>

      <PhoneSearch onSearch={searchByPhone} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <LeadsTable leads={leads} onSelect={openChat} />

        <div>
          <h2 className="font-medium mb-2">Conversation</h2>
          {loading ? (
            <div className="text-sm text-gray-500">Loading chat...</div>
          ) : (
            <ChatViewer chats={chats} />
          )}
        </div>
      </div>
    </div>
    </AdminDashboardLayout>
  );
}
