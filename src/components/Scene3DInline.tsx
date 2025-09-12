import React, { Suspense, useRef, forwardRef, useImperativeHandle, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment } from '@react-three/drei';

import { HumanModel } from './HumanModel';
import { ClothingModel } from './ClothingModel';
import { AccessoryModel } from './AccessoryModel';

import type { BasicMeasurements, DetailedMeasurements, ClothingItem, Accessory } from '../types';

interface Scene3DProps {
  measurements: BasicMeasurements | DetailedMeasurements;
  selectedClothing: ClothingItem[];
  selectedAccessories: Accessory[];
  measurementMode: 'basic' | 'detailed';
}

export interface Scene3DRef {
  resetCamera: () => void;
}

// Inline styles to replace CSS classes
const styles = {
  mainContainer: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
  },
  fullViewport: {
    width: '100vw',
    height: '100vh',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    zIndex: 0,
  },
  topOverlay: {
    position: 'absolute' as const,
    top: '16px',
    left: '24px',
    right: '16px',
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    pointerEvents: 'none' as const,
  },
  viewIndicator: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    pointerEvents: 'auto' as const,
  },
  indicatorPanel: {
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
    background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(6, 182, 212, 0.25)',
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
  controlsContainer: {
    position: 'absolute' as const,
    top: '120px',
    right: '24px',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    pointerEvents: 'auto' as const,
  },
  resetButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    padding: '12px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer' as const,
    color: 'rgba(255, 255, 255, 0.7)',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  buttonIcon: {
    width: '20px',
    height: '20px',
    fill: 'none',
    stroke: 'currentColor',
    transition: 'color 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  bottomOverlay: {
    position: 'absolute' as const,
    bottom: '16px',
    right: '16px',
    zIndex: 10,
    pointerEvents: 'none' as const,
  },
  statsPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
    pointerEvents: 'auto' as const,
  },
  statsContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    fontSize: '14px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  statIcon: {
    padding: '8px',
    background: 'linear-gradient(135deg, #10b981, #14b8a6)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(16, 185, 129, 0.25)',
  },
  statText: {
    margin: 0,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
    margin: 0,
  },
  statValue: {
    color: 'white',
    fontWeight: '600' as const,
    margin: 0,
  },
  divider: {
    width: '1px',
    height: '40px',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  keyboardHints: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    borderLeft: '1px solid rgba(255, 255, 255, 0.1)',
    paddingLeft: '24px',
  },
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  },
  hintKey: {
    padding: '2px 6px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    fontSize: '10px',
    fontFamily: 'monospace',
  },
};

const LoadingIndicator: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 0.5]} />
      <meshStandardMaterial color="#646cff" opacity={0.5} transparent />
    </mesh>
  );
};

