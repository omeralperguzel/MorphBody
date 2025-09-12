import React, { useRef, useMemo } from 'react';
import * as THREE from 'three';
import type { ClothingItem, BasicMeasurements, DetailedMeasurements } from '../types';

// Mesh parameters interface matching HumanModel
interface ClothingMeshParameters {
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other';
  shoulderWidth: number;
  hipWidth: number;
  chestDepth: number;
  waistTaper: number;
  chestCircumference: number;
  waistCircumference: number;
  hipCircumference: number;
  armLength: number;
  legLength: number;
  size: 'S' | 'M' | 'L';
}

interface ClothingModelProps {
  item: ClothingItem;
  measurements: BasicMeasurements | DetailedMeasurements;
}

export const ClothingModel: React.FC<ClothingModelProps> = ({ item, measurements }) => {
  const meshRef = useRef<THREE.Group>(null);
  
  // Convert measurements to clothing parameters
  const clothingParams = useMemo(() => 
    measurementsToClothingParameters(measurements, item.size), 
    [measurements, item.size]
  );

  // Create parametric clothing geometry
  const clothingGeometry = useMemo(() => {
    return createClothingGeometry(item.type, clothingParams);
  }, [item.type, clothingParams]);

  // Render the parametric clothing mesh
  const renderClothingGeometry = () => {
    const { vertices, faces } = clothingGeometry;
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.setIndex(Array.from(faces));
    geometry.computeVertexNormals();
    
    const material = getClothingMaterial(item.type);
    
    return (
      <mesh geometry={geometry} material={material} />
    );
  };

  return (
    <group ref={meshRef}>
      {renderClothingGeometry()}
    </group>
  );
};
// Create parametric clothing geometry
function createClothingGeometry(
  type: ClothingItem['type'], 
  params: ClothingMeshParameters
): { vertices: Float32Array; faces: Uint32Array } {
  
  switch (type) {
    case 'tshirt':
      return createTShirtGeometry(params);
    case 'hoodie':
      return createHoodieGeometry(params);
    case 'pants':
      return createPantsGeometry(params);
    case 'dress':
      return createDressGeometry(params);
    case 'skirt':
      return createSkirtGeometry(params);
    case 'suit':
      return createSuitGeometry(params);
    default:
      return createTShirtGeometry(params);
  }
}

// Convert measurements to clothing-specific parameters - aligned with HumanModel
function measurementsToClothingParameters(
  measurements: BasicMeasurements | DetailedMeasurements, 
  size: 'S' | 'M' | 'L'
): ClothingMeshParameters {
  // Use the same baseline values as HumanModel for consistency
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
  
  // Size multipliers for clothing fit (clothing ease)
  const sizeMultipliers = {
    S: { fit: 0.95, ease: 0.02 },
    M: { fit: 1.0, ease: 0.05 },  
    L: { fit: 1.05, ease: 0.08 }
  };
  
  const sizeData = sizeMultipliers[size];
  
  // Use detailed measurements if available, otherwise fallback to baseline
  const detailed = measurements as DetailedMeasurements;
  
  return {
    // Same scaling as HumanModel
    height: measurements.height / baseline.height,
    weight: measurements.weight / baseline.weight,
    gender: measurements.gender,
    size,
    
    // Use the same gender-specific shape factors as HumanModel
    shoulderWidth: baseline.shoulderWidth * sizeData.fit,
    hipWidth: baseline.hipWidth * sizeData.fit,
    chestDepth: baseline.chestDepth * sizeData.fit,
    waistTaper: baseline.waistTaper * sizeData.fit,
    
    // Circumferences with clothing ease - same conversion as HumanModel
    chestCircumference: ((detailed.chestCircumference || baseline.chestCircumference) / baseline.chestCircumference) * (1 + sizeData.ease),
    waistCircumference: ((detailed.waistCircumference || baseline.waistCircumference) / baseline.waistCircumference) * (1 + sizeData.ease),
    hipCircumference: ((detailed.hipCircumference || baseline.hipCircumference) / baseline.hipCircumference) * (1 + sizeData.ease),
    armLength: ((detailed.armLength || baseline.armLength) / baseline.armLength),
    legLength: ((detailed.legLength || baseline.legLength) / baseline.legLength),
  };
}

