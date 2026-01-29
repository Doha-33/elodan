import PageLayout from '@/components/PageLayout'

export default function TextToVideoPage() {
  return (
    <PageLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-display text-brand mb-4">Text to Video</h1>
          <p className="text-body-lg text-muted-foreground">
            Transform your ideas into cinematic masterpieces with our advanced AI video engine.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-50 p-6">
              <h2 className="text-lg font-bold mb-6 text-gray-900">Customization</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Duration</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['15s', '30s', '60s'].map((d) => (
                      <button key={d} className={`py-2 text-xs font-bold rounded-lg border transition-all ${d === '15s' ? 'bg-brand/10 border-brand text-brand' : 'bg-white border-gray-100 text-gray-600 hover:border-brand/20'}`}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Art Style</label>
                  <select className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all text-sm font-medium">
                    <option>Cinematic & Realistic</option>
                    <option>Anime & Manga</option>
                    <option>3D Animation</option>
                    <option>Cyberpunk</option>
                    <option>Oil Painting</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Aspect Ratio</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button className="flex items-center justify-center gap-2 py-3 border border-brand bg-brand/5 rounded-xl text-brand text-xs font-bold">
                      <div className="w-4 h-3 bg-brand/20 border border-brand/40 rounded-sm" />
                      16:9 Wide
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 border border-gray-100 hover:border-brand/20 rounded-xl text-gray-600 text-xs font-bold">
                      <div className="w-3 h-4 bg-gray-200 border border-gray-300 rounded-sm" />
                      9:16 Port
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-brand/5 border border-brand/10 rounded-2xl">
              <p className="text-xs text-brand-700 leading-relaxed font-medium">
                <strong>Pro Tip:</strong> Be specific about lighting (e.g., "golden hour") and camera movement (e.g., "drone shot") for better results.
              </p>
            </div>
          </div>

          {/* Prompt Panel */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-50 p-8">
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-900 mb-3">Your Prompt</label>
                <textarea
                  className="w-full px-6 py-5 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all min-h-[200px] text-gray-800 placeholder:text-gray-400 leading-relaxed"
                  placeholder="Describe your scene in detail... e.g., 'A futuristic city in the clouds, neon lights reflecting on wet pavement, cinematic lighting, 8k resolution...'"
                />
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                      <div className="w-full h-full bg-gradient-to-br from-brand-200 to-brand-400" />
                    </div>
                  ))}
                  <div className="px-3 flex items-center text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Credits: 45 left
                  </div>
                </div>
                <button className="btn-brand px-10 py-3.5 shadow-xl shadow-brand/30">
                  Generate Video
                </button>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Recent Creations</h2>
                <button className="text-sm font-bold text-brand hover:underline">View All</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[1, 2].map((i) => (
                  <div key={i} className="group relative aspect-video bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 shadow-sm transition-all hover:shadow-lg">
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-100/50 to-brand-300/50 flex flex-col items-center justify-center">
                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                        <svg className="w-5 h-5 text-brand ml-1" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <span className="mt-4 text-xs font-bold text-brand-900 bg-white/40 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        Snowy Little Tiger
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
