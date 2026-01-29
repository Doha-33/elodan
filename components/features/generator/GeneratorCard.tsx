"use client";

import React from "react";
import Button from "@/components/ui/Button";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

interface GeneratorCardProps {
  title: string;
  description: string;
  gradientColors?: string;
  imageSrc?: string;
  sourceImageSrc?: string; // Prop for the small source image
  videoSrc?: string;
  defaultPrompt?: string;
  type:
    | "text-to-image"
    | "image-to-image"
    | "text-to-video"
    | "image-to-video"
    | "text-to-voice";
}
const BACKGROUND_IMAGE = "/assets/icons/ui/cardBg.png";

export function GeneratorCard({
  title,
  description,
  gradientColors,
  imageSrc,
  sourceImageSrc,
  videoSrc,
  defaultPrompt,
  type,
}: GeneratorCardProps) {
  const router = useRouter();
  const [typedText, setTypedText] = useState("");
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleNavigate = () => {
    const routes = {
      "text-to-image": "/image",
      "image-to-image": "/image",
      "text-to-video": "/video",
      "image-to-video": "/video",
      "text-to-voice": "/voice",
    };
    router.push(routes[type]);
  };

  const startInteraction = () => {
    // 1. Text Animation Logic
    if (defaultPrompt && !typingRef.current) {
      setTypedText("");
      let index = 0;
      typingRef.current = setInterval(() => {
        index++;
        setTypedText(defaultPrompt.slice(0, index));
        if (index === defaultPrompt.length) {
          clearInterval(typingRef.current!);
          typingRef.current = null;
        }
      }, 35);
    }

    // 2. Speech Logic (only for text-to-voice)
    if (type === "text-to-voice" && defaultPrompt) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(defaultPrompt);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }

    // 3. Video Logic (Play on Hover)
    if (videoRef.current) {
      videoRef.current
        .play()
        .catch((e) => console.log("Video play interrupted"));
    }
  };

  const stopInteraction = () => {
    // Stop Animation
    if (typingRef.current) {
      clearInterval(typingRef.current);
      typingRef.current = null;
    }
    setTypedText("");

    // Stop Speech
    if (type === "text-to-voice") {
      window.speechSynthesis.cancel();
    }

    // 4. Video Logic (Pause and Reset on Mouse Leave)
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      onClick={handleNavigate}
      onMouseEnter={startInteraction}
      onMouseLeave={stopInteraction}
      className="w-[224.6pxzz] h-[250px] bg-white rounded-[8px] border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex-shrink-0 group flex flex-col cursor-pointer active:scale-[0.98]"
    >
      {/* Preview Area */}
      <div className="aspect-square relative overflow-hidden bg-gray-50">
        <div
          className={`absolute inset-0 ${
            gradientColors || ""
          } flex items-center justify-center transition-transform duration-700 group-hover:scale-110`}
        >
          {imageSrc && (
            <img
              src={imageSrc}
              alt={title}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${videoSrc ? "group-hover:opacity-0" : "opacity-100"}`}
            />
          )}

          {videoSrc && (
            <video
              ref={videoRef}
              src={videoSrc}
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          )}

          {/* Small Square Preview for Image-based transformations (Source Image) */}
          {(type === "image-to-image" || type === "image-to-video") && (
            <div className="absolute top-3 left-3 w-[64px] h-[77px] bg-white/30 rounded-lg border border-white/40 backdrop-blur-md shadow-xl overflow-hidden z-10 transition-all duration-500 group-hover:translate-x-1 group-hover:translate-y-1">
              {sourceImageSrc ? (
                <img
                  src={sourceImageSrc}
                  alt="Source"
                  className="w-full h-full object-cover opacity-90"
                />
              ) : (
                <img
                  src={imageSrc}
                  alt="Source"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          )}

          {type === "text-to-voice" && (
            <div className="relative flex items-center justify-center group">
              <img
                src="/assets/videos/sound.gif"
                alt="sound"
                className="
  w-[150px] h-[150px]
  opacity-0 scale-75
  -translate-y-4
  transition-all duration-300 ease-out
  group-hover:opacity-100
  group-hover:scale-110
"
              />
            </div>
          )}

        </div>

        {/* Input overlay */}
        {defaultPrompt && (
          <div className="absolute inset-x-0 bottom-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
            <div className="w-[187px] h-[38px] flex items-center justify-between bg-white/80 backdrop-blur-md rounded-full px-1 shadow-lg">
              <span className="text-[11px] font-bold text-black px-4 truncate">
                {typedText}
                {typedText.length < defaultPrompt.length && (
                  <span className="ml-0.5 animate-pulse text-[#ED2024]">|</span>
                )}
              </span>

              <Button
                className="w-[72px] h-[30px] rounded-full px-2 text-[10px] font-black bg-gradient-to-r from-[#5A0A0A] to-[#110C0C] hover:scale-105 transition-transform"
                onClick={(e) => {
                  e.stopPropagation();
                  handleNavigate();
                }}
              >
                Generate
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="relative w-[224.6px] h-[88px] p-8 flex-1 flex flex-col justify-center">
        <div className="absolute top-0 right-0 w-[224.6px] h-[88px]">
          <img
            src={BACKGROUND_IMAGE}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10">
          <h4 className="font-bold text-[15px] mb-2 text-gray-900 transition-colors duration-300">
            {title}
          </h4>
          <p className="text-gray-500 text-[13px] font-medium leading-relaxed opacity-80">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
