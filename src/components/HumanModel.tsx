import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { BasicMeasurements, DetailedMeasurements } from '../types';

interface HumanModelProps {
  measurements: BasicMeasurements | DetailedMeasurements;
  measurementMode: 'basic' | 'detailed';
}

// Enhanced parametric model with gender-specific morphology and muscle definition
interface MeshParameters {
  // Core measurements
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other';
  
  // Gender-specific shape factors
  shoulderWidth: number;  // Relative shoulder broadness
  hipWidth: number;       // Relative hip width
  chestDepth: number;     // Chest/breast volume
  waistTaper: number;     // Waist definition
  
  // Muscle definition factors
  muscleDefinition: number; // Overall muscle visibility
  bicepSize: number;       // Bicep/tricep bulk
  deltoidSize: number;     // Shoulder muscle prominence
  quadricepSize: number;   // Thigh muscle definition
  calfSize: number;        // Calf muscle prominence
  gluteSize: number;       // Glute roundness
  
  // Body circumferences
  headCircumference: number;
  neckCircumference: number;
  chestCircumference: number;
  waistCircumference: number;
  hipCircumference: number;
  
  // Limb measurements
  armLength: number;
  wristCircumference: number;
  palmLength: number;
  fingerLength: number;
  legLength: number;
  thighCircumference: number;
  ankleCircumference: number;
  toeLength: number;
}

export const HumanModel: React.FC<HumanModelProps> = ({ measurements, measurementMode }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [parameters, setParameters] = useState<MeshParameters>(() => 
    measurementsToParameters(measurements, measurementMode)
  );

  // Create the connected manifold human mesh
  const geometry = useMemo(() => {
    return createConnectedHumanGeometry(parameters);
  }, []);

  // Update geometry when measurements change
  useEffect(() => {
    const newParams = measurementsToParameters(measurements, measurementMode);
    setParameters(newParams);
    
    // Morph the existing geometry
    morphConnectedGeometry(geometry, newParams);
  }, [measurements, measurementMode, geometry]);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing animation
      const breathingScale = 1 + Math.sin(state.clock.elapsedTime * 1.2) * 0.005;
      meshRef.current.scale.y = breathingScale;
    }
  });

  return (
    <mesh
      ref={meshRef}
      geometry={geometry}
      castShadow
      receiveShadow
      position={[0, 0, 0]}
    >
      <meshStandardMaterial
        color="#f4c2a1"
        roughness={0.6}
        metalness={0.02}
        side={THREE.DoubleSide}
        flatShading={false}
      />
    </mesh>
  );
};

// Create connected manifold human geometry with proper joint topology
function createConnectedHumanGeometry(params: MeshParameters): THREE.BufferGeometry {
  const geometry = new THREE.BufferGeometry();
  
  // Define connected mesh vertices
  const baseVertices = getConnectedHumanVertices();
  const faces = getConnectedHumanFaces();
  const vertexRegions = getConnectedVertexRegions();
  
  // Apply initial morphing
  const morphedVertices = morphConnectedVertices(baseVertices, vertexRegions, params);
  
  // Set geometry attributes
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(morphedVertices, 3));
  geometry.setIndex(Array.from(faces));
  geometry.computeVertexNormals();
  geometry.computeBoundingBox();
  
  // Store base data for morphing
  (geometry as any).baseVertices = baseVertices;
  (geometry as any).vertexRegions = vertexRegions;
  
  return geometry;
}

// Morph existing geometry with new parameters
function morphConnectedGeometry(geometry: THREE.BufferGeometry, params: MeshParameters) {
  const baseVertices = (geometry as any).baseVertices;
  const vertexRegions = (geometry as any).vertexRegions;
  
  if (!baseVertices || !vertexRegions) return;
  
  const morphedVertices = morphConnectedVertices(baseVertices, vertexRegions, params);
  
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(morphedVertices, 3));
  geometry.attributes.position.needsUpdate = true;
  geometry.computeVertexNormals();
}

