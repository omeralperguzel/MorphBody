import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { Accessory, BasicMeasurements, DetailedMeasurements } from '../types';

// Accessory parameters interface
interface AccessoryMeshParameters {
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other';
  headCircumference: number;
  chestCircumference: number;
  waistCircumference: number;
  hipCircumference: number;
  shoulderWidth: number;
  hipWidth: number;
  chestDepth: number;
  waistTaper: number;
}

interface AccessoryModelProps {
  accessory: Accessory;
  measurements: BasicMeasurements | DetailedMeasurements;
}

export const AccessoryModel: React.FC<AccessoryModelProps> = ({ accessory, measurements }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Convert measurements to accessory parameters
  const accessoryParams = useMemo(() => 
    measurementsToAccessoryParameters(measurements), 
    [measurements]
  );

  // Create parametric accessory geometry
  const accessoryGeometry = useMemo(() => {
    return createAccessoryGeometry(accessory, accessoryParams);
  }, [accessory, accessoryParams]);

  // Render the parametric accessory mesh
  const renderAccessoryGeometry = () => {
    const { vertices, faces, position, scale } = accessoryGeometry;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(Array.from(faces));
    geometry.computeVertexNormals();
    
    const material = getAccessoryMaterial(accessory);
    
    return (
      <mesh 
        geometry={geometry} 
        material={material}
        position={[position.x, position.y, position.z]}
        scale={[scale.x, scale.y, scale.z]}
      />
    );
  };

  return (
    <group ref={meshRef}>
      {renderAccessoryGeometry()}
    </group>
  );
};

// Convert measurements to accessory-specific parameters
function measurementsToAccessoryParameters(
  measurements: BasicMeasurements | DetailedMeasurements
): AccessoryMeshParameters {
  // Use the same baseline values as HumanModel for perfect alignment
  const baselines = {
    male: {
      height: 175, weight: 70, headCircumference: 58, neckCircumference: 38,
      chestCircumference: 100, waistCircumference: 85, hipCircumference: 95,
      armLength: 63, wristCircumference: 17, palmLength: 19, fingerLength: 8,
      legLength: 85, thighCircumference: 58, ankleCircumference: 24, toeLength: 26,
      shoulderWidth: 1.2, hipWidth: 0.9, chestDepth: 0.8, waistTaper: 1.0,
      muscleDefinition: 1.1, bicepSize: 1.2, deltoidSize: 1.3, quadricepSize: 1.2,
      calfSize: 1.1, gluteSize: 0.9
    },
    female: {
      height: 165, weight: 60, headCircumference: 56, neckCircumference: 34,
      chestCircumference: 90, waistCircumference: 70, hipCircumference: 100,
      armLength: 58, wristCircumference: 15, palmLength: 17, fingerLength: 7.5,
      legLength: 78, thighCircumference: 55, ankleCircumference: 22, toeLength: 24,
      shoulderWidth: 0.9, hipWidth: 1.2, chestDepth: 1.3, waistTaper: 1.4,
      muscleDefinition: 0.8, bicepSize: 0.8, deltoidSize: 0.9, quadricepSize: 1.0,
      calfSize: 0.9, gluteSize: 1.3
    },
    other: {
      height: 170, weight: 65, headCircumference: 57, neckCircumference: 36,
      chestCircumference: 95, waistCircumference: 77, hipCircumference: 97,
      armLength: 60, wristCircumference: 16, palmLength: 18, fingerLength: 7.8,
      legLength: 81, thighCircumference: 56, ankleCircumference: 23, toeLength: 25,
      shoulderWidth: 1.05, hipWidth: 1.05, chestDepth: 1.05, waistTaper: 1.2,
      muscleDefinition: 0.95, bicepSize: 1.0, deltoidSize: 1.1, quadricepSize: 1.1,
      calfSize: 1.0, gluteSize: 1.1
    }
  };
  
  const baseline = baselines[measurements.gender];
  const detailed = measurements as DetailedMeasurements;
  
  return {
    // Same scaling factors as HumanModel
    height: measurements.height / baseline.height,
    weight: measurements.weight / baseline.weight,
    gender: measurements.gender,
    
    // Use the same gender-specific shape factors as HumanModel
    shoulderWidth: baseline.shoulderWidth,
    hipWidth: baseline.hipWidth,
    chestDepth: baseline.chestDepth,
    waistTaper: baseline.waistTaper,
    
    // Same circumference conversions as HumanModel
    headCircumference: (detailed.headCircumference || baseline.headCircumference) / baseline.headCircumference,
    chestCircumference: (detailed.chestCircumference || baseline.chestCircumference) / baseline.chestCircumference,
    waistCircumference: (detailed.waistCircumference || baseline.waistCircumference) / baseline.waistCircumference,
    hipCircumference: (detailed.hipCircumference || baseline.hipCircumference) / baseline.hipCircumference,
  };
}

