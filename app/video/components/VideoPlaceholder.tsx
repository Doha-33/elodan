'use client'

const VIDEO_PLACEHOLDER_ICON = "/assets/icons/ui/image.svg"

export function VideoPlaceholder() {
  return (
    <div className="flex-1 flex items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4 text-center">
        {/* Video Icon */}
        <div className="w-[102px] h-[102px] flex items-center justify-center bg-[#F8F8F8] rounded-2xl">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
            <path d="M38 16L28 24L38 32V16Z" fill="#8A8A8A" />
            <rect x="10" y="14" width="18" height="20" rx="2" fill="#8A8A8A" />
          </svg>
        </div>

        {/* Text */}
        <div>
          <h3 className="text-[16px] font-medium text-[#110C0C] mb-1">
            Video Not Found
          </h3>
          <p className="text-[14px] text-[#8A8A8A]">
            Start creating your first video
          </p>
        </div>
      </div>
    </div>
  )
}
