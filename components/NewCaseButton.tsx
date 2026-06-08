'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from '@tanstack/react-router'

export default function NewCaseButton() {
  const router = useRouter()

  return (
    <Button 
      onClick={() => router.navigate({ to: '/cases/new' })}
      className="bg-blue-600 hover:bg-blue-700"
    >
      File New Case
    </Button>
  )
} 