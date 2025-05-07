
"use client"

import { ShieldCheck, LockKeyhole } from 'lucide-react';
import { PasswordGenerator } from '@/components/password-generator';
import { PasswordManager, addGeneratedPasswordToManager } from '@/components/password-manager';
import { ThemeToggle } from '@/components/theme-toggle';
import { useToast } from '@/hooks/use-toast';

export default function HomePage() {
  const { toast } = useToast();

  const handleSaveGeneratedPassword = (passwordDetails: { site: string, username: string, password_encrypted: string }) => {
    addGeneratedPasswordToManager(passwordDetails);
    toast({
      title: "Password Saved",
      description: `Generated password for ${passwordDetails.site} has been saved to the manager.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <LockKeyhole className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">PassLock</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <PasswordGenerator onSavePassword={handleSaveGeneratedPassword} />
          </div>
          <div className="lg:col-span-2">
            <PasswordManager />
          </div>
        </div>
      </main>

      <footer className="py-6 border-t">
        <div className="container text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} PassLock. Secure your digital life.</p>
          <p className="mt-1">
            Built with Next.js, Tailwind CSS, and ShadCN UI.
          </p>
        </div>
      </footer>
    </div>
  );
}
