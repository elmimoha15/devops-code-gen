"use client"

import type { ReactNode } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ConfigFormLayoutProps {
  title: string
  description?: string
  children: ReactNode
  actions?: ReactNode
}

export function ConfigFormLayout({ title, description, children, actions }: ConfigFormLayoutProps) {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>}
          </div>
          {actions && <div>{actions}</div>}
        </div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