export const Scene3D = forwardRef<Scene3DRef, Scene3DProps>(({
  measurements,
  selectedClothing,
  selectedAccessories,
  measurementMode,
}, ref) => {
  const controlsRef = useRef<any>(null);
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Handle window resize for dynamic scaling
  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    
    // Initial call to set dimensions
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useImperativeHandle(ref, () => ({
    resetCamera: () => {
      if (controlsRef.current) {
        controlsRef.current.reset();
      }
    },
  }));

  // Calculate responsive camera FOV based on screen size
  const responsiveFOV = Math.min(75, Math.max(50, 50 + (1920 - dimensions.width) / 50));

  const handleResetClick = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div style={styles.fullViewport}>
      {/* Modern UI Overlay - Top */}
      <div style={styles.topOverlay}>
        {/* 3D View Indicator */}
        <div style={styles.viewIndicator}>
          <div style={styles.indicatorPanel}>
            <div style={styles.indicatorContent}>
              <div style={styles.iconContainer}>
                <span style={styles.icon}>🎯</span>
              </div>
              <div style={styles.indicatorText}>
                <h3 style={styles.indicatorTitle}>3D Interactive Mode</h3>
                <p style={styles.indicatorSubtitle}>Rotate, zoom, and pan around your 3D model with full interactive controls.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Center Controls */}
      <div style={styles.controlsContainer}>
        <button
          onClick={handleResetClick}
          style={styles.resetButton}
          title="Reset Camera (R)"
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.color = 'white';
            e.currentTarget.style.boxShadow = '0 6px 12px rgba(6, 182, 212, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          <svg style={styles.buttonIcon} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Modern UI Overlay - Bottom Right */}
      <div style={styles.bottomOverlay}>
        <div style={styles.statsPanel}>
          <div style={styles.statsContent}>
            {/* Model Stats */}
            <div style={styles.statItem}>
              <div style={styles.statIcon}>
                <span style={styles.icon}>📊</span>
              </div>
              <div style={styles.statText}>
                <p style={styles.statLabel}>Model Stats</p>
                <p style={styles.statValue}>
                  {measurements.height}cm • {measurements.weight}kg
                </p>
                <p style={styles.statValue}>
                  {measurements.gender} • {measurementMode}
                </p>
              </div>
            </div>

            <div style={styles.divider} />
            
            <div style={{...styles.keyboardHints, display: dimensions.width < 768 ? 'none' : 'flex'}}>
              <div style={styles.hint}>
                <span style={styles.hintKey}>R</span>
                <span>Reset</span>
              </div>
              <div style={styles.hint}>
                <span style={styles.hintKey}>Mouse</span>
                <span>Rotate</span>
              </div>
              <div style={styles.hint}>
                <span style={styles.hintKey}>Wheel</span>
                <span>Zoom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Canvas
        camera={{ 
          position: [3, 2, 5], 
          fov: responsiveFOV,
          aspect: dimensions.width / dimensions.height
        }}
        style={{ 
          width: '100%', 
          height: '100%',
          background: 'linear-gradient(to bottom, #1a1a2e, #16213e)'
        }}
        shadows
        dpr={Math.min(window.devicePixelRatio, 2)} // Optimize for performance
        resize={{ scroll: false, debounce: { scroll: 50, resize: 0 } }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-10, 5, 5]} intensity={0.3} />

        {/* Environment */}
        <Environment preset="studio" />

        {/* OrbitControls - Responsive to screen size */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={dimensions.width < 768 ? 1.5 : 2} // Closer zoom on mobile
          maxDistance={dimensions.width < 768 ? 12 : 15}
          target={[0, 1, 0]}
          enableDamping={true}
          dampingFactor={0.05}
          panSpeed={dimensions.width < 768 ? 0.5 : 1} // Slower pan on mobile
          rotateSpeed={dimensions.width < 768 ? 0.3 : 0.5}
          zoomSpeed={dimensions.width < 768 ? 0.3 : 0.5}
          maxPolarAngle={Math.PI * 0.9} // Prevent camera from going under the ground
        />

        {/* Grid Floor - Responsive size */}
        <Grid
          args={[dimensions.width < 768 ? 15 : 20, dimensions.width < 768 ? 15 : 20]}
          position={[0, 0, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor={'#6f6f6f'}
          sectionSize={5}
          sectionThickness={1}
          sectionColor={'#9d9d9d'}
          fadeDistance={dimensions.width < 768 ? 20 : 25}
          fadeStrength={1}
        />

        {/* 3D Content */}
        <Suspense fallback={<LoadingIndicator />}>
          <group position={[0, 0, 0]}>
            {/* Human model with measurements */}
            <HumanModel
              measurements={applyBodyModifications(measurements, selectedAccessories)}
              measurementMode={measurementMode}
            />
            
            {/* Clothing items */}
            {selectedClothing.map((item) => (
              <ClothingModel
                key={item.id}
                item={item}
                measurements={applyBodyModifications(measurements, selectedAccessories)}
              />
            ))}
            
            {/* Accessories */}
            {selectedAccessories.map((accessory) => (
              <AccessoryModel
                key={accessory.id}
                accessory={accessory}
                measurements={measurements}
              />
            ))}
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
});

// Apply body modifications from cosplay accessories
function applyBodyModifications(
  measurements: BasicMeasurements | DetailedMeasurements,
  accessories: Accessory[]
): BasicMeasurements | DetailedMeasurements {
  if (!accessories.length) return measurements;
  
  // Calculate cumulative modifications
  let chestScale = 1.0;
  let waistScale = 1.0;
  let hipScale = 1.0;
  
  accessories.forEach(accessory => {
    if (accessory.bodyModifications) {
      if (accessory.bodyModifications.chestScale) {
        chestScale *= accessory.bodyModifications.chestScale;
      }
      if (accessory.bodyModifications.waistScale) {
        waistScale *= accessory.bodyModifications.waistScale;
      }
      if (accessory.bodyModifications.hipScale) {
        hipScale *= accessory.bodyModifications.hipScale;
      }
    }
  });
  
  // Apply modifications to detailed measurements if available
  const detailed = measurements as DetailedMeasurements;
  if (detailed.chestCircumference || detailed.waistCircumference || detailed.hipCircumference) {
    return {
      ...detailed,
      chestCircumference: (detailed.chestCircumference || 
        (measurements.gender === 'male' ? 100 : measurements.gender === 'female' ? 90 : 95)) * chestScale,
      waistCircumference: (detailed.waistCircumference || 
        (measurements.gender === 'male' ? 85 : measurements.gender === 'female' ? 70 : 77)) * waistScale,
      hipCircumference: (detailed.hipCircumference || 
        (measurements.gender === 'male' ? 95 : measurements.gender === 'female' ? 100 : 97)) * hipScale,
    };
  }
  
  // For basic measurements, we can't directly modify circumferences, 
  // but the body modifications will still be applied through the accessory visual effects
  return measurements;
}

Scene3D.displayName = 'Scene3D';