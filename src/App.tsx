import { Scene3D } from './components/Scene3DInline';
import { Scene2D } from './components/Scene2DInline';
import { ModeToggle } from './components/ModeToggle';
import type { Scene3DRef } from './components/Scene3DInline';
import { TabNavigation } from './components/TabNavigation';
import { MeasurementsTab } from './components/MeasurementsTabFixed';
import { ClothingTab } from './components/ClothingTab';
import { CosplayTab } from './components/CosplayTab';
import { useAppState } from './hooks/useAppState';
import { useState, useRef } from 'react';

// Shared styled components and utilities
const GlassContainer: React.FC<{ children: React.ReactNode; style?: React.CSSProperties }> = ({ children, style }) => (
  <div
    style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
      ...style,
    }}
  >
    {children}
  </div>
);

interface GradientButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant: 'blue' | 'purple' | 'green' | 'orange';
  size: 'sm' | 'md' | 'lg';
  style?: React.CSSProperties;
}

const GradientButton: React.FC<GradientButtonProps> = ({ children, onClick, variant, size, style }) => {
  const gradients = {
    blue: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    purple: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    green: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    orange: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
  };

  const sizes = {
    sm: { padding: '8px 16px', fontSize: '14px' },
    md: { padding: '12px 24px', fontSize: '16px' },
    lg: { padding: '16px 32px', fontSize: '18px' },
  };

  return (
    <button
      onClick={onClick}
      style={{
        background: gradients[variant],
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        ...sizes[size],
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      }}
    >
      {children}
    </button>
  );
};

