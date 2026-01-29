'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { videoEffectService } from '@/lib/services/videoEffect.service'
import { useToast } from '@/components/ui/Toast'
import { compressImage } from '@/lib/utils/image'
import { cn } from '@/lib/utils'
import { Upload, X, Check, ChevronDown, Sparkles, Image as ImageIcon } from 'lucide-react'
import { GenerateButton } from '@/components/ui/GenerateButton'

export function VideoEffectSettings({ onGenerated }: { onGenerated?: (data: any) => void }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [scenes, setScenes] = useState<any[]>([])
  const [selectedScene, setSelectedScene] = useState<any>(null)
  const [prompt, setPrompt] = useState('')
  const { showToast } = useToast()
  
  // Image Upload State
  const [inputImage, setInputImage] = useState<File | null>(null)
  const [inputImagePreview, setInputImagePreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const [modelsData, catsData] = await Promise.all([
          videoEffectService.getModels(),
          videoEffectService.getCategories()
        ])
        
        const fetchedCats = catsData.categories || []
        setCategories([{ name: 'All' }, ...fetchedCats])
        
        if (modelsData && modelsData.length > 0) {
          const allScenes = modelsData.flatMap(m => (m.scenes || []).map((s: any) => ({ 
            ...s, 
            isLocked: m.isLocked,
            modelName: m.name
          })))
          setScenes(allScenes)
          if (allScenes.length > 0) {
            const initialScene = allScenes.find(s => !s.isLocked) || allScenes[0]
            setSelectedScene(initialScene)
          }
        }
      } catch (err) {
        console.error("Failed to load effects data", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredScenes = selectedCategory === 'All' 
    ? scenes 
    : scenes.filter(s => s.category === selectedCategory)

  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file', 'error')
      return
    }
    setInputImage(file)
    const reader = new FileReader()
    reader.onload = (e) => setInputImagePreview(e.target?.result as string)
    reader.readAsDataURL(file)
  }, [showToast])

  const handleGenerate = async () => {
    if (!inputImage || !selectedScene) {
      showToast('Upload image and select template', 'warning')
      return
    }

    setIsGenerating(true)
    try {
      const compressed = await compressImage(inputImage, 3.0)
      
      const res = await videoEffectService.generate({
        image: compressed,
        effectScene: selectedScene.sceneId,
        prompt: prompt || undefined
      })
      
      if (res.success && res.data) {
        showToast('Generation complete!', 'success')
        // إرسال البيانات فوراً لفتح الـ Lightbox
        onGenerated?.(res.data)
        setPrompt('')
      } else {
        showToast('Processing started. Check history.', 'info')
        onGenerated?.(null)
      }
    } catch (err: any) {
      showToast(err.message || 'Generation failed', 'error')
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="w-[440px] h-full bg-white border-r border-[#F0F0F3] p-7 flex flex-col font-['Outfit',sans-serif] overflow-y-auto elegant-scroll">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h1 className="text-2xl font-black text-[#110C0C] tracking-tight">AI Templates</h1>
        </div>
        <p className="text-[13px] text-[#8A8A8A] font-medium leading-relaxed">Bring your static photos to life with cinematic motion effects.</p>
      </div>

      {/* Image Upload Area */}
      <div className="mb-8">
        {inputImagePreview ? (
          <div className="relative group">
            <div className="w-full aspect-video rounded-2xl overflow-hidden border-2 border-[#F0F0F3] bg-gray-50 shadow-inner">
              <img src={inputImagePreview} alt="Input" className="w-full h-full object-contain" />
            </div>
            <button
              onClick={() => { setInputImage(null); setInputImagePreview(null); }}
              className="absolute top-3 right-3 w-9 h-9 bg-black/70 hover:bg-black/90 rounded-full flex items-center justify-center transition-all border border-white/20"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFileSelect(e.dataTransfer.files[0]); }}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "w-full aspect-video rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center justify-center gap-4 group",
              isDragging ? "border-purple-500 bg-purple-50" : "border-[#E5E5E8] hover:border-purple-400 hover:bg-purple-50/30"
            )}
          >
            <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center text-[#8A8A8A]">
              <ImageIcon className="w-7 h-7" />
            </div>
            <p className="text-[15px] font-bold text-[#110C0C]">Upload your photo</p>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])} />
          </div>
        )}
      </div>

      {/* Categories */}
      <div className="mb-6">
        <div className="flex gap-2 overflow-x-auto pb-2 elegant-scroll">
          {categories.map(cat => (
            <button
              key={cat.name}
              onClick={() => setSelectedCategory(cat.name)}
              className={cn(
                "px-5 py-2 rounded-2xl text-[12px] font-bold whitespace-nowrap transition-all border-2",
                selectedCategory === cat.name ? "bg-[#110C0C] text-white border-[#110C0C]" : "bg-white text-[#8A8A8A] border-[#F0F0F3]"
              )}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="flex-1 min-h-[250px] overflow-y-auto custom-scrollbar mb-8">
        <div className="grid grid-cols-2 gap-4">
          {filteredScenes.map(scene => (
            <button
              key={scene.sceneId}
              disabled={scene.isLocked}
              onClick={() => setSelectedScene(scene)}
              className={cn(
                "p-4 rounded-2xl border-2 transition-all text-left flex flex-col gap-3 group relative",
                selectedScene?.sceneId === scene.sceneId ? "border-purple-600 bg-purple-50/50" : "border-[#F0F0F3] hover:border-purple-200",
                scene.isLocked && "opacity-60 grayscale cursor-not-allowed"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  selectedScene?.sceneId === scene.sceneId ? "bg-purple-600 text-white" : "bg-gray-100 text-[#8A8A8A]"
                )}>
                  {scene.isLocked ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg> : <Sparkles className="w-5 h-5" />}
                </div>
                {selectedScene?.sceneId === scene.sceneId && <Check className="w-4 h-4 text-purple-600" strokeWidth={4} />}
              </div>
              <span className="text-[13px] font-black leading-tight truncate">{scene.name || scene.sceneId}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Footer / Generate */}
      <div className="mt-auto pt-6 space-y-4">
        <textarea 
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Custom instructions (Optional)..."
          className="w-full h-24 p-4 bg-[#F9F9FB] border-2 border-[#F0F0F3] rounded-2xl text-[14px] font-medium focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all resize-none"
        />
        <GenerateButton
          onClick={handleGenerate}
          isLoading={isGenerating}
          credits={selectedScene?.creditCost || 40}
          className="w-full h-[60px] rounded-2xl"
          disabled={!inputImage || !selectedScene}
        />
      </div>
    </div>
  )
}