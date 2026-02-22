import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';

interface BubbleMenuItem {
  label: string;
  href?: string;
  onClick?: () => void;
  ariaLabel: string;
  rotation: number;
  hoverStyles: { bgColor: string; textColor: string };
}

interface BubbleMenuProps {
  logo: React.ReactNode;
  items: BubbleMenuItem[];
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
}

const BubbleMenu: React.FC<BubbleMenuProps> = ({
  logo,
  items,
  menuAriaLabel = 'Toggle navigation',
  menuBg = '#ffffff',
  menuContentColor = '#111111',
  useFixedPosition = false,
  animationEase = 'back.out(1.5)',
  animationDuration = 0.5,
  staggerDelay = 0.12,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<HTMLDivElement[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;

    if (isOpen) {
      gsap.to(menuRef.current, {
        scale: 1,
        opacity: 1,
        duration: animationDuration,
        ease: animationEase,
      });

      itemsRef.current.forEach((item, i) => {
        if (!item) return;
        gsap.fromTo(
          item,
          { scale: 0, opacity: 0, rotation: items[i]?.rotation || 0 },
          {
            scale: 1,
            opacity: 1,
            rotation: items[i]?.rotation || 0,
            duration: animationDuration,
            delay: i * staggerDelay,
            ease: animationEase,
          }
        );
      });

      if (overlayRef.current) {
        gsap.to(overlayRef.current, { opacity: 1, duration: 0.3 });
      }
    } else {
      gsap.to(menuRef.current, {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in',
      });

      if (overlayRef.current) {
        gsap.to(overlayRef.current, { opacity: 0, duration: 0.3 });
      }
    }
  }, [isOpen, animationDuration, animationEase, staggerDelay, items]);

  return (
    <>
      {isOpen && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[2999] bg-black/20 backdrop-blur-sm opacity-0"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div className={`${useFixedPosition ? 'fixed' : 'relative'} z-[3000]`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label={menuAriaLabel}
          className="h-[34px] w-[34px] border border-foreground flex items-center justify-center bg-background text-foreground hover:bg-foreground hover:text-background transition-colors"
          style={{ color: menuContentColor }}
        >
          {isOpen ? (
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="2" y1="2" x2="12" y2="12" />
              <line x1="12" y1="2" x2="2" y2="12" />
            </svg>
          ) : (
            logo
          )}
        </button>

        <div
          ref={menuRef}
          className="absolute top-full left-0 mt-2 flex flex-col gap-2 opacity-0"
          style={{ transformOrigin: 'top left', scale: 0.8 }}
        >
          {items.map((item, i) => (
            <div
              key={item.label}
              ref={(el) => {
                if (el) itemsRef.current[i] = el;
              }}
              style={{ transform: `rotate(${item.rotation}deg)` }}
            >
              {item.onClick ? (
                <button
                  onClick={() => {
                    item.onClick?.();
                    setIsOpen(false);
                  }}
                  aria-label={item.ariaLabel}
                  className="px-4 py-2 text-sm font-medium uppercase tracking-wide border border-foreground whitespace-nowrap transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: menuBg,
                    color: menuContentColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = item.hoverStyles.bgColor;
                    e.currentTarget.style.color = item.hoverStyles.textColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = menuBg;
                    e.currentTarget.style.color = menuContentColor;
                  }}
                >
                  {item.label}
                </button>
              ) : (
                <a
                  href={item.href || '#'}
                  aria-label={item.ariaLabel}
                  className="block px-4 py-2 text-sm font-medium uppercase tracking-wide border border-foreground whitespace-nowrap transition-all duration-200 hover:scale-105"
                  style={{
                    backgroundColor: menuBg,
                    color: menuContentColor,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = item.hoverStyles.bgColor;
                    e.currentTarget.style.color = item.hoverStyles.textColor;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = menuBg;
                    e.currentTarget.style.color = menuContentColor;
                  }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BubbleMenu;
