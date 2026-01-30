"use client";

import React from "react";
import { GeneratorCard } from "../generator/GeneratorCard";
import { DecorativeGrid } from "@/components/ui/DecorativeGrid";

const guides = [
  {
    title: "Text to image",
    description: "Generate your text into images",
    imageSrc: "/assets/images/gallery/80.jpg",
    defaultPrompt: "Boy in club",
    type: "text-to-image" as const,
  },
  {
    title: "Image to image",
    description: "Let Your Image Inspire Another",
    defaultPrompt: "Boy in club",
    imageSrc: "/assets/images/gallery/082.png",
    sourceImageSrc: "/assets/images/gallery/082.png", // Example source image
    type: "image-to-image" as const,
  },
  {
    title: "Text to video",
    description: "Generate your text into videos",
    imageSrc: "/assets/images/gallery/vidImg.png",
    videoSrc: "/assets/videos/3.mp4",
    defaultPrompt: "A surreal cinematic interior with glossy deep-red tiled walls and floors, forming a narrow corridor lined with identical doors on both sides. A well-dressed man in a dark suit stands in the center, pushing against a door as if trapped in an endless architectural loop. Mirrors and reflections create multiple versions of him, slightly delayed and distorted. The environment feels symmetrical, unsettling, and precise. Overhead soft white lighting reflects sharply on the tiles. Hyper-clean surfaces, brutalist geometry, psychological tension, cinematic depth, ultra-realistic textures, no text, no logos.Camera slowly dollies forward through the corridor → subtle fisheye distortion increases → reflections multiply → cut to top-down view revealing the corridor forming a perfect geometric loop → the man appears centered inside an impossible architectural ring → slow rotation from above.",
    type: "text-to-video" as const,
  },
  {
    title: "Image to video",
    description: "Bring your photos to life",
    defaultPrompt: "Boy in club",
    imageSrc: "/assets/images/gallery/014.jpg",
    type: "image-to-video" as const,
  },
  {
    title: "Text to voice",
    description: "Let Your text Speak",
    imageSrc: "/assets/images/gallery/Text to voice.jpg",
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
          <div
            className="overflow-x-auto no-scrollbar
 pb-4 -mx-4 px-4 lg:mx-0 lg:px-0"
          >
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
