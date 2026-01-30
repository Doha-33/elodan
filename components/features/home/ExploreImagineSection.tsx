"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { DecorativeGrid } from "@/components/ui/DecorativeGrid";
import {
  Copy,
  Download,
  Maximize2,
  X,
  Smartphone,
  DownloadCloud,
  Play,
} from "lucide-react";
import { useRouter } from "next/navigation";

const categories = ["Image", "Video"];

const exploreData = [
  {
    id: 1,
    src: "/assets/images/gallery/1.jpeg",
    category: "Image",
    type: "Text to image",
    prompt:
      "A colossal, smooth red spherical megastructure hovering just above a desolate frozen wasteland, parasitic industrial architecture and refinery machinery clinging to the side of the sphere, intricate mechanical details, pipes, scaffolding, dripping viscous fluid, moody atmospheric lighting, volumetric heavy clouds, grey mist, reflective ice puddles on the ground, small rover vehicle in foreground for scale, cinematic composition, hyper-realistic, 8k, Octane render, Unreal Engine 5, sci-fi concept art, gloom, rusted metal texture --ar 3:2 --v 5.2",
    referenceImage: "/assets/images/gallery/1.jpeg",
    date: "11 October 2025",
    settings: {
      model: "Flux",
      style: "Anime",
      dimension: "3:4",
      autoSpeech: "Jon",
      duration: "5s",
    },
  },
  {
    id: 2,
    src: "/assets/images/gallery/2.jpeg",
    category: "Image",
    type: "Text to image",
    prompt:
      "Ultra-realistic cinematic portrait of a hooded person in a rainy cyberpunk city at night.Wearing futuristic round goggles with intense glowing red lenses, wet glass and light streaks dripping down.Moody neon city background with soft bokeh, shallow depth of field.Cold blue tones contrasted with strong red glow.Dramatic cinematic lighting, hyper-detailed skin and fabric, rain particles visible.Centered composition, dark futuristic atmosphere, high realism, 4K.",
    date: "10 October 2025",
    settings: {
      model: "Flux",
      style: "Cinematic",
      dimension: "16:9",
      autoSpeech: "None",
      duration: "N/A",
    },
  },
  {
    id: 3,
    src: "/assets/images/gallery/3.jpeg",
    category: "Image",
    type: "Text to image",
    prompt:
      "A wide-angle landscape photograph of a red sedan driving away on a dusty dirt road through a desert, scrub brush and Joshua trees, red rock formations. The sky is filled with hundreds of saucer-shaped UFOs, one large and detailed mother ship with mechanical undercarriage greeble in the center foreground, and many smaller ships in the distance. Distant mountains, bright sunny day, warm light, cinematic, photorealistic, sci-fi art. --ar 2:3",
    date: "10 October 2025",
    settings: {
      model: "Flux",
      style: "Cinematic",
      dimension: "16:9",
      autoSpeech: "None",
      duration: "N/A",
    },
  },
  {
    id: 4,
    src: "/assets/images/gallery/4.jpeg",
    category: "Image",
    type: "Text to image",
    prompt:
      "A massive, dark grey industrial spaceship flying low over a vast field of vibrant red poppies, red flower petals floating in the air, turbulence from the ship's engines kicking up petals, surreal juxtaposition, white fluffy clouds, blue sky, cinematic wide angle, intricate mechanical details, greeble, hyper-realistic, 8k, Unreal Engine 5 render, digital concept art, soft daylight --ar 21:9 --v 6.0",
    date: "10 October 2025",
    settings: {
      model: "Flux",
      style: "Cinematic",
      dimension: "16:9",
      autoSpeech: "None",
      duration: "N/A",
    },
  },
  {
    id: 5,
    src: "/assets/images/gallery/5.jpeg",
    category: "Image",
    type: "Text to image",
    prompt:
      "A detailed, close-up portrait of a man with intense, stern features, wearing a dark suit, a black tie, and black-framed glasses. He has a neat beard and slicked-back dark hair. A black headset with a microphone is visible on his left ear. The entire scene is bathed in a dramatic, intense red light from unseen sources, creating strong highlights on his face, hair, and the glasses, with deep shadows. The background consists of vertical red light streaks against a dark, blurred backdrop. The mood is mysterious and intense.",
    date: "10 October 2025",
    settings: {
      model: "Flux",
      style: "Cinematic",
      dimension: "16:9",
      autoSpeech: "None",
      duration: "N/A",
    },
  },
  {
    id: 6,
    src: "/assets/images/gallery/6.jpeg",
    category: "Image",
    type: "Text to image",
    prompt:
      "A vertical, low-angle cinematic photograph of a young man with messy, wavy dark hair and a visible neck tattoo. He is wearing round, red-tinted sunglasses and a long, textured dark leather trench coat over a black shirt. He stands in the center of a narrow, rain-slicked urban alley at night, heavily bathed in the intense, saturated red glow of multiple neon signs, some featuring vertical Chinese characters. The wet asphalt ground reflects the red light, and wisps of steam or fog rise around him. The background is a towering canyon of city buildings with blurred neon lights and signs, creating a dense, futuristic, neo-noir atmosphere with high detail and deep shadows.",
    date: "10 October 2025",
    settings: {
      model: "Flux",
      style: "Cinematic",
      dimension: "16:9",
      autoSpeech: "None",
      duration: "N/A",
    },
  },
  {
    id: 7,
    src: "/assets/images/gallery/7.jpeg",
    category: "Image",
    type: "Text to image",
    prompt:
      "A detailed, close-up portrait photograph of a man with a stubbly beard and short, dark hair, looking directly into the camera with an intense expression. His face is partially obscured by sharp, jagged shards of broken glass suspended in the air around him, with one large shard specifically framing his eyes. The scene is dramatically lit with intense red light and a strong rim light, against a smoky, hazy red background with blurred particles. The focus is sharp on the man's eyes and the glass shards.",
    date: "10 October 2025",
    settings: {
      model: "Flux",
      style: "Cinematic",
      dimension: "16:9",
      autoSpeech: "None",
      duration: "N/A",
    },
  },
  {
    id: 8,
    src: "/assets/images/gallery/8.jpeg",
    category: "Image",
    type: "Text to image",
    prompt:
      "A fantastical sci-fi landscape concept art, featuring a sleek, red futuristic spaceship with swept wings flying over a vibrant alien planet. Below the spacecraft are floating islands covered in a mix of vibrant red and green trees, rocky formations, and deep blue lakes within large craters. The sky is deep blue and filled with dramatic, fluffy white clouds, multiple large planets, and moons of various sizes. The scene is bathed in bright, natural daylight, showcasing high detail and a rich color palette.",
    date: "10 October 2025",
    settings: {
      model: "Flux",
      style: "Cinematic",
      dimension: "16:9",
      autoSpeech: "None",
      duration: "N/A",
    },
  },
  {
    id: 9,
    src: "/assets/images/gallery/9.jpeg",
    category: "Image",
    type: "Text to image",
    prompt:
      "A stylized comic book panel illustration of a young man with medium-length, wavy dark hair and sunglasses, wearing a black leather jacket. He is looking back over his shoulder with a serious expression. The entire scene, including the sprawling urban cityscape with skyscrapers and the cloudy sky in the background, is rendered in a striking monochromatic deep red color palette. The lighting is dramatic and high-contrast, with heavy shadows and bold line work, creating a cool, noir-inspired atmosphere.",
    date: "10 October 2025",
    settings: {
      model: "Flux",
      style: "Cinematic",
      dimension: "16:9",
      autoSpeech: "None",
      duration: "N/A",
    },
  },
  {
    id: 10,
    videoUrl: "/assets/videos/2.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600",
    category: "Video",
    type: "Image to video",
    prompt:
      "A cinematic cyberpunk-inspired fashion video of a strong bald woman wearing a metallic silver biker jacket, black fitted outfit, black combat boots, and red-tinted round sunglasses.She is crouching low in an abandoned industrial warehouse with concrete walls covered in graffiti, exposed machinery in the background.Red neon lights and warm industrial lighting create dramatic shadows and reflections on the metallic jacket.The camera is placed low and slightly angled, capturing her in a powerful grounded pose as she slowly shifts her weight and raises her head toward the camera.Dark, gritty, futuristic atmosphere with cinematic contrast, volumetric lighting, realistic reflections, high-end fashion film look.Shot on a 50mm lens, shallow depth of field, dramatic lighting, ultra-realistic textures.",
    referenceImage:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=100",
    date: "15 October 2025",
    settings: {
      model: "Gen-3",
      style: "Realistic",
      dimension: "9:16",
      autoSpeech: "None",
      duration: "5s",
    },
  },
  {
    id: 11,
    videoUrl: "/assets/videos/1.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1485846234645-a62644ef7467?auto=format&fit=crop&q=80&w=600",
    category: "Video",
    type: "Text to video",
    prompt:
      "Ultra-cinematic surreal desert scene set near the Great Pyramids of Giza at golden hour. A massive futuristic metallic loop highway rises organically from the desert sand, forming a perfect vertical ring. Multiple modern sports cars race through the loop at high speed, tires kicking up sand and dust. Motion blur on cars, sharp focus on the environment. Hyper-realistic lighting, dramatic shadows, volumetric sunlight, cinematic depth of field. The pyramids remain ancient, untouched, and monumental in the background, contrasting with the futuristic structure. Realistic physics, high realism, epic scale, IMAX-level cinematography, ultra-high resolution, clean composition, no text, no logos.Camera starts low at sand level, tracking alongside a speeding car → tilts upward as the car enters the vertical loop → wide cinematic reveal showing the full loop aligned with the pyramids → subtle slow-motion dust particles in the air → smooth stabilized camera, no shake.",
    date: "12 October 2025",
    settings: {
      model: "Gen-3",
      style: "Cyberpunk",
      dimension: "16:9",
      autoSpeech: "None",
      duration: "10s",
    },
  },
  {
    id: 12,
    videoUrl: "/assets/videos/3.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600",
    category: "Video",
    type: "Image to video",
    prompt:
      "A surreal cinematic interior with glossy deep-red tiled walls and floors, forming a narrow corridor lined with identical doors on both sides. A well-dressed man in a dark suit stands in the center, pushing against a door as if trapped in an endless architectural loop. Mirrors and reflections create multiple versions of him, slightly delayed and distorted. The environment feels symmetrical, unsettling, and precise. Overhead soft white lighting reflects sharply on the tiles. Hyper-clean surfaces, brutalist geometry, psychological tension, cinematic depth, ultra-realistic textures, no text, no logos.Camera slowly dollies forward through the corridor → subtle fisheye distortion increases → reflections multiply → cut to top-down view revealing the corridor forming a perfect geometric loop → the man appears centered inside an impossible architectural ring → slow rotation from above.",
    referenceImage:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=100",
    date: "15 October 2025",
    settings: {
      model: "Gen-3",
      style: "Realistic",
      dimension: "9:16",
      autoSpeech: "None",
      duration: "5s",
    },
  },
  {
    id: 13,
    videoUrl: "/assets/videos/4.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=600",
    category: "Video",
    type: "Image to video",
    prompt:
      "A cinematic fashion video of a confident androgynous woman with a short platinum blonde mullet haircut, wearing black cat-eye sunglasses, a sleeveless light blue denim vest over a black t-shirt, black mesh gloves.She is standing in a narrow corridor with glossy deep red ceramic tiles on both sides, forming strong leading lines toward the center.The camera is positioned slightly behind and to the side, capturing her as she slowly turns her head over her shoulder and locks eyes with the camera.Moody, editorial fashion tone. Soft natural light from above, subtle shadows on her face, high contrast but clean color grading.Ultra-realistic skin texture, sharp focus, cinematic depth of field.Shot on a 35mm lens, shallow depth, fashion film aesthetic, luxury street style energy, slow motion, confident body language.",
    referenceImage:
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=100",
    date: "15 October 2025",
    settings: {
      model: "Gen-3",
      style: "Realistic",
      dimension: "9:16",
      autoSpeech: "None",
      duration: "5s",
    },
  },
];

