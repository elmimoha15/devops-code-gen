"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DockerfileGenerator } from "@/components/dockerfile-generator"
import { KubernetesGenerator } from "@/components/kubernetes-generator"
import { FilePreview } from "@/components/file-preview"
import { Header } from "@/components/header"
import { FileList } from "@/components/file-list"
import type { GeneratedFile } from "@/lib/file-generator"

export default function Home() {
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([])
  const [selectedFileIndex, setSelectedFileIndex] = useState(0)

  const handleFilesGenerated = (files: GeneratedFile[]) => {
    setGeneratedFiles(files)
    setSelectedFileIndex(0)
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Header />

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
              DevOps Code Gen
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Generate Dockerfiles and Kubernetes manifests with ease
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
              <Tabs defaultValue="dockerfile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="dockerfile">Dockerfile</TabsTrigger>
                  <TabsTrigger value="kubernetes">Kubernetes</TabsTrigger>
                </TabsList>
                <TabsContent value="dockerfile">
                  <DockerfileGenerator onGenerate={handleFilesGenerated} />
                </TabsContent>
                <TabsContent value="kubernetes">
                  <KubernetesGenerator onGenerate={handleFilesGenerated} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                <FileList files={generatedFiles} onSelect={setSelectedFileIndex} selectedIndex={selectedFileIndex} />
              </div>

              {generatedFiles.length > 0 && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
                  <FilePreview files={[generatedFiles[selectedFileIndex]]} />
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          DevOps Configuration Generator &copy; {new Date().getFullYear()}
        </div>
      </footer>
    </div>
  )
}