// Convert measurements to mesh parameters with realistic baseline values
function measurementsToParameters(
  measurements: BasicMeasurements | DetailedMeasurements, 
  mode: 'basic' | 'detailed'
): MeshParameters {
  // Baseline values for average adult with gender-specific shape factors
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
  
  if (mode === 'basic') {
    return {
      height: measurements.height / baseline.height,
      weight: measurements.weight / baseline.weight,
      gender: measurements.gender,
      
      // Gender-specific shape factors
      shoulderWidth: baseline.shoulderWidth,
      hipWidth: baseline.hipWidth,
      chestDepth: baseline.chestDepth,
      waistTaper: baseline.waistTaper,
      
      // Muscle definition factors
      muscleDefinition: baseline.muscleDefinition,
      bicepSize: baseline.bicepSize,
      deltoidSize: baseline.deltoidSize,
      quadricepSize: baseline.quadricepSize,
      calfSize: baseline.calfSize,
      gluteSize: baseline.gluteSize,
      
      // Use gender-based defaults for detailed measurements
      headCircumference: baseline.headCircumference / baseline.headCircumference,
      neckCircumference: baseline.neckCircumference / baseline.neckCircumference,
      chestCircumference: baseline.chestCircumference / baseline.chestCircumference,
      waistCircumference: baseline.waistCircumference / baseline.waistCircumference,
      hipCircumference: baseline.hipCircumference / baseline.hipCircumference,
      armLength: (baseline.armLength * (measurements.height / baseline.height)) / baseline.armLength,
      wristCircumference: baseline.wristCircumference / baseline.wristCircumference,
      palmLength: baseline.palmLength / baseline.palmLength,
      fingerLength: baseline.fingerLength / baseline.fingerLength,
      legLength: (baseline.legLength * (measurements.height / baseline.height)) / baseline.legLength,
      thighCircumference: baseline.thighCircumference / baseline.thighCircumference,
      ankleCircumference: baseline.ankleCircumference / baseline.ankleCircumference,
      toeLength: baseline.toeLength / baseline.toeLength,
    };
  }
  
  // Detailed mode - use actual measurements
  const detailed = measurements as DetailedMeasurements;
  const baseline_detailed = baselines[detailed.gender];
  
  return {
    height: detailed.height / baseline_detailed.height,
    weight: detailed.weight / baseline_detailed.weight,
    gender: detailed.gender,
    
    // Gender-specific shape factors
    shoulderWidth: baseline_detailed.shoulderWidth,
    hipWidth: baseline_detailed.hipWidth,
    chestDepth: baseline_detailed.chestDepth,
    waistTaper: baseline_detailed.waistTaper,
    
    // Muscle definition factors
    muscleDefinition: baseline_detailed.muscleDefinition,
    bicepSize: baseline_detailed.bicepSize,
    deltoidSize: baseline_detailed.deltoidSize,
    quadricepSize: baseline_detailed.quadricepSize,
    calfSize: baseline_detailed.calfSize,
    gluteSize: baseline_detailed.gluteSize,
    
    headCircumference: (detailed.headCircumference || baseline_detailed.headCircumference) / baseline_detailed.headCircumference,
    neckCircumference: (detailed.neckCircumference || baseline_detailed.neckCircumference) / baseline_detailed.neckCircumference,
    chestCircumference: (detailed.chestCircumference || baseline_detailed.chestCircumference) / baseline_detailed.chestCircumference,
    waistCircumference: (detailed.waistCircumference || baseline_detailed.waistCircumference) / baseline_detailed.waistCircumference,
    hipCircumference: (detailed.hipCircumference || baseline_detailed.hipCircumference) / baseline_detailed.hipCircumference,
    armLength: (detailed.armLength || baseline_detailed.armLength) / baseline_detailed.armLength,
    wristCircumference: (detailed.wristCircumference || baseline_detailed.wristCircumference) / baseline_detailed.wristCircumference,
    palmLength: (detailed.palmLength || baseline_detailed.palmLength) / baseline_detailed.palmLength,
    fingerLength: (detailed.middleFingerLength || baseline_detailed.fingerLength) / baseline_detailed.fingerLength,
    legLength: (detailed.legLength || baseline_detailed.legLength) / baseline_detailed.legLength,
    thighCircumference: (detailed.thighCircumference || baseline_detailed.thighCircumference) / baseline_detailed.thighCircumference,
    ankleCircumference: (detailed.ankleCircumference || baseline_detailed.ankleCircumference) / baseline_detailed.ankleCircumference,
    toeLength: (detailed.toeLength || baseline_detailed.toeLength) / baseline_detailed.toeLength,
  };
}

