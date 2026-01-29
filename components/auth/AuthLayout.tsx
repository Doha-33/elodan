import { ReactNode, useState } from "react";
import Image from "next/image";

const ELODAN_LOGO = "/assets/images/backgrounds/eLogo.png";
const BACKGROUND_VIDEO = "/assets/videos/Special Power.Supernatural.14.mp4";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}
const BACKGROUND_VIDEOS = [
  "/assets/videos/Special Power.Supernatural.14.mp4",
  "/assets/videos/community10.mp4",
  "/assets/videos/Transitions & Edits.7.mp4",
  "/assets/videos/Transitions & Edits.34.mp4",
  "/assets/videos/6e46a597-6f5c-4c46-a15e-322294550f93.mp4",
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
    <div className="flex h-screen font-[Inter]">
      {/* Left Side - Form */}
      <div className="w-[644px] flex flex-col items-center justify-center px-12 bg-white">
        <div className="w-full max-w-[532px]">
          {/* Logo */}
          <div className="flex justify-center mb-8">
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

          <h1 className="text-[36px] font-semibold text-[#110C0C] text-center mb-2">
            {title}
          </h1>
          <p className="text-[14px] text-[#8A8A8A] text-center mb-8 tracking-[0.1px]">
            {subtitle}
          </p>

          {children}
        </div>
      </div>

      {/* Right Side - Video */}
      <div className="w-[796px] flex-1 relative overflow-hidden">
        <video
          key={currentVideo} // مهم علشان يجبر React يعيد تحميل الفيديو
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
        <div className="absolute bottom-[20%] right-[10%] w-[300px] h-[250px] flex items-center justify-center pointer-events-none">
          <div className="w-full h-full bg-[rgba(154,87,255,0.2)] blur-[50px] rounded-full" />
        </div>
      </div>
    </div>
  );
}