export function ExploreImagineSection() {
  const [activeTab, setActiveTab] = useState("Image");
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const router = useRouter();

  const filteredData = useMemo(() => {
    return exploreData.filter((item) => item.category === activeTab);
  }, [activeTab]);

  const handleCreateSimilar = (item: any) => {
    const baseUrl = item.category === "Image" ? "/image" : "/video";
    const params = new URLSearchParams();

    if (item.prompt) params.append("prompt", item.prompt);
    if (item.referenceImage) params.append("ref", item.referenceImage);

    const mode = item.type.toLowerCase().includes("text") ? "text" : "image";
    params.append("mode", mode);

    router.push(`${baseUrl}?${params.toString()}`);
    setSelectedItem(null);
  };

  return (
    <div className="mb-24 relative w-full font-[Inter]">
      <DecorativeGrid />
      <div className="relative z-10">
        <div className="flex flex-col justify-between gap-6 mb-10">
          <h3 className="text-[24px] md:text-[28px] font-black text-[#110C0C] tracking-tight">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ED2024] to-[#110C0C]">
              Imagine
            </span>
          </h3>

          <div className="flex bg-[#E9E7E7] p-1.5 rounded-full w-fit shadow-inner">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={cn(
                  "px-8 py-2.5 rounded-full text-sm font-medium transition-all duration-500",
                  activeTab === cat
                    ? "bg-white text-[#110C0C] shadow-md"
                    : "text-[#8A8A8A] hover:text-[#110C0C]",
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-2 sm:columns-3 lg:columns-4 gap-6 [column-fill:_balance]">
          {filteredData.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedItem(item)}
              className="group relative overflow-hidden rounded-[24px] bg-[#F5F5F5]
  border border-[#E5E5E8] cursor-pointer mb-6 break-inside-avoid shadow-sm hover:shadow-xl transition-all"
            >
              {/* Content Preview - Videos play always */}
              {item.category === "Image" ? (
                <img
                  src={item.src}
                  alt=""
                  className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
                />
              ) : (
                <div className="relative w-full bg-black">
                  <video
                    src={item.videoUrl}
                    className="w-full h-auto object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    poster={item.thumbnail}
                  />

                  <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-2 py-1 rounded-md">
                    <Play className="w-3 h-3 text-white fill-current" />
                  </div>
                </div>
              )}

              {/* Hover Overlay - Matching exact design */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col p-5">
                <div className="flex items-center justify-between">
                  <div className="px-3 py-1 bg-white/20 backdrop-blur-md border border-white/20 rounded-lg">
                    <span className="text-[11px] font-bold text-white whitespace-nowrap">
                      {item.type}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Smartphone className="w-4 h-4 text-black" />
                    </button>
                    <button
                      className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DownloadCloud className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </div>

                <div className="flex-1 flex items-center justify-center px-4">
                  <p className="text-[14px] text-white/90 font-medium text-center leading-relaxed line-clamp-4">
                    {item.prompt}
                  </p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCreateSimilar(item);
                  }}
                  className="w-full h-[48px] bg-[#1A0505] text-white rounded-full font-bold text-[14px] hover:bg-black transition-all shadow-xl active:scale-95"
                >
                  Create similar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Detail View */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-[1000] animate-in fade-in duration-300">
          <div className="bg-white rounded-3xl max-w-5xl w-full h-[95vh] shadow-2xl relative animate-in zoom-in-95 duration-500 overflow-hidden">
            <div className="p-8 h-full overflow-y-auto elegant-scroll">
              {/* Header Actions */}
              <div className="flex justify-end mb-4">
                <button
                  onClick={() => setSelectedItem(null)}
                  className="w-10 h-10 bg-[#F8F8F8] rounded-full flex items-center justify-center hover:bg-gray-100 transition-all shadow-sm"
                >
                  <X className="w-5 h-5 text-[#110C0C]" />
                </button>
              </div>

              <div className="flex flex-col lg:flex-row gap-8 bg-[#F2F2F2] rounded-[32px] p-6 border border-gray-100">
                {/* Left Side: Preview */}
                <div className="flex-1 relative rounded-2xl overflow-hidden bg-white border border-gray-200 min-h-[400px] flex items-center justify-center group shadow-sm">
                  {selectedItem.category === "Image" ? (
                    <img
                      src={selectedItem.src}
                      className="max-w-full max-h-[600px] object-contain"
                      alt=""
                    />
                  ) : (
                    <video
                      src={selectedItem.videoUrl}
                      controls
                      autoPlay
                      loop
                      className="max-w-full max-h-[600px] object-contain"
                    />
                  )}

                  <div className="absolute top-4 right-4 flex gap-2">
                    <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all">
                      <Maximize2 className="w-4 h-4 text-black" />
                    </button>
                    <button className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-all">
                      <Download className="w-4 h-4 text-black" />
                    </button>
                  </div>
                </div>

                {/* Right Side: Details Info */}
                <div className="w-full lg:w-[420px] flex flex-col">
                  <div className="flex items-center justify-between mb-4 px-1">
                    <div className="px-4 py-1.5 bg-white border border-gray-200 rounded-full shadow-sm">
                      <span className="text-[12px] font-bold text-[#110C0C]">
                        {selectedItem.type}
                      </span>
                    </div>
                    <span className="text-[12px] text-[#8A8A8A] font-bold tracking-tight uppercase opacity-60">
                      {selectedItem.date}
                    </span>
                  </div>

                  <div className="space-y-5">
                    {/* Reference Image Section */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                      <p className="text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest mb-3">
                        Reference image
                      </p>
                      <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-100 bg-gray-50 group cursor-pointer relative">
                        {selectedItem.referenceImage ? (
                          <img
                            src={selectedItem.referenceImage}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-gray-200" />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Prompt Section */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200 relative shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest">
                          Prompt
                        </p>
                        <button className="w-7 h-7 flex items-center justify-center bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
                          <Copy className="w-3.5 h-3.5 text-gray-400" />
                        </button>
                      </div>
                      <p className="text-[14px] text-[#110C0C] font-semibold leading-relaxed line-clamp-6">
                        {selectedItem.prompt}
                      </p>
                    </div>

                    {/* Settings Section */}
                    <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
                      <p className="text-[11px] font-black text-[#8A8A8A] uppercase tracking-widest mb-3">
                        Settings
                      </p>
                      <div className="space-y-2.5">
                        {selectedItem.settings &&
                          Object.entries(selectedItem.settings).map(
                            ([key, val]: [string, any]) => (
                              <div
                                key={key}
                                className="flex justify-between items-center text-[13px] group"
                              >
                                <span className="text-[#8A8A8A] capitalize font-medium">
                                  {key.replace(/([A-Z])/g, " $1")}
                                </span>
                                <span className="text-[#110C0C] font-black tracking-tight">
                                  {val}
                                </span>
                              </div>
                            ),
                          )}
                      </div>
                    </div>

                    {/* Create Similar Button */}
                    <button
                      onClick={() => handleCreateSimilar(selectedItem)}
                      className="w-full h-[60px] bg-[#0A0404] text-white rounded-2xl font-black uppercase tracking-widest text-[14px] hover:bg-black transition-all shadow-xl active:scale-[0.98] mt-2"
                    >
                      Create similar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
