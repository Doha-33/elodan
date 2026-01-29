"use client";

import React from "react";
import { GeneratorCard } from "../generator/GeneratorCard";
import { DecorativeGrid } from "@/components/ui/DecorativeGrid";

const guides = [
  {
    title: "Text to image",
    description: "Generate your text into images",
    imageSrc:
      "/assets/images/gallery/texttoimg.png",
    defaultPrompt: "Boy in club",
    type: "text-to-image" as const,
  },
  {
    title: "Image to image",
    description: "Let Your Image Inspire Another",
    imageSrc: "/assets/images/gallery/imgtoimg2.jpg",
    sourceImageSrc: "/assets/images/gallery/imgtoimg1.jpg", // Example source image
    type: "image-to-image" as const,
  },
  {
    title: "Text to video",
    description: "Generate your text into videos",
    imageSrc: "/assets/images/gallery/veo2-t2v.png",
    videoSrc: "/assets/videos/veo2-t2v.mp4",
    defaultPrompt: "Snowy little tiger",
    type: "text-to-video" as const,
  },
  {
    title: "Image to video",
    description: "Bring your photos to life",
    imageSrc:
      "/assets/images/gallery/imgtovid.png",
    videoSrc: "/assets/videos/imgtovid.mp4",
    type: "image-to-video" as const,
  },
  {
    title: "Text to voice",
    description: "Let Your text Speak",
    imageSrc: "/assets/images/gallery/Rectangle 7850.png",
    defaultPrompt: "Experience the magic of voice...",
    type: "text-to-voice" as const,
  },
];

export function FeaturedGuides() {
  return (
    <div className="mb-10 relative w-full overflow-hidden">
      <DecorativeGrid />
      <div className="relative z-10 font-[Inter]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-[24px] md:text-[28px] font-black text-[#110C0C] tracking-tight">
            Featured{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ED2024] to-[#110C0C]">
              Guides
            </span>
          </h3>
        </div>

        <div className="relative">
          <div className="overflow-x-auto pb-4 -mx-4 px-4 lg:mx-0 lg:px-0 elegant-scroll">
            <div className="flex gap-2 min-w-max lg:min-w-0 lg:grid lg:grid-cols-5">
              {guides.map((guide, index) => (
                <div
                  key={index}
                  className="transition-all duration-500 ease-in-out"
                >
                  <GeneratorCard {...guide} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
