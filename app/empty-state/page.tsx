import PageLayout from '@/components/PageLayout'
import Button from '@/components/ui/Button'

export default function EmptyStatePage() {
  return (
    <PageLayout>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="text-center max-w-md">
          <div className="mb-8">
            <svg className="w-24 h-24 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold mb-4">No content yet</h1>
          <p className="text-gray-600 mb-8">
            Get started by creating your first piece of content. Click the button below to begin.
          </p>
          <button
            className="bg-[#8B2E3D] hover:bg-[#7A2635] text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Create Now
          </button>
        </div>
      </div>
    </PageLayout>
  )
}
