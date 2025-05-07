
"use client"

import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import type { PasswordEntry } from '@/lib/types';
import { PasswordItem } from './password-item';
import { PasswordForm } from './password-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, Lock, Search, AlertTriangle } from 'lucide-react';
import { Input } from './ui/input';

const LOCAL_STORAGE_KEY = 'passlock-passwords';

export function PasswordManager() {
  const [passwords, setPasswords] = useLocalStorage<PasswordEntry[]>(LOCAL_STORAGE_KEY, []);
  const [isMounted, setIsMounted] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<PasswordEntry | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleAddPassword = (data: Omit<PasswordEntry, 'id' | 'createdAt'>) => {
    const newPassword: PasswordEntry = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setPasswords(prev => [...prev, newPassword]);
    setIsFormOpen(false);
    toast({ title: "Password Added", description: `Password for ${newPassword.site} has been saved.` });
  };

  const handleEditPassword = (data: Omit<PasswordEntry, 'id' | 'createdAt'>) => {
    if (!editingEntry) return;
    setPasswords(prev => prev.map(p => (p.id === editingEntry.id ? { ...editingEntry, ...data } : p)));
    setEditingEntry(undefined);
    setIsFormOpen(false);
    toast({ title: "Password Updated", description: `Password for ${data.site} has been updated.` });
  };

  const handleDeletePassword = (id: string) => {
    setPasswords(prev => prev.filter(p => p.id !== id));
    toast({ title: "Password Deleted", description: "The password entry has been removed." });
  };

  const openEditForm = (entry: PasswordEntry) => {
    setEditingEntry(entry);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingEntry(undefined);
    setIsFormOpen(true);
  };

  const filteredPasswords = passwords.filter(entry =>
    entry.site.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (entry.username && entry.username.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  if (!isMounted) {
    // Or a skeleton loader
    return (
      <Card className="w-full shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Lock className="text-primary" /> Password Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading passwords...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-grow">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <Lock className="text-primary" /> Password Manager
            </CardTitle>
            <CardDescription>Securely store and manage your passwords locally.</CardDescription>
          </div>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button onClick={openAddForm}>
                <PlusCircle className="mr-2 h-4 w-4" /> Add New
              </Button>
            </DialogTrigger>
            {isFormOpen && ( // Conditionally render form to reset state on close/reopen
              <PasswordForm
                onSubmit={editingEntry ? handleEditPassword : handleAddPassword}
                initialData={editingEntry ? { site: editingEntry.site, username: editingEntry.username, password_encrypted: editingEntry.password_encrypted } : undefined}
                isEditing={!!editingEntry}
              />
            )}
          </Dialog>
        </div>
        <div className="mt-4 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="text"
            placeholder="Search by site or username..."
            className="pl-10 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="my-4 p-3 border border-destructive/50 bg-destructive/10 rounded-md text-destructive flex items-start gap-2">
          <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
          <p className="text-sm">
            <strong>Security Warning:</strong> Passwords stored in browser local storage are not completely secure against advanced attacks like XSS or if your device is compromised. For highly sensitive data, consider dedicated password managers. This app is for demonstration purposes.
          </p>
        </div>
        {filteredPasswords.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">
            {passwords.length === 0 ? "No passwords stored yet. Add one to get started!" : "No passwords match your search."}
          </p>
        ) : (
          <div className="space-y-4">
            {filteredPasswords.map(entry => (
              <PasswordItem
                key={entry.id}
                entry={entry}
                onEdit={openEditForm}
                onDelete={handleDeletePassword}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Public function to be used by PasswordGenerator
export const addGeneratedPasswordToManager = (passwordDetails: { site: string, username: string, password_encrypted: string }) => {
  const currentPasswords: PasswordEntry[] = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  const newPasswordEntry: PasswordEntry = {
    ...passwordDetails,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };
  const updatedPasswords = [...currentPasswords, newPasswordEntry];
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedPasswords));
  // Dispatch a storage event so other instances of PasswordManager can update
  window.dispatchEvent(new StorageEvent('storage', {
    key: LOCAL_STORAGE_KEY,
    newValue: JSON.stringify(updatedPasswords),
    oldValue: JSON.stringify(currentPasswords),
    storageArea: localStorage,
  }));
};

