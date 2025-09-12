import React from 'react';

export type View = 'front' | 'side' | 'back';
export type Gender = 'male' | 'female' | 'other';

export type Pose = {
  shoulderAbductionDeg?: number;
  elbowFlexionDeg?: number;
  wristFlexionDeg?: number;
  hipAbductionDeg?: number;
  kneeFlexionDeg?: number;
  ankleDorsiDeg?: number;
};

export type Human2DModelProps = {
  width: number; 
  height: number; 
  view: View;
  gender: Gender;
  measurements: {
    height: number; weight: number;
    headCircumference: number; neckCircumference: number;
    chestCircumference: number; waistCircumference: number; hipCircumference: number;
    armLength: number; wristCircumference: number; palmLength: number; middleFingerLength: number;
    legLength: number; thighCircumference: number; ankleCircumference: number; toeLength: number;
  };
  pose?: Pose;
  showGrid?: boolean; 
  gridStepCm?: number; 
  gridMajorEvery?: number;
  showGuides?: boolean; // show landmarks/labels for debugging
  className?: string;
  zoom?: number; // zoom level (default 1.0)
  pan?: { x: number; y: number }; // pan offset in pixels (default {x:0, y:0})
  onWheel?: (event: React.WheelEvent) => void; // zoom handler
  onMouseDown?: (event: React.MouseEvent) => void; // pan start handler
  onMouseMove?: (event: React.MouseEvent) => void; // pan move handler
  onMouseUp?: () => void; // pan end handler
};

type Measurements = Human2DModelProps['measurements'];
type Landmarks = Record<string, {x: number; y: number}>;

// Constants
const TAU = Math.PI * 2;

// Realistic shape factors for converting circumferences to half-widths
const SHAPE = {
  male: {
    head: { front: 0.78, side: 0.66 },
    neck: { front: 0.90, side: 0.75 },
    chest: { front: 0.96, side: 0.78 },
    waist: { front: 0.86, side: 0.72 },
    hips: { front: 0.95, side: 0.82 },
    thigh: { front: 0.92, side: 0.80 },
    calf: { front: 0.88, side: 0.78 },
    ankle: { front: 0.75, side: 0.68 },
    wrist: { front: 0.65, side: 0.55 },
    shoulderRatio: 1.25,
    bustProj: 0.0,
    buttProj: 0.15,
    bellyProj: 0.08
  },
  female: {
    head: { front: 0.78, side: 0.66 },
    neck: { front: 0.88, side: 0.72 },
    chest: { front: 0.90, side: 0.80 },
    waist: { front: 0.80, side: 0.70 },
    hips: { front: 1.05, side: 0.92 },
    thigh: { front: 1.00, side: 0.85 },
    calf: { front: 0.90, side: 0.80 },
    ankle: { front: 0.72, side: 0.66 },
    wrist: { front: 0.62, side: 0.53 },
    shoulderRatio: 0.95,
    bustProj: 0.18,
    buttProj: 0.20,
    bellyProj: 0.10
  },
  other: {
    head: { front: 0.78, side: 0.66 },
    neck: { front: 0.89, side: 0.735 },
    chest: { front: 0.93, side: 0.79 },
    waist: { front: 0.83, side: 0.71 },
    hips: { front: 1.00, side: 0.87 },
    thigh: { front: 0.96, side: 0.825 },
    calf: { front: 0.89, side: 0.79 },
    ankle: { front: 0.735, side: 0.67 },
    wrist: { front: 0.635, side: 0.54 },
    shoulderRatio: 1.10,
    bustProj: 0.09,
    buttProj: 0.175,
    bellyProj: 0.09
  }
};

// Loomis-like vertical anchors (torso proportions only)
const anchors = (H: number) => ({
  headTop: 0,
  chin: 0.125 * H,
  neckBase: 0.17 * H,
  shoulderY: 0.22 * H,
  chestY: 0.28 * H,
  waistY: 0.35 * H,
  hipY: 0.45 * H,
  crotchY: 0.50 * H,
  toeY: 1.00 * H
});

// Correct half-width formula
const hw = (circCm: number, factor: number): number => (circCm / TAU) * factor;

// Helper: Linear interpolation
const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

// Helper: Convert degrees to radians
const degToRad = (deg: number): number => (deg * Math.PI) / 180;

// Helper: Rotate a point around origin
const rotatePoint = (x: number, y: number, angleDeg: number): {x: number; y: number} => {
  const rad = degToRad(angleDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos
  };
};

// Default pose parameters
const DEFAULT_POSE: Required<Pose> = {
  shoulderAbductionDeg: 45,
  elbowFlexionDeg: 5,
  wristFlexionDeg: 0,
  hipAbductionDeg: 5,
  kneeFlexionDeg: 2,
  ankleDorsiDeg: 0
};

