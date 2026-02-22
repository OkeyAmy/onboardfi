import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

interface ElectricBorderProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  glowColor?: string;
  borderWidth?: number;
  speed?: number;
}

const ElectricBorder: React.FC<ElectricBorderProps> = ({
  children,
  className = '',
  borderColor = '#00ff88',
  glowColor = '#00ff8855',
  borderWidth = 2,
  speed = 3,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const borderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!borderRef.current) return;

    const tl = gsap.timeline({ repeat: -1 });

    tl.to(borderRef.current, {
      backgroundPosition: '200% 0',
      duration: speed,
      ease: 'none',
    });

    return () => {
      tl.kill();
    };
  }, [speed]);

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
      style={{ padding: borderWidth }}
    >
      <div
        ref={borderRef}
        className="absolute inset-0 rounded-none"
        style={{
          background: `linear-gradient(90deg, transparent, ${borderColor}, ${glowColor}, ${borderColor}, transparent)`,
          backgroundSize: '200% 100%',
          filter: `drop-shadow(0 0 6px ${glowColor})`,
        }}
      />
      <div className="relative bg-background h-full w-full">
        {children}
      </div>
    </div>
  );
};

export default ElectricBorder;
