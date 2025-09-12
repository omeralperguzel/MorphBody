import { Scene3D } from './components/Scene3D';
import { Scene2D } from './components/Scene2D';
import { ModeToggle } from './components/ModeToggle';
import type { Scene3DRef } from './components/Scene3D';
import { TabNavigation } from './components/TabNavigation';
import { MeasurementsTab } from './components/MeasurementsTab';
import { ClothingTab } from './components/ClothingTab';
import { CosplayTab } from './components/CosplayTab';
import { useAppState } from './hooks/useAppState';
import { useState, useRef, useEffect } from 'react';

// Inline styles to replace CSS classes
const styles = {
  container: {
    width: '100%',
    height: '100vh',
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
    position: 'relative' as const,
    overflow: 'hidden' as const,
  },
  ambientBg1: {
    position: 'absolute' as const,
    inset: '0',
    background: 'radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.2) 0%, transparent 50%, rgba(168, 85, 247, 0.2) 100%)',
  },
  ambientBg2: {
    position: 'absolute' as const,
    inset: '0',
    background: 'radial-gradient(ellipse at bottom left, rgba(6, 182, 212, 0.1) 0%, transparent 50%, rgba(236, 72, 153, 0.1) 100%)',
  },
  glassPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(25px)',
    WebkitBackdropFilter: 'blur(25px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '24px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
  },
  transition: {
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  gradientButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: 'white',
    fontWeight: '600' as const,
    cursor: 'pointer' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  mobileMenuBtn: {
    position: 'fixed' as const,
    top: '24px',
    left: '24px',
    zIndex: 50,
    padding: '16px',
  },
  leftPanel: {
    position: 'fixed' as const,
    left: '24px',
    top: '24px',
    bottom: '24px',
    width: '360px',
    maxWidth: 'calc(100vw - 48px)',
    zIndex: 40,
    overflow: 'hidden' as const,
  },
  rightPanel: {
    position: 'fixed' as const,
    top: '24px',
    right: '24px',
    maxWidth: 'calc(100vw - 48px)',
    padding: '24px',
    zIndex: 40,
  },
  viewport: {
    position: 'absolute' as const,
    left: '0',
    top: '0',
    right: '0',
    bottom: '0',
    background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
  },
  viewportInner: {
    width: '100%',
    height: '100%',
    overflow: 'hidden' as const,
    border: '1px solid rgba(255, 255, 255, 0.05)',
  },
  mobileOverlay: {
    position: 'fixed' as const,
    inset: '0',
    background: 'rgba(0, 0, 0, 0.6)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    zIndex: 30,
  },
};

