import { Suspense } from 'react'
import { Platform } from '../components'

export default function PlatformPage() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Platform Review</h1>
      <Suspense fallback={<div>Loading...</div>}>
        <Platform />
      </Suspense>
    </div>
  )
} 