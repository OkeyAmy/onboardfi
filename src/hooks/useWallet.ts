import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';

const generateWalletAddress = (): string => {
  const chars = '0123456789abcdef';
  let addr = '0x';
  for (let i = 0; i < 40; i++) {
    addr += chars[Math.floor(Math.random() * chars.length)];
  }
  return addr;
};

const WALLET_KEY = 'onboardfi_wallet_address';

export const formatWalletAddress = (address: string): string => {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const useWallet = () => {
  const [user, setUser] = useState<User | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        const stored = localStorage.getItem(WALLET_KEY);
        setWalletAddress(stored || generateWalletAddress());
        if (!stored) {
          const addr = generateWalletAddress();
          localStorage.setItem(WALLET_KEY, addr);
          setWalletAddress(addr);
        }
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        let addr = localStorage.getItem(WALLET_KEY);
        if (!addr) {
          addr = generateWalletAddress();
          localStorage.setItem(WALLET_KEY, addr);
        }
        setWalletAddress(addr);
      } else {
        setWalletAddress(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const connectWallet = async (email: string, password: string, isSignUp: boolean) => {
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    }
  };

  const disconnectWallet = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem(WALLET_KEY);
    setWalletAddress(null);
  };

  return { user, walletAddress, connectWallet, disconnectWallet, formatWalletAddress };
};
