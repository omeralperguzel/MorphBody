import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BasicMeasurements, DetailedMeasurements } from '../types';

interface HumanModelProps {
  measurements: BasicMeasurements | DetailedMeasurements;
  measurementMode: 'basic' | 'detailed';
}

export const HumanModel: React.FC<HumanModelProps> = ({ measurements, measurementMode }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [modelLoaded, setModelLoaded] = useState(false);

  // For now, we'll create a simple placeholder geometry since we don't have the actual GLTF model
  // In a real implementation, you would use:
  // const { scene } = useGLTF('/assets/models/human_base.glb');

  useEffect(() => {
    if (meshRef.current) {
      // Apply measurements-based scaling
      const scale = calculateScale(measurements, measurementMode);
      meshRef.current.scale.set(scale.x, scale.y, scale.z);
      setModelLoaded(true);
    }
  }, [measurements, measurementMode]);

  useFrame((state) => {
    if (meshRef.current && modelLoaded) {
      // Subtle idle animation
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.02;
    }
  });

  return (
    <mesh ref={meshRef} castShadow receiveShadow>
      {/* Placeholder human-like geometry */}
      <group>
        {/* Body */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.8, 1.6, 0.4]} />
          <meshStandardMaterial color="#ddb5a5" />
        </mesh>
        
        {/* Head */}
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.25, 16, 16]} />
          <meshStandardMaterial color="#ddb5a5" />
        </mesh>
        
        {/* Arms */}
        <mesh position={[-0.6, 0.3, 0]}>
          <boxGeometry args={[0.15, 1.2, 0.15]} />
          <meshStandardMaterial color="#ddb5a5" />
        </mesh>
        <mesh position={[0.6, 0.3, 0]}>
          <boxGeometry args={[0.15, 1.2, 0.15]} />
          <meshStandardMaterial color="#ddb5a5" />
        </mesh>
        
        {/* Legs */}
        <mesh position={[-0.2, -1.2, 0]}>
          <boxGeometry args={[0.2, 1.4, 0.2]} />
          <meshStandardMaterial color="#ddb5a5" />
        </mesh>
        <mesh position={[0.2, -1.2, 0]}>
          <boxGeometry args={[0.2, 1.4, 0.2]} />
          <meshStandardMaterial color="#ddb5a5" />
        </mesh>
      </group>
    </mesh>
  );
};

function calculateScale(measurements: BasicMeasurements | DetailedMeasurements, mode: 'basic' | 'detailed') {
  const baseHeight = 170; // cm
  const baseWeight = 70; // kg
  
  if (mode === 'basic') {
    const heightRatio = measurements.height / baseHeight;
    const weightRatio = Math.sqrt(measurements.weight / baseWeight);
    
    // Gender-based adjustments
    let genderModifier = { x: 1, y: 1, z: 1 };
    if (measurements.gender === 'male') {
      genderModifier = { x: 1.1, y: 1, z: 1.05 };
    } else if (measurements.gender === 'female') {
      genderModifier = { x: 0.95, y: 1, z: 0.95 };
    }
    
    return {
      x: weightRatio * genderModifier.x,
      y: heightRatio * genderModifier.y,
      z: weightRatio * genderModifier.z,
    };
  }
  
  // Detailed mode calculations
  const detailed = measurements as DetailedMeasurements;
  const heightRatio = detailed.height / baseHeight;
  
  return {
    x: (detailed.chestCircumference / 90) * 0.8 + 0.2, // Base chest circumference 90cm
    y: heightRatio,
    z: (detailed.waistCircumference / 75) * 0.6 + 0.4, // Base waist circumference 75cm
  };
}

// Preload the model (placeholder - would be actual GLTF path)
// useGLTF.preload('/assets/models/human_base.glb');