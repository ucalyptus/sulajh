export default function CaseDetailLoading() {
  return (
    <div className="container mx-auto p-8">
      <div className="animate-pulse space-y-6">
        <div className="h-10 bg-gray-200 rounded w-1/3"></div>
        <div className="h-6 bg-gray-200 rounded w-24"></div>
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    </div>
  )
}
