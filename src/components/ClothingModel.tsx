import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { ClothingItem, BasicMeasurements, DetailedMeasurements } from '../types';

interface ClothingModelProps {
  item: ClothingItem;
  measurements: BasicMeasurements | DetailedMeasurements;
}

export const ClothingModel: React.FC<ClothingModelProps> = ({ item, measurements }) => {
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current) {
      // Apply clothing-specific scaling based on measurements
      const scale = calculateClothingScale(item, measurements);
      meshRef.current.scale.set(scale.x, scale.y, scale.z);
    }
  }, [item, measurements]);

  // Placeholder clothing geometry - in real app would load from GLTF
  const renderClothingGeometry = () => {
    switch (item.type) {
      case 'tshirt':
        return (
          <>
            {/* T-shirt body */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.9, 1.2, 0.45]} />
              <meshStandardMaterial color="#4a90e2" transparent opacity={0.8} />
            </mesh>
            {/* T-shirt sleeves */}
            <mesh position={[-0.7, 0.3, 0]}>
              <boxGeometry args={[0.25, 0.6, 0.2]} />
              <meshStandardMaterial color="#4a90e2" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0.7, 0.3, 0]}>
              <boxGeometry args={[0.25, 0.6, 0.2]} />
              <meshStandardMaterial color="#4a90e2" transparent opacity={0.8} />
            </mesh>
          </>
        );
        
      case 'hoodie':
        return (
          <>
            {/* Hoodie body */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[1.0, 1.3, 0.5]} />
              <meshStandardMaterial color="#2d3748" transparent opacity={0.8} />
            </mesh>
            {/* Hoodie sleeves */}
            <mesh position={[-0.75, 0.3, 0]}>
              <boxGeometry args={[0.3, 1.0, 0.25]} />
              <meshStandardMaterial color="#2d3748" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0.75, 0.3, 0]}>
              <boxGeometry args={[0.3, 1.0, 0.25]} />
              <meshStandardMaterial color="#2d3748" transparent opacity={0.8} />
            </mesh>
            {/* Hood */}
            <mesh position={[0, 1.0, -0.1]}>
              <boxGeometry args={[0.6, 0.4, 0.4]} />
              <meshStandardMaterial color="#2d3748" transparent opacity={0.8} />
            </mesh>
          </>
        );
        
      case 'pants':
        return (
          <>
            {/* Pants legs */}
            <mesh position={[-0.25, -1.2, 0]}>
              <boxGeometry args={[0.25, 1.5, 0.25]} />
              <meshStandardMaterial color="#1a365d" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0.25, -1.2, 0]}>
              <boxGeometry args={[0.25, 1.5, 0.25]} />
              <meshStandardMaterial color="#1a365d" transparent opacity={0.8} />
            </mesh>
            {/* Waist */}
            <mesh position={[0, -0.3, 0]}>
              <boxGeometry args={[0.85, 0.3, 0.45]} />
              <meshStandardMaterial color="#1a365d" transparent opacity={0.8} />
            </mesh>
          </>
        );
        
      case 'suit':
        return (
          <>
            {/* Suit jacket */}
            <mesh position={[0, 0.1, 0]}>
              <boxGeometry args={[0.95, 1.4, 0.48]} />
              <meshStandardMaterial color="#1a202c" transparent opacity={0.8} />
            </mesh>
            {/* Suit sleeves */}
            <mesh position={[-0.7, 0.3, 0]}>
              <boxGeometry args={[0.2, 1.1, 0.2]} />
              <meshStandardMaterial color="#1a202c" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0.7, 0.3, 0]}>
              <boxGeometry args={[0.2, 1.1, 0.2]} />
              <meshStandardMaterial color="#1a202c" transparent opacity={0.8} />
            </mesh>
            {/* Suit pants */}
            <mesh position={[-0.22, -1.2, 0]}>
              <boxGeometry args={[0.22, 1.5, 0.22]} />
              <meshStandardMaterial color="#1a202c" transparent opacity={0.8} />
            </mesh>
            <mesh position={[0.22, -1.2, 0]}>
              <boxGeometry args={[0.22, 1.5, 0.22]} />
              <meshStandardMaterial color="#1a202c" transparent opacity={0.8} />
            </mesh>
          </>
        );
        
      default:
        return null;
    }
  };

  return (
    <group ref={meshRef}>
      {renderClothingGeometry()}
    </group>
  );
};

function calculateClothingScale(item: ClothingItem, measurements: BasicMeasurements | DetailedMeasurements) {
  // Size multipliers
  const sizeMultipliers = {
    S: 0.9,
    M: 1.0,
    L: 1.1,
  };
  
  const sizeMultiplier = sizeMultipliers[item.size];
  const baseHeight = 170; // cm
  const heightRatio = measurements.height / baseHeight;
  
  // Basic scaling based on height and size
  let scale = {
    x: sizeMultiplier,
    y: heightRatio,
    z: sizeMultiplier,
  };
  
  // Adjust for gender if available
  if (measurements.gender === 'male') {
    scale.x *= 1.05;
    scale.z *= 1.02;
  } else if (measurements.gender === 'female') {
    scale.x *= 0.98;
    scale.z *= 0.98;
  }
  
  return scale;
}