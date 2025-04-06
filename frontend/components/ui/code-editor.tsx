"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy, Check } from "lucide-react"

interface CodeEditorProps {
  value: string
  language?: string
  readOnly?: boolean
  onChange?: (value: string) => void
  height?: string
}

export function CodeEditor({ value, language = "yaml", readOnly = true, onChange, height = "400px" }: CodeEditorProps) {
  const [copied, setCopied] = useState(false)
  const preRef = useRef<HTMLPreElement>(null)

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  useEffect(() => {
    // This would be where you'd initialize a code editor like Monaco or CodeMirror
    // For simplicity, we're just using a pre tag with syntax highlighting via CSS
  }, [])

  return (
    <div className="relative">
      <div className="absolute right-2 top-2 z-10">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCopy}
          className="h-8 w-8 bg-gray-800/30 hover:bg-gray-800/50"
        >
          {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-300" />}
        </Button>
      </div>
      <pre
        ref={preRef}
        className={`p-4 rounded-md bg-gray-900 text-gray-100 overflow-auto text-sm font-mono`}
        style={{ height }}
        contentEditable={!readOnly}
        suppressContentEditableWarning={true}
        onBlur={(e) => onChange?.(e.currentTarget.textContent || "")}
      >
        <code className={`language-${language}`}>{value}</code>
      </pre>
    </div>
  )
}