// Generate arm landmarks for specific view and side
function armLandmarks(view: View, side: 'L' | 'R', m: Measurements, g: Gender, angles: Required<Pose>): Landmarks {
  const A = anchors(m.height);
  const F = SHAPE[g];
  const front = view !== 'side';
  
  // Base measurements using correct shape factors
  const chest = hw(m.chestCircumference, front ? F.chest.front : F.chest.side);
  const wrist = hw(m.wristCircumference, front ? F.wrist.front : F.wrist.side);
  
  // Arm segment lengths
  const upperArmLen = m.armLength * 0.47;
  const forearmLen = m.armLength * 0.53;
  
  // Half-widths
  const shoulderHW = chest * F.shoulderRatio;
  const bicepsHW = Math.max(wrist * 1.4, chest * 0.35);  // Reduced from wrist * 2.0
  const elbowHW = lerp(bicepsHW, wrist, 0.65);
  const forearmHW = Math.max(wrist * 1.2, bicepsHW * 0.65);  // Reduced multipliers
  const wristHW = wrist;
  const palmHW = wristHW * 1.15;
  
  // Side multiplier for left/right
  const sideSign = side === 'L' ? -1 : 1;
  
  // Base positions
  const acromionBase = { x: sideSign * shoulderHW, y: A.shoulderY };
  
  // Apply shoulder abduction
  const abductionOffset = rotatePoint(0, upperArmLen, angles.shoulderAbductionDeg * sideSign);
  const elbowBase = {
    x: acromionBase.x + abductionOffset.x,
    y: acromionBase.y + abductionOffset.y
  };
  
  // Apply elbow flexion
  const flexionOffset = rotatePoint(0, forearmLen, angles.elbowFlexionDeg * sideSign);
  const wristBase = {
    x: elbowBase.x + flexionOffset.x,
    y: elbowBase.y + flexionOffset.y
  };
  
  // Intermediate landmarks along arm
  const bicepsMax = {
    x: lerp(acromionBase.x, elbowBase.x, 0.4),
    y: lerp(acromionBase.y, elbowBase.y, 0.4)
  };
  
  const forearmMax = {
    x: lerp(elbowBase.x, wristBase.x, 0.4),
    y: lerp(elbowBase.y, wristBase.y, 0.4)
  };
  
  // Hand landmarks
  const handDirection = { 
    x: wristBase.x - elbowBase.x, 
    y: wristBase.y - elbowBase.y 
  };
  const handLength = Math.sqrt(handDirection.x ** 2 + handDirection.y ** 2);
  const handUnit = { 
    x: handDirection.x / handLength, 
    y: handDirection.y / handLength 
  };
  
  const palmTip = {
    x: wristBase.x + handUnit.x * m.palmLength,
    y: wristBase.y + handUnit.y * m.palmLength
  };
  
  const palm = {
    x: wristBase.x + handUnit.x * (m.palmLength * 0.6),
    y: wristBase.y + handUnit.y * (m.palmLength * 0.6)
  };
  
  const fingerTip = {
    x: palmTip.x + handUnit.x * m.middleFingerLength,
    y: palmTip.y + handUnit.y * m.middleFingerLength
  };
  
  return {
    [`acromion${side}`]: acromionBase,
    [`bicepsMax${side}`]: bicepsMax,
    [`elbow${side}`]: elbowBase,
    [`forearmMax${side}`]: forearmMax,
    [`wrist${side}`]: wristBase,
    [`palmTip${side}`]: palmTip,
    [`palm${side}`]: palm,
    [`fingerTip${side}`]: fingerTip,
    // generic aliases for debug/overlays
    [`biceps${side}`]: bicepsMax,
    [`forearm${side}`]: forearmMax,
    // tolerate legacy typo:
    [`wristle${side}`]: wristBase,
    // Width data for path building
    [`shoulderHW${side}`]: { x: shoulderHW, y: 0 },
    [`bicepsHW${side}`]: { x: bicepsHW, y: 0 },
    [`elbowHW${side}`]: { x: elbowHW, y: 0 },
    [`forearmHW${side}`]: { x: forearmHW, y: 0 },
    [`wristHW${side}`]: { x: wristHW, y: 0 },
    [`palmHW${side}`]: { x: palmHW, y: 0 }
  };
}