// Define vertices for anatomically enhanced connected humanoid mesh
function getConnectedHumanVertices(): Float32Array {
  // Enhanced mesh with realistic body mass and muscle definition
  const vertices = [
    // HEAD (0-15) - connected to neck
    0, 1.65, 0,      // 0: top of head
    -0.1, 1.55, 0.1, // 1: front-left
    0.1, 1.55, 0.1,  // 2: front-right
    -0.1, 1.45, 0.12, // 3: mid-left
    0.1, 1.45, 0.12,  // 4: mid-right
    -0.08, 1.35, 0.08, // 5: lower-left
    0.08, 1.35, 0.08,  // 6: lower-right
    0, 1.25, 0.05,     // 7: chin
    
    -0.1, 1.55, -0.1,  // 8: back-left-top
    0.1, 1.55, -0.1,   // 9: back-right-top
    -0.1, 1.45, -0.12, // 10: back-left-mid
    0.1, 1.45, -0.12,  // 11: back-right-mid
    -0.08, 1.35, -0.08, // 12: back-left-low
    0.08, 1.35, -0.08,  // 13: back-right-low
    0, 1.25, -0.05,     // 14: back neck connection
    0, 1.55, 0,         // 15: head center
    
    // NECK (16-23) - enhanced with visible volume
    -0.08, 1.22, 0.04,  // 16: neck front-left top
    0.08, 1.22, 0.04,   // 17: neck front-right top
    -0.08, 1.22, -0.04, // 18: neck back-left top
    0.08, 1.22, -0.04,  // 19: neck back-right top
    -0.09, 1.15, 0.05,  // 20: neck front-left mid
    0.09, 1.15, 0.05,   // 21: neck front-right mid
    -0.09, 1.15, -0.05, // 22: neck back-left mid
    0.09, 1.15, -0.05,  // 23: neck back-right mid
    
    // SHOULDERS & UPPER TORSO (24-39) - enhanced deltoid definition
    -0.28, 1.12, 0.08,  // 24: left deltoid front
    0.28, 1.12, 0.08,   // 25: right deltoid front
    -0.28, 1.12, -0.08, // 26: left deltoid back
    0.28, 1.12, -0.08,  // 27: right deltoid back
    -0.25, 1.08, 0.02,  // 28: left deltoid inner
    0.25, 1.08, 0.02,   // 29: right deltoid inner
    -0.25, 1.08, -0.02, // 30: left deltoid inner back
    0.25, 1.08, -0.02,  // 31: right deltoid inner back
    
    // CHEST (32-47) - enhanced with pectoral definition
    -0.18, 1.0, 0.14,   // 32: left upper chest
    0.18, 1.0, 0.14,    // 33: right upper chest
    -0.16, 0.95, 0.16,  // 34: left pectoral peak
    0.16, 0.95, 0.16,   // 35: right pectoral peak
    -0.14, 0.88, 0.15,  // 36: left lower pectoral
    0.14, 0.88, 0.15,   // 37: right lower pectoral
    0, 0.92, 0.12,      // 38: center chest
    0, 0.85, 0.13,      // 39: lower center chest
    
    // BACK UPPER (40-47)
    -0.18, 1.0, -0.1,   // 40: left upper back
    0.18, 1.0, -0.1,    // 41: right upper back
    -0.16, 0.95, -0.12, // 42: left mid back
    0.16, 0.95, -0.12,  // 43: right mid back
    -0.14, 0.88, -0.11, // 44: left lower back
    0.14, 0.88, -0.11,  // 45: right lower back
    0, 0.92, -0.08,     // 46: center back upper
    0, 0.85, -0.09,     // 47: center back mid
    
    // WAIST (48-55) - narrower for definition
    -0.12, 0.78, 0.12,  // 48: left waist front
    0.12, 0.78, 0.12,   // 49: right waist front
    -0.12, 0.78, -0.08, // 50: left waist back
    0.12, 0.78, -0.08,  // 51: right waist back
    -0.1, 0.7, 0.11,    // 52: left lower waist
    0.1, 0.7, 0.11,     // 53: right lower waist
    -0.1, 0.7, -0.07,   // 54: left lower waist back
    0.1, 0.7, -0.07,    // 55: right lower waist back
    
    // HIPS & GLUTES (56-71) - enhanced with rounded volume
    -0.15, 0.62, 0.12,  // 56: left hip front
    0.15, 0.62, 0.12,   // 57: right hip front
    -0.15, 0.62, -0.08, // 58: left hip back
    0.15, 0.62, -0.08,  // 59: right hip back
    -0.17, 0.55, 0.11,  // 60: left glute side
    0.17, 0.55, 0.11,   // 61: right glute side
    -0.16, 0.55, -0.12, // 62: left glute back
    0.16, 0.55, -0.12,  // 63: right glute back
    -0.14, 0.48, 0.09,  // 64: left lower hip
    0.14, 0.48, 0.09,   // 65: right lower hip
    -0.14, 0.48, -0.1,  // 66: left lower hip back
    0.14, 0.48, -0.1,   // 67: right lower hip back
    0, 0.55, 0.08,      // 68: center hip front
    0, 0.55, -0.1,      // 69: center glute
    -0.12, 0.4, 0.07,   // 70: left pelvis
    0.12, 0.4, 0.07,    // 71: right pelvis
    
    // LEFT ARM (72-87) - enhanced with cylindrical volume and muscle definition
    -0.32, 1.05, 0,     // 72: left shoulder joint
    -0.35, 0.95, 0.04,  // 73: left deltoid-bicep junction front
    -0.35, 0.95, -0.04, // 74: left deltoid-bicep junction back
    -0.38, 0.85, 0.05,  // 75: left bicep peak front
    -0.38, 0.85, -0.05, // 76: left tricep peak back
    -0.4, 0.75, 0.04,   // 77: left mid bicep
    -0.4, 0.75, -0.04,  // 78: left mid tricep
    -0.42, 0.65, 0.03,  // 79: left elbow front
    -0.42, 0.65, -0.03, // 80: left elbow back
    -0.44, 0.55, 0.025, // 81: left forearm upper
    -0.44, 0.55, -0.025, // 82: left forearm upper back
    -0.45, 0.4, 0.02,   // 83: left forearm mid
    -0.45, 0.4, -0.02,  // 84: left forearm mid back
    -0.46, 0.25, 0.015, // 85: left wrist
    -0.48, 0.2, 0.02,   // 86: left hand
    -0.5, 0.15, 0.01,   // 87: left fingers
    
    // RIGHT ARM (88-103) - mirror of left with muscle definition
    0.32, 1.05, 0,      // 88: right shoulder joint
    0.35, 0.95, 0.04,   // 89: right deltoid-bicep junction front
    0.35, 0.95, -0.04,  // 90: right deltoid-bicep junction back
    0.38, 0.85, 0.05,   // 91: right bicep peak front
    0.38, 0.85, -0.05,  // 92: right tricep peak back
    0.4, 0.75, 0.04,    // 93: right mid bicep
    0.4, 0.75, -0.04,   // 94: right mid tricep
    0.42, 0.65, 0.03,   // 95: right elbow front
    0.42, 0.65, -0.03,  // 96: right elbow back
    0.44, 0.55, 0.025,  // 97: right forearm upper
    0.44, 0.55, -0.025, // 98: right forearm upper back
    0.45, 0.4, 0.02,    // 99: right forearm mid
    0.45, 0.4, -0.02,   // 100: right forearm mid back
    0.46, 0.25, 0.015,  // 101: right wrist
    0.48, 0.2, 0.02,    // 102: right hand
    0.5, 0.15, 0.01,    // 103: right fingers
    
    // LEFT LEG (104-119) - enhanced with thigh and calf definition
    -0.1, 0.35, 0.04,   // 104: left hip-thigh junction
    -0.12, 0.25, 0.08,  // 105: left thigh front upper
    -0.12, 0.25, -0.06, // 106: left thigh back upper
    -0.14, 0.1, 0.09,   // 107: left quadricep peak
    -0.14, 0.1, -0.07,  // 108: left hamstring peak
    -0.13, -0.05, 0.07, // 109: left thigh lower front
    -0.13, -0.05, -0.06, // 110: left thigh lower back
    -0.11, -0.2, 0.05,  // 111: left knee front
    -0.11, -0.2, -0.05, // 112: left knee back
    -0.09, -0.35, 0.04, // 113: left shin upper
    -0.09, -0.35, -0.06, // 114: left calf upper
    -0.08, -0.5, 0.03,  // 115: left shin mid
    -0.08, -0.5, -0.05, // 116: left calf peak
    -0.07, -0.65, 0.02, // 117: left ankle front
    -0.07, -0.65, -0.03, // 118: left ankle back
    -0.07, -0.72, 0.08, // 119: left foot
    
    // RIGHT LEG (120-135) - mirror with muscle definition
    0.1, 0.35, 0.04,    // 120: right hip-thigh junction
    0.12, 0.25, 0.08,   // 121: right thigh front upper
    0.12, 0.25, -0.06,  // 122: right thigh back upper
    0.14, 0.1, 0.09,    // 123: right quadricep peak
    0.14, 0.1, -0.07,   // 124: right hamstring peak
    0.13, -0.05, 0.07,  // 125: right thigh lower front
    0.13, -0.05, -0.06, // 126: right thigh lower back
    0.11, -0.2, 0.05,   // 127: right knee front
    0.11, -0.2, -0.05,  // 128: right knee back
    0.09, -0.35, 0.04,  // 129: right shin upper
    0.09, -0.35, -0.06, // 130: right calf upper
    0.08, -0.5, 0.03,   // 131: right shin mid
    0.08, -0.5, -0.05,  // 132: right calf peak
    0.07, -0.65, 0.02,  // 133: right ankle front
    0.07, -0.65, -0.03, // 134: right ankle back
    0.07, -0.72, 0.08,  // 135: right foot
  ];
  
  return new Float32Array(vertices);
}