// Create T-Shirt geometry - fitted to body parameters
function createTShirtGeometry(params: ClothingMeshParameters): { vertices: Float32Array; faces: Uint32Array } {
  const vertices: number[] = [];
  const faces: number[] = [];
  
  // T-shirt dimensions based on body parameters
  const chestWidth = params.chestCircumference * params.shoulderWidth * 0.4;
  const length = params.height * 0.6;
  const armLength = params.armLength * 0.3;
  
  // Simple T-shirt mesh - front and back panels with sleeves
  vertices.push(
    // Front panel
    -chestWidth, length, 0.02,     // 0: Top left front
    chestWidth, length, 0.02,      // 1: Top right front
    chestWidth, 0, 0.02,           // 2: Bottom right front  
    -chestWidth, 0, 0.02,          // 3: Bottom left front
    
    // Back panel
    -chestWidth, length, -0.02,    // 4: Top left back
    chestWidth, length, -0.02,     // 5: Top right back
    chestWidth, 0, -0.02,          // 6: Bottom right back
    -chestWidth, 0, -0.02,         // 7: Bottom left back
    
    // Left sleeve
    -chestWidth - armLength, length * 0.8, 0,    // 8: Left sleeve end
    -chestWidth, length * 0.6, 0,                // 9: Left sleeve base
    
    // Right sleeve
    chestWidth + armLength, length * 0.8, 0,     // 10: Right sleeve end
    chestWidth, length * 0.6, 0                  // 11: Right sleeve base
  );
  
  // T-shirt faces
  faces.push(
    // Front panel
    0, 1, 2,  0, 2, 3,
    // Back panel  
    5, 4, 7,  5, 7, 6,
    // Connect front to back at top
    0, 4, 5,  0, 5, 1,
    // Connect front to back at bottom
    3, 2, 6,  3, 6, 7,
    // Left sleeve
    0, 9, 8,  0, 8, 4,
    // Right sleeve
    1, 10, 11, 1, 11, 2
  );
  
  return {
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces)
  };
}

// Create Hoodie geometry
function createHoodieGeometry(params: ClothingMeshParameters): { vertices: Float32Array; faces: Uint32Array } {
  const tshirt = createTShirtGeometry({...params, height: params.height * 1.1});
  const vertices = Array.from(tshirt.vertices);
  const faces = Array.from(tshirt.faces);
  
  // Add hood vertices
  const currentVertexCount = vertices.length / 3;
  const hoodHeight = params.height * 0.15;
  const hoodWidth = params.chestCircumference * params.shoulderWidth * 0.25;
  const topY = params.height * 0.6;
  
  vertices.push(
    -hoodWidth, topY + hoodHeight, -hoodWidth * 0.3,  // Hood left
    0, topY + hoodHeight * 1.2, -hoodWidth * 0.4,     // Hood top
    hoodWidth, topY + hoodHeight, -hoodWidth * 0.3     // Hood right
  );
  
  // Hood faces
  faces.push(
    currentVertexCount, currentVertexCount + 1, currentVertexCount + 2
  );
  
  return {
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces)
  };
}

