import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';

interface CurvedLoopProps {
  marqueeText?: string;
  speed?: number;
  curveAmount?: number;
  direction?: 'left' | 'right';
  interactive?: boolean;
  className?: string;
}

const CurvedLoop: React.FC<CurvedLoopProps> = ({
  marqueeText = 'OnboardFi ✦',
  speed = 2,
  curveAmount = 400,
  direction = 'left',
  interactive = false,
  className = '',
}) => {
  const pathRef = useRef<SVGPathElement>(null);
  const textRef = useRef<SVGTextElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const animRef = useRef<gsap.core.Tween | null>(null);
  const [pathId] = useState(() => `curved-path-${Math.random().toString(36).slice(2, 9)}`);

  useEffect(() => {
    if (!textRef.current) return;

    const textPath = textRef.current.querySelector('textPath');
    if (!textPath) return;

    const dur = 20 / speed;

    // Set initial startOffset based on direction
    gsap.set(textPath, { attr: { startOffset: direction === 'left' ? '0%' : '-100%' } });

    animRef.current = gsap.to(textPath, {
      attr: { startOffset: direction === 'left' ? '-100%' : '0%' },
      duration: dur,
      ease: 'none',
      repeat: -1,
    });

    return () => {
      animRef.current?.kill();
    };
  }, [speed, direction]);

  useEffect(() => {
    if (!interactive || !svgRef.current) return;

    const svg = svgRef.current;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = svg.getBoundingClientRect();
      const y = e.clientY - rect.top;
      const ratio = y / rect.height;
      const curve = curveAmount * (0.5 - ratio) * 2;

      if (pathRef.current) {
        const w = rect.width;
        pathRef.current.setAttribute(
          'd',
          `M 0 250 Q ${w / 2} ${250 + curve} ${w} 250`
        );
      }
    };

    const handleMouseLeave = () => {
      if (pathRef.current) {
        const w = svg.getBoundingClientRect().width;
        gsap.to(pathRef.current, {
          attr: { d: `M 0 250 Q ${w / 2} 250 ${w} 250` },
          duration: 0.6,
          ease: 'elastic.out(1, 0.3)',
        });
      }
    };

    svg.addEventListener('mousemove', handleMouseMove);
    svg.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      svg.removeEventListener('mousemove', handleMouseMove);
      svg.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [interactive, curveAmount]);

  // Use enough repetitions to fill the path even during animation
  const repeatedText = Array(20).fill(marqueeText).join(' ');

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 1920 500"
      preserveAspectRatio="xMidYMid meet"
      className={`w-full h-full ${className}`}
      style={{ overflow: 'visible', display: 'block' }}
    >
      <defs>
        <path
          ref={pathRef}
          id={pathId}
          d={`M 0 250 Q 960 ${250 + curveAmount} 1920 250`}
        />
      </defs>
      <text
        ref={textRef}
        className="fill-current"
        style={{
          fontSize: '72px',
          fontWeight: 700,
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        }}
      >
        <textPath href={`#${pathId}`} startOffset="0%">
          {repeatedText}
        </textPath>
      </text>
    </svg>
  );
};

export default CurvedLoop;