// Generate leg landmarks for specific view and side
function legLandmarks(view: View, side: 'L' | 'R', m: Measurements, g: Gender, angles: Required<Pose>): Landmarks {
  const A = anchors(m.height);
  const F = SHAPE[g];
  const front = view !== 'side';
  
  // Base measurements using correct shape factors
  const hips = hw(m.hipCircumference, front ? F.hips.front : F.hips.side);
  const thigh = hw(m.thighCircumference, front ? F.thigh.front : F.thigh.side);
  const ankle = hw(m.ankleCircumference, front ? F.ankle.front : F.ankle.side);
  
  // Leg segment lengths (measurement-driven)
  const kneeY = A.crotchY + m.legLength * 0.50;  // Midpoint of legLength
  const ankleY = A.crotchY + m.legLength;        // End of legLength
  const heelY = ankleY + m.height * 0.04;        // Heel thickness
  const thighLen = kneeY - A.hipY;
  const shankLen = ankleY - kneeY;
  
  // Half-widths
  const hipHW = hips;
  const thighHW = thigh;
  const kneeHW = lerp(thighHW, ankle, 0.7);
  const calfHW = Math.max(thighHW * 0.60, ankle * 1.4);  // Reduced from 0.80 and 1.8
  const ankleHW = ankle;
  
  // Side multiplier for left/right
  const sideSign = side === 'L' ? -1 : 1;
  
  // Base positions
  const hipJointBase = { x: sideSign * hipHW, y: A.hipY };
  
  // Apply hip abduction
  const abductionOffset = rotatePoint(0, thighLen, angles.hipAbductionDeg * sideSign);
  const kneeBase = {
    x: hipJointBase.x + abductionOffset.x,
    y: hipJointBase.y + abductionOffset.y
  };
  
  // Apply knee flexion
  const flexionOffset = rotatePoint(0, shankLen, angles.kneeFlexionDeg * sideSign);
  const ankleBase = {
    x: kneeBase.x + flexionOffset.x,
    y: kneeBase.y + flexionOffset.y
  };
  
  // Intermediate landmarks along leg
  const thighMax = {
    x: lerp(hipJointBase.x, kneeBase.x, 0.4),
    y: lerp(hipJointBase.y, kneeBase.y, 0.4)
  };
  
  const calfMax = {
    x: lerp(kneeBase.x, ankleBase.x, 0.35),
    y: lerp(kneeBase.y, ankleBase.y, 0.35)
  };
  
  // Foot landmarks
  const heel = { x: ankleBase.x, y: heelY };
  const toeTip = { x: ankleBase.x + sideSign * m.toeLength * 0.3, y: A.toeY };
  
  return {
    [`hipJoint${side}`]: hipJointBase,
    [`thighMax${side}`]: thighMax,
    [`knee${side}`]: kneeBase,
    [`calfMax${side}`]: calfMax,
    [`ankle${side}`]: ankleBase,
    [`heel${side}`]: heel,
    [`toeTip${side}`]: toeTip,
    // generic aliases
    [`hip${side}`]: hipJointBase,
    [`thigh${side}`]: thighMax,
    [`calf${side}`]: calfMax,
    // Width data for path building
    [`hipHW${side}`]: { x: hipHW, y: 0 },
    [`thighHW${side}`]: { x: thighHW, y: 0 },
    [`kneeHW${side}`]: { x: kneeHW, y: 0 },
    [`calfHW${side}`]: { x: calfHW, y: 0 },
    [`ankleHW${side}`]: { x: ankleHW, y: 0 }
  };
}
function landmarksFront(m: Measurements, g: Gender): Landmarks {
  const A = anchors(m.height);
  const F = SHAPE[g];
  
  // Core half-widths from circumferences
  const head = hw(m.headCircumference, F.head.front);
  const neck = hw(m.neckCircumference, F.neck.front);
  const chest = hw(m.chestCircumference, F.chest.front);
  const waist = hw(m.waistCircumference, F.waist.front);
  const hips = hw(m.hipCircumference, F.hips.front);
  const thigh = hw(m.thighCircumference, F.thigh.front);
  const ankle = hw(m.ankleCircumference, F.ankle.front);
  const wrist = hw(m.wristCircumference, F.wrist.front);
  
  // Leg segment lengths (measurement-driven)
  const kneeY = A.crotchY + m.legLength * 0.50;  // Midpoint of legLength
  const ankleY = A.crotchY + m.legLength;        // End of legLength
  const heelY = ankleY + m.height * 0.04;        // Heel thickness
  const lowerLeg = ankleY - kneeY;
  
  // Derived widths
  const shoulder = chest * F.shoulderRatio;
  const biceps = wrist * 1.4;  // Reduced from 2.0 to match arm reduction
  const forearm = wrist * 1.2;  // Reduced from 1.6 to match arm reduction
  const elbow = (biceps + wrist) * 0.6;
  const knee = (thigh + ankle) * 0.7;
  const calf = ankle * 1.4;  // Reduced from 1.8 to match leg reduction
  
  // Arm/leg segment lengths
  const upperArm = m.armLength * 0.55; // shoulder to elbow
  const lowerArm = m.armLength * 0.45; // elbow to wrist
  const upperLeg = m.legLength * 0.55; // hip to knee  
  // lowerLeg already calculated above as ankleY - kneeY
  
  return {
    // Head & Neck
    headTop: { x: 0, y: A.headTop },
    headL: { x: -head, y: A.chin * 0.6 },
    headR: { x: head, y: A.chin * 0.6 },
    chin: { x: 0, y: A.chin },
    neckL: { x: -neck, y: A.neckBase },
    neckR: { x: neck, y: A.neckBase },
    
    // Torso landmarks
    acromionL: { x: -shoulder, y: A.shoulderY },
    acromionR: { x: shoulder, y: A.shoulderY },
    chestL: { x: -chest, y: A.chestY },
    chestR: { x: chest, y: A.chestY },
    waistL: { x: -waist, y: A.waistY },
    waistR: { x: waist, y: A.waistY },
    hipL: { x: -hips, y: A.hipY },
    hipR: { x: hips, y: A.hipY },
    crotch: { x: 0, y: A.crotchY },
    
    // Left arm landmarks
    bicepsL: { x: -shoulder - biceps * 0.3, y: A.shoulderY + upperArm * 0.3 },
    elbowL: { x: -shoulder - elbow * 0.5, y: A.shoulderY + upperArm },
    forearmL: { x: -shoulder - forearm * 0.4, y: A.shoulderY + upperArm + lowerArm * 0.4 },
    wristL: { x: -shoulder - wrist, y: A.shoulderY + m.armLength },
    palmTipL: { x: -shoulder - wrist * 1.2, y: A.shoulderY + m.armLength + m.palmLength },
    fingerTipL: { x: -shoulder - wrist * 1.1, y: A.shoulderY + m.armLength + m.palmLength + m.middleFingerLength },
    
    // Right arm landmarks (mirrored)
    bicepsR: { x: shoulder + biceps * 0.3, y: A.shoulderY + upperArm * 0.3 },
    elbowR: { x: shoulder + elbow * 0.5, y: A.shoulderY + upperArm },
    forearmR: { x: shoulder + forearm * 0.4, y: A.shoulderY + upperArm + lowerArm * 0.4 },
    wristR: { x: shoulder + wrist, y: A.shoulderY + m.armLength },
    palmTipR: { x: shoulder + wrist * 1.2, y: A.shoulderY + m.armLength + m.palmLength },
    fingerTipR: { x: shoulder + wrist * 1.1, y: A.shoulderY + m.armLength + m.palmLength + m.middleFingerLength },
    
    // Left leg landmarks
    thighL: { x: -thigh, y: A.hipY + upperLeg * 0.3 },
    kneeL: { x: -knee, y: kneeY },
    calfL: { x: -calf, y: kneeY + lowerLeg * 0.4 },
    ankleL: { x: -ankle, y: ankleY },
    heelL: { x: -ankle, y: heelY },
    toeTipL: { x: -m.toeLength * 0.3, y: A.toeY },
    
    // Right leg landmarks (mirrored)
    thighR: { x: thigh, y: A.hipY + upperLeg * 0.3 },
    kneeR: { x: knee, y: kneeY },
    calfR: { x: calf, y: kneeY + lowerLeg * 0.4 },
    ankleR: { x: ankle, y: ankleY },
    heelR: { x: ankle, y: heelY },
    toeTipR: { x: m.toeLength * 0.3, y: A.toeY },
    
    // Gender-specific landmarks
    bustApexL: g === 'female' ? { x: -chest * 0.7, y: A.chestY - chest * 0.1 } : { x: -chest, y: A.chestY },
    bustApexR: g === 'female' ? { x: chest * 0.7, y: A.chestY - chest * 0.1 } : { x: chest, y: A.chestY },
  };
}

