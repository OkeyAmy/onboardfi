import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface ConnectWalletSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ConnectWalletSheet: React.FC<ConnectWalletSheetProps> = ({ isOpen, onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/` },
        });
        if (error) throw error;
        toast({ title: 'Wallet Created!', description: 'Check your email to verify, then connect your wallet.' });
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast({ title: 'Wallet Connected!', description: 'Welcome to OnboardFi.' });
        onSuccess?.();
        onClose();
      }
    } catch (error: any) {
      toast({ title: 'Connection Failed', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <>
      <div className="fixed inset-0 bg-black/50 z-[3000]" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-foreground z-[3001] shadow-2xl animate-slide-in-right">
        <button onClick={onClose} className="absolute top-8 right-8 text-background/60 hover:text-background transition-colors">
          <X size={24} />
        </button>

        <div className="flex flex-col h-full px-10 pt-24 pb-10">
          <h2 className="text-background text-3xl font-medium mb-2">
            {isSignUp ? 'Create Wallet' : 'Connect Wallet'}
          </h2>
          <p className="text-background/50 text-sm mb-8">
            {isSignUp ? 'Create your wallet to start earning' : 'Connect to start completing quests'}
          </p>

          <form onSubmit={handleAuth} className="flex flex-col gap-5">
            <div>
              <label className="block text-background/70 text-[11px] font-medium mb-2 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-background/10 border border-background/20 text-background px-4 py-3 focus:outline-none focus:border-[#00ff88] transition-colors text-sm"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-background/70 text-[11px] font-medium mb-2 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-background/10 border border-background/20 text-background px-4 py-3 focus:outline-none focus:border-[#00ff88] transition-colors text-sm"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#00ff88] text-black font-bold py-3 px-6 uppercase text-[11px] tracking-wider hover:bg-[#00dd77] transition-colors disabled:opacity-50"
            >
              {loading ? 'Connecting...' : isSignUp ? 'Create Wallet' : 'Connect Wallet'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-background/50 hover:text-background transition-colors text-sm"
            >
              {isSignUp ? 'Already have a wallet? Connect' : "Don't have a wallet? Create one"}
            </button>
          </div>
        </div>
      </div>
    </>,
    document.body
  );
};
