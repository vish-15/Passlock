
"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Eye, EyeOff, Copy, Edit3, Trash2, KeyRound } from 'lucide-react';
import type { PasswordEntry } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface PasswordItemProps {
  entry: PasswordEntry;
  onEdit: (entry: PasswordEntry) => void;
  onDelete: (id: string) => void;
}

export function PasswordItem({ entry, onEdit, onDelete }: PasswordItemProps) {
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const handleCopyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Copied!", description: `${fieldName} copied to clipboard.` });
  };

  return (
    <Card className="mb-4 shadow-md hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-xl">
          <KeyRound className="text-primary" /> {entry.site}
        </CardTitle>
        {entry.username && <CardDescription>Username: {entry.username}</CardDescription>}
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="flex items-center space-x-2">
          <Input
            type={showPassword ? 'text' : 'password'}
            value={entry.password_encrypted}
            readOnly
            className="flex-grow font-mono"
          />
          <Button variant="outline" size="icon" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff /> : <Eye />}
            <span className="sr-only">{showPassword ? 'Hide' : 'Show'} password</span>
          </Button>
          <Button variant="outline" size="icon" onClick={() => handleCopyToClipboard(entry.password_encrypted, 'Password')}>
            <Copy />
            <span className="sr-only">Copy password</span>
          </Button>
        </div>
        {entry.username && (
           <Button variant="link" size="sm" className="p-0 h-auto mt-1 text-xs" onClick={() => handleCopyToClipboard(entry.username!, 'Username')}>
            Copy Username
          </Button>
        )}
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline" size="sm" onClick={() => onEdit(entry)}>
          <Edit3 className="mr-1 h-4 w-4" /> Edit
        </Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-1 h-4 w-4" /> Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the password for "{entry.site}".
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onDelete(entry.id)}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