function App() {
  const [mode, setMode] = useState<'3d' | '2d'>('3d');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const sceneRef = useRef<Scene3DRef>(null);

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleResetCamera = () => {
    if (mode === '3d' && sceneRef.current) {
      sceneRef.current.resetCamera();
    } else if (mode === '2d') {
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
    <div style={styles.container}>
      {/* Ambient background effects */}
      <div style={styles.ambientBg1} />
      <div style={styles.ambientBg2} />
      
      {/* Mode Toggle */}
      <ModeToggle mode={mode} onModeChange={setMode} />

      {/* Mobile Menu Button */}
      {isMobile && (
        <button
          onClick={() => setIsPanelOpen(true)}
          style={{
            ...styles.gradientButton,
            ...styles.mobileMenuBtn,
          }}
        >
          <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}

      {/* Left Settings Panel */}
      <div
        style={{
          ...styles.glassPanel,
          ...styles.leftPanel,
          ...styles.transition,
          transform: isPanelOpen || !isMobile ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {/* Panel gradient overlay */}
        <div style={{
          position: 'absolute',
          inset: '0',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
          pointerEvents: 'none' as const,
          borderRadius: '24px',
        }} />
        
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column' as const,
          padding: '32px',
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden' as const,
        }}>
          {/* Header */}
          <div style={{ flexShrink: 0, marginBottom: '32px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
              }}>
                <span style={{
                  marginRight: '16px',
                  fontSize: '30px',
                  background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  👤
                </span>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{
                    background: 'linear-gradient(135deg, white 0%, #d1d5db 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>
                    MorphBody
                  </span>
                  <span style={{
                    fontSize: '14px',
                    fontWeight: '500',
                    color: 'rgba(96, 165, 250, 0.8)',
                  }}>
                    {mode === '3d' ? '3D Studio' : '2D Designer'}
                  </span>
                </div>
              </h1>
              {isMobile && (
                <button
                  onClick={() => setIsPanelOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    border: 'none',
                    padding: '8px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    ...styles.transition,
                  }}
                >
                  <svg style={{ width: '24px', height: '24px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <p style={{
              fontSize: '14px',
              color: 'rgba(255, 255, 255, 0.6)',
              marginTop: '16px',
              lineHeight: 1.5,
            }}>
              Customize your {mode === '3d' ? 'three-dimensional' : 'two-dimensional'} human model with precision and style
            </p>
          </div>

          {/* Tab Navigation */}
          <div style={{ flexShrink: 0, marginBottom: '32px' }}>
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              overflowY: 'auto' as const,
              paddingLeft: '8px',
              paddingRight: '24px',
              scrollbarWidth: 'thin' as const,
              scrollbarColor: 'rgba(75, 85, 99, 0.8) transparent',
            }}>
              <div style={{ paddingBottom: '24px' }}>
                {renderActiveTab()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top-Right Controls Panel */}
      <div style={{
        ...styles.glassPanel,
        ...styles.rightPanel,
        ...styles.transition,
      }}>
        <div style={{
          position: 'absolute',
          inset: '0',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
          borderRadius: '24px',
          pointerEvents: 'none' as const,
        }} />
        
        <div style={{ position: 'relative', zIndex: 10 }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 'bold',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '16px',
          }}>
            <span style={{ marginRight: '12px', fontSize: '20px' }}>
              {mode === '3d' ? '🎯' : '📐'}
            </span>
            {mode === '3d' ? 'Camera Controls' : 'View Controls'}
          </h3>
          
          <div style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
            {mode === '3d' ? (
              <>
                <ControlItem icon="🔵" color="#3b82f6" text="Left Click: Rotate" />
                <ControlItem icon="🟢" color="#10b981" text="Right Click: Pan" />
                <ControlItem icon="🟣" color="#a855f7" text="Scroll: Zoom" />
              </>
            ) : (
              <>
                <ControlItem icon="🟣" color="#a855f7" text="Drag: Pan view" />
                <ControlItem icon="🔵" color="#3b82f6" text="Scroll: Zoom" />
                <ControlItem icon="🟢" color="#10b981" text="Keys: 1-4 for views" />
              </>
            )}
          </div>
          
          <div style={{
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            paddingTop: '16px',
            marginTop: '16px',
          }}>
            <button
              onClick={handleResetCamera}
              style={{
                ...styles.gradientButton,
                width: '100%',
                padding: '12px 24px',
                fontSize: '14px',
                boxShadow: '0 4px 8px rgba(59, 130, 246, 0.25)',
              }}
              onMouseEnter={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(-2px) scale(1.02)';
                target.style.boxShadow = '0 10px 25px rgba(59, 130, 246, 0.3), 0 0 20px rgba(255, 255, 255, 0.1)';
              }}
              onMouseLeave={(e) => {
                const target = e.target as HTMLButtonElement;
                target.style.transform = 'translateY(0) scale(1)';
                target.style.boxShadow = '0 4px 8px rgba(59, 130, 246, 0.25)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>Reset View</span>
                {mode === '2d' && (
                  <span style={{ fontSize: '12px', opacity: 0.75, marginLeft: '8px' }}>(R)</span>
                )}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport */}
      <div style={{
        ...styles.viewport,
        ...(isMobile ? {} : {
          left: '408px',
          top: '24px',
          right: '24px',
          bottom: '24px',
        }),
      }}>
        <div style={{
          ...styles.viewportInner,
          borderRadius: isMobile ? '0' : '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
        }}>
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
      {isPanelOpen && isMobile && (
        <div
          style={styles.mobileOverlay}
          onClick={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
}

// Control item component for the right panel
const ControlItem: React.FC<{ icon: string; color: string; text: string }> = ({ icon, color, text }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{
        width: '12px',
        height: '12px',
        background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
        borderRadius: '50%',
        marginRight: '12px',
        boxShadow: `0 4px 8px ${color}40`,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: isHovered ? 'scale(1.1)' : 'scale(1)',
      }} />
      <span style={{
        color: isHovered ? 'white' : 'rgba(255, 255, 255, 0.7)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {text}
      </span>
    </div>
  );
};

export default App;