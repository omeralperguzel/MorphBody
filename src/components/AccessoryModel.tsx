import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import type { Accessory, BasicMeasurements, DetailedMeasurements } from '../types';

interface AccessoryModelProps {
  accessory: Accessory;
  measurements: BasicMeasurements | DetailedMeasurements;
}

export const AccessoryModel: React.FC<AccessoryModelProps> = ({ accessory, measurements }) => {
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current) {
      // Apply accessory-specific positioning and scaling
      const transform = calculateAccessoryTransform(accessory, measurements);
      meshRef.current.scale.set(transform.scale.x, transform.scale.y, transform.scale.z);
      meshRef.current.position.set(transform.position.x, transform.position.y, transform.position.z);
      meshRef.current.rotation.set(transform.rotation.x, transform.rotation.y, transform.rotation.z);
    }
  }, [accessory, measurements]);

  // Placeholder accessory geometry - in real app would load from GLTF
  const renderAccessoryGeometry = () => {
    switch (accessory.type) {
      case 'mask':
        return (
          <mesh>
            <sphereGeometry args={[0.28, 16, 16]} />
            <meshStandardMaterial 
              color={accessory.name.includes('cat') ? '#ffa500' : '#8b4513'} 
              transparent 
              opacity={0.9} 
            />
          </mesh>
        );
        
      case 'wig':
        return (
          <mesh>
            <sphereGeometry args={[0.32, 16, 16]} />
            <meshStandardMaterial 
              color={accessory.name.includes('long') ? '#8B4513' : '#D2691E'} 
              transparent 
              opacity={0.8} 
            />
          </mesh>
        );
        
      case 'corset':
        return (
          <mesh>
            <cylinderGeometry args={[0.35, 0.45, 0.8, 16]} />
            <meshStandardMaterial color="#800080" transparent opacity={0.7} />
          </mesh>
        );
        
      case 'padding':
        return (
          <mesh>
            {accessory.name.includes('chest') ? (
              <sphereGeometry args={[0.15, 16, 16]} />
            ) : (
              <sphereGeometry args={[0.2, 16, 16]} />
            )}
            <meshStandardMaterial color="#ffb6c1" transparent opacity={0.6} />
          </mesh>
        );
        
      default:
        return null;
    }
  };

  return (
    <group ref={meshRef}>
      {renderAccessoryGeometry()}
    </group>
  );
};

function calculateAccessoryTransform(accessory: Accessory, measurements: BasicMeasurements | DetailedMeasurements) {
  const baseHeight = 170; // cm
  const heightRatio = measurements.height / baseHeight;
  
  let transform = {
    scale: { x: 1, y: 1, z: 1 },
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  };

  switch (accessory.type) {
    case 'mask':
      transform.position = { x: 0, y: 1.2 * heightRatio, z: 0.2 };
      transform.scale = { x: heightRatio, y: heightRatio, z: heightRatio };
      break;
      
    case 'wig':
      transform.position = { x: 0, y: 1.3 * heightRatio, z: 0 };
      transform.scale = { x: heightRatio, y: heightRatio, z: heightRatio };
      break;
      
    case 'corset':
      transform.position = { x: 0, y: -0.1 * heightRatio, z: 0 };
      transform.scale = { 
        x: 0.8 * (accessory.bodyModifications?.waistScale || 1), 
        y: heightRatio, 
        z: 0.8 * (accessory.bodyModifications?.waistScale || 1) 
      };
      break;
      
    case 'padding':
      if (accessory.name.includes('chest')) {
        transform.position = { x: 0, y: 0.3 * heightRatio, z: 0.25 };
        transform.scale = { 
          x: accessory.bodyModifications?.chestScale || 1, 
          y: accessory.bodyModifications?.chestScale || 1, 
          z: accessory.bodyModifications?.chestScale || 1 
        };
      } else if (accessory.name.includes('hip')) {
        transform.position = { x: 0, y: -0.5 * heightRatio, z: 0 };
        transform.scale = { 
          x: accessory.bodyModifications?.hipScale || 1, 
          y: 1, 
          z: accessory.bodyModifications?.hipScale || 1 
        };
      }
      break;
  }
  
  return transform;
}