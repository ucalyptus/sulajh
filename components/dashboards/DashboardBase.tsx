interface DashboardBaseProps {
  children: React.ReactNode
  title: string
}

export function DashboardBase({ children, title }: DashboardBaseProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-8">{title}</h1>
        {children}
      </div>
    </div>
  )
} 