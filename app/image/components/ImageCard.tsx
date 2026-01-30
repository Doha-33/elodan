"use client";

import { useState } from "react";
import { Maximize2, Trash2, Download, X, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageCardProps {
  image?: string;
  isPlaceholder?: boolean;
  isLoading?: boolean;
  prompt?: string;
}

export function ImageCard({
  image,
  isPlaceholder = false,
  isLoading = false,
  prompt,
}: ImageCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleDownload = async () => {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `elodan-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // حالة التحميل أو العنصر النائب (Placeholder)
  if (isPlaceholder || isLoading) {
    return (
      <div className="w-full aspect-[3/4] bg-[#F5F5F6] border border-[#E6E6EA] rounded-2xl flex flex-col items-center justify-center gap-4 p-6">
        {/* Progress Ring */}
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-20 h-20 animate-spin" viewBox="0 0 80 80">
            {/* background ring */}
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="#E5E5E8"
              strokeWidth="4"
              fill="none"
            />

            {/* arc */}
            <circle
              cx="40"
              cy="40"
              r="30"
              stroke="#2E2E2E"
              strokeWidth="4"
              fill="none"
              strokeLinecap="round"
              strokeDasharray="60 140"
            />
          </svg>

          {/* image icon */}
          <svg
            className="absolute w-7 h-7 text-[#2E2E2E]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="3" y="5" width="18" height="14" rx="3" />
            <circle cx="8" cy="10" r="1.5" />
            <path d="M21 15l-5-5L5 19" />
          </svg>
        </div>

        {/* Text */}
        <div className="text-center">
          <p className="text-[15px] font-semibold text-[#1C1C1C]">
            Generate your image
          </p>
          <p className="text-[13px] text-[#8E8E93]">
            Image will be ready in a few seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="w-full aspect-[3/4] bg-white border border-[#E5E5E8] rounded-2xl overflow-hidden group cursor-pointer relative shadow-sm hover:shadow-md transition-all"
        onClick={() => setIsOpen(true)}
      >
        <img
          src={image}
          alt={prompt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4 md:p-12 animate-in fade-in duration-300 backdrop-blur-sm">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 text-white hover:opacity-70 transition-opacity bg-white/10 rounded-full p-2"
          >
            <X className="w-8 h-8" />
          </button>

          <div className="relative max-w-5xl w-full bg-white rounded-[32px] p-8 overflow-hidden flex flex-col gap-6 animate-in zoom-in-95 duration-300 shadow-2xl">
            {/* Action Bar inside Lightbox */}
            <div className="flex justify-end items-center gap-3">
              <button
                onClick={handleDownload}
                className="w-11 h-11 bg-[#F8F8F8] hover:bg-gray-100 rounded-full flex items-center justify-center transition-all text-[#110C0C]"
                title="Download"
              >
                <Download className="w-5 h-5" />
              </button>
              <button className="w-11 h-11 bg-[#F8F8F8] hover:bg-red-50 rounded-full flex items-center justify-center transition-all text-[#110C0C] hover:text-red-600">
                <Trash2 className="w-5 h-5" />
              </button>
              <button className="w-11 h-11 bg-[#F8F8F8] hover:bg-gray-100 rounded-full flex items-center justify-center transition-all text-[#110C0C]">
                <Maximize2 className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden rounded-2xl bg-gray-50 border border-[#E5E5E8]">
              <img
                src={image}
                className="max-w-full max-h-[65vh] object-contain shadow-sm"
                alt="Preview"
              />
            </div>

            <div className="px-2">
              <p className="text-[15px] text-[#110C0C] font-semibold leading-relaxed tracking-[0.1px]">
                {prompt}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