// Generate landmarks for side view
function landmarksSide(m: Measurements, g: Gender): Landmarks {
  const A = anchors(m.height);
  const F = SHAPE[g];
  
  // Core half-depths from circumferences
  const head = hw(m.headCircumference, F.head.side);
  const neck = hw(m.neckCircumference, F.neck.side);
  const chest = hw(m.chestCircumference, F.chest.side);
  const waist = hw(m.waistCircumference, F.waist.side);
  const hips = hw(m.hipCircumference, F.hips.side);
  const thigh = hw(m.thighCircumference, F.thigh.side);
  const ankle = hw(m.ankleCircumference, F.ankle.side);
  const wrist = hw(m.wristCircumference, F.wrist.side);
  
  // Derived widths/depths
  const shoulder = chest * F.shoulderRatio;
  const biceps = wrist * 1.8;
  const forearm = wrist * 1.4;
  const elbow = (biceps + wrist) * 0.6;
  const knee = (thigh + ankle) * 0.7;
  const calf = ankle * 1.6;
  
  // Projections for side view
  const bustProj = chest * F.bustProj;
  const buttockProj = hips * F.buttProj;
  const bellyProj = waist * F.bellyProj;
  
  // Leg segment lengths (measurement-driven)
  const kneeY = A.crotchY + m.legLength * 0.50;  // Midpoint of legLength
  const ankleY = A.crotchY + m.legLength;        // End of legLength
  const heelY = ankleY + m.height * 0.04;        // Heel thickness
  
  // Arm/leg segment lengths
  const upperArm = m.armLength * 0.55;
  const lowerArm = m.armLength * 0.45;
  const upperLeg = m.legLength * 0.55;
  const lowerLeg = m.legLength * 0.45;
  
  return {
    // Head & Neck profile
    headTop: { x: 0, y: A.headTop },
    headFront: { x: head * 0.8, y: A.chin * 0.7 },
    headBack: { x: -head * 0.6, y: A.chin * 0.8 },
    chin: { x: head * 0.6, y: A.chin },
    neckFront: { x: neck, y: A.neckBase },
    neckBack: { x: -neck * 0.5, y: A.neckBase },
    
    // Torso profile
    shoulderFront: { x: shoulder, y: A.shoulderY },
    shoulderBack: { x: -shoulder * 0.3, y: A.shoulderY },
    chestFront: { x: chest + bustProj, y: A.chestY },
    chestBack: { x: -chest * 0.3, y: A.chestY },
    waistFront: { x: waist + bellyProj, y: A.waistY },
    waistBack: { x: -waist * 0.2, y: A.waistY },
    hipFront: { x: hips, y: A.hipY },
    hipBack: { x: -hips, y: A.hipY },
    buttockMax: { x: -hips - buttockProj, y: A.hipY + upperLeg * 0.1 },
    crotch: { x: 0, y: A.crotchY },
    
    // Arm profile (right side)
    bicepsR: { x: shoulder + biceps * 0.4, y: A.shoulderY + upperArm * 0.3 },
    elbowR: { x: shoulder + elbow * 0.3, y: A.shoulderY + upperArm },
    forearmR: { x: shoulder + forearm * 0.3, y: A.shoulderY + upperArm + lowerArm * 0.4 },
    wristR: { x: shoulder + wrist * 0.5, y: A.shoulderY + m.armLength },
    palmTipR: { x: shoulder + wrist * 0.7, y: A.shoulderY + m.armLength + m.palmLength },
    fingerTipR: { x: shoulder + wrist * 0.6, y: A.shoulderY + m.armLength + m.palmLength + m.middleFingerLength },
    
    // Leg profile (right side)  
    thighR: { x: thigh * 0.5, y: A.hipY + upperLeg * 0.3 },
    kneeR: { x: knee * 0.3, y: kneeY },
    calfR: { x: calf * 0.4, y: kneeY + lowerLeg * 0.4 },
    ankleR: { x: ankle * 0.3, y: ankleY },
    heelR: { x: -ankle * 0.5, y: heelY },
    toeTipR: { x: m.toeLength * 0.8, y: A.toeY },
    
    // Female-specific bust apex in profile
    bustApex: g === 'female' ? { x: chest + bustProj * 1.2, y: A.chestY - chest * 0.05 } : { x: chest, y: A.chestY },
  };
}

