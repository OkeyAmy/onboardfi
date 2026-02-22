import React from 'react';
import CurvedLoop from './CurvedLoop';

const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-foreground text-background overflow-hidden">
      <div className="h-[200px] md:h-[300px] flex items-center">
        <CurvedLoop
          marqueeText="OnboardFi ✦ Protocol Aligned Learning ✦ Learn → Verify → Earn ✦"
          speed={2}
          curveAmount={80}
          interactive
          className="text-background"
        />
      </div>
      <div className="border-t border-background/20 px-4 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-background/60 uppercase tracking-wider">
          © 2026 OnboardFi. Protocol Aligned Learning Infrastructure.
        </p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-xs text-background/60 hover:text-background transition-colors uppercase tracking-wider">Docs</a>
          <a href="#" className="text-xs text-background/60 hover:text-background transition-colors uppercase tracking-wider">GitHub</a>
          <a href="#" className="text-xs text-background/60 hover:text-background transition-colors uppercase tracking-wider">Twitter</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
