import { useState, useCallback } from 'react';
import type { 
  BasicMeasurements, 
  DetailedMeasurements, 
  ClothingItem, 
  Accessory, 
  Tab, 
  MeasurementMode 
} from '../types';

const defaultBasicMeasurements: BasicMeasurements = {
  height: 170,
  weight: 70,
  gender: 'other',
};

const defaultDetailedMeasurements: DetailedMeasurements = {
  ...defaultBasicMeasurements,
  headCircumference: 56,
  neckCircumference: 36,
  chestCircumference: 90,
  waistCircumference: 75,
  hipCircumference: 95,
  armLength: 60,
  legLength: 75,
  thighCircumference: 55,
  wristCircumference: 16,
  palmLength: 18,
  middleFingerLength: 7.5,
  ankleCircumference: 22,
  toeLength: 25,
};

export function useAppState() {
  const [activeTab, setActiveTab] = useState<Tab>('measurements');
  const [measurementMode, setMeasurementMode] = useState<MeasurementMode>('basic');
  const [measurements, setMeasurements] = useState<BasicMeasurements | DetailedMeasurements>(
    defaultBasicMeasurements
  );
  const [selectedClothing, setSelectedClothing] = useState<ClothingItem[]>([]);
  const [selectedAccessories, setSelectedAccessories] = useState<Accessory[]>([]);

  const handleModeChange = useCallback((mode: MeasurementMode) => {
    setMeasurementMode(mode);
    
    if (mode === 'detailed' && !('headCircumference' in measurements)) {
      // Switch to detailed measurements, preserving basic values
      setMeasurements({
        ...defaultDetailedMeasurements,
        height: measurements.height,
        weight: measurements.weight,
        gender: measurements.gender,
      });
    } else if (mode === 'basic' && 'headCircumference' in measurements) {
      // Switch to basic measurements, preserving basic values
      setMeasurements({
        height: measurements.height,
        weight: measurements.weight,
        gender: measurements.gender,
      });
    }
  }, [measurements]);

  const handleMeasurementsChange = useCallback((newMeasurements: BasicMeasurements | DetailedMeasurements) => {
    setMeasurements(newMeasurements);
  }, []);

  const handleClothingChange = useCallback((clothing: ClothingItem[]) => {
    setSelectedClothing(clothing);
  }, []);

  const handleAccessoriesChange = useCallback((accessories: Accessory[]) => {
    setSelectedAccessories(accessories);
  }, []);

  const handleTabChange = useCallback((tab: Tab) => {
    setActiveTab(tab);
  }, []);

  // Individual measurement update function
  const updateMeasurement = useCallback((key: string, value: number | string) => {
    setMeasurements(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Gender update function
  const updateGender = useCallback((gender: 'male' | 'female' | 'other') => {
    setMeasurements(prev => ({
      ...prev,
      gender
    }));
  }, []);

  return {
    // State
    activeTab,
    measurementMode,
    measurements,
    selectedClothing,
    selectedAccessories,
    selectedGender: measurements.gender,
    
    // Actions
    handleTabChange,
    handleModeChange,
    handleMeasurementsChange,
    handleClothingChange,
    handleAccessoriesChange,
    updateMeasurement,
    updateGender,
    setClothing: handleClothingChange,
    setAccessories: handleAccessoriesChange,
  };
}