// Create parametric accessory geometry
function createAccessoryGeometry(
  accessory: Accessory, 
  params: AccessoryMeshParameters
): { vertices: Float32Array; faces: Uint32Array; position: {x: number, y: number, z: number}; scale: {x: number, y: number, z: number} } {
  
  switch (accessory.type) {
    case 'mask':
      return createMaskGeometry(accessory, params);
    case 'wig':
      return createWigGeometry(accessory, params);
    case 'corset':
      return createCorsetGeometry(accessory, params);
    case 'padding':
      return createPaddingGeometry(accessory, params);
    default:
      return createMaskGeometry(accessory, params);
  }
}

// Create mask geometry - anime-style face masks
function createMaskGeometry(_accessory: Accessory, params: AccessoryMeshParameters) {
  const vertices: number[] = [];
  const faces: number[] = [];
  
  const maskRadius = params.headCircumference * 0.25;
  const maskDepth = maskRadius * 0.2;
  
  // Simple oval mask
  const segments = 12;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * maskRadius;
    const y = Math.sin(angle) * maskRadius * 0.8;
    
    vertices.push(x, y, maskDepth);     // Front
    vertices.push(x * 0.9, y * 0.9, 0); // Back
  }
  
  vertices.push(0, 0, maskDepth);       // Front center
  vertices.push(0, 0, 0);               // Back center
  
  // Create faces
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    const frontCenter = segments * 2;
    const backCenter = segments * 2 + 1;
    
    faces.push(i * 2, next * 2, frontCenter);
    faces.push(backCenter, next * 2 + 1, i * 2 + 1);
    faces.push(i * 2, i * 2 + 1, next * 2);
    faces.push(next * 2, i * 2 + 1, next * 2 + 1);
  }
  
  return {
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces),
    position: { x: 0, y: params.height * 0.7, z: params.headCircumference * 0.15 },
    scale: { x: params.height, y: params.height, z: params.height }
  };
}

// Create wig geometry - anime-style hair
function createWigGeometry(accessory: Accessory, params: AccessoryMeshParameters) {
  const vertices: number[] = [];
  const faces: number[] = [];
  
  const headRadius = params.headCircumference * 0.3;
  const hairLength = accessory.name.includes('long') ? headRadius * 1.5 : headRadius * 0.5;
  
  // Hair strands
  const segments = 16;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle) * headRadius;
    const z = Math.sin(angle) * headRadius;
    
    vertices.push(x, headRadius * 0.2, z);              // Scalp
    vertices.push(x * 1.1, -hairLength, z * 1.1);      // Hair ends
  }
  
  // Create hair faces
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    faces.push(i * 2, next * 2, next * 2 + 1);
    faces.push(i * 2, next * 2 + 1, i * 2 + 1);
  }
  
  return {
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces),
    position: { x: 0, y: params.height * 0.75, z: 0 },
    scale: { x: params.height, y: params.height, z: params.height }
  };
}

