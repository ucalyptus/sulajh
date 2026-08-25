'use client'

import { Button } from '@/components/ui/button'
import { useRouter } from '@tanstack/react-router'
import * as stylex from '@stylexjs/stylex'
import { colors } from '@/styles/tokens.stylex'

const styles = stylex.create({
  button: {
    backgroundColor: colors.blue600,
    color: colors.white,
    ':hover': {
      backgroundColor: colors.blue700,
    },
  },
})

export default function NewCaseButton() {
  const router = useRouter()

  return (
    <Button 
      onClick={() => router.navigate({ to: '/cases/new' })}
      style={styles.button}
    >
      File New Case
    </Button>
  )
}
