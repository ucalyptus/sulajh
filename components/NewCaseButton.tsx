'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function NewCaseButton() {
  const router = useRouter()

  return (
    <Button 
      onClick={() => router.push('/cases/new')}
      className="bg-blue-600 hover:bg-blue-700"
    >
      File New Case
    </Button>
  )
} 