"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

const HERO_VIDEO = "/assets/videos/ElodanLogo.mp4";
const POSTER_IMAGE = "/assets/images/backgrounds/bg.png";

export function HeroSection() {
  const [shouldLoad, setShouldLoad] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative mb-8 rounded-3xl overflow-hidden w-full h-[400px] bg-[#E6D4D4] transition-all duration-500 ease-in-out shadow-sm"
    >
      {/* Video Background with Lazy Loading */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        {shouldLoad ? (
          <video
            autoPlay
            loop
            muted
            playsInline
            poster={POSTER_IMAGE}
            className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-1000"
          >
            <source src={HERO_VIDEO} type="video/mp4" />
          </video>
        ) : (
          <img
            src={POSTER_IMAGE}
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
        )}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* Content */}
      <div className="relative z-10 px-8 md:px-16 py-[50px] flex flex-col justify-center h-full">
        <div className="max-w-xl">
          <h1 className="text-[28px] md:text-[32px] font-black leading-tight text-white mb-2 font-[Inter] tracking-tighter">
            One chat, Endless Creations
          </h1>
          <p className="text-[16px] md:text-[18px] font-medium text-white/80 mb-6 font-[Inter]">
            Bring your creativity to life and start your journey
          </p>
          <Link href="/start-chat">
            <button
              className="px-8 h-[46px] bg-gradient-to-r from-[#5A0A0A] to-[#110C0C]
              text-white rounded-2xl text-[14px] font-bold tracking-[0.2px] 
              hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02] 
              active:scale-[0.98] transition-all"
            >
              Start conversation now
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
