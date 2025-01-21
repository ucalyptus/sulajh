'use client'

import ReactMarkdown from 'react-markdown'
import { Card } from "@/components/ui/card"

interface CaseJudgmentProps {
  judgment: string
}

export function CaseJudgment({ judgment }: CaseJudgmentProps) {
  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-4">Case Decision</h2>
      <div className="prose prose-indigo max-w-none">
        <ReactMarkdown
          components={{
            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="text-xl font-semibold mt-6 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="text-lg font-medium mt-4 mb-2">{children}</h3>,
            p: ({ children }) => <p className="mb-4 text-gray-700">{children}</p>,
            ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
            li: ({ children }) => <li className="mb-1">{children}</li>,
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-indigo-200 pl-4 italic my-4">
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