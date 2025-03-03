'use client'

import { useState, useEffect, useRef } from 'react'
import { useCompletion } from 'ai/react'
import ReactMarkdown from 'react-markdown'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card } from '@/components/ui/card'

export default function TestLLM() {
  const [role, setRole] = useState<'platform' | 'neutral' | 'judgment'>('platform')
  const [testPrompt, setTestPrompt] = useState('')
  const [formattedResponse, setFormattedResponse] = useState('')
  const [isFirstResponse, setIsFirstResponse] = useState(true)
  const [model, setModel] = useState<'ollama' | 'gpt4'>('ollama')
  const responseBuffer = useRef('')
  const lastChunkRef = useRef('')
  
  const { completion, complete, isLoading } = useCompletion({
    api: model === 'ollama' ? '/api/test-llm' : '/api/test-gpt4',
    onResponse: (response) => {
      if (isFirstResponse) {
        setFormattedResponse('')
        responseBuffer.current = ''
        lastChunkRef.current = ''
        setIsFirstResponse(false)
      }
    },
    onFinish: () => {
      setIsFirstResponse(true)
      if (model === 'gpt4') {
        setFormattedResponse(responseBuffer.current)
      }
    }
  })

  const handleTest = async () => {
    if (!testPrompt) return
    setIsFirstResponse(true)
    setFormattedResponse('')
    responseBuffer.current = ''
    lastChunkRef.current = ''
    try {
      await complete(JSON.stringify({
        prompt: testPrompt,
        role
      }))
    } catch (error) {
      console.error('Error during completion:', error)
      setFormattedResponse('Error: Failed to get response from LLM')
    }
  }

  useEffect(() => {
    if (!completion || !isLoading) return

    try {
      if (model === 'ollama') {
        // Process Ollama response format
        const lines = completion.split('\n')
        let newText = ''
        
        for (const line of lines) {
          if (!line.trim()) continue
          
          try {
            const responseObj = JSON.parse(line)
            if (responseObj.response) {
              newText += responseObj.response
            }
          } catch (e) {
            continue
          }
        }
        
        if (newText.trim()) {
          setFormattedResponse(prev => prev + newText)
        }
      } else {
        // For GPT-4, process the response to avoid duplicates
        const currentChunk = completion
        
        // Only add the new content that hasn't been seen before
        if (!lastChunkRef.current.endsWith(currentChunk)) {
          const newContent = currentChunk.replace(lastChunkRef.current, '')
          if (newContent) {
            responseBuffer.current += newContent
            lastChunkRef.current = currentChunk
            setFormattedResponse(responseBuffer.current)
          }
        }
      }
    } catch (e) {
      console.error('Error processing response:', e)
    }
  }, [completion, isLoading, model])

  const samplePrompts = {
    platform: "I have a dispute with my landlord over a security deposit. They're withholding $800 for damages I don't believe I caused. What steps should I take?",
    neutral: "Please review this case between a customer and an online retailer. The customer claims they never received a $150 order shipped 2 months ago. The retailer shows delivery confirmation but no signature.",
    judgment: "Based on the evidence presented in case #1234 regarding a contract dispute between ABC Corp and XYZ Ltd, please provide a final judgment."
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Test LLM Response</h1>
      
      <Card className="mb-4 p-4">
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2">Select Model:</label>
              <Select
                value={model}
                onValueChange={(value: 'ollama' | 'gpt4') => setModel(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select model" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ollama">Llama 3.2 (Ollama)</SelectItem>
                  <SelectItem value="gpt4">GPT-4</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="block mb-2">Select Role:</label>
              <Select
                value={role}
                onValueChange={(value: typeof role) => setRole(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="platform">Platform</SelectItem>
                  <SelectItem value="neutral">Neutral Party</SelectItem>
                  <SelectItem value="judgment">Final Judgment</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <label className="block mb-2">Test Prompt:</label>
            <Textarea
              value={testPrompt}
              onChange={(e) => setTestPrompt(e.target.value)}
              rows={4}
              className="w-full"
              placeholder="Enter your test prompt here..."
            />
          </div>

          <div className="flex gap-2">
            <Button
              onClick={() => setTestPrompt(samplePrompts[role])}
              variant="outline"
            >
              Load Sample Prompt
            </Button>
            <Button onClick={handleTest} disabled={isLoading}>
              {isLoading ? 'Testing...' : 'Test Response'}
            </Button>
          </div>
        </div>
      </Card>

      {(formattedResponse || isLoading) && (
        <Card className="p-4">
          <h2 className="font-semibold mb-2">LLM Response:</h2>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            {isLoading && !formattedResponse ? (
              <div className="animate-pulse">Generating response...</div>
            ) : (
              <ReactMarkdown>{formattedResponse}</ReactMarkdown>
            )}
          </div>
        </Card>
      )}
    </div>
  )
} 