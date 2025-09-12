import React from 'react';

interface ModeToggleProps {
  mode: '3d' | '2d';
  onModeChange: (mode: '3d' | '2d') => void;
}

// Inline styles to replace CSS classes
const styles = {
  container: {
    position: 'fixed' as const,
    top: '24px',
    right: '24px',
    zIndex: 50,
  },
  panel: {
    position: 'relative' as const,
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(40px)',
    WebkitBackdropFilter: 'blur(40px)',
    borderRadius: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '8px',
    overflow: 'hidden' as const,
  },
  backgroundOverlay: {
    position: 'absolute' as const,
    inset: '0',
    background: 'linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(168, 85, 247, 0.1), rgba(59, 130, 246, 0.1))',
    pointerEvents: 'none' as const,
  },
  slidingIndicator3D: {
    position: 'absolute' as const,
    top: '8px',
    bottom: '8px',
    left: '8px',
    width: 'calc(50% - 4px)',
    background: 'linear-gradient(to right, #3b82f6, #06b6d4)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(59, 130, 246, 0.25)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  slidingIndicator2D: {
    position: 'absolute' as const,
    top: '8px',
    bottom: '8px',
    right: '8px',
    width: 'calc(50% - 4px)',
    background: 'linear-gradient(to right, #a855f7, #ec4899)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(168, 85, 247, 0.25)',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  buttonContainer: {
    display: 'flex',
    gap: '8px',
    position: 'relative' as const,
    zIndex: 10,
  },
  button: {
    position: 'relative' as const,
    padding: '12px 24px',
    borderRadius: '12px',
    fontWeight: '600' as const,
    fontSize: '14px',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    minWidth: '120px',
    border: 'none',
    cursor: 'pointer' as const,
    background: 'transparent',
  },
  activeButton: {
    color: 'white',
    transform: 'scale(1.05)',
  },
  inactiveButton: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  buttonContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  },
  icon: {
    fontSize: '20px',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  iconActive: {
    transform: 'scale(1.1)',
  },
  buttonText: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'flex-start',
  },
  subtitle: {
    fontSize: '12px',
    transition: 'opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  subtitleActive: {
    opacity: 0.9,
  },
  subtitleInactive: {
    opacity: 0.6,
  },
  glowEffect3D: {
    position: 'absolute' as const,
    inset: '0',
    borderRadius: '16px',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none' as const,
    boxShadow: 'inset 0 0 60px rgba(59, 130, 246, 0.1)',
  },
  glowEffect2D: {
    position: 'absolute' as const,
    inset: '0',
    borderRadius: '16px',
    transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    pointerEvents: 'none' as const,
    boxShadow: 'inset 0 0 60px rgba(168, 85, 247, 0.1)',
  },
  particlesContainer: {
    position: 'absolute' as const,
    inset: '0',
    pointerEvents: 'none' as const,
    overflow: 'hidden' as const,
    borderRadius: '16px',
  },
  particle1: {
    position: 'absolute' as const,
    top: '8px',
    left: '16px',
    width: '4px',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  },
  particle2: {
    position: 'absolute' as const,
    bottom: '12px',
    right: '24px',
    width: '4px',
    height: '4px',
    background: 'rgba(255, 255, 255, 0.2)',
    borderRadius: '50%',
    animation: 'pulse 2s infinite 1s',
  },
  particle3: {
    position: 'absolute' as const,
    top: '16px',
    right: '12px',
    width: '2px',
    height: '2px',
    background: 'rgba(255, 255, 255, 0.4)',
    borderRadius: '50%',
    animation: 'pulse 2s infinite 0.5s',
  },
};

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div style={styles.container}>
      <div style={styles.panel}>
        {/* Background gradient overlay */}
        <div style={styles.backgroundOverlay} />
        
        {/* Sliding background indicator */}
        <div style={mode === '3d' ? styles.slidingIndicator3D : styles.slidingIndicator2D} />
        
        <div style={styles.buttonContainer}>
          <button
            onClick={() => onModeChange('3d')}
            style={{
              ...styles.button,
              ...(mode === '3d' ? styles.activeButton : styles.inactiveButton),
            }}
            onMouseEnter={(e) => {
              if (mode !== '3d') {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (mode !== '3d') {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <div style={styles.buttonContent}>
              <span style={{
                ...styles.icon,
                ...(mode === '3d' ? styles.iconActive : {}),
              }}>
                🎯
              </span>
              <div style={styles.buttonText}>
                <span>3D Mode</span>
                <span style={{
                  ...styles.subtitle,
                  ...(mode === '3d' ? styles.subtitleActive : styles.subtitleInactive),
                }}>
                  Interactive View
                </span>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => onModeChange('2d')}
            style={{
              ...styles.button,
              ...(mode === '2d' ? styles.activeButton : styles.inactiveButton),
            }}
            onMouseEnter={(e) => {
              if (mode !== '2d') {
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'scale(1.02)';
              }
            }}
            onMouseLeave={(e) => {
              if (mode !== '2d') {
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            <div style={styles.buttonContent}>
              <span style={{
                ...styles.icon,
                ...(mode === '2d' ? styles.iconActive : {}),
              }}>
                📐
              </span>
              <div style={styles.buttonText}>
                <span>2D Mode</span>
                <span style={{
                  ...styles.subtitle,
                  ...(mode === '2d' ? styles.subtitleActive : styles.subtitleInactive),
                }}>
                  Blueprint Mode
                </span>
              </div>
            </div>
          </button>
        </div>
        
        {/* Subtle glow effect */}
        <div style={mode === '3d' ? styles.glowEffect3D : styles.glowEffect2D} />
      </div>
      
      {/* Floating particles effect */}
      <div style={styles.particlesContainer}>
        <div style={styles.particle1} />
        <div style={styles.particle2} />
        <div style={styles.particle3} />
      </div>
    </div>
  );
};