// Build parametric arm SVG path
function buildPathParametricArm(L: Landmarks, _view: View, side: 'L' | 'R'): string {
  // Get landmarks
  const acromion = L[`acromion${side}`];
  const bicepsMax = L[`bicepsMax${side}`];
  const elbow = L[`elbow${side}`];
  const forearmMax = L[`forearmMax${side}`];
  const wrist = L[`wrist${side}`];
  const palmTip = L[`palmTip${side}`];
  const fingerTip = L[`fingerTip${side}`];
  
  // Build the arm outline path - use landmark positions directly
  return `
    M ${acromion.x},${acromion.y}
    Q ${bicepsMax.x},${bicepsMax.y} ${elbow.x},${elbow.y}
    Q ${forearmMax.x},${forearmMax.y} ${wrist.x},${wrist.y}
    L ${palmTip.x},${palmTip.y}
    L ${fingerTip.x},${fingerTip.y}
    L ${palmTip.x},${palmTip.y}
    L ${wrist.x},${wrist.y}
    Q ${forearmMax.x},${forearmMax.y} ${elbow.x},${elbow.y}
    Q ${bicepsMax.x},${bicepsMax.y} ${acromion.x},${acromion.y}
    Z
  `;
}

// Build parametric leg SVG path
function buildPathParametricLeg(L: Landmarks, _view: View, side: 'L' | 'R'): string {
  // Get landmarks
  const hipJoint = L[`hipJoint${side}`];
  const thighMax = L[`thighMax${side}`];
  const knee = L[`knee${side}`];
  const calfMax = L[`calfMax${side}`];
  const ankle = L[`ankle${side}`];
  const heel = L[`heel${side}`];
  const toeTip = L[`toeTip${side}`];
  
  // Build the leg outline path - use landmark positions directly
  return `
    M ${hipJoint.x},${hipJoint.y}
    Q ${thighMax.x},${thighMax.y} ${knee.x},${knee.y}
    Q ${calfMax.x},${calfMax.y} ${ankle.x},${ankle.y}
    L ${heel.x},${heel.y}
    L ${toeTip.x},${toeTip.y}
    L ${heel.x},${heel.y}
    L ${ankle.x},${ankle.y}
    Q ${calfMax.x},${calfMax.y} ${knee.x},${knee.y}
    Q ${thighMax.x},${thighMax.y} ${hipJoint.x},${hipJoint.y}
    Z
  `;
}

