"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const formSchema = z.object({
  framework: z.string().min(1, "Framework is required"),
  baseImage: z.string().min(1, "Base image is required"),
  version: z.string().min(1, "Version is required"),
  port: z.string().min(1, "Port is required"),
});

type DockerfileGeneratorProps = {
  onGenerate: (files: { name: string; content: string }[]) => void;
};

export function DockerfileGenerator({ onGenerate }: DockerfileGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || "http://localhost:8000"; // Default for local dev

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      framework: "nextjs",
      baseImage: "node",
      version: "18-alpine",
      port: "3000",
    },
  });

  const generateDockerfile = async (values: z.infer<typeof formSchema>) => {
    setIsGenerating(true);

    try {
      const response = await fetch(`${backendUrl}/generate/dockerfile`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error generating Dockerfile:", errorData);
        // Optionally display an error message to the user
        setIsGenerating(false);
        return;
      }

      const data: { name: string; content: string }[] = await response.json();
      onGenerate(data);
    } catch (error) {
      console.error("Error sending request to backend:", error);
      // Optionally display an error message to the user
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(generateDockerfile)} className="space-y-6">
            <FormField
              control={form.control}
              name="framework"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Framework</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a framework" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="nextjs">Next.js</SelectItem>
                      <SelectItem value="flask">Flask</SelectItem>
                      <SelectItem value="django">Django</SelectItem>
                      <SelectItem value="vite">Vite</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>Select the framework for your application</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="baseImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Base Image</FormLabel>
                  <FormControl>
                    <Input placeholder="node" {...field} />
                  </FormControl>
                  <FormDescription>The base Docker image (e.g., node, python)</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="version"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Version</FormLabel>
                  <FormControl>
                    <Input placeholder="18-alpine" {...field} />
                  </FormControl>
                  <FormDescription>The version tag for the base image</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="port"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Port</FormLabel>
                  <FormControl>
                    <Input placeholder="3000" {...field} />
                  </FormControl>
                  <FormDescription>The port your application will run on</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isGenerating}>
              {isGenerating ? "Generating..." : "Generate Dockerfile"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}