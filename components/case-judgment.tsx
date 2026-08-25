'use client'

import ReactMarkdown from 'react-markdown'
import { Card } from "@/components/ui/card"
import * as stylex from '@stylexjs/stylex'
import { colors, spacing } from '@/styles/tokens.stylex'

const styles = stylex.create({
  card: {
    padding: spacing[6],
  },
  heading: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: spacing[4],
    margin: 0,
  },
  h1: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: spacing[4],
  },
  h2: {
    fontSize: '1.25rem',
    fontWeight: 600,
    marginTop: spacing[6],
    marginBottom: spacing[3],
  },
  h3: {
    fontSize: '1.125rem',
    fontWeight: 500,
    marginTop: spacing[4],
    marginBottom: spacing[2],
  },
  p: {
    marginBottom: spacing[4],
    color: colors.gray700,
    lineHeight: 1.6,
  },
  ul: {
    listStyleType: 'disc',
    paddingLeft: spacing[6],
    marginBottom: spacing[4],
  },
  ol: {
    listStyleType: 'decimal',
    paddingLeft: spacing[6],
    marginBottom: spacing[4],
  },
  li: {
    marginBottom: spacing[1],
  },
  blockquote: {
    borderLeftWidth: '4px',
    borderLeftStyle: 'solid',
    borderLeftColor: colors.indigo200,
    paddingLeft: spacing[4],
    fontStyle: 'italic',
    marginTop: spacing[4],
    marginBottom: spacing[4],
  },
})

interface CaseJudgmentProps {
  judgment: string
}

export function CaseJudgment({ judgment }: CaseJudgmentProps) {
  return (
    <Card style={styles.card}>
      <h2 {...stylex.props(styles.heading)}>Case Decision</h2>
      <div>
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 {...stylex.props(styles.h1)}>{children}</h1>,
            h2: ({ children }) => <h2 {...stylex.props(styles.h2)}>{children}</h2>,
            h3: ({ children }) => <h3 {...stylex.props(styles.h3)}>{children}</h3>,
            p: ({ children }) => <p {...stylex.props(styles.p)}>{children}</p>,
            ul: ({ children }) => <ul {...stylex.props(styles.ul)}>{children}</ul>,
            ol: ({ children }) => <ol {...stylex.props(styles.ol)}>{children}</ol>,
            li: ({ children }) => <li {...stylex.props(styles.li)}>{children}</li>,
            blockquote: ({ children }) => (
              <blockquote {...stylex.props(styles.blockquote)}>
                {children}
              </blockquote>
            ),
          }}
        >
          {judgment}
        </ReactMarkdown>
      </div>
    </Card>
  )
}