// Build pelvis SVG path (connects torso to legs)
function buildPathPelvis(L: Landmarks, view: View): string {
  if (view === 'side') {
    return `
      M ${L.hipFront.x},${L.hipFront.y}
      Q ${L.buttockMax ? L.buttockMax.x : L.hipBack.x},${L.buttockMax ? L.buttockMax.y : L.hipBack.y} ${L.hipBack.x},${L.hipBack.y}
      L ${L.hipBack.x},${L.crotch.y}
      L ${L.hipFront.x},${L.crotch.y}
      Z
    `;
  } else {
    // Front/back view - pelvis connects hips to crotch
    return `
      M ${L.hipL.x},${L.hipL.y}
      Q ${L.hipL.x * 0.3},${L.hipL.y + (L.crotch.y - L.hipL.y) * 0.3} ${L.crotch.x},${L.crotch.y}
      Q ${L.hipR.x * 0.3},${L.hipR.y + (L.crotch.y - L.hipR.y) * 0.3} ${L.hipR.x},${L.hipR.y}
      L ${L.hipR.x},${L.hipR.y - 5}
      L ${L.hipL.x},${L.hipL.y - 5}
      Z
    `;
  }
}

function buildPathHead(L: Landmarks, view: View): string {
  if (view === 'side') {
    return `
      M ${L.headTop.x},${L.headTop.y}
      Q ${L.headFront.x},${L.headTop.y} ${L.headFront.x},${L.headFront.y}
      Q ${L.headFront.x},${L.chin.y} ${L.chin.x},${L.chin.y}
      Q ${L.headBack.x},${L.chin.y} ${L.headBack.x},${L.headBack.y}
      Q ${L.headBack.x},${L.headTop.y} ${L.headTop.x},${L.headTop.y}
      Z
    `;
  } else {
    // Front/back view - symmetric oval
    return `
      M ${L.headTop.x},${L.headTop.y}
      Q ${L.headR.x},${L.headTop.y} ${L.headR.x},${L.headR.y}
      Q ${L.headR.x},${L.chin.y} ${L.chin.x},${L.chin.y}
      Q ${L.headL.x},${L.chin.y} ${L.headL.x},${L.headL.y}
      Q ${L.headL.x},${L.headTop.y} ${L.headTop.x},${L.headTop.y}
      Z
    `;
  }
}

// Build neck SVG path
function buildPathNeck(L: Landmarks, view: View): string {
  if (view === 'side') {
    return `
      M ${L.neckFront.x},${L.neckFront.y}
      L ${L.neckFront.x},${L.chin.y}
      Q ${L.chin.x},${L.chin.y} ${L.headBack.x * 0.3},${L.chin.y}
      L ${L.neckBack.x},${L.neckBack.y}
      L ${L.shoulderBack.x},${L.shoulderBack.y}
      L ${L.shoulderFront.x},${L.shoulderFront.y}
      Z
    `;
  } else {
    return `
      M ${L.neckL.x},${L.neckL.y}
      L ${L.neckL.x},${L.chin.y}
      Q ${L.chin.x},${L.chin.y} ${L.neckR.x},${L.chin.y}
      L ${L.neckR.x},${L.neckR.y}
      L ${L.acromionR.x},${L.acromionR.y}
      L ${L.acromionL.x},${L.acromionL.y}
      Z
    `;
  }
}

