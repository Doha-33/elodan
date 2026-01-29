const SPHERE_IMAGE = "/assets/images/gallery/ae6eae1791ddb0edfefe2427ae5d226182a72a39.gif";

export function ChatHero() {
  return (
    <div 
      className="flex flex-col items-center gap-[2px] px-4 py-12 font-[Inter]"
      data-node-id="75:4249"
    >
      {/* Sphere Image */}
      <div 
        className="relative w-[159px] h-[159.646px] mb-2"
        data-node-id="811:8566"
      >
        <img 
          src={SPHERE_IMAGE} 
          alt="AI Sphere" 
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
      </div>

      {/* Text Content */}
      <div 
        className="flex flex-col items-center gap-2 text-center w-full"
        data-node-id="75:4251"
      >
        {/* Main Heading */}
        <h1 
          className="text-[32px] font-semibold leading-[60px] tracking-[-2.2px] bg-clip-text text-transparent bg-gradient-to-r from-[#160D0D] to-[#9E1518] font-[Inter]"
          data-node-id="75:4252"
        >
          Unleash your creativity. One chat endless possibilities.
        </h1>
        
        {/* Subheading */}
        <p 
          className="text-[16px] font-medium leading-[20px] text-[#160D0D]/70 font-[Inter]"
          data-node-id="75:4253"
        >
          Share your thoughts and lets see how much we can go further!
        </p>
      </div>
    </div>
  )
}
