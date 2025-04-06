"use client"

import { useState } from "react"
import type { z } from "zod"
import { useForm as useReactHookForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export function useForm<T extends z.ZodType<any, any>>(schema: T, defaultValues?: z.infer<T>) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useReactHookForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const onSubmit = async (values: z.infer<T>, callback: (values: z.infer<T>) => Promise<void> | void) => {
    try {
      setIsSubmitting(true)
      await callback(values)
    } catch (error) {
      console.error("Form submission error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    isSubmitting,
    onSubmit,
  }
}

