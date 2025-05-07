
"use client"

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription, DialogClose } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import type { PasswordEntry } from '@/lib/types';

const passwordEntrySchema = z.object({
  site: z.string().min(1, "Site name is required"),
  username: z.string().optional(), // Username can be empty
  password_encrypted: z.string().min(1, "Password is required"),
});

type PasswordFormValues = Omit<PasswordEntry, 'id' | 'createdAt'>;

interface PasswordFormProps {
  onSubmit: (data: PasswordFormValues) => void;
  initialData?: PasswordFormValues;
  isEditing: boolean;
}

export function PasswordForm({ onSubmit, initialData, isEditing }: PasswordFormProps) {
  const form = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordEntrySchema),
    defaultValues: initialData || {
      site: "",
      username: "",
      password_encrypted: "",
    },
  });

  const handleSubmit = (values: PasswordFormValues) => {
    onSubmit(values);
  };

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{isEditing ? 'Edit Password' : 'Add New Password'}</DialogTitle>
        <DialogDescription>
          {isEditing ? 'Update the details for this password entry.' : 'Enter the details for the new password entry.'}
        </DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
          <FormField
            control={form.control}
            name="site"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site/Service Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Google, Facebook" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username/Email</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., user@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password_encrypted"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">{isEditing ? 'Save Changes' : 'Add Password'}</Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}
