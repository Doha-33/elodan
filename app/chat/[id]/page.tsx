
"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import { ChatInput } from "@/app/start-chat/components/ChatInput";
import { chatService } from "@/lib/services/chat.service";
import { ChatMessage } from "@/types";
import {
  RotateCcw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Check,
  ChevronDown,
  Plus,
  Edit2
} from "lucide-react";
import { useToast } from "@/components/ui/Toast";
import Link from "next/link";

const BOT_ICON = "/assets/icons/brands/gpt.svg";
const USER_IMG = "/assets/images/gallery/image to image.png";

export default function ChatSessionPage() {
  const { id } = useParams();
  const router = useRouter();
  const sessionId = id as string;
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<any>({ name: "Open AI GPT-4o mini" });
  const [models, setModels] = useState<any[]>([]);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const history = await chatService.getHistory(sessionId);
        setMessages(history);
      } catch (error) {
        console.error("Failed to load chat history", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const fetchModels = async () => {
      try {
        const data = await chatService.getModels();
        setModels(data);
      } catch (e) {}
    }

    fetchHistory();
    fetchModels();
  }, [sessionId]);

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowModelDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopyingId(id);
    showToast("Message copied to clipboard", "success");
    setTimeout(() => setCopyingId(null), 2000);
  };

  const handleFeedback = (type: "up" | "down") => {
    showToast(
      type === "up"
        ? "Glad you liked it!"
        : "Sorry about that. Feedback recorded.",
      "info",
    );
  };

  const handleNewMessages = (newMsgs: ChatMessage | ChatMessage[]) => {
    if (Array.isArray(newMsgs)) {
      setMessages((prev) => {
        const filtered = prev.filter((m) => !m.id.startsWith("temp-"));
        return [...filtered, ...newMsgs];
      });
    } else {
      setMessages((prev) => [...prev, newMsgs]);
    }
  };

  return (
    <PageLayout>
      <div className="flex flex-col h-[calc(100vh-200px)] sm:h-[calc(100vh-100px)] bg-white font-[Inter] rounded-none sm:rounded-[4px] border-x-0 sm:border border-[#E5E5E8] overflow-hidden shadow-sm">
        {/* Top Header Section */}
        <div className="px-4 md:px-8 py-4 md:py-6 flex items-center justify-between bg-white z-20 border-b sm:border-b-0 border-[#E5E5E8]">
          <Link 
            href="/start-chat" 
            className="flex items-center gap-1.5 px-3 md:px-4 py-2 border border-[#E5E5E8] rounded-3xl text-[13px] md:text-[14px] font-bold text-[#9E1518] hover:bg-gray-50 transition-all bg-white shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">New conversation</span>
            <span className="xs:hidden">New</span>
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 bg-[#F8F8F8] border border-[#E5E5E8] rounded-3xl text-[13px] md:text-[14px] font-bold text-[#110C0C] hover:bg-gray-100 transition-all shadow-sm"
            >
              <span className="truncate max-w-[100px] sm:max-w-none">{selectedModel.name}</span>
              <ChevronDown className="w-4 h-4 opacity-30 flex-shrink-0" />
            </button>

            {showModelDropdown && (
              <div className="absolute right-0 mt-2 w-56 md:w-64 bg-white border border-[#E5E5E8] rounded-2xl shadow-xl z-50 p-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <div className="max-h-60 overflow-y-auto elegant-scroll">
                  {models.map((m) => (
                    <button
                      key={m._id || m.id}
                      onClick={() => {
                        setSelectedModel(m);
                        setShowModelDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-[13px] font-medium transition-colors ${
                        selectedModel?.id === (m._id || m.id) ? 'bg-[#F04549]/5 text-[#9E1518]' : 'hover:bg-gray-50 text-[#110C0C]'
                      }`}
                    >
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 sm:px-10 py-4 space-y-8 sm:space-y-12 scrollbar-hide elegant-scroll bg-[#FFFFFF]">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-[#110C0C]/10 border-t-[#110C0C] rounded-full animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <div className="text-center text-gray-400 py-20 font-medium">No messages yet. Start a conversation!</div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id || index}
                className={`flex gap-3 sm:gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar Column */}
                <div className="flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden border border-[#E5E5E8] bg-white flex items-center justify-center shadow-sm">
                  <img
                    src={msg.role === "user" ? USER_IMG : BOT_ICON}
                    alt={msg.role}
                    className={`w-full h-full object-cover ${msg.role === "assistant" ? "p-1.5 sm:p-2" : ""}`}
                  />
                </div>

                {/* Content Column */}
                <div className={`flex flex-col gap-2 max-w-[85%] sm:max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div
                    className={`relative p-4 sm:p-5 rounded-[20px] sm:rounded-[22px] text-[14px] sm:text-[15px] leading-relaxed shadow-sm transition-all duration-300 ${
                      msg.role === "user"
                        ? "bg-[#F2F2F2] text-[#110C0C] rounded-tr-none"
                        : "bg-[#F2F2F2] text-[#110C0C] rounded-tl-none"
                    }`}
                  >
                    {msg.content}
                    
                    {msg.role === "user" && (
                       <div className="absolute top-4 right-4 opacity-30 hover:opacity-100 transition-opacity cursor-pointer">
                          <Edit2 className="w-4 h-4 sm:w-[18px] sm:h-[18px]" strokeWidth={2} />
                       </div>
                    )}
                    
                    <div className="mt-2 text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">11:30 PM</div>
                  </div>

                  {msg.role === "assistant" && (
                    <div className="flex items-center gap-1 mt-1 ml-1">
                      <button className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Regenerate">
                        <RotateCcw className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-[#110C0C]" />
                      </button>
                      <button 
                        onClick={() => handleCopy(msg.id, msg.content)} 
                        className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group" 
                        title="Copy"
                      >
                        {copyingId === msg.id ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />}
                      </button>
                      <button onClick={() => handleFeedback('up')} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Good">
                        <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-green-500" />
                      </button>
                      <button onClick={() => handleFeedback('down')} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors group" title="Bad">
                        <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 group-hover:text-red-500" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="pt-2 px-4 sm:px-8 bg-white border-t sm:border-t-0 border-[#E5E5E8]">
          <ChatInput sessionId={sessionId} onMessageSent={handleNewMessages} selectedModel={selectedModel} />
        </div>
      </div>
    </PageLayout>
  );
}
