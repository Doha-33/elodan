
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { chatService } from "@/lib/services/chat.service";
import { cn } from "@/lib/utils";

const GLOBE_ICON = "/assets/icons/ui/SVGRepo_iconCarrier-8.svg";
const ATTACHMENT_ICON = "/assets/icons/ui/SVGRepo_iconCarrier-9.svg";
const SEND_ICON = "/assets/icons/ui/SVGRepo_iconCarrier-10.svg";
const CHEVRON_ICON = "/assets/icons/ui/Vector 3.svg";

interface ChatInputProps {
  sessionId?: string;
  onMessageSent?: (msg: any) => void;
  selectedModel?: any;
}

export function ChatInput({
  sessionId,
  onMessageSent,
  selectedModel,
}: ChatInputProps) {
  const [prompt, setPrompt] = useState("");
  const [isSending, setIsSending] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!prompt.trim() || isSending) return;

    setIsSending(true);
    try {
      let targetSessionId = sessionId;

      if (!targetSessionId) {
        const modelId = selectedModel?._id || selectedModel?.id;
        const session = await chatService.createSession(modelId);
        targetSessionId = session.id;
      }

      const response = await chatService.sendMessage(targetSessionId, prompt);

      setPrompt("");

      if (onMessageSent) {
        onMessageSent(response);
      } else {
        router.push(`/chat/${targetSessionId}`);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="max-w-[955px] mx-auto w-full px-4 mb-8 font-[Inter]">
      <div
        className="
    relative
    rounded-[26px]
    p-5
    shadow-sm
    transition-all
    focus-within:shadow-md
    border border-[#E5E5E8]
  "
        style={{
          background: `
      linear-gradient(
        90deg,
        rgba(212, 212, 212, 0.3) 30%,
        #EAF2F2 50%,
        rgba(212, 212, 212, 0.3) 30%
      )
    `,
        }}
      >
        <div className="mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Start"
            disabled={isSending}
            className="
    w-full bg-transparent border-none 
    focus:outline-none focus:ring-0 focus:ring-offset-0
    text-[16px] leading-[24px] font-normal
    text-[#110C0C] placeholder-[#8A8A8A]
    resize-none min-h-[48px]
    disabled:opacity-50
  "
          />
        </div>

        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-[10px] bg-white border border-[#E5E5E8] rounded-full text-[13px] font-medium text-[#110C0C] hover:bg-gray-50 transition-all">
              <img src={GLOBE_ICON} alt="" className="w-4 h-4" />
              <span>Search the web</span>
            </button>
          </div>

          <div className="flex items-center gap-[10px]">
            <button className="flex items-center justify-between gap-4 px-5 py-[10px] bg-white border border-[#E5E5E8] rounded-full text-[13px] font-semibold text-[#110C0C] hover:bg-gray-50 transition-all">
              <span>{selectedModel?.name || "Select Model"}</span>
              <img
                src={CHEVRON_ICON}
                alt=""
                className="w-3.5 h-3.5 opacity-40"
              />
            </button>

            <button
              onClick={handleSend}
              disabled={!prompt.trim() || isSending}
              className={cn(
                "flex items-center justify-center w-10 h-10 rounded-full transition-all active:scale-90",
                prompt.trim()
                  ? "bg-[#110C0C] text-white"
                  : "bg-[#110C0C]/30 text-white cursor-not-allowed",
              )}
            >
              {isSending ? (
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
