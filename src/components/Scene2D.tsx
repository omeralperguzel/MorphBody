import React, { useEffect, useState } from 'react';
import type { BasicMeasurements, DetailedMeasurements } from '../types';
import Human2DModel, { type View as Human2DView } from '../blueprint/Human2DModel';

type ViewType = 'front' | 'right' | 'left' | 'back';

interface Scene2DProps {
  measurements: BasicMeasurements | DetailedMeasurements;
  measurementMode: 'basic' | 'detailed';
}

// Inline styles to replace CSS classes
const styles = {
  mainContainer: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    overflow: 'hidden' as const,
  },
  fullViewport: {
    width: '100vw',
    height: '100vh',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    zIndex: 0,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    overflow: 'hidden' as const,
  },
  topLeftOverlay: {
    position: 'absolute' as const,
    top: '16px',
    left: '24px',
    zIndex: 10,
    pointerEvents: 'auto' as const,
  },
  viewIndicator: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
  },
  indicatorContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconContainer: {
    padding: '8px',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(168, 85, 247, 0.25)',
  },
  icon: {
    fontSize: '20px',
  },
  indicatorText: {
    margin: 0,
  },
  indicatorTitle: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: 'white',
    background: 'linear-gradient(135deg, white 0%, #d1d5db 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '4px',
  },
  indicatorSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  rightSideControls: {
    position: 'absolute' as const,
    top: 'calc(50% + 120px)',
    right: '24px',
    transform: 'translateY(-50%)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    pointerEvents: 'auto' as const,
  },
  controlsPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
  },
  controlsTitle: {
    fontSize: '16px',
    fontWeight: '600' as const,
    color: 'white',
    marginBottom: '12px',
    textAlign: 'center' as const,
  },
  viewButtonsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '16px',
  },
  viewButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600' as const,
    cursor: 'pointer' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    minWidth: '80px',
  },
  activeViewButton: {
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: 'white',
    boxShadow: '0 4px 8px rgba(168, 85, 247, 0.25)',
    transform: 'scale(1.05)',
  },
  inactiveViewButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  buttonIcon: {
    fontSize: '16px',
  },
  buttonLabel: {
    fontSize: '12px',
  },
  bottomRightOverlay: {
    position: 'absolute' as const,
    bottom: '24px',
    right: '24px',
    zIndex: 10,
    pointerEvents: 'auto' as const,
  },
  statsPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
    minWidth: '200px',
  },
  statsContent: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statIcon: {
    fontSize: '20px',
    width: '32px',
    height: '32px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    borderRadius: '8px',
  },
  statText: {
    flex: 1,
  },
  statLabel: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: '0 0 2px 0',
  },
  statValue: {
    fontSize: '14px',
    fontWeight: '600' as const,
    color: 'white',
    margin: 0,
  },
  divider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
    margin: '4px 0',
  },
  keyboardHints: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
  },
  hint: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  hintKey: {
    padding: '2px 6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    fontSize: '10px',
    fontFamily: 'monospace',
  },
};

