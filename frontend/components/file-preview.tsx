"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Copy, Check } from "lucide-react"

type FilePreviewProps = {
  files: { name: string; content: string }[]
}

export function FilePreview({ files }: FilePreviewProps) {
  const [activeFile, setActiveFile] = useState<number>(0)
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (files.length === 0) return

    navigator.clipboard.writeText(files[activeFile].content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    if (files.length === 0) return

    const file = files[activeFile]
    const blob = new Blob([file.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  if (files.length === 0) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent className="text-center p-6">
          <p className="text-gray-500 dark:text-gray-400">
            Configure your options and generate a file to see the preview here
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle>File Preview</CardTitle>
          <div className="flex space-x-2">
            <Button variant="outline" size="icon" onClick={handleCopy} title="Copy to clipboard">
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
            <Button variant="outline" size="icon" onClick={handleDownload} title="Download file">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-0 pb-6 px-6">
        {files.length > 1 ? (
          <Tabs
            value={activeFile.toString()}
            onValueChange={(value) => setActiveFile(Number.parseInt(value))}
            className="w-full"
          >
            <TabsList className="mb-4">
              {files.map((file, index) => (
                <TabsTrigger key={index} value={index.toString()}>
                  {file.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {files.map((file, index) => (
              <TabsContent key={index} value={index.toString()} className="mt-0">
                <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
                  <code>{file.content}</code>
                </pre>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <div>
            <div className="text-sm font-medium mb-2">{files[0].name}</div>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md overflow-auto max-h-[500px] text-sm">
              <code>{files[0].content}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

