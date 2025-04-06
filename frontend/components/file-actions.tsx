"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Download, Copy, Share, MoreVertical, Check } from "lucide-react"
import { downloadFile, copyToClipboard } from "@/lib/file-generator"

interface FileActionsProps {
  fileName: string
  content: string
  onShare?: () => void
}

export function FileActions({ fileName, content, onShare }: FileActionsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await copyToClipboard(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    downloadFile(fileName, content)
  }

  return (
    <div className="flex items-center space-x-2">
      <Button variant="outline" size="sm" className="h-8" onClick={handleCopy}>
        {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
        {copied ? "Copied" : "Copy"}
      </Button>

      <Button variant="outline" size="sm" className="h-8" onClick={handleDownload}>
        <Download className="h-4 w-4 mr-2" />
        Download
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onShare && (
            <DropdownMenuItem onClick={onShare}>
              <Share className="h-4 w-4 mr-2" />
              Share
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