export const Scene2D: React.FC<Scene2DProps> = ({ measurements }) => {
  const [currentView, setCurrentView] = useState<ViewType>('front');
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Zoom and Pan state
  const [zoom, setZoom] = useState(1.0);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Convert ViewType to Human2DView
  const getHuman2DView = (viewType: ViewType): Human2DView => {
    switch (viewType) {
      case 'front':
      case 'back':
        return 'front';
      case 'right':
      case 'left':
        return 'side';
      default:
        return 'front';
    }
  };

  // Convert measurements to the format expected by Human2DModel
  const getModelMeasurements = () => {
    const detailed = measurements as DetailedMeasurements;
    
    // Realistic anthropometric defaults based on gender
    const defaults = {
      male: {
        headCircumference: 58, neckCircumference: 38,
        chestCircumference: 98, waistCircumference: 84, hipCircumference: 96,
        armLength: 62, wristCircumference: 17, palmLength: 19, middleFingerLength: 8.5,
        legLength: 78, thighCircumference: 55, ankleCircumference: 23, toeLength: 26,
      },
      female: {
        headCircumference: 56, neckCircumference: 34,
        chestCircumference: 90, waistCircumference: 70, hipCircumference: 98,
        armLength: 59, wristCircumference: 15, palmLength: 18, middleFingerLength: 7.8,
        legLength: 75, thighCircumference: 57, ankleCircumference: 21, toeLength: 24,
      },
      other: {
        headCircumference: 57, neckCircumference: 36,
        chestCircumference: 94, waistCircumference: 77, hipCircumference: 97,
        armLength: 60, wristCircumference: 16, palmLength: 18.5, middleFingerLength: 8.1,
        legLength: 76, thighCircumference: 56, ankleCircumference: 22, toeLength: 25,
      }
    };

    const defaultValues = defaults[measurements.gender];
    
    return {
      height: measurements.height,
      weight: measurements.weight,
      headCircumference: detailed.headCircumference || defaultValues.headCircumference,
      neckCircumference: detailed.neckCircumference || defaultValues.neckCircumference,
      chestCircumference: detailed.chestCircumference || defaultValues.chestCircumference,
      waistCircumference: detailed.waistCircumference || defaultValues.waistCircumference,
      hipCircumference: detailed.hipCircumference || defaultValues.hipCircumference,
      armLength: detailed.armLength || defaultValues.armLength,
      wristCircumference: detailed.wristCircumference || defaultValues.wristCircumference,
      palmLength: detailed.palmLength || defaultValues.palmLength,
      middleFingerLength: detailed.middleFingerLength || defaultValues.middleFingerLength,
      legLength: detailed.legLength || defaultValues.legLength,
      thighCircumference: detailed.thighCircumference || defaultValues.thighCircumference,
      ankleCircumference: detailed.ankleCircumference || defaultValues.ankleCircumference,
      toeLength: detailed.toeLength || defaultValues.toeLength,
    };
  };

  // Handle window resize
  const handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width > 0 && height > 0) {
      setDimensions({ width, height });
    }
  };

  // Effects
  useEffect(() => {
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Zoom and Pan event handlers
  const handleWheel = (event: React.WheelEvent) => {
    event.preventDefault();
    const zoomSensitivity = 0.001;
    const deltaZoom = -event.deltaY * zoomSensitivity;
    const newZoom = Math.max(0.1, Math.min(5, zoom + deltaZoom));
    
    // Zoom towards mouse position
    const rect = (event.currentTarget as HTMLElement).getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Calculate new pan to zoom towards mouse
    const zoomRatio = newZoom / zoom;
    const newPanX = mouseX - (mouseX - pan.x) * zoomRatio;
    const newPanY = mouseY - (mouseY - pan.y) * zoomRatio;
    
    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button === 0) { // Left mouse button
      setIsDragging(true);
      setDragStart({ x: event.clientX, y: event.clientY });
      setPanStart({ x: pan.x, y: pan.y });
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = event.clientX - dragStart.x;
      const deltaY = event.clientY - dragStart.y;
      setPan({
        x: panStart.x + deltaX,
        y: panStart.y + deltaY
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Reset view handler for reset button
  const resetView = () => {
    setZoom(1.0);
    setPan({ x: 0, y: 0 });
  };

  // Listen for reset2DView event from App.tsx
  useEffect(() => {
    const handleReset = () => resetView();
    window.addEventListener('reset2DView', handleReset);
    return () => window.removeEventListener('reset2DView', handleReset);
  }, []);

  const viewConfigs = [
    { key: 'front' as ViewType, icon: '👤', label: 'Front' },
    { key: 'back' as ViewType, icon: '🔄', label: 'Back' },
    { key: 'right' as ViewType, icon: '👉', label: 'Right' },
    { key: 'left' as ViewType, icon: '👈', label: 'Left' },
  ];

  const viewEmoji = {
    front: '👤',
    back: '🔄', 
    right: '👉',
    left: '👈'
  };

  return (
    <div style={styles.fullViewport}>
      {/* View Indicator - Top Left */}
      <div style={styles.topLeftOverlay}>
        <div style={styles.viewIndicator}>
          <div style={styles.indicatorContent}>
            <div style={styles.iconContainer}>
              <span style={styles.icon}>{viewEmoji[currentView]}</span>
            </div>
            <div style={styles.indicatorText}>
              <h3 style={styles.indicatorTitle}>2D View</h3>
              <p style={styles.indicatorSubtitle}>{currentView.charAt(0).toUpperCase() + currentView.slice(1)} View</p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls Panel - Right Side */}
      <div style={styles.rightSideControls}>
        <div style={styles.controlsPanel}>
          <h3 style={styles.controlsTitle}>View Controls</h3>
          
          <div style={styles.viewButtonsGrid}>
            {viewConfigs.map((view) => (
              <button
                key={view.key}
                onClick={() => setCurrentView(view.key)}
                style={{
                  ...styles.viewButton,
                  ...(currentView === view.key ? styles.activeViewButton : styles.inactiveViewButton),
                }}
              >
                <span style={styles.buttonIcon}>{view.icon}</span>
                <span style={styles.buttonLabel}>{view.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Panel - Bottom Right */}
      <div style={styles.bottomRightOverlay}>
        <div style={styles.statsPanel}>
          <div style={styles.statsContent}>
            <div style={styles.statItem}>
              <div style={styles.statIcon}>
                <span>📏</span>
              </div>
              <div style={styles.statText}>
                <p style={styles.statLabel}>Current View</p>
                <p style={styles.statValue}>{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</p>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.keyboardHints}>
              <div style={styles.hint}>
                <span style={styles.hintKey}>Drag</span>
                <span>Pan</span>
              </div>
              <div style={styles.hint}>
                <span style={styles.hintKey}>Wheel</span>
                <span>Zoom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Human2D SVG Model */}
      <Human2DModel
        width={dimensions.width}
        height={dimensions.height}
        view={getHuman2DView(currentView)}
        gender={measurements.gender}
        measurements={getModelMeasurements()}
        pose={{
          // Use DEFAULT_POSE from Human2DModel - arms will hang naturally downward from shoulders
        }}
        showGrid={true}
        gridStepCm={5}
        gridMajorEvery={2}
        showGuides={true}
        className="absolute inset-0"
        zoom={zoom}
        pan={pan}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      />
    </div>
  );
};

export default Scene2D;