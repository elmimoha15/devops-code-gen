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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

const deploymentSchema = z.object({
  name: z.string().min(1, "Name is required"),
  replicas: z.number().min(1, "Replicas must be at least 1"), // Expect number
  image: z.string().min(1, "Image is required"),
  containerPort: z.number().min(1, "Container port is required"), // Expect number
  envVars: z.string().optional(),
});

const serviceSchema = z.object({
  name: z.string().min(1, "Name is required"),
  port: z.number().min(1, "Port is required"), // Expect number
  targetPort: z.number().min(1, "Target port is required"), // Expect number
  protocol: z.string().min(1, "Protocol is required"),
  serviceType: z.string().min(1, "Service type is required"),
});

type KubernetesGeneratorProps = {
  onGenerate: (files: { name: string; content: string }[]) => void;
};

export function KubernetesGenerator({ onGenerate }: KubernetesGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("deployment");
  const backendUrl = "http://127.0.0.1:8000"; // Replace with your actual backend URL

  const deploymentForm = useForm<z.infer<typeof deploymentSchema>>({
    resolver: zodResolver(deploymentSchema),
    defaultValues: {
      name: "my-app",
      replicas: 3, // Default as number
      image: "my-app:latest",
      containerPort: 3000, // Default as number
      envVars: "NODE_ENV=production,DEBUG=false",
    },
  });

  const serviceForm = useForm<z.infer<typeof serviceSchema>>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: "my-app-service",
      port: 80, // Default as number
      targetPort: 3000, // Default as number
      protocol: "TCP",
      serviceType: "ClusterIP",
    },
  });

  const generateDeployment = async (values: z.infer<typeof deploymentSchema>) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${backendUrl}/generate/kubernetes/deployment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error generating Kubernetes Deployment:", errorData);
        // Optionally display an error message to the user
        setIsGenerating(false);
        return;
      }

      const data: { name: string; content: string }[] = await response.json();
      onGenerate(data);
    } catch (error) {
      console.error("Error sending request to backend for Deployment:", error);
      // Optionally display an error message to the user
    } finally {
      setIsGenerating(false);
    }
  };

  const generateService = async (values: z.infer<typeof serviceSchema>) => {
    setIsGenerating(true);
    try {
      const response = await fetch(`${backendUrl}/generate/kubernetes/service`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error generating Kubernetes Service:", errorData);
        // Optionally display an error message to the user
        setIsGenerating(false);
        return;
      }

      const data: { name: string; content: string }[] = await response.json();
      onGenerate(data);
    } catch (error) {
      console.error("Error sending request to backend for Service:", error);
      // Optionally display an error message to the user
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="deployment">Deployment</TabsTrigger>
            <TabsTrigger value="service">Service</TabsTrigger>
          </TabsList>

          <TabsContent value="deployment">
            <Form {...deploymentForm}>
              <form onSubmit={deploymentForm.handleSubmit(generateDeployment)} className="space-y-4">
                <FormField
                  control={deploymentForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="my-app" {...field} />
                      </FormControl>
                      <FormDescription>The name of your deployment</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deploymentForm.control}
                  name="replicas"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Replicas</FormLabel>
                      <FormControl>
                        <Input placeholder="3" type="number" {...field} />
                      </FormControl>
                      <FormDescription>Number of pod replicas</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deploymentForm.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input placeholder="my-app:latest" {...field} />
                      </FormControl>
                      <FormDescription>Docker image to use</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deploymentForm.control}
                  name="containerPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Container Port</FormLabel>
                      <FormControl>
                        <Input placeholder="3000" type="number" {...field} />
                      </FormControl>
                      <FormDescription>Port exposed by the container</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={deploymentForm.control}
                  name="envVars"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment Variables</FormLabel>
                      <FormControl>
                        <Input placeholder="KEY=value,ANOTHER_KEY=value" {...field} />
                      </FormControl>
                      <FormDescription>Comma-separated list of environment variables (KEY=value)</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Deployment"}
                </Button>
              </form>
            </Form>
          </TabsContent>

          <TabsContent value="service">
            <Form {...serviceForm}>
              <form onSubmit={serviceForm.handleSubmit(generateService)} className="space-y-4">
                <FormField
                  control={serviceForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="my-app-service" {...field} />
                      </FormControl>
                      <FormDescription>The name of your service</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={serviceForm.control}
                  name="port"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Port</FormLabel>
                      <FormControl>
                        <Input placeholder="80" type="number" {...field} />
                      </FormControl>
                      <FormDescription>Port exposed by the service</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={serviceForm.control}
                  name="targetPort"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Target Port</FormLabel>
                      <FormControl>
                        <Input placeholder="3000" type="number" {...field} />
                      </FormControl>
                      <FormDescription>Port on the pod to forward to</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={serviceForm.control}
                  name="protocol"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Protocol</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a protocol" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="TCP">TCP</SelectItem>
                          <SelectItem value="UDP">UDP</SelectItem>
                          <SelectItem value="SCTP">SCTP</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Network protocol to use</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={serviceForm.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a service type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="ClusterIP">ClusterIP</SelectItem>
                          <SelectItem value="NodePort">NodePort</SelectItem>
                          <SelectItem value="LoadBalancer">LoadBalancer</SelectItem>
                          <SelectItem value="ExternalName">ExternalName</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Type of Kubernetes service</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={isGenerating}>
                  {isGenerating ? "Generating..." : "Generate Service"}
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}