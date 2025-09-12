import React, { type CSSProperties } from 'react';

// Style constants for reusability
export const glassmorphismStyles = {
  glass: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  } as CSSProperties,

  glassStrong: {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  } as CSSProperties,

  glassSubtle: {
    background: 'rgba(255, 255, 255, 0.02)',
    backdropFilter: 'blur(15px)',
    WebkitBackdropFilter: 'blur(15px)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
  } as CSSProperties,
};

export const animationStyles = {
  smoothTransition: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  } as CSSProperties,
};

export const gradients = {
  blue: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
  purple: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
  emerald: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  orange: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
  pink: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
  cyan: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
};

export const shadows = {
  premium: '0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 25px rgba(255, 255, 255, 0.05), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
  premiumLg: '0 35px 60px -12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(255, 255, 255, 0.08), inset 0 1px 3px rgba(255, 255, 255, 0.15)',
  glowBlue: '0 0 20px rgba(59, 130, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
  glowPurple: '0 0 20px rgba(168, 85, 247, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
  glowEmerald: '0 0 20px rgba(16, 185, 129, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.1)',
};

// Styled Components
interface GlassContainerProps {
  children: React.ReactNode;
  variant?: 'glass' | 'glassStrong' | 'glassSubtle';
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ 
  children, 
  variant = 'glass', 
  className = '', 
  style = {}, 
  onClick
}) => {
  const baseStyle = glassmorphismStyles[variant];

  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        ...animationStyles.smoothTransition,
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'blue' | 'purple' | 'emerald' | 'orange' | 'pink' | 'cyan';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  style?: CSSProperties;
}

export const GradientButton: React.FC<GradientButtonProps> = ({
  children,
  onClick,
  disabled = false,
  variant = 'blue',
  size = 'md',
  className = '',
  style = {},
}) => {
  const sizeStyles = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' },
  };

  const buttonStyle: CSSProperties = {
    background: gradients[variant],
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.6 : 1,
    ...animationStyles.smoothTransition,
    ...sizeStyles[size],
    ...style,
  };

  return (
    <button
      className={className}
      style={buttonStyle}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface ModernRangeSliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
  style?: CSSProperties;
}

export const ModernRangeSlider: React.FC<ModernRangeSliderProps> = ({
  value,
  onChange,
  min,
  max,
  step = 1,
  className = '',
  style = {},
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const sliderStyle: CSSProperties = {
    appearance: 'none',
    background: `linear-gradient(to right, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.8) ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
    outline: 'none',
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    cursor: 'pointer',
    ...animationStyles.smoothTransition,
    ...style,
  };

  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`modern-range-slider ${className}`}
      style={sliderStyle}
    />
  );
};

// Utility functions for inline styles
export const getGradientBackground = (variant: keyof typeof gradients) => ({
  background: gradients[variant],
});

export const getGlowShadow = (color: 'blue' | 'purple' | 'emerald') => ({
  boxShadow: shadows[`glow${color.charAt(0).toUpperCase()}${color.slice(1)}` as keyof typeof shadows],
});

export const getScaleHoverProps = () => ({
  onMouseEnter: (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.transform = 'scale(1.02)';
  },
  onMouseLeave: (e: React.MouseEvent<HTMLElement>) => {
    const target = e.currentTarget;
    target.style.transform = 'scale(1)';
  },
  style: { ...animationStyles.smoothTransition, cursor: 'pointer' },
});

// CSS-in-JS approach for complex animations
export const createFloatingAnimation = () => {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-5px); }
    }
    
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    
    @keyframes particles {
      0%, 100% {
        opacity: 0;
        transform: scale(0) rotate(0deg);
      }
      50% {
        opacity: 1;
        transform: scale(1) rotate(180deg);
      }
    }
    
    .float-animation {
      animation: float 6s ease-in-out infinite;
    }
    
    .fade-in-up {
      animation: fadeInUp 0.3s ease-out;
    }
    
    .modern-range-slider::-webkit-slider-thumb {
      appearance: none;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      cursor: pointer;
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3), 0 0 0 0 rgba(59, 130, 246, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.2);
      border: 2px solid rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(10px);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .modern-range-slider::-webkit-slider-thumb:hover {
      transform: scale(1.15);
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4), 0 0 0 6px rgba(59, 130, 246, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3);
      background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
    }
    
    .modern-range-slider::-moz-range-thumb {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
      cursor: pointer;
      border: 2px solid rgba(255, 255, 255, 0.8);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2);
    }
    
    .scrollbar-thin {
      scrollbar-width: thin;
      scrollbar-color: rgba(75, 85, 99, 0.8) transparent;
    }
    
    .scrollbar-thin::-webkit-scrollbar {
      width: 6px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-track {
      background: transparent;
      border-radius: 3px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb {
      background: rgba(75, 85, 99, 0.8);
      border-radius: 3px;
    }
    
    .scrollbar-thin::-webkit-scrollbar-thumb:hover {
      background: rgba(107, 114, 128, 0.9);
    }
  `;
  
  if (!document.head.querySelector('style[data-styled-components]')) {
    style.setAttribute('data-styled-components', 'true');
    document.head.appendChild(style);
  }
};

// Initialize animations on component mount
export const useStylesInit = () => {
  React.useEffect(() => {
    createFloatingAnimation();
  }, []);
};