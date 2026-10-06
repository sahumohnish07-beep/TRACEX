import React, { useEffect, useState } from 'react';

interface CustomCursorProps {
  mousePos: { x: number; y: number };
  isHoveringTarget: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ mousePos, isHoveringTarget }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch / coarse pointer
    const isTouch = window.matchMedia('(pointer: coarse)').matches || 'ontouchstart' in window;
    setIsTouchDevice(isTouch);

    if (isTouch) return;

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    if (mousePos.x > 0 || mousePos.y > 0) {
      setIsVisible(true);
    }

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mousePos]);

  if (isTouchDevice || !isVisible) return null;

  const color = 'var(--landing-text-x)'; // #1F2A6B deep navy

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        transform: `translate3d(${mousePos.x}px, ${mousePos.y}px, 0)`,
        pointerEvents: 'none',
        zIndex: 9999,
        willChange: 'transform',
      }}
    >
      <div style={{ position: 'relative', width: 0, height: 0 }}>
        {/* Reticle / crosshair */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          style={{
            position: 'absolute',
            left: -20,
            top: -20,
            transition: 'transform 150ms ease',
            transform: isHoveringTarget ? 'scale(1.2) rotate(45deg)' : 'scale(1)',
          }}
        >
          {/* Outer Corner Reticle Brackets */}
          <path d="M 6 12 L 6 6 L 12 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 34 12 L 34 6 L 28 6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 6 28 L 6 34 L 12 34" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 34 28 L 34 34 L 28 34" stroke={color} strokeWidth="1.5" strokeLinecap="round" />

          {/* Crosshair Ticks */}
          <line x1="20" y1="10" x2="20" y2="16" stroke={color} strokeWidth="1.2" />
          <line x1="20" y1="24" x2="20" y2="30" stroke={color} strokeWidth="1.2" />
          <line x1="10" y1="20" x2="16" y2="20" stroke={color} strokeWidth="1.2" />
          <line x1="24" y1="20" x2="30" y2="20" stroke={color} strokeWidth="1.2" />

          {/* Central Point */}
          <circle
            cx="20"
            cy="20"
            r={isHoveringTarget ? '2.5' : '1.5'}
            fill={isHoveringTarget ? 'var(--landing-desc)' : color}
          />
        </svg>
      </div>
    </div>
  );
};
