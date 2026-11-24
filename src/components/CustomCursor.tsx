import React, { useEffect, useState } from 'react';

interface CustomCursorProps {
  mousePos: { x: number; y: number };
  isHoveringTarget: boolean;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ mousePos, isHoveringTarget }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Initial check
    if (mousePos.x > 0 || mousePos.y > 0) {
      setIsVisible(true);
    }

    return () => {
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [mousePos]);

  if (!isVisible) return null;

  const color = '#1F2A6B'; // --landing-text-x deep navy

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
        transition: 'transform 0.04s linear',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: 0,
          height: 0,
        }}
      >
        {/* Reticle SVG centered at 0, 0 */}
        <svg
          width="48"
          height="48"
          viewBox="0 0 48 48"
          fill="none"
          style={{
            position: 'absolute',
            left: -24,
            top: -24,
            transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease',
            transform: isHoveringTarget ? 'scale(1.25) rotate(45deg)' : 'scale(1) rotate(0deg)',
          }}
        >
          {/* Outer Corner Brackets */}
          <path
            d="M 6 14 L 6 6 L 14 6"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 42 14 L 42 6 L 34 6"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 6 34 L 6 42 L 14 42"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M 42 34 L 42 42 L 34 42"
            stroke={color}
            strokeWidth="1.5"
            strokeLinecap="round"
          />

          {/* Central Crosshair Ticks */}
          <line x1="24" y1="12" x2="24" y2="19" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
          <line x1="24" y1="29" x2="24" y2="36" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
          <line x1="12" y1="24" x2="19" y2="24" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />
          <line x1="29" y1="24" x2="36" y2="24" stroke={color} strokeWidth="1.2" strokeOpacity="0.85" />

          {/* Center Point */}
          <circle
            cx="24"
            cy="24"
            r={isHoveringTarget ? "2.5" : "1.5"}
            fill={isHoveringTarget ? "#2F5FD0" : color}
            style={{ transition: 'all 0.2s ease' }}
          />

          {/* Target Ring when hovering */}
          {isHoveringTarget && (
            <circle
              cx="24"
              cy="24"
              r="17"
              stroke="#2F5FD0"
              strokeWidth="1"
              strokeDasharray="2 3"
              style={{ animation: 'spin 4s linear infinite' }}
            />
          )}
        </svg>

        {/* Small Tactical Readout */}
        <div
          style={{
            position: 'absolute',
            left: 20,
            top: 14,
            fontSize: '9px',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500,
            letterSpacing: '0.06em',
            color: '#5A6475',
            whiteSpace: 'nowrap',
            pointerEvents: 'none',
            opacity: 0.85,
            lineHeight: 1.2,
          }}
        >
          {isHoveringTarget ? (
            <span style={{ color: '#2F5FD0', fontWeight: 600 }}>[LOCK ON]</span>
          ) : (
            <span>
              {Math.round(mousePos.x).toString().padStart(4, '0')}.{Math.round(mousePos.y).toString().padStart(4, '0')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