// Create corset geometry - waist cinching
function createCorsetGeometry(accessory: Accessory, params: AccessoryMeshParameters) {
  const vertices: number[] = [];
  const faces: number[] = [];
  
  const waistRadius = params.waistCircumference * 0.3;
  const cinchRadius = waistRadius * (accessory.bodyModifications?.waistScale || 0.8);
  const height = params.height * 0.25;
  
  const segments = 12;
  for (let i = 0; i < segments; i++) {
    const angle = (i / segments) * Math.PI * 2;
    const x = Math.cos(angle);
    const z = Math.sin(angle);
    
    vertices.push(x * waistRadius, height, z * waistRadius);      // Top
    vertices.push(x * cinchRadius, height * 0.5, z * cinchRadius); // Cinch
    vertices.push(x * waistRadius, 0, z * waistRadius);           // Bottom
  }
  
  // Create corset panels
  for (let i = 0; i < segments; i++) {
    const next = (i + 1) % segments;
    const base = i * 3;
    const nextBase = next * 3;
    
    faces.push(base, nextBase, nextBase + 1);
    faces.push(base, nextBase + 1, base + 1);
    faces.push(base + 1, nextBase + 1, nextBase + 2);
    faces.push(base + 1, nextBase + 2, base + 2);
  }
  
  return {
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces),
    position: { x: 0, y: params.height * 0.05, z: 0 },
    scale: { x: 1, y: params.height, z: 1 }
  };
}

// Create padding geometry - body enhancement
function createPaddingGeometry(accessory: Accessory, params: AccessoryMeshParameters) {
  const vertices: number[] = [];
  const faces: number[] = [];
  
  let position, scale;
  
  if (accessory.name.includes('chest')) {
    const radius = params.chestCircumference * 0.08;
    const segments = 8;
    
    // Simple sphere for chest padding
    for (let i = 0; i <= segments; i++) {
      const lat = (i / segments) * Math.PI;
      for (let j = 0; j < segments; j++) {
        const lon = (j / segments) * Math.PI * 2;
        
        const x = Math.sin(lat) * Math.cos(lon) * radius;
        const y = Math.cos(lat) * radius;
        const z = Math.sin(lat) * Math.sin(lon) * radius;
        
        vertices.push(x, y, z);
      }
    }
    
    for (let i = 0; i < segments; i++) {
      for (let j = 0; j < segments; j++) {
        const first = i * segments + j;
        const second = first + segments;
        const next = (j + 1) % segments;
        
        if (i < segments) {
          faces.push(first, second, first + next);
          if (second + next < vertices.length / 3) {
            faces.push(second, second + next, first + next);
          }
        }
      }
    }
    
    position = { x: 0, y: params.height * 0.5, z: params.chestCircumference * 0.15 };
    
  } else {
    // Hip padding - simple ellipsoid
    const radius = params.hipCircumference * 0.12;
    const segments = 8;
    
    for (let i = 0; i < segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius * 0.6;
      
      vertices.push(x, radius * 0.3, z);
      vertices.push(x, -radius * 0.3, z);
    }
    
    for (let i = 0; i < segments; i++) {
      const next = (i + 1) % segments;
      faces.push(i * 2, next * 2, next * 2 + 1);
      faces.push(i * 2, next * 2 + 1, i * 2 + 1);
    }
    
    position = { x: 0, y: params.height * 0.1, z: 0 };
  }
  
  scale = {
    x: accessory.bodyModifications?.hipScale || accessory.bodyModifications?.chestScale || 1,
    y: params.height,
    z: accessory.bodyModifications?.hipScale || accessory.bodyModifications?.chestScale || 1
  };
  
  return {
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces),
    position: position!,
    scale
  };
}

// Get material for accessory type
function getAccessoryMaterial(accessory: Accessory): THREE.Material {
  const materials = {
    mask: new THREE.MeshStandardMaterial({
      color: accessory.name.includes('cat') ? '#ffa500' : 
             accessory.name.includes('fox') ? '#d2691e' : '#ff6b6b',
      transparent: true,
      opacity: 0.9,
      side: THREE.DoubleSide
    }),
    wig: new THREE.MeshStandardMaterial({
      color: accessory.name.includes('long') ? '#8b4513' : '#daa520',
      transparent: true,
      opacity: 0.85,
      side: THREE.DoubleSide
    }),
    corset: new THREE.MeshStandardMaterial({
      color: '#800080',
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    }),
    padding: new THREE.MeshStandardMaterial({
      color: '#ffb6c1',
      transparent: true,
      opacity: 0.6,
      side: THREE.DoubleSide
    }),
  };
  
  return materials[accessory.type] || materials.mask;
}