const animationStyles = {
  smoothTransition: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

function useStylesInit() {
  // Custom scrollbar styles
  const scrollbarStyles = `
    /* Custom scrollbar styles */
    .custom-scrollbar::-webkit-scrollbar {
      width: 8px;
    }

    .custom-scrollbar::-webkit-scrollbar-track {
      background: rgba(255, 255, 255, 0.05);
      border-radius: 4px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb {
      background: linear-gradient(135deg, #a855f7, #ec4899);
      border-radius: 4px;
    }

    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
      background: linear-gradient(135deg, #9333ea, #db2777);
    }
  `;

  // Inject styles if not already present
  if (!document.querySelector('#custom-scrollbar-styles')) {
    const styleElement = document.createElement('style');
    styleElement.id = 'custom-scrollbar-styles';
    styleElement.textContent = scrollbarStyles;
    document.head.appendChild(styleElement);
  }
}


function App() {
  const [mode, setMode] = useState<'3d' | '2d'>('3d');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const sceneRef = useRef<Scene3DRef>(null);
  
  // Initialize our custom styles
  useStylesInit();

  const {
    activeTab,
    measurementMode,
    measurements,
    selectedClothing,
    selectedAccessories,
    setClothing,
    setAccessories,
    handleTabChange,
    handleModeChange,
    handleMeasurementsChange,
  } = useAppState();

  const handleResetCamera = () => {
    if (mode === '3d' && sceneRef.current) {
      sceneRef.current.resetCamera();
    } else if (mode === '2d') {
      // For 2D mode, we'll trigger a custom event that Scene2D can listen to
      window.dispatchEvent(new CustomEvent('reset2DView'));
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'measurements':
        return (
          <MeasurementsTab
            measurements={measurements}
            measurementMode={measurementMode}
            onMeasurementsChange={handleMeasurementsChange}
            onModeChange={handleModeChange}
          />
        );
      case 'clothing':
        return (
          <ClothingTab
            selectedClothing={selectedClothing}
            onClothingChange={setClothing}
          />
        );
      case 'cosplay':
        return (
          <CosplayTab
            selectedAccessories={selectedAccessories}
            onAccessoriesChange={setAccessories}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      style={{
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient background effects */}
      <div 
        style={{
          position: 'absolute',
          inset: '0',
          background: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.2) 0%, transparent 50%, rgba(168, 85, 247, 0.2) 100%)',
        }}
      />
      <div 
        style={{
          position: 'absolute',
          inset: '0',
          background: 'radial-gradient(ellipse at bottom left, rgba(6, 182, 212, 0.1) 0%, transparent 50%, rgba(236, 72, 153, 0.1) 100%)',
        }}
      />
      
      {/* Mode Toggle - Top Right */}
      <ModeToggle mode={mode} onModeChange={setMode} />

      {/* Mobile Menu Button */}
      <GradientButton
        onClick={() => setIsPanelOpen(true)}
        variant="blue"
        size="md"
        style={{
          position: 'fixed',
          top: '24px',
          left: '24px',
          zIndex: 50,
          display: window.innerWidth >= 1024 ? 'none' : 'block',
          borderRadius: '16px',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        }}
      >
        <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </GradientButton>

      {/* Left Settings Panel - Modern glassmorphism design */}
      <GlassContainer
        style={{
          position: 'fixed',
          left: '24px',
          top: '140px', // Positioned below Scene overlays
          bottom: '24px',
          width: '500px', // Slightly smaller width
          maxWidth: 'calc(100vw - 48px)',
          borderRadius: '20px', // Slightly smaller border radius
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
          zIndex: 40,
          transform: isPanelOpen ? 'translateX(0)' : (window.innerWidth >= 1024 ? 'translateX(0)' : 'translateX(-100%)'),
          ...animationStyles.smoothTransition,
        }}
      >
        {/* Panel gradient overlay */}
        <div 
          style={{
            position: 'absolute',
            inset: '0',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
            pointerEvents: 'none',
            borderRadius: '20px',
          }}
        />
        <div 
          style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: '24px', // Reduced padding for smaller height
            position: 'relative',
            zIndex: 10,
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div style={{ flexShrink: 0, marginBottom: '24px' }}> {/* Reduced margin */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 
                style={{
                  fontSize: '24px',
                  fontWeight: 'bold',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span 
                  style={{
                    marginRight: '16px',
                    fontSize: '30px',
                    background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  👤
                </span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span 
                    style={{
                      background: 'linear-gradient(135deg, white 0%, #d1d5db 100%)',
                      WebkitBackgroundClip: 'text',
                      backgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    MorphBody
                  </span>
                  <span 
                    style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: 'rgba(96, 165, 250, 0.8)',
                    }}
                  >
                    {mode === '3d' ? '3D Studio' : '2D Designer'}
                  </span>
                </div>
              </h1>
              <GradientButton
                onClick={() => setIsPanelOpen(false)}
                variant="blue"
                size="sm"
                style={{
                  display: window.innerWidth >= 1024 ? 'none' : 'flex',
                  padding: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.6)',
                  border: 'none',
                }}
              >
                <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </GradientButton>
            </div>
            <p 
              style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.6)',
                marginTop: '16px',
                lineHeight: 1.5,
              }}
            >
              Customize your {mode === '3d' ? 'three-dimensional' : 'two-dimensional'} human model with precision and style
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={{ flexShrink: 0, marginBottom: '24px' }}> {/* Reduced margin */}
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Tab Content - Enhanced scrolling */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div 
              className="scrollbar-thin"
              style={{
                height: '100%',
                overflowY: 'auto',
                paddingLeft: '8px',
                paddingRight: '24px',
              }}
            >
              <div style={{ paddingBottom: '24px' }}>
                {renderActiveTab()}
              </div>
            </div>
          </div>
        </div>
      </GlassContainer>

      {/* Top-Right Controls Panel - Enhanced design */}
      <GlassContainer
        style={{
          position: 'fixed',
          top: '120px',
          right: '24px',
          maxWidth: 'calc(100vw - 48px)',
          padding: '24px',
          zIndex: 40,
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        }}
      >
        <div 
          style={{
            position: 'absolute',
            inset: '0',
            background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
            borderRadius: '24px',
            pointerEvents: 'none',
          }}
        />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h3 
            style={{
              fontSize: '18px',
              fontWeight: 'bold',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <span style={{ marginRight: '12px', fontSize: '20px' }}>
              {mode === '3d' ? '🎯' : '📐'}
            </span>
            {mode === '3d' ? 'Camera Controls' : 'View Controls'}
          </h3>
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            {mode === '3d' ? (
              <>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    ...animationStyles.smoothTransition,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '50%',
                      marginRight: '12px',
                      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.25)',
                    }}
                  />
                  <span style={{ ...animationStyles.smoothTransition }}>Left Click: Rotate</span>
                </div>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    ...animationStyles.smoothTransition,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '50%',
                      marginRight: '12px',
                      boxShadow: '0 4px 8px rgba(16, 185, 129, 0.25)',
                    }}
                  />
                  <span style={{ ...animationStyles.smoothTransition }}>Right Click: Pan</span>
                </div>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    ...animationStyles.smoothTransition,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                      borderRadius: '50%',
                      marginRight: '12px',
                      boxShadow: '0 4px 8px rgba(168, 85, 247, 0.25)',
                    }}
                  />
                  <span style={{ ...animationStyles.smoothTransition }}>Scroll: Zoom</span>
                </div>
              </>
            ) : (
              <>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    ...animationStyles.smoothTransition,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                      borderRadius: '50%',
                      marginRight: '12px',
                      boxShadow: '0 4px 8px rgba(168, 85, 247, 0.25)',
                    }}
                  />
                  <span style={{ ...animationStyles.smoothTransition }}>Drag: Pan view</span>
                </div>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '12px',
                    ...animationStyles.smoothTransition,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                      borderRadius: '50%',
                      marginRight: '12px',
                      boxShadow: '0 4px 8px rgba(59, 130, 246, 0.25)',
                    }}
                  />
                  <span style={{ ...animationStyles.smoothTransition }}>Scroll: Zoom</span>
                </div>
                <div 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    ...animationStyles.smoothTransition,
                  }}
                  onMouseEnter={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'white';
                  }}
                  onMouseLeave={(e) => {
                    const target = e.currentTarget;
                    const span = target.querySelector('span:last-child') as HTMLElement;
                    if (span) span.style.color = 'rgba(255, 255, 255, 0.7)';
                  }}
                >
                  <div 
                    style={{
                      width: '12px',
                      height: '12px',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      borderRadius: '50%',
                      marginRight: '12px',
                      boxShadow: '0 4px 8px rgba(16, 185, 129, 0.25)',
                    }}
                  />
                  <span style={{ ...animationStyles.smoothTransition }}>Keys: 1-4 for views</span>
                </div>
              </>
            )}
          </div>
          <div 
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '16px',
              marginTop: '16px',
            }}
          >
            <GradientButton
              onClick={handleResetCamera}
              variant="blue"
              size="md"
              style={{
                width: '100%',
                borderRadius: '16px',
                fontWeight: '600',
                fontSize: '14px',
                boxShadow: '0 4px 8px rgba(59, 130, 246, 0.25)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Reset View</span>
                {mode === '2d' && (
                  <span style={{ fontSize: '12px', opacity: 0.75, marginLeft: '8px' }}>(R)</span>
                )}
              </div>
            </GradientButton>
          </div>
        </div>
      </GlassContainer>

      {/* Main Viewport */}
      <div 
        style={{
          position: 'absolute',
          left: '0',
          top: '0',
          right: '0',
          bottom: '0',
          ...(window.innerWidth >= 1024 && {
            left: '368px', // Adjusted for new Settings Menu width (320px + 24px left + 24px gap)
            top: '24px',
            right: '24px',
            bottom: '24px',
          }),
          background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
        }}
      >
        <div 
          style={{
            width: '100%',
            height: '100%',
            borderRadius: window.innerWidth >= 1024 ? '24px' : '0',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
          }}
        >
          {mode === '3d' ? (
            <Scene3D
              ref={sceneRef}
              measurements={measurements}
              selectedClothing={selectedClothing}
              selectedAccessories={selectedAccessories}
              measurementMode={measurementMode}
            />
          ) : (
            <Scene2D
              measurements={measurements}
              measurementMode={measurementMode}
            />
          )}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isPanelOpen && (
        <div
          style={{
            position: 'fixed',
            inset: '0',
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            zIndex: 30,
            display: window.innerWidth >= 1024 ? 'none' : 'block',
          }}
          onClick={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
