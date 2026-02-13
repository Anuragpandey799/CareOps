import { useEffect, useState, useRef } from "react";
import { Send, User } from "lucide-react";
import API from "../services/api";
import socket from "../socket";
import Layout from "../components/layout/Layout";

const Messages = () => {
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loadingMessages, setLoadingMessages] = useState(false);

  const messagesContainerRef = useRef(null);

  // Scroll only chat container
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  // Fetch Leads
  useEffect(() => {
    API.get("/leads").then((res) => setLeads(res.data));
  }, []);

  // Fetch Messages when selecting lead
  useEffect(() => {
    if (selectedLead) {
      setLoadingMessages(true);

      API.get(`/messages/${selectedLead._id}`).then((res) => {
        setMessages(res.data);
        setTimeout(scrollToBottom, 100);
        setLoadingMessages(false);
      });

      API.put(`/messages/read/${selectedLead._id}`);
    }
  }, [selectedLead]);

  // Real-time new message
  useEffect(() => {
    socket.on("newMessage", (msg) => {
      if (selectedLead && msg.customer._id === selectedLead._id) {
        setMessages((prev) => [...prev, msg]);
        setTimeout(scrollToBottom, 100);
      }
    });

    return () => socket.off("newMessage");
  }, [selectedLead]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedLead) return;

    await API.post("/messages", {
      customer: selectedLead._id,
      content: newMessage,
    });

    setNewMessage("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <Layout>
      <div className="flex h-[85vh] rounded-2xl overflow-hidden border border-slate-700 shadow-2xl bg-slate-900">
        
        {/* ================= LEFT PANEL - LEADS ================= */}
        <div className="w-1/4 bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 overflow-y-auto">
          <div className="p-4 text-lg font-bold border-b border-slate-700">
            Conversations
          </div>

          {leads.map((lead) => (
            <div
              key={lead._id}
              onClick={() => setSelectedLead(lead)}
              className={`flex items-center gap-3 p-4 cursor-pointer transition-all duration-300 border-b border-slate-800 hover:bg-slate-800 ${
                selectedLead?._id === lead._id
                  ? "bg-indigo-600/20 border-l-4 border-indigo-500"
                  : ""
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                {lead.name?.charAt(0)}
              </div>
              <div>
                <div className="font-semibold">{lead.name}</div>
                <div className="text-xs text-gray-400 truncate w-32">
                  Click to view messages
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ================= RIGHT PANEL - CHAT ================= */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-800 to-slate-900">

          {selectedLead ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-700 flex items-center gap-3 backdrop-blur-md bg-slate-900/60 sticky top-0 z-10">
                <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white font-bold">
                  {selectedLead.name?.charAt(0)}
                </div>
                <div>
                  <div className="font-semibold">{selectedLead.name}</div>
                  <div className="text-xs text-gray-400">Active conversation</div>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-slate-700"
              >
                {loadingMessages ? (
                  <div className="text-center text-gray-400 animate-pulse">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-gray-500">
                    No messages yet. Start the conversation 🚀
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`max-w-md px-4 py-3 rounded-2xl text-sm shadow-md transition-all duration-300 ${
                        msg.direction === "Outbound"
                          ? "ml-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white"
                          : "bg-slate-700 text-gray-200"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-slate-700 bg-slate-900 flex items-center gap-3">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="flex-1 p-3 rounded-xl bg-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Type your message..."
                />

                <button
                  onClick={sendMessage}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 p-3 rounded-xl hover:scale-105 transition-transform shadow-lg"
                >
                  <Send size={18} className="text-white" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-1 text-gray-500">
              <User size={50} className="mb-4 opacity-40" />
              <div className="text-lg font-medium">
                Select a conversation to start chatting
              </div>
              <div className="text-sm opacity-60">
                Your messages will appear here.
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Messages;