// Build torso SVG path for front view
function buildPathFrontTorso(L: Landmarks): string {
  return `
    M ${L.acromionL.x},${L.acromionL.y}
    C ${L.chestL.x},${L.acromionL.y} ${L.chestL.x},${L.chestL.y} ${L.chestL.x},${L.chestL.y}
    ${L.bustApexL ? `Q ${L.bustApexL.x},${L.bustApexL.y} ${L.chestL.x},${L.chestL.y + 5}` : ''}
    L ${L.waistL.x},${L.waistL.y}
    C ${L.hipL.x},${L.waistL.y} ${L.hipL.x},${L.hipL.y} ${L.hipL.x},${L.hipL.y}
    L ${L.crotch.x},${L.crotch.y}
    L ${L.hipR.x},${L.hipR.y}
    C ${L.hipR.x},${L.waistR.y} ${L.waistR.x},${L.waistR.y} ${L.waistR.x},${L.waistR.y}
    ${L.bustApexR ? `Q ${L.bustApexR.x},${L.bustApexR.y} ${L.chestR.x},${L.chestR.y + 5}` : ''}
    L ${L.chestR.x},${L.chestR.y}
    C ${L.chestR.x},${L.acromionR.y} ${L.acromionR.x},${L.acromionR.y} ${L.acromionR.x},${L.acromionR.y}
    Z
  `;
}

// Build torso SVG path for side view
function buildPathSideTorso(L: Landmarks): string {
  return `
    M ${L.shoulderFront.x},${L.shoulderFront.y}
    L ${L.chestFront.x},${L.chestFront.y}
    ${L.bustApex ? `Q ${L.bustApex.x},${L.bustApex.y} ${L.chestFront.x},${L.chestFront.y + 3}` : ''}
    L ${L.waistFront.x},${L.waistFront.y}
    L ${L.hipFront.x},${L.hipFront.y}
    Q ${L.buttockMax.x},${L.buttockMax.y} ${L.hipBack.x},${L.hipBack.y}
    L ${L.waistBack.x},${L.waistBack.y}
    L ${L.chestBack.x},${L.chestBack.y}
    L ${L.shoulderBack.x},${L.shoulderBack.y}
    Z
  `;
}

