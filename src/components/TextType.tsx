import React, { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';

interface TextTypeProps {
  texts: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
  showCursor?: boolean;
  cursorCharacter?: string;
  cursorBlinkDuration?: number;
  className?: string;
}

const TextType: React.FC<TextTypeProps> = ({
  texts,
  typingSpeed = 75,
  deletingSpeed = 50,
  pauseDuration = 1500,
  showCursor = true,
  cursorCharacter = '_',
  cursorBlinkDuration = 0.5,
  className = '',
}) => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const cursorRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!cursorRef.current || !showCursor) return;
    const blink = gsap.to(cursorRef.current, {
      opacity: 0,
      duration: cursorBlinkDuration,
      repeat: -1,
      yoyo: true,
      ease: 'steps(1)',
    });
    return () => { blink.kill(); };
  }, [showCursor, cursorBlinkDuration]);

  useEffect(() => {
    if (texts.length === 0) return;

    const currentText = texts[textIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (charIndex < currentText.length) {
          setDisplayText(currentText.slice(0, charIndex + 1));
          setCharIndex(charIndex + 1);
        } else {
          setTimeout(() => setIsDeleting(true), pauseDuration);
        }
      } else {
        if (charIndex > 0) {
          setDisplayText(currentText.slice(0, charIndex - 1));
          setCharIndex(charIndex - 1);
        } else {
          setIsDeleting(false);
          setTextIndex((textIndex + 1) % texts.length);
        }
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, textIndex, texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      {showCursor && (
        <span ref={cursorRef} className="inline-block">
          {cursorCharacter}
        </span>
      )}
    </span>
  );
};

export default TextType;
