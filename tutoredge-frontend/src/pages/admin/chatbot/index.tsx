import { useEffect, useState } from "react";
import {
  getChatbotLeads,
  getChatBySession,
  searchChatbotByPhone,
} from "@/lib/chatbotAdmin";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

import LeadsTable from "@/components/admin-chatbot/LeadsTable";
import ChatViewer from "@/components/admin-chatbot/ChatViewer";
import PhoneSearch from "@/components/admin-chatbot/PhoneSearch";
import AdminDashboardLayout from "@/components/admin-dashboard/AdminDashboardLayout";
export default function AdminChatbotPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [chats, setChats] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);

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

  // Export to Excel with full conversations
  const exportToExcel = async () => {
    setExporting(true);
    try {
      const exportData = [];

      // Fetch conversations for each lead
      for (const lead of leads) {
        const messages = await getChatBySession(lead.sessionId);
        
        if (messages && messages.length > 0) {
          // Create a row for each message
          messages.forEach((msg: any, index: number) => {
            exportData.push({
              "Lead Name": lead.name || "Guest",
              "Role": lead.role || "Guest",
              "Phone": lead.phone || "N/A",
              "Session ID": lead.sessionId || "N/A",
              "Message #": index + 1,
              "Sender": msg.sender || "N/A",
              "Message": msg.message || msg.text || "N/A",
              "Timestamp": msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 
                          msg.createdAt ? new Date(msg.createdAt).toLocaleString() : "N/A",
            });
          });
        } else {
          // If no messages, add lead info only
          exportData.push({
            "Lead Name": lead.name || "Guest",
            "Role": lead.role || "Guest",
            "Phone": lead.phone || "N/A",
            "Session ID": lead.sessionId || "N/A",
            "Message #": 0,
            "Sender": "N/A",
            "Message": "No messages",
            "Timestamp": lead.createdAt ? new Date(lead.createdAt).toLocaleString() : "N/A",
          });
        }
      }

      const worksheet = XLSX.utils.json_to_sheet(exportData);

      worksheet["!cols"] = [
        { wch: 20 }, // Lead Name
        { wch: 12 }, // Role
        { wch: 15 }, // Phone
        { wch: 30 }, // Session ID
        { wch: 10 }, // Message #
        { wch: 15 }, // Sender
        { wch: 60 }, // Message
        { wch: 20 }, // Timestamp
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Chatbot Conversations");

      const dateStr = new Date().toISOString().split("T")[0];
      const filename = `Chatbot_Full_Conversations_${dateStr}.xlsx`;

      XLSX.writeFile(workbook, filename);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export conversations. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <AdminDashboardLayout>
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">🤖 Chatbot Admin Panel</h1>
        
        {/* Export Button */}
        <button
          onClick={exportToExcel}
          disabled={leads.length === 0 || exporting}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {exporting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Exporting...
            </>
          ) : (
            <>
              <Download size={18} />
              Export Full Chats ({leads.length})
            </>
          )}
        </button>
      </div>

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
