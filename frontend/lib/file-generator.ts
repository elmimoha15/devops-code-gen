// Utility functions for file generation

export type GeneratedFile = {
  name: string
  content: string
}

// Helper function to format YAML indentation
export function formatYaml(yaml: string): string {
  return yaml.trim()
}

// Helper function to download a file
export function downloadFile(filename: string, content: string): void {
  const blob = new Blob([content], { type: "text/plain" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Helper function to generate a zip file with multiple files
export async function generateZipFile(files: GeneratedFile[]): Promise<Blob> {
  // This is a placeholder - in a real implementation, you would use a library like JSZip
  // Since we're not installing additional dependencies, this is just a mock
  return new Blob([JSON.stringify(files)], { type: "application/zip" })
}

// Helper function to copy text to clipboard
export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

