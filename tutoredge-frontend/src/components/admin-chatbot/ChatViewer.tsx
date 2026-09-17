"use client";

type ChatMessage = {
  sender: "user" | "bot";
  message: string;
  createdAt?: string;
};
export default function ChatViewer({
  chats,
}: {
  chats: ChatMessage[];
}) {
  if (!Array.isArray(chats)) {
    return (
      <div className="border rounded-lg p-3 h-[400px] flex items-center justify-center text-sm text-gray-500 bg-gray-50">
        Invalid chat data
      </div>
    );
  }
  if (chats.length === 0) {
    return (
      <div className="border rounded-lg p-3 h-[400px] flex items-center justify-center text-sm text-gray-500 bg-gray-50">
        No conversation found
      </div>
    );
  }
  return (
    <div className="border rounded-lg p-3 h-[400px] overflow-y-auto space-y-2 bg-gray-50">
      {chats.map((c, i) => (
        <div
          key={i}
          className={`max-w-[80%] px-3 py-2 rounded-lg text-sm ${
            c.sender === "user"
              ? "ml-auto bg-green-500 text-white"
              : "mr-auto bg-white border"
          }`}
        >
          {c.message}
        </div>
      ))}
    </div>
  );
}