// Create Pants geometry
function createPantsGeometry(params: ClothingMeshParameters): { vertices: Float32Array; faces: Uint32Array } {
  const vertices: number[] = [];
  const faces: number[] = [];
  
  const waistWidth = params.waistCircumference * 0.4;
  const hipWidth = params.hipCircumference * params.hipWidth * 0.4;
  const legLength = params.legLength;
  const legWidth = hipWidth * 0.25;
  
  // Pants vertices
  vertices.push(
    // Waist
    -waistWidth, 0, 0.02,          // 0: Waist left front
    waistWidth, 0, 0.02,           // 1: Waist right front
    waistWidth, 0, -0.02,          // 2: Waist right back
    -waistWidth, 0, -0.02,         // 3: Waist left back
    
    // Hip level
    -hipWidth, -legLength * 0.15, 0.02,    // 4: Hip left front
    hipWidth, -legLength * 0.15, 0.02,     // 5: Hip right front
    hipWidth, -legLength * 0.15, -0.02,    // 6: Hip right back
    -hipWidth, -legLength * 0.15, -0.02,   // 7: Hip left back
    
    // Left leg bottom
    -legWidth, -legLength, 0.01,   // 8: Left ankle front
    -legWidth, -legLength, -0.01,  // 9: Left ankle back
    
    // Right leg bottom
    legWidth, -legLength, 0.01,    // 10: Right ankle front
    legWidth, -legLength, -0.01    // 11: Right ankle back
  );
  
  // Pants faces
  faces.push(
    // Waist to hips
    0, 4, 5,  0, 5, 1,
    1, 5, 6,  1, 6, 2,
    2, 6, 7,  2, 7, 3,
    3, 7, 4,  3, 4, 0,
    
    // Left leg
    4, 8, 9,  4, 9, 7,
    // Right leg
    5, 10, 11, 5, 11, 6,
    
    // Crotch connection
    4, 7, 6,  4, 6, 5
  );
  
  return {
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces)
  };
}

// Create Suit geometry
function createSuitGeometry(params: ClothingMeshParameters): { vertices: Float32Array; faces: Uint32Array } {
  const jacket = createTShirtGeometry({...params, height: params.height * 1.05});
  const pants = createPantsGeometry(params);
  
  const vertices = new Float32Array(jacket.vertices.length + pants.vertices.length);
  vertices.set(jacket.vertices, 0);
  vertices.set(pants.vertices, jacket.vertices.length);
  
  const faces = new Uint32Array(jacket.faces.length + pants.faces.length);
  faces.set(jacket.faces, 0);
  const pantsOffset = jacket.vertices.length / 3;
  for (let i = 0; i < pants.faces.length; i++) {
    faces[jacket.faces.length + i] = pants.faces[i] + pantsOffset;
  }
  
  return { vertices, faces };
}

// Create Dress geometry - combines top and flowing skirt
function createDressGeometry(params: ClothingMeshParameters): { vertices: Float32Array; faces: Uint32Array } {
  const vertices: number[] = [];
  const faces: number[] = [];
  
  const chestWidth = params.chestCircumference * params.shoulderWidth * 0.4;
  const waistWidth = params.waistCircumference * params.waistTaper * 0.35;
  const hemWidth = params.hipCircumference * params.hipWidth * 0.5;
  const dressLength = params.height * 0.8;
  const armLength = params.armLength * 0.25;
  
  // Dress vertices - fitted bodice flowing to A-line hem
  vertices.push(
    // Bodice top
    -chestWidth, dressLength * 0.8, 0.02,      // 0: Top left front
    chestWidth, dressLength * 0.8, 0.02,       // 1: Top right front
    -chestWidth, dressLength * 0.8, -0.02,     // 2: Top left back
    chestWidth, dressLength * 0.8, -0.02,      // 3: Top right back
    
    // Waist
    -waistWidth, dressLength * 0.4, 0.02,      // 4: Waist left front
    waistWidth, dressLength * 0.4, 0.02,       // 5: Waist right front
    -waistWidth, dressLength * 0.4, -0.02,     // 6: Waist left back
    waistWidth, dressLength * 0.4, -0.02,      // 7: Waist right back
    
    // Hem (flowing A-line)
    -hemWidth, 0, 0.02,                        // 8: Hem left front
    hemWidth, 0, 0.02,                         // 9: Hem right front
    -hemWidth, 0, -0.02,                       // 10: Hem left back
    hemWidth, 0, -0.02,                        // 11: Hem right back
    
    // Sleeves (short)
    -chestWidth - armLength, dressLength * 0.75, 0,   // 12: Left sleeve
    chestWidth + armLength, dressLength * 0.75, 0     // 13: Right sleeve
  );
  
  // Dress faces
  faces.push(
    // Front panel - bodice to waist to hem
    0, 1, 5,  0, 5, 4,
    4, 5, 9,  4, 9, 8,
    
    // Back panel
    3, 2, 6,  3, 6, 7,
    7, 6, 10, 7, 10, 11,
    
    // Connect front to back
    0, 2, 3,  0, 3, 1,
    4, 6, 7,  4, 7, 5,
    8, 10, 11, 8, 11, 9,
    
    // Sleeves
    0, 12, 2,
    1, 13, 3
  );
  
  return {
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces)
  };
}

