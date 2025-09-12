export interface BasicMeasurements {
  height: number;
  weight: number;
  gender: 'male' | 'female' | 'other';
}

export interface DetailedMeasurements extends BasicMeasurements {
  headCircumference: number;
  neckCircumference: number;
  chestCircumference: number;
  waistCircumference: number;
  hipCircumference: number;
  armLength: number;
  legLength: number;
  thighCircumference: number;
  wristCircumference: number;
  palmLength: number;
  middleFingerLength: number;
  ankleCircumference: number;
  toeLength: number;
}

export interface ClothingItem {
  id: string;
  name: string;
  type: 'tshirt' | 'hoodie' | 'pants' | 'suit' | 'dress' | 'skirt';
  size: 'S' | 'M' | 'L';
  modelPath: string;
  thumbnail?: string;
}

export interface Accessory {
  id: string;
  name: string;
  type: 'mask' | 'wig' | 'corset' | 'padding';
  category: 'masks' | 'wigs' | 'corsets' | 'padding';
  modelPath: string;
  thumbnail?: string;
  bodyModifications?: {
    waistScale?: number;
    chestScale?: number;
    hipScale?: number;
  };
}

export interface ModelTransform {
  scale: { x: number; y: number; z: number };
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
}

export type Tab = 'measurements' | 'clothing' | 'cosplay';
export type MeasurementMode = 'basic' | 'detailed';