// Define faces for enhanced anatomical mesh with proper connectivity
function getConnectedHumanFaces(): Uint32Array {
  return new Uint32Array([
    // HEAD - connected topology (0-15)
    0, 1, 3,  1, 3, 5,  3, 5, 7,  1, 2, 4,  2, 4, 6,  4, 6, 7,
    5, 6, 7,  // front face
    0, 9, 8,  8, 10, 12, 9, 11, 13, 10, 11, 14, 12, 13, 14, // back face
    1, 8, 10, 1, 10, 3,  2, 4, 11, 2, 11, 9, // sides
    5, 12, 14, 5, 14, 7,  6, 7, 14, 6, 14, 13,
    0, 15, 8, 0, 8, 1,  0, 2, 9, 0, 9, 15,
    
    // HEAD to NECK connection (enhanced volume)
    7, 16, 17, 7, 17, 6,  14, 18, 19, 14, 19, 13,
    16, 17, 21, 16, 21, 20, 17, 19, 23, 17, 23, 21,
    18, 20, 22, 18, 22, 19, 20, 21, 23, 20, 23, 22,
    
    // NECK to SHOULDERS connection (enhanced deltoids)
    20, 24, 28, 20, 28, 21, 21, 28, 29, 21, 29, 25,
    22, 26, 30, 22, 30, 23, 23, 30, 31, 23, 31, 27,
    
    // DELTOIDS (24-31) - shoulder muscle definition
    24, 25, 29, 24, 29, 28, 26, 30, 31, 26, 31, 27,
    24, 26, 30, 24, 30, 28, 25, 29, 31, 25, 31, 27,
    28, 29, 72, 29, 31, 88, // connect to arm joints
    
    // CHEST & PECTORALS (32-47) - enhanced chest definition
    32, 33, 35, 32, 35, 34, 34, 35, 37, 34, 37, 36,
    32, 34, 38, 34, 36, 39, 36, 37, 39, 37, 39, 38,
    40, 41, 43, 40, 43, 42, 42, 43, 45, 42, 45, 44,
    40, 42, 46, 42, 44, 47, 44, 45, 47, 45, 47, 46,
    // Connect chest to back
    32, 40, 46, 32, 46, 38, 33, 41, 47, 33, 47, 39,
    
    // WAIST (48-55) - narrower definition
    48, 49, 53, 48, 53, 52, 50, 54, 55, 50, 55, 51,
    48, 50, 54, 48, 54, 52, 49, 53, 55, 49, 55, 51,
    
    // HIPS & GLUTES (56-71) - enhanced volume
    56, 57, 61, 56, 61, 60, 58, 62, 63, 58, 63, 59,
    60, 61, 65, 60, 65, 64, 62, 66, 67, 62, 67, 63,
    64, 65, 71, 64, 71, 70, 66, 69, 67, // glute definition
    // Connect hips to legs
    64, 70, 104, 65, 71, 120, // hip-thigh junctions
    
    // LEFT ARM (72-87) - enhanced with muscle definition
    72, 73, 75, 73, 75, 77, 75, 77, 79, 77, 79, 81,
    81, 83, 85, 85, 86, 87, // arm chain front
    72, 74, 76, 74, 76, 78, 76, 78, 80, 78, 80, 82,
    82, 84, 85, // arm chain back
    // Muscle definition (bicep/tricep)
    73, 74, 76, 73, 76, 75, 75, 76, 78, 75, 78, 77,
    
    // RIGHT ARM (88-103) - mirror with muscle definition
    88, 89, 91, 89, 91, 93, 91, 93, 95, 93, 95, 97,
    97, 99, 101, 101, 102, 103, // arm chain front
    88, 90, 92, 90, 92, 94, 92, 94, 96, 94, 96, 98,
    98, 100, 101, // arm chain back
    // Muscle definition
    89, 90, 92, 89, 92, 91, 91, 92, 94, 91, 94, 93,
    
    // LEFT LEG (104-119) - enhanced with thigh/calf definition
    104, 105, 107, 105, 107, 109, 107, 109, 111, 109, 111, 113,
    113, 115, 117, 117, 119, 119, // leg front chain
    104, 106, 108, 106, 108, 110, 108, 110, 112, 110, 112, 114,
    114, 116, 118, // leg back chain
    // Muscle definition (quadricep/hamstring)
    105, 106, 108, 105, 108, 107, 107, 108, 110, 107, 110, 109,
    // Calf definition
    113, 114, 116, 113, 116, 115, 115, 116, 118, 115, 118, 117,
    
    // RIGHT LEG (120-135) - mirror with muscle definition
    120, 121, 123, 121, 123, 125, 123, 125, 127, 125, 127, 129,
    129, 131, 133, 133, 135, 135, // leg front chain
    120, 122, 124, 122, 124, 126, 124, 126, 128, 126, 128, 130,
    130, 132, 134, // leg back chain
    // Muscle definition
    121, 122, 124, 121, 124, 123, 123, 124, 126, 123, 126, 125,
    // Calf definition
    129, 130, 132, 129, 132, 131, 131, 132, 134, 131, 134, 133,
  ]);
}