// Create Skirt geometry - waist to hem A-line
function createSkirtGeometry(params: ClothingMeshParameters): { vertices: Float32Array; faces: Uint32Array } {
  const vertices: number[] = [];
  const faces: number[] = [];
  
  const waistWidth = params.waistCircumference * 0.4;
  const hemWidth = params.hipCircumference * params.hipWidth * 0.5;
  const skirtLength = params.height * 0.4;
  
  // Skirt vertices
  vertices.push(
    // Waistband
    -waistWidth, 0, 0.02,              // 0: Waist left front
    waistWidth, 0, 0.02,               // 1: Waist right front
    -waistWidth, 0, -0.02,             // 2: Waist left back
    waistWidth, 0, -0.02,              // 3: Waist right back
    
    // Hem (flared)
    -hemWidth, -skirtLength, 0.02,     // 4: Hem left front
    hemWidth, -skirtLength, 0.02,      // 5: Hem right front
    -hemWidth, -skirtLength, -0.02,    // 6: Hem left back
    hemWidth, -skirtLength, -0.02      // 7: Hem right back
  );
  
  // Skirt faces
  faces.push(
    // Front panel
    0, 1, 5,  0, 5, 4,
    // Back panel
    3, 2, 6,  3, 6, 7,
    // Connect front to back at waist
    0, 2, 3,  0, 3, 1,
    // Connect front to back at hem
    4, 6, 7,  4, 7, 5
  );
  
  return {
    vertices: new Float32Array(vertices),
    faces: new Uint32Array(faces)
  };
}

// Get material for clothing type
function getClothingMaterial(type: ClothingItem['type']): THREE.Material {
  const materials = {
    tshirt: new THREE.MeshStandardMaterial({ 
      color: '#4a90e2', 
      transparent: true, 
      opacity: 0.85,
      side: THREE.DoubleSide
    }),
    hoodie: new THREE.MeshStandardMaterial({ 
      color: '#2d3748', 
      transparent: true, 
      opacity: 0.85,
      side: THREE.DoubleSide 
    }),
    pants: new THREE.MeshStandardMaterial({ 
      color: '#1a365d', 
      transparent: true, 
      opacity: 0.85,
      side: THREE.DoubleSide 
    }),
    dress: new THREE.MeshStandardMaterial({ 
      color: '#e53e3e', 
      transparent: true, 
      opacity: 0.85,
      side: THREE.DoubleSide 
    }),
    skirt: new THREE.MeshStandardMaterial({ 
      color: '#d53f8c', 
      transparent: true, 
      opacity: 0.85,
      side: THREE.DoubleSide 
    }),
    suit: new THREE.MeshStandardMaterial({ 
      color: '#1a202c', 
      transparent: true, 
      opacity: 0.85,
      side: THREE.DoubleSide 
    }),
  };
  
  return materials[type] || materials.tshirt;
}