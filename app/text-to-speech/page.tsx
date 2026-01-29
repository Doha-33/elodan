import PageLayout from '@/components/PageLayout'
import Button from '@/components/ui/Button'

export default function TextToSpeechPage() {
  return (
    <PageLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Text to Speech</h1>
          <p className="text-gray-600 text-lg">
            Convert your text into natural-sounding speech
          </p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">Text to Convert</label>
              <textarea
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[200px]"
                placeholder="Enter the text you want to convert to speech..."
                defaultValue="Hello, this is a sample text that will be converted to speech."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Voice</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Male Voice 1</option>
                  <option>Male Voice 2</option>
                  <option>Female Voice 1</option>
                  <option>Female Voice 2</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Speed</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option>Slow</option>
                  <option>Normal</option>
                  <option>Fast</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                className="flex-1 bg-[#8B2E3D] hover:bg-[#7A2635] text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Generate Speech
              </button>
              <button
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Preview
              </button>
            </div>

            {/* Audio Player */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-4">
                <button className="p-3 bg-[#8B2E3D] text-white rounded-full hover:bg-[#7A2635] transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
                <div className="flex-1">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#8B2E3D] w-1/3"></div>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-2">
                    <span>0:00</span>
                    <span>0:15</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}
