import { ReactNode, useState } from "react";
import Image from "next/image";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

const BACKGROUND_VIDEOS = [
  "https://res.cloudinary.com/djf62tcs2/video/upload/v1769888913/Special_Power.Supernatural.14_qpwre1.mp4",
  "https://res.cloudinary.com/djf62tcs2/video/upload/v1769953159/community10_ycwqu5.webm",
  "https://res.cloudinary.com/djf62tcs2/video/upload/v1769888980/Transitions_Edits.7_r23g7k.mp4",
  "https://res.cloudinary.com/djf62tcs2/video/upload/v1769889025/Transitions_Edits.34_wkxrtm.mp4",
  "https://res.cloudinary.com/djf62tcs2/video/upload/v1769953294/6e46a597-6f5c-4c46-a15e-322294550f93_z5ab7d.mp4",
];

export default function AuthLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  const [currentVideo, setCurrentVideo] = useState(0);

  const handleVideoEnd = () => {
    setCurrentVideo((prev) =>
      prev === BACKGROUND_VIDEOS.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="flex flex-col lg:flex-row h-screen font-[Inter] overflow-hidden bg-white">
      {/* Left Side - Form (44.7%) */}
      <div className="w-full lg:w-[44.7%] h-full flex flex-col items-center justify-center px-6 pt-24 lg:px-0 bg-white overflow-y-auto elegant-scroll">
        <div className="w-full max-w-[532px] lg:w-[82.6%] py-12 flex flex-col items-center">
          {/* Logo */}
          <div className="flex justify-center mt-32 mb-2">
            <div className="w-[81px] h-[82px] bg-[#F8F8F8] rounded-2xl flex items-center justify-center">
              <Image
                src="/assets/images/backgrounds/eLogo.png"
                alt="Elodan"
                width={47}
                height={43}
                unoptimized
              />
            </div>
          </div>

          <h1 className="text-[28px] md:text-[36px] font-semibold text-[#110C0C] text-center mb-2 leading-tight">
            {title}
          </h1>
          <p className="text-[14px] text-[#8A8A8A] text-center mb-8 tracking-[0.1px]">
            {subtitle}
          </p>

          <div className="w-full">
            {children}
          </div>
        </div>
      </div>

      {/* Right Side - Video (55.3%) */}
      <div className="hidden lg:block lg:w-[55.3%] h-full relative overflow-hidden bg-black">
        <video
          key={currentVideo}
          autoPlay
          muted
          playsInline
          controlsList="nodownload"
          onEnded={handleVideoEnd}
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={BACKGROUND_VIDEOS[currentVideo]} type="video/mp4" />
        </video>

        {/* Purple Blur Effect */}
        <div className="absolute bottom-[20%] right-[10%] w-[30%] h-[25%] flex items-center justify-center pointer-events-none">
          <div className="w-full h-full bg-[rgba(154,87,255,0.2)] blur-[50px] rounded-full" />
        </div>
      </div>
    </div>
  );
}