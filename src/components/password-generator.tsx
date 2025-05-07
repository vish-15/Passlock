
"use client"

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { generateStrongPassword, type GenerateStrongPasswordOutput } from '@/ai/flows/generate-strong-password';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Copy, Save, Wand2, AlertTriangle } from 'lucide-react';
import type { PasswordEntry, PasswordGeneratorFormValues } from '@/lib/types';

const passwordGeneratorSchema = z.object({
  length: z.number().min(8, "Min length 8").max(128, "Max length 128"),
  includeUppercase: z.boolean(),
  includeLowercase: z.boolean(),
  includeNumbers: z.boolean(),
  includeSymbols: z.boolean(),
  excludeCharacters: z.string().max(50, "Too many excluded chars").optional(),
});

interface PasswordGeneratorProps {
  onSavePassword: (passwordDetails: { site: string, username: string, password_encrypted: string }) => void;
}

export function PasswordGenerator({ onSavePassword }: PasswordGeneratorProps) {
  const [generatedPassword, setGeneratedPassword] = useState<GenerateStrongPasswordOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PasswordGeneratorFormValues>({
    resolver: zodResolver(passwordGeneratorSchema),
    defaultValues: {
      length: 16,
      includeUppercase: true,
      includeLowercase: true,
      includeNumbers: true,
      includeSymbols: true,
      excludeCharacters: "",
    },
  });

  async function onSubmit(values: PasswordGeneratorFormValues) {
    setIsLoading(true);
    setGeneratedPassword(null);
    try {
      const result = await generateStrongPassword({
        length: values.length,
        includeUppercase: values.includeUppercase,
        includeLowercase: values.includeLowercase,
        includeNumbers: values.includeNumbers,
        includeSymbols: values.includeSymbols,
        excludeCharacters: values.excludeCharacters || "",
      });
      setGeneratedPassword(result);
      if (!result.isSecure) {
        toast({
          title: "Password Generated (Weak)",
          description: "The generated password might not be strong enough. Consider regenerating or adjusting criteria.",
          variant: "destructive",
        });
      } else {
         toast({
          title: "Password Generated",
          description: "A strong password has been generated.",
        });
      }
    } catch (error) {
      console.error("Error generating password:", error);
      toast({
        title: "Error",
        description: "Failed to generate password. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  }

  const handleCopyToClipboard = () => {
    if (generatedPassword?.password) {
      navigator.clipboard.writeText(generatedPassword.password);
      toast({ title: "Copied!", description: "Password copied to clipboard." });
    }
  };
  
  const handleSave = () => {
    if (generatedPassword?.password) {
      // For simplicity, prompt for site/username. In a real app, this might be a more integrated form.
      const site = prompt("Enter site/service name for this password:");
      if (!site) return;
      const username = prompt(`Enter username for ${site}:`);
      if (username === null) return; // Allow empty username

      onSavePassword({ site, username, password_encrypted: generatedPassword.password });
      setGeneratedPassword(null); // Clear after saving
    }
  };


  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Wand2 className="text-primary" /> Strong Password Generator
        </CardTitle>
        <CardDescription>Create secure passwords based on your criteria.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="length"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password Length (8-128)</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value, 10))} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="includeUppercase"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Uppercase (A-Z)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeLowercase"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Lowercase (a-z)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeNumbers"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Numbers (0-9)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="includeSymbols"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Include Symbols (!@#)</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="excludeCharacters"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Exclude Characters</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., oO0Il" {...field} />
                  </FormControl>
                  <FormDescription>Characters to exclude from the password.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="animate-spin" /> : "Generate Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
      {generatedPassword && (
        <CardFooter className="flex flex-col items-start gap-4 pt-6">
          <div className="w-full p-4 border rounded-md bg-muted/50">
            <Label htmlFor="generatedPasswordOutput" className="text-sm font-semibold">Generated Password:</Label>
            <div className="flex items-center justify-between mt-1">
              <Input
                id="generatedPasswordOutput"
                type="text"
                readOnly
                value={generatedPassword.password}
                className="text-lg font-mono tracking-wider flex-grow mr-2"
              />
              <Button variant="outline" size="icon" onClick={handleCopyToClipboard} className="mr-2">
                <Copy />
                <span className="sr-only">Copy password</span>
              </Button>
              <Button variant="outline" size="icon" onClick={handleSave}>
                <Save />
                <span className="sr-only">Save password</span>
              </Button>
            </div>
            {!generatedPassword.isSecure && (
              <p className="mt-2 text-sm text-destructive flex items-center gap-1">
                <AlertTriangle size={16} /> This password may not be strong enough.
              </p>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
