import React, { Suspense, useRef, useImperativeHandle, forwardRef, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Grid } from '@react-three/drei';
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

  return (
    <div 
      className="w-full h-full relative"
      style={{ 
        width: '100vw', 
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    >
      {/* Modern UI Overlay - Top */}
      <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
        {/* 3D View Indicator */}
        <div className="flex items-center space-x-3 pointer-events-auto">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/20">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-xl shadow-lg shadow-cyan-500/25">
                <span className="text-lg">🎮</span>
              </div>
              <div>
                <div className="text-sm font-bold text-white">3D Interactive Mode</div>
                <div className="text-xs text-white/60">Drag to rotate • Scroll to zoom</div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => controlsRef.current?.reset()}
            className="group bg-white/5 backdrop-blur-xl border border-white/10 hover:border-white/20 rounded-xl p-3 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-cyan-500/10"
            title="Reset Camera (R)"
          >
            <div className="text-white/70 group-hover:text-white transition-colors duration-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Modern UI Overlay - Bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 pointer-events-none">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/20 pointer-events-auto">
          <div className="flex items-center space-x-6 text-sm">
            {/* Model Stats */}
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg shadow-lg shadow-emerald-500/25">
                <span className="text-sm">📊</span>
              </div>
              <div>
                <div className="text-white/90 font-medium">
                  {measurements.height}cm • {measurements.weight}kg • {measurements.gender}
                </div>
                <div className="text-white/60 text-xs">
                  Clothing: {selectedClothing.length} • Accessories: {selectedAccessories.length}
                </div>
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="hidden md:flex items-center space-x-4 text-xs text-white/60 border-l border-white/10 pl-6">
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">R</kbd>
                <span>Reset</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Mouse</kbd>
                <span>Orbit</span>
              </div>
              <div className="flex items-center space-x-2">
                <kbd className="px-2 py-1 bg-white/10 rounded border border-white/20 font-mono">Wheel</kbd>
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
            {/* Human Model with body modifications applied */}
            <HumanModel
              measurements={applyBodyModifications(measurements, selectedAccessories)}
              measurementMode={measurementMode}
            />
            
            {/* Clothing */}
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