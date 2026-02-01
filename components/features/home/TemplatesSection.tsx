"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export function TemplatesSection() {
  const templates = [
    {
      name: "Cinematic Movie",
      videoSrc: "https://res.cloudinary.com/djf62tcs2/video/upload/v1769981253/example-1-tiny_br3hwy.mp4",
    },
    {
      name: "3D Portrait",
      videoSrc: "https://res.cloudinary.com/djf62tcs2/video/upload/v1769980863/after_13_swtu1u.mp4",
    },
    {
      name: "Abstract Art",
      videoSrc: "https://res.cloudinary.com/djf62tcs2/video/upload/v1769981184/after_3_duuxjt.mp4",
    },
    {
      name: "Cyberpunk City",
      videoSrc: "https://res.cloudinary.com/djf62tcs2/video/upload/v1769981205/example-1-tiny_1_w8kt8s.mp4",
    },
    {
      name: "Nature Drone",
      videoSrc: "https://res.cloudinary.com/djf62tcs2/video/upload/v1769981145/after_2_bnnvav.mp4",
    },
  ];

  return (
    <div className="mb-10 w-full font-[Inter]">
      <div className="flex items-center gap-3 mb-10">
        <h3 className="text-[24px] md:text-[28px] font-black text-[#110C0C] tracking-tight">
          Start with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ED2024] to-[#110C0C]">
            templates
          </span>
        </h3>
      </div>

      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {templates.map((template, i) => (
          <div
            key={i}
            className="group relative h-[147px] w-[224px] shrink-0
      bg-[#F5F5F5] rounded-[28px] overflow-hidden shadow-sm
      hover:shadow-2xl transition-all duration-700 cursor-pointer
      border border-[#E5E5E8] hover:border-[#110C0C]/20"
          >
            <video
              src={template.videoSrc}
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-1000 group-hover:scale-110"
            />

            {/* overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-60 transition-opacity" />
          </div>
        ))}
      </div>
    </div>
  );
}
