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