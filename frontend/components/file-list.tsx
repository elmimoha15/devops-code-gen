"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileActions } from "@/components/file-actions"
import { Archive } from "lucide-react"
import { generateZipFile, type GeneratedFile } from "@/lib/file-generator"

interface FileListProps {
  files: GeneratedFile[]
  onSelect: (index: number) => void
  selectedIndex: number
}

export function FileList({ files, onSelect, selectedIndex }: FileListProps) {
  const [isDownloadingZip, setIsDownloadingZip] = useState(false)

  const handleDownloadAll = async () => {
    if (files.length === 0) return

    try {
      setIsDownloadingZip(true)
      const zipBlob = await generateZipFile(files)
      const url = URL.createObjectURL(zipBlob)
      const a = document.createElement("a")
      a.href = url
      a.download = "config-files.zip"
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error generating zip file:", error)
    } finally {
      setIsDownloadingZip(false)
    }
  }

  if (files.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500 dark:text-gray-400">No files generated yet</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Generated Files</h3>
        {files.length > 1 && (
          <Button variant="outline" size="sm" onClick={handleDownloadAll} disabled={isDownloadingZip}>
            <Archive className="h-4 w-4 mr-2" />
            {isDownloadingZip ? "Downloading..." : "Download All"}
          </Button>
        )}
      </div>

      <div className="space-y-2">
        {files.map((file, index) => (
          <div
            key={index}
            className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
              index === selectedIndex ? "bg-gray-100 dark:bg-gray-800" : "hover:bg-gray-50 dark:hover:bg-gray-900"
            }`}
            onClick={() => onSelect(index)}
          >
            <div className="truncate">{file.name}</div>
            {index === selectedIndex && <FileActions fileName={file.name} content={file.content} />}
          </div>
        ))}
      </div>
    </div>
  )
}

