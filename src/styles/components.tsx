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

  scaleHover: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
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
  hover?: boolean;
}

export const GlassContainer: React.FC<GlassContainerProps> = ({ 
  children, 
  variant = 'glass', 
  className = '', 
  style = {}, 
  onClick,
  hover = false 
}) => {
  const baseStyle = glassmorphismStyles[variant];
  const hoverStyle = hover ? {
    ':hover': {
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(25px)',
      WebkitBackdropFilter: 'blur(25px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      transform: 'translateY(-1px)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)',
    }
  } : {};

  return (
    <div
      className={className}
      style={{
        ...baseStyle,
        ...animationStyles.smoothTransition,
        ...style,
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        if (hover) {
          const target = e.target as HTMLElement;
          target.style.background = 'rgba(255, 255, 255, 0.08)';
          target.style.backdropFilter = 'blur(25px)';
          target.style.WebkitBackdropFilter = 'blur(25px)';
          target.style.border = '1px solid rgba(255, 255, 255, 0.15)';
          target.style.transform = 'translateY(-1px)';
          target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2), 0 0 20px rgba(255, 255, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (hover) {
          const target = e.target as HTMLElement;
          target.style.background = baseStyle.background!;
          target.style.backdropFilter = baseStyle.backdropFilter!;
          target.style.WebkitBackdropFilter = baseStyle.WebkitBackdropFilter!;
          target.style.border = baseStyle.border!;
          target.style.transform = 'translateY(0)';
          target.style.boxShadow = 'none';
        }
      }}
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
      onMouseEnter={(e) => {
        if (!disabled) {
          const target = e.target as HTMLElement;
          target.style.transform = 'translateY(-2px) scale(1.02)';
          target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (!disabled) {
          const target = e.target as HTMLElement;
          target.style.transform = 'translateY(0) scale(1)';
          target.style.boxShadow = 'none';
        }
      }}
      onMouseDown={(e) => {
        if (!disabled) {
          const target = e.target as HTMLElement;
          target.style.transform = 'translateY(0) scale(0.98)';
        }
      }}
      onMouseUp={(e) => {
        if (!disabled) {
          const target = e.target as HTMLElement;
          target.style.transform = 'translateY(-2px) scale(1.02)';
        }
      }}
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
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className={className}
        style={sliderStyle}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
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
        
        input[type="range"]::-webkit-slider-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4), 0 0 0 6px rgba(59, 130, 246, 0.2), inset 0 1px 2px rgba(255, 255, 255, 0.3);
          background: linear-gradient(135deg, #2563eb 0%, #1e40af 100%);
        }
        
        input[type="range"]::-webkit-slider-thumb:active {
          transform: scale(1.1);
          box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3), 0 0 0 4px rgba(59, 130, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          cursor: pointer;
          border: 2px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3), inset 0 1px 2px rgba(255, 255, 255, 0.2);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        input[type="range"]::-moz-range-thumb:hover {
          transform: scale(1.15);
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  );
};

interface FloatingParticlesProps {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
}

export const FloatingParticles: React.FC<FloatingParticlesProps> = ({
  children,
  className = '',
  style = {},
}) => {
  return (
    <div
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      {children}
      <div
        style={{
          content: '',
          position: 'absolute',
          width: '2px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          top: '20%',
          left: '20%',
          animation: 'particles 8s linear infinite',
          animationDelay: '0s',
        }}
      />
      <div
        style={{
          content: '',
          position: 'absolute',
          width: '2px',
          height: '2px',
          background: 'rgba(255, 255, 255, 0.3)',
          borderRadius: '50%',
          top: '80%',
          right: '20%',
          animation: 'particles 8s linear infinite',
          animationDelay: '4s',
        }}
      />
      <style jsx>{`
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
      `}</style>
    </div>
  );
};

// Custom scrollbar styles for containers
export const customScrollbarStyles: CSSProperties = {
  scrollbarWidth: 'thin',
  scrollbarColor: 'rgba(75, 85, 99, 0.8) transparent',
};

// CSS-in-JS scrollbar styles (WebKit)
export const webkitScrollbarStyles = `
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: rgba(75, 85, 99, 0.8);
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: rgba(107, 114, 128, 0.9);
  }
`;