// Render grid background
const renderGrid = (
  width: number,
  height: number,
  pixelsPerCm: number,
  gridStepCm: number,
  gridMajorEvery: number,
  zoom: number
): React.ReactElement => {
  const lines: React.ReactElement[] = [];
  const stepPx = gridStepCm * pixelsPerCm;
  const majorStepPx = stepPx * gridMajorEvery;

  // Vertical lines
  for (let x = 0; x <= width; x += stepPx) {
    const isMajor = (x % majorStepPx) === 0;
    lines.push(
      <line
        key={`v-${x}`}
        x1={x}
        y1={0}
        x2={x}
        y2={height}
        stroke={isMajor ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"}
        strokeWidth={(isMajor ? 1 : 0.5) / zoom}
      />
    );
  }

  // Horizontal lines
  for (let y = 0; y <= height; y += stepPx) {
    const isMajor = (y % majorStepPx) === 0;
    lines.push(
      <line
        key={`h-${y}`}
        x1={0}
        y1={y}
        x2={width}
        y2={y}
        stroke={isMajor ? "rgba(255, 255, 255, 0.3)" : "rgba(255, 255, 255, 0.1)"}
        strokeWidth={(isMajor ? 1 : 0.5) / zoom}
      />
    );
  }

  return <g>{lines}</g>;
};

// Render debug guides
const renderGuides = (landmarks: Landmarks, zoom: number): React.ReactElement => {
  return (
    <g>
      {Object.entries(landmarks).map(([key, point]) => (
        point && (
          <g key={key}>
            <circle
              cx={point.x}
              cy={point.y}
              r={2 / zoom} // Scale circle size inversely with zoom
              fill="rgba(255, 0, 0, 0.7)"
            />
            <text
              x={point.x + 3 / zoom}
              y={point.y - 3 / zoom}
              fontSize={8 / zoom} // Scale text size inversely with zoom
              fill="rgba(255, 255, 255, 0.8)"
            >
              {key}
            </text>
          </g>
        )
      ))}
    </g>
  );
};

// Main Human2DModel component
const Human2DModel: React.FC<Human2DModelProps> = ({
  width,
  height,
  view,
  gender,
  measurements,
  pose = {},
  showGrid = true,
  gridStepCm = 5,
  gridMajorEvery = 2,
  showGuides = false,
  className = '',
  zoom = 1.0,
  pan = { x: 0, y: 0 },
  onWheel,
  onMouseDown,
  onMouseMove,
  onMouseUp,
}) => {
  // Merge pose with defaults
  const fullPose: Required<Pose> = { ...DEFAULT_POSE, ...pose };
  
  // Calculate pixels per cm to fit the model in the viewport
  const modelHeightCm = measurements.height;
  const padding = 50; // px padding around model
  const availableHeight = height - (2 * padding);
  const pixelsPerCm = availableHeight / modelHeightCm;

  // Center the model
  const centerX = width / 2;
  const modelHeightPx = modelHeightCm * pixelsPerCm;
  const topY = (height - modelHeightPx) / 2;

  // Generate landmarks based on view
  const landmarks = view === 'side' 
    ? landmarksSide(measurements, gender)
    : landmarksFront(measurements, gender);
  
  // Generate parametric arm and leg landmarks
  const leftArmLandmarks = armLandmarks(view, 'L', measurements, gender, fullPose);
  const rightArmLandmarks = armLandmarks(view, 'R', measurements, gender, fullPose);
  const leftLegLandmarks = legLandmarks(view, 'L', measurements, gender, fullPose);
  const rightLegLandmarks = legLandmarks(view, 'R', measurements, gender, fullPose);
  
  // Combine all landmarks
  const allLandmarks = {
    ...landmarks,
    ...leftArmLandmarks,
    ...rightArmLandmarks,
    ...leftLegLandmarks,
    ...rightLegLandmarks
  };
  
  // Offset landmarks to screen coordinates
  const offsetLandmarks: Landmarks = {};
  Object.entries(allLandmarks).forEach(([key, point]) => {
    offsetLandmarks[key] = {
      x: centerX + point.x * pixelsPerCm,
      y: topY + point.y * pixelsPerCm
    };
  });

  // Build SVG paths for each body segment
  const headPath = buildPathHead(offsetLandmarks, view);
  const neckPath = buildPathNeck(offsetLandmarks, view);
  const torsoPath = view === 'side' 
    ? buildPathSideTorso(offsetLandmarks)
    : buildPathFrontTorso(offsetLandmarks);
  const pelvisPath = buildPathPelvis(offsetLandmarks, view);
  
  // Parametric arms and legs
  const leftArmPath = view === 'front' || view === 'back' ? buildPathParametricArm(offsetLandmarks, view, 'L') : '';
  const rightArmPath = buildPathParametricArm(offsetLandmarks, view, 'R');
  const leftLegPath = view === 'front' || view === 'back' ? buildPathParametricLeg(offsetLandmarks, view, 'L') : '';
  const rightLegPath = buildPathParametricLeg(offsetLandmarks, view, 'R');

  // Calculate the cursor style based on interaction state
  const getCursor = () => {
    if (!onMouseDown) return 'default';
    return 'grab';
  };

  // Gender-specific colors with better visibility
  const colors = {
    male: { fill: 'rgba(59, 130, 246, 0.8)', stroke: 'rgba(59, 130, 246, 1.0)' },
    female: { fill: 'rgba(236, 72, 153, 0.8)', stroke: 'rgba(236, 72, 153, 1.0)' },
    other: { fill: 'rgba(168, 85, 247, 0.8)', stroke: 'rgba(168, 85, 247, 1.0)' }
  }[gender];

  return (
    <svg 
      width={width} 
      height={height} 
      className={className}
      style={{ 
        background: 'transparent',
        cursor: getCursor()
      }}
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp} // End drag if mouse leaves SVG
    >
      {/* Human body segments with zoom and pan transform - everything transforms together */}
      <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}>
        {/* Grid background - now transforms with the model */}
        {showGrid && renderGrid(width, height, pixelsPerCm, gridStepCm, gridMajorEvery, zoom)}
        
        {/* Human body segments */}
        {/* Head */}
        <path
          d={headPath}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={1.5 / zoom} // Scale stroke width inversely to maintain visual consistency
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Neck */}
        <path
          d={neckPath}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={1.5 / zoom}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Torso */}
        <path
          d={torsoPath}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={1.5 / zoom}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Pelvis */}
        <path
          d={pelvisPath}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={1.5 / zoom}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Arms */}
        {leftArmPath && (
          <path
            d={leftArmPath}
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth={1.5 / zoom}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        <path
          d={rightArmPath}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={1.5 / zoom}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Legs */}
        {leftLegPath && (
          <path
            d={leftLegPath}
            fill={colors.fill}
            stroke={colors.stroke}
            strokeWidth={1.5 / zoom}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}
        <path
          d={rightLegPath}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={1.5 / zoom}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Debug guides - now transform with the model */}
        {showGuides && renderGuides(offsetLandmarks, zoom)}
      </g>
    </svg>
  );
};

export default Human2DModel;