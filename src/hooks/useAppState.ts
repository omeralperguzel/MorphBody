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
  height: 170, // Will be updated based on gender
  weight: 65,  // Will be updated based on gender
  gender: 'other',
};

const getGenderDefaults = (gender: 'male' | 'female' | 'other') => {
  const defaults = {
    male: {
      height: 175, weight: 70,
      headCircumference: 58, neckCircumference: 38,
      chestCircumference: 98, waistCircumference: 84, hipCircumference: 96,
      armLength: 62, legLength: 78, thighCircumference: 55,
      wristCircumference: 17, palmLength: 19, middleFingerLength: 8.5,
      ankleCircumference: 23, toeLength: 26,
    },
    female: {
      height: 165, weight: 60,
      headCircumference: 56, neckCircumference: 34,
      chestCircumference: 90, waistCircumference: 70, hipCircumference: 98,
      armLength: 59, legLength: 75, thighCircumference: 57,
      wristCircumference: 15, palmLength: 18, middleFingerLength: 7.8,
      ankleCircumference: 21, toeLength: 24,
    },
    other: {
      height: 170, weight: 65,
      headCircumference: 57, neckCircumference: 36,
      chestCircumference: 94, waistCircumference: 77, hipCircumference: 97,
      armLength: 60, legLength: 76, thighCircumference: 56,
      wristCircumference: 16, palmLength: 18.5, middleFingerLength: 8.1,
      ankleCircumference: 22, toeLength: 25,
    }
  };
  return defaults[gender];
};

const defaultDetailedMeasurements: DetailedMeasurements = {
  ...defaultBasicMeasurements,
  ...getGenderDefaults('other'),
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
    const genderDefaults = getGenderDefaults(gender);
    
    setMeasurements(prev => {
      if (measurementMode === 'detailed' && 'headCircumference' in prev) {
        // Update detailed measurements with gender-specific defaults
        return {
          ...prev,
          gender,
          height: prev.height === defaultBasicMeasurements.height ? genderDefaults.height : prev.height,
          weight: prev.weight === defaultBasicMeasurements.weight ? genderDefaults.weight : prev.weight,
          headCircumference: prev.headCircumference === defaultDetailedMeasurements.headCircumference ? genderDefaults.headCircumference : prev.headCircumference,
          neckCircumference: prev.neckCircumference === defaultDetailedMeasurements.neckCircumference ? genderDefaults.neckCircumference : prev.neckCircumference,
          chestCircumference: prev.chestCircumference === defaultDetailedMeasurements.chestCircumference ? genderDefaults.chestCircumference : prev.chestCircumference,
          waistCircumference: prev.waistCircumference === defaultDetailedMeasurements.waistCircumference ? genderDefaults.waistCircumference : prev.waistCircumference,
          hipCircumference: prev.hipCircumference === defaultDetailedMeasurements.hipCircumference ? genderDefaults.hipCircumference : prev.hipCircumference,
          armLength: prev.armLength === defaultDetailedMeasurements.armLength ? genderDefaults.armLength : prev.armLength,
          legLength: prev.legLength === defaultDetailedMeasurements.legLength ? genderDefaults.legLength : prev.legLength,
          thighCircumference: prev.thighCircumference === defaultDetailedMeasurements.thighCircumference ? genderDefaults.thighCircumference : prev.thighCircumference,
          wristCircumference: prev.wristCircumference === defaultDetailedMeasurements.wristCircumference ? genderDefaults.wristCircumference : prev.wristCircumference,
          palmLength: prev.palmLength === defaultDetailedMeasurements.palmLength ? genderDefaults.palmLength : prev.palmLength,
          middleFingerLength: prev.middleFingerLength === defaultDetailedMeasurements.middleFingerLength ? genderDefaults.middleFingerLength : prev.middleFingerLength,
          ankleCircumference: prev.ankleCircumference === defaultDetailedMeasurements.ankleCircumference ? genderDefaults.ankleCircumference : prev.ankleCircumference,
          toeLength: prev.toeLength === defaultDetailedMeasurements.toeLength ? genderDefaults.toeLength : prev.toeLength,
        } as DetailedMeasurements;
      } else {
        // Update basic measurements with gender-specific defaults
        return {
          ...prev,
          gender,
          height: prev.height === defaultBasicMeasurements.height ? genderDefaults.height : prev.height,
          weight: prev.weight === defaultBasicMeasurements.weight ? genderDefaults.weight : prev.weight,
        };
      }
    });
  }, [measurementMode]);

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