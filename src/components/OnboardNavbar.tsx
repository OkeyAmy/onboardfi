import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import BubbleMenu from './BubbleMenu';
import ElectricBorder from './ElectricBorder';

export const OnboardNavbar: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const menuItems = [
    {
      label: 'Discover',
      onClick: () => navigate('/'),
      ariaLabel: 'Discover quests',
      rotation: -4,
      hoverStyles: { bgColor: '#00ff88', textColor: '#000000' },
    },
    {
      label: 'Create Quest',
      onClick: () => navigate('/create-event'),
      ariaLabel: 'Create a quest',
      rotation: 3,
      hoverStyles: { bgColor: '#8b5cf6', textColor: '#ffffff' },
    },
    {
      label: 'My Quests',
      onClick: () => navigate('/my-events'),
      ariaLabel: 'View my quests',
      rotation: -2,
      hoverStyles: { bgColor: '#f59e0b', textColor: '#000000' },
    },
    ...(user
      ? [
          {
            label: 'Disconnect',
            onClick: async () => { await supabase.auth.signOut(); },
            ariaLabel: 'Disconnect wallet',
            rotation: 5,
            hoverStyles: { bgColor: '#ef4444', textColor: '#ffffff' },
          },
        ]
      : []),
  ];

  return createPortal(
    <nav className="fixed top-8 left-4 md:left-8 right-4 md:right-8 z-[2000] flex items-center justify-between">
      <div className="flex items-center gap-0">
        {/* Logo + Brand */}
        <div
          className="bg-foreground text-background h-[34px] px-3 border border-foreground flex items-center cursor-pointer"
          onClick={() => navigate('/')}
        >
          <span className="text-[11px] font-bold uppercase tracking-[0.15em]">OnboardFi</span>
        </div>

        {/* Bubble Menu */}
        <div className="ml-0">
          <BubbleMenu
            logo={
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="1" y1="4" x2="13" y2="4" />
                <line x1="1" y1="7" x2="13" y2="7" />
                <line x1="1" y1="10" x2="13" y2="10" />
              </svg>
            }
            items={menuItems}
            menuAriaLabel="Toggle navigation"
            menuBg="#ffffff"
            menuContentColor="#111111"
            animationEase="back.out(1.5)"
            animationDuration={0.5}
            staggerDelay={0.12}
          />
        </div>
      </div>

      {/* Connect Wallet / Disconnect */}
      {!user ? (
        <ElectricBorder borderColor="#00ff88" glowColor="#00ff8844" borderWidth={2} speed={2}>
          <button
            onClick={() => navigate('/auth')}
            className="h-[30px] px-4 flex items-center text-[11px] font-bold uppercase tracking-[0.1em] text-foreground bg-background"
          >
            Connect Wallet
          </button>
        </ElectricBorder>
      ) : (
        <div className="flex items-center gap-0">
          <div className="bg-background border border-foreground h-[34px] px-3 flex items-center">
            <div className="w-2 h-2 rounded-full bg-[#00ff88] mr-2 animate-pulse" />
            <span className="text-[11px] font-medium uppercase tracking-wider text-foreground">Connected</span>
          </div>
        </div>
      )}
    </nav>,
    document.body
  );
};
