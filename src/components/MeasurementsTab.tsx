import React from 'react';
import type { BasicMeasurements, DetailedMeasurements, MeasurementMode } from '../types';

interface MeasurementsTabProps {
  measurements: BasicMeasurements | DetailedMeasurements;
  measurementMode: MeasurementMode;
  onMeasurementsChange: (measurements: BasicMeasurements | DetailedMeasurements) => void;
  onModeChange: (mode: MeasurementMode) => void;
}

export const MeasurementsTab: React.FC<MeasurementsTabProps> = ({
  measurements,
  measurementMode,
  onMeasurementsChange,
  onModeChange,
}) => {
  const handleBasicChange = (field: keyof BasicMeasurements, value: number | string) => {
    onMeasurementsChange({
      ...measurements,
      [field]: value,
    } as BasicMeasurements);
  };

  const handleDetailedChange = (field: keyof DetailedMeasurements, value: number) => {
    onMeasurementsChange({
      ...measurements,
      [field]: value,
    } as DetailedMeasurements);
  };

  return (
    <div className="space-y-6">
      {/* Mode Toggle */}
      <div className="flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-300">Mode:</label>
        <div className="flex space-x-2">
          <button
            onClick={() => onModeChange('basic')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              measurementMode === 'basic'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Basic
          </button>
          <button
            onClick={() => onModeChange('detailed')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              measurementMode === 'detailed'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Detailed
          </button>
        </div>
      </div>

      {/* Basic Measurements */}
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Height (cm): {measurements.height}
          </label>
          <input
            type="range"
            min="140"
            max="200"
            step="1"
            value={measurements.height}
            onChange={(e) => handleBasicChange('height', Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <input
            type="number"
            min="140"
            max="200"
            value={measurements.height}
            onChange={(e) => handleBasicChange('height', Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Weight (kg): {measurements.weight}
          </label>
          <input
            type="range"
            min="40"
            max="150"
            step="1"
            value={measurements.weight}
            onChange={(e) => handleBasicChange('weight', Number(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          />
          <input
            type="number"
            min="40"
            max="150"
            value={measurements.weight}
            onChange={(e) => handleBasicChange('weight', Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">Gender</label>
          <select
            value={measurements.gender}
            onChange={(e) => handleBasicChange('gender', e.target.value as 'male' | 'female' | 'other')}
            className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Detailed Measurements */}
      {measurementMode === 'detailed' && (
        <div className="space-y-4 border-t border-gray-600 pt-4">
          <h3 className="text-lg font-semibold text-white">Detailed Measurements</h3>
          
          <div className="grid grid-cols-2 gap-4">
            {/* Head and Neck */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-300">Head & Neck</h4>
              <DetailedMeasurementInput
                label="Head Circumference (cm)"
                value={(measurements as DetailedMeasurements).headCircumference || 56}
                min={50}
                max={65}
                onChange={(value) => handleDetailedChange('headCircumference', value)}
              />
              <DetailedMeasurementInput
                label="Neck Circumference (cm)"
                value={(measurements as DetailedMeasurements).neckCircumference || 36}
                min={30}
                max={45}
                onChange={(value) => handleDetailedChange('neckCircumference', value)}
              />
            </div>

            {/* Torso */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-300">Torso</h4>
              <DetailedMeasurementInput
                label="Chest Circumference (cm)"
                value={(measurements as DetailedMeasurements).chestCircumference || 90}
                min={70}
                max={130}
                onChange={(value) => handleDetailedChange('chestCircumference', value)}
              />
              <DetailedMeasurementInput
                label="Waist Circumference (cm)"
                value={(measurements as DetailedMeasurements).waistCircumference || 75}
                min={60}
                max={120}
                onChange={(value) => handleDetailedChange('waistCircumference', value)}
              />
              <DetailedMeasurementInput
                label="Hip Circumference (cm)"
                value={(measurements as DetailedMeasurements).hipCircumference || 95}
                min={75}
                max={130}
                onChange={(value) => handleDetailedChange('hipCircumference', value)}
              />
            </div>

            {/* Arms and Hands */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-300">Arms & Hands</h4>
              <DetailedMeasurementInput
                label="Arm Length (cm)"
                value={(measurements as DetailedMeasurements).armLength || 60}
                min={50}
                max={80}
                onChange={(value) => handleDetailedChange('armLength', value)}
              />
              <DetailedMeasurementInput
                label="Wrist Circumference (cm)"
                value={(measurements as DetailedMeasurements).wristCircumference || 16}
                min={12}
                max={22}
                onChange={(value) => handleDetailedChange('wristCircumference', value)}
              />
              <DetailedMeasurementInput
                label="Palm Length (cm)"
                value={(measurements as DetailedMeasurements).palmLength || 18}
                min={15}
                max={22}
                onChange={(value) => handleDetailedChange('palmLength', value)}
              />
              <DetailedMeasurementInput
                label="Middle Finger Length (cm)"
                value={(measurements as DetailedMeasurements).middleFingerLength || 7.5}
                min={6}
                max={10}
                step={0.1}
                onChange={(value) => handleDetailedChange('middleFingerLength', value)}
              />
            </div>

            {/* Legs and Feet */}
            <div className="space-y-3">
              <h4 className="font-medium text-gray-300">Legs & Feet</h4>
              <DetailedMeasurementInput
                label="Leg Length (cm)"
                value={(measurements as DetailedMeasurements).legLength || 75}
                min={60}
                max={95}
                onChange={(value) => handleDetailedChange('legLength', value)}
              />
              <DetailedMeasurementInput
                label="Thigh Circumference (cm)"
                value={(measurements as DetailedMeasurements).thighCircumference || 55}
                min={40}
                max={75}
                onChange={(value) => handleDetailedChange('thighCircumference', value)}
              />
              <DetailedMeasurementInput
                label="Ankle Circumference (cm)"
                value={(measurements as DetailedMeasurements).ankleCircumference || 22}
                min={18}
                max={28}
                onChange={(value) => handleDetailedChange('ankleCircumference', value)}
              />
              <DetailedMeasurementInput
                label="Toe Length (cm)"
                value={(measurements as DetailedMeasurements).toeLength || 25}
                min={20}
                max={32}
                onChange={(value) => handleDetailedChange('toeLength', value)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

interface DetailedMeasurementInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

const DetailedMeasurementInput: React.FC<DetailedMeasurementInputProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  onChange,
}) => (
  <div className="space-y-1">
    <label className="block text-xs font-medium text-gray-400">
      {label}: {value}
    </label>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer slider-sm"
    />
  </div>
);