// Define vertex regions for the enhanced anatomical mesh
function getConnectedVertexRegions(): string[] {
  return [
    // HEAD (0-15)
    'head', 'head', 'head', 'head', 'head', 'head', 'head', 'head',
    'head', 'head', 'head', 'head', 'head', 'head', 'head', 'head',
    
    // NECK (16-23) - enhanced volume
    'neck', 'neck', 'neck', 'neck', 'neck', 'neck', 'neck', 'neck',
    
    // DELTOIDS/SHOULDERS (24-31)
    'deltoids', 'deltoids', 'deltoids', 'deltoids', 'deltoids', 'deltoids', 'deltoids', 'deltoids',
    
    // CHEST & PECTORALS (32-39)
    'chest', 'chest', 'chest', 'chest', 'chest', 'chest', 'chest', 'chest',
    
    // BACK UPPER (40-47)
    'back', 'back', 'back', 'back', 'back', 'back', 'back', 'back',
    
    // WAIST (48-55)
    'waist', 'waist', 'waist', 'waist', 'waist', 'waist', 'waist', 'waist',
    
    // HIPS & GLUTES (56-71)
    'hips', 'hips', 'hips', 'hips', 'glutes', 'glutes', 'glutes', 'glutes',
    'hips', 'hips', 'hips', 'hips', 'hips', 'glutes', 'hips', 'hips',
    
    // LEFT ARM (72-87) - enhanced with muscle regions
    'deltoids', 'biceps', 'triceps', 'biceps', 'triceps', 'biceps', 'triceps',
    'arms', 'arms', 'forearms', 'forearms', 'forearms', 'forearms',
    'hands', 'hands', 'hands',
    
    // RIGHT ARM (88-103) - enhanced with muscle regions
    'deltoids', 'biceps', 'triceps', 'biceps', 'triceps', 'biceps', 'triceps',
    'arms', 'arms', 'forearms', 'forearms', 'forearms', 'forearms',
    'hands', 'hands', 'hands',
    
    // LEFT LEG (104-119) - enhanced with muscle regions
    'thighs', 'quadriceps', 'hamstrings', 'quadriceps', 'hamstrings',
    'thighs', 'thighs', 'knees', 'knees', 'shins', 'calves',
    'shins', 'calves', 'ankles', 'ankles', 'feet',
    
    // RIGHT LEG (120-135) - enhanced with muscle regions
    'thighs', 'quadriceps', 'hamstrings', 'quadriceps', 'hamstrings',
    'thighs', 'thighs', 'knees', 'knees', 'shins', 'calves',
    'shins', 'calves', 'ankles', 'ankles', 'feet',
  ];
}

// Apply parameter-based morphing with enhanced anatomical and gender-specific shaping
function morphConnectedVertices(
  baseVertices: Float32Array, 
  vertexRegions: string[], 
  params: MeshParameters
): Float32Array {
  const vertices = new Float32Array(baseVertices);
  
  // Overall scaling factors
  const heightScale = params.height;
  const volumeScale = Math.pow(params.weight, 0.33); // Cubic root for volume
  
  for (let i = 0; i < vertices.length; i += 3) {
    const vertexIndex = i / 3;
    const region = vertexRegions[vertexIndex];
    
    let x = vertices[i];
    let y = vertices[i + 1];
    let z = vertices[i + 2];
    
    // Apply height scaling to Y coordinates
    y *= heightScale;
    
    // Apply regional morphing based on measurements, gender, and muscle definition
    switch (region) {
      case 'head':
        const headScale = params.headCircumference * volumeScale;
        x *= headScale;
        z *= headScale;
        break;
        
      case 'neck':
        const neckScale = params.neckCircumference * volumeScale;
        // Enhanced cylindrical neck volume with gender-specific thickness
        const neckThickness = params.gender === 'male' ? 1.2 : 
                             params.gender === 'female' ? 0.9 : 1.0;
        // Better neck-to-shoulder transition
        const neckCylindricalScale = neckScale * neckThickness;
        x *= neckCylindricalScale;
        z *= neckCylindricalScale;
        break;
        
      case 'deltoids':
        // Enhanced deltoid definition with gender and muscle factors
        const deltoidScale = params.chestCircumference * volumeScale;
        const deltoidMuscle = params.deltoidSize * params.muscleDefinition;
        // Gender-specific deltoid bulk (males more angular, females softer)
        const deltoidBulk = params.gender === 'male' ? 1.15 : 
                           params.gender === 'female' ? 0.9 : 1.0;
        x *= deltoidScale * params.shoulderWidth * deltoidMuscle * deltoidBulk;
        z *= deltoidScale * deltoidMuscle * deltoidBulk;
        break;
        
      case 'chest':
        // Gender-specific chest/breast morphing with pectoral definition
        const chestScale = params.chestCircumference * volumeScale;
        // Enhanced sexual dimorphism
        const chestProjection = params.gender === 'female' ? 
          params.chestDepth * 1.4 : // More prominent breasts
          params.chestDepth * 0.9;  // Flatter male chest
        const chestWidth = params.gender === 'male' ? 
          params.shoulderWidth * 1.1 : // Broader male chest
          params.shoulderWidth * 0.95;  // Narrower female chest
        x *= chestScale * chestWidth;
        z *= chestScale * chestProjection;
        break;
        
      case 'back':
        // Back definition complements chest
        const backScale = params.chestCircumference * volumeScale * 0.8;
        x *= backScale * params.shoulderWidth;
        z *= backScale;
        break;
        
      case 'waist':
        // Enhanced gender-specific waist definition for hourglass/athletic shape
        const waistScale = params.waistCircumference * volumeScale;
        // More pronounced waist taper for females
        const waistTaper = params.gender === 'female' ? params.waistTaper * 1.2 : 
                          params.gender === 'male' ? params.waistTaper * 0.9 : params.waistTaper;
        x *= waistScale * waistTaper;
        z *= waistScale * 0.9; // Slightly less depth than chest
        break;
        
      case 'hips':
        // Gender-specific hip morphing
        const hipScale = params.hipCircumference * volumeScale;
        x *= hipScale * params.hipWidth; // Wider for females
        z *= hipScale;
        break;
        
      case 'glutes':
        // Enhanced glute definition with gender-specific roundness and projection
        const gluteScale = params.hipCircumference * volumeScale;
        const gluteRoundness = params.gluteSize;
        // Enhanced female glute prominence and roundness
        const gluteProjection = params.gender === 'female' ? 1.3 : 
                               params.gender === 'male' ? 0.8 : 1.0;
        const gluteWidth = params.gender === 'female' ? params.hipWidth * 1.1 : 
                          params.gender === 'male' ? params.hipWidth * 0.9 : params.hipWidth;
        x *= gluteScale * gluteWidth;
        z *= gluteScale * gluteRoundness * gluteProjection;
        break;
        
      case 'biceps':
        // Enhanced bicep definition with gender-specific muscle bulk
        const bicepScale = Math.sqrt(params.wristCircumference) * volumeScale;
        const bicepMuscle = params.bicepSize * params.muscleDefinition;
        // Gender-specific muscle definition (males more pronounced)
        const bicepBulk = params.gender === 'male' ? 1.2 : 
                         params.gender === 'female' ? 0.8 : 1.0;
        x *= params.armLength * bicepMuscle * bicepBulk;
        z *= bicepScale * bicepMuscle * bicepBulk;
        break;
        
      case 'triceps':
        // Enhanced tricep definition (back of arm) with gender-specific bulk
        const tricepScale = Math.sqrt(params.wristCircumference) * volumeScale;
        const tricepMuscle = params.bicepSize * params.muscleDefinition * 0.9;
        // Gender-specific tricep prominence
        const tricepBulk = params.gender === 'male' ? 1.15 : 
                          params.gender === 'female' ? 0.75 : 0.95;
        x *= params.armLength * tricepMuscle * tricepBulk;
        z *= tricepScale * tricepMuscle * tricepBulk;
        break;
        
      case 'arms':
      case 'forearms':
        const armLengthScale = params.armLength;
        const armVolumeScale = Math.sqrt(params.wristCircumference) * volumeScale;
        // Enhanced cylindrical arm volume
        const armCylindricalScale = params.gender === 'male' ? 1.1 : 
                                   params.gender === 'female' ? 0.9 : 1.0;
        x *= armLengthScale * armCylindricalScale;
        z *= armVolumeScale * armCylindricalScale;
        break;
        
      case 'hands':
        const handScale = (params.palmLength + params.fingerLength) / 2;
        const wristScale = params.wristCircumference * volumeScale;
        x *= handScale;
        z *= wristScale;
        break;
        
      case 'thighs':
        // Enhanced cylindrical thigh volume
        const thighLengthScale = params.legLength;
        const thighScale = params.thighCircumference * volumeScale;
        // Gender-specific thigh volume (females wider hips, males more muscular)
        const thighCylindricalScale = params.gender === 'female' ? 1.05 : 
                                     params.gender === 'male' ? 1.1 : 1.0;
        if (y < 0.6) y *= thighLengthScale;
        x *= thighScale * thighCylindricalScale;
        z *= thighScale * thighCylindricalScale;
        break;
        
      case 'quadriceps':
        // Enhanced quadricep definition (front of thigh) with gender-specific muscle mass
        const quadLengthScale = params.legLength;
        const quadScale = params.thighCircumference * volumeScale;
        const quadMuscle = params.quadricepSize * params.muscleDefinition;
        // Gender-specific quad prominence
        const quadBulk = params.gender === 'male' ? 1.1 : 
                        params.gender === 'female' ? 0.9 : 1.0;
        if (y < 0.6) y *= quadLengthScale;
        x *= quadScale * quadMuscle * quadBulk;
        z *= quadScale * quadMuscle * quadBulk;
        break;
        
      case 'hamstrings':
        // Enhanced hamstring definition (back of thigh)
        const hamLengthScale = params.legLength;
        const hamScale = params.thighCircumference * volumeScale;
        const hamMuscle = params.quadricepSize * params.muscleDefinition * 0.9;
        if (y < 0.6) y *= hamLengthScale;
        x *= hamScale * hamMuscle;
        z *= hamScale * hamMuscle;
        break;
        
      case 'knees':
        // Knee area scaling
        const kneeLengthScale = params.legLength;
        const kneeScale = params.ankleCircumference * volumeScale * 1.2;
        if (y < 0.6) y *= kneeLengthScale;
        x *= kneeScale;
        z *= kneeScale;
        break;
        
      case 'shins':
        // Enhanced cylindrical shin volume
        const shinLengthScale = params.legLength;
        const shinScale = params.ankleCircumference * volumeScale;
        // Better cylindrical shin definition
        const shinCylindricalScale = params.gender === 'male' ? 1.05 : 
                                    params.gender === 'female' ? 0.95 : 1.0;
        if (y < 0.6) y *= shinLengthScale;
        x *= shinScale * shinCylindricalScale;
        z *= shinScale * shinCylindricalScale;
        break;
        
      case 'calves':
        // Enhanced calf definition with gender-specific muscle mass
        const calfLengthScale = params.legLength;
        const calfScale = params.ankleCircumference * volumeScale;
        const calfMuscle = params.calfSize * params.muscleDefinition;
        // Gender-specific calf prominence (males more defined)
        const calfBulk = params.gender === 'male' ? 1.15 : 
                        params.gender === 'female' ? 0.85 : 1.0;
        if (y < 0.6) y *= calfLengthScale;
        x *= calfScale * calfMuscle * calfBulk;
        z *= calfScale * calfMuscle * calfBulk;
        break;
        
      case 'ankles':
        // Ankle scaling
        const ankleLengthScale = params.legLength;
        const ankleScale = params.ankleCircumference * volumeScale;
        if (y < 0.6) y *= ankleLengthScale;
        x *= ankleScale;
        z *= ankleScale;
        break;
        
      case 'feet':
        const footScale = params.toeLength;
        const footVolumeScale = params.ankleCircumference * volumeScale;
        x *= footVolumeScale;
        z *= footScale;
        break;
    }
    
    // Apply global volume scaling
    x *= volumeScale;
    z *= volumeScale;
    
    vertices[i] = x;
    vertices[i + 1] = y;
    vertices[i + 2] = z;
  }
  
  return vertices;
}

