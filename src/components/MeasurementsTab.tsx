import React from 'react';
import type { BasicMeasurements, DetailedMeasurements, MeasurementMode } from '../types';
import { 
  GlassContainer, 
  GradientButton, 
  ModernRangeSlider, 
  gradients, 
  animationStyles,
  getGradientBackground 
} from '../styles/StyledComponents';

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
    <div className="space-y-8">
      {/* Mode Toggle - Modern Switch Design */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-base font-semibold text-white">Measurement Mode</label>
          <div className="flex items-center space-x-1 bg-white/10 p-1 rounded-xl border border-white/20">
            <button
              onClick={() => onModeChange('basic')}
              className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                measurementMode === 'basic'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="relative z-10">Basic</span>
            </button>
            <button
              onClick={() => onModeChange('detailed')}
              className={`relative px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                measurementMode === 'detailed'
                  ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25 transform scale-105'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <span className="relative z-10">Detailed</span>
            </button>
          </div>
        </div>
        
        <div className="text-sm text-white/60 leading-relaxed">
          {measurementMode === 'basic' 
            ? 'Essential measurements for quick model generation'
            : 'Comprehensive body measurements for precise customization'
          }
        </div>
      </div>

      {/* Basic Measurements - Enhanced Design */}
      <div className="space-y-6">
        <ModernMeasurementInput
          label="Height"
          value={measurements.height}
          min={140}
          max={200}
          unit="cm"
          icon="📏"
          color="blue"
          onChange={(value) => handleBasicChange('height', value)}
          description="Total body height from head to toe"
        />

        <ModernMeasurementInput
          label="Weight"
          value={measurements.weight}
          min={40}
          max={150}
          unit="kg"
          icon="⚖️"
          color="emerald"
          onChange={(value) => handleBasicChange('weight', value)}
          description="Body weight for proportional scaling"
        />

        {/* Gender Selection - Modern Card Design */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">⚧️</span>
            <div>
              <h3 className="text-base font-semibold text-white">Gender</h3>
              <p className="text-sm text-white/60">Affects default body proportions</p>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: 'male', label: 'Male', icon: '♂️', gradient: 'from-blue-500 to-blue-600' },
              { value: 'female', label: 'Female', icon: '♀️', gradient: 'from-pink-500 to-pink-600' },
              { value: 'other', label: 'Other', icon: '⚧️', gradient: 'from-purple-500 to-purple-600' }
            ].map(({ value, label, icon, gradient }) => (
              <button
                key={value}
                onClick={() => handleBasicChange('gender', value)}
                className={`relative p-4 rounded-xl border-2 transition-all duration-300 ${
                  measurements.gender === value
                    ? 'border-white/30 bg-white/20 text-white scale-105 shadow-xl'
                    : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:bg-white/10 hover:border-white/20'
                }`}
              >
                {measurements.gender === value && (
                  <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-20 rounded-xl`} />
                )}
                
                <div className="relative z-10 text-center space-y-2">
                  <span className="text-2xl block">{icon}</span>
                  <span className="text-sm font-semibold">{label}</span>
                </div>
                
                {measurements.gender === value && (
                  <div className="absolute top-2 right-2">
                    <div className={`w-3 h-3 bg-gradient-to-br ${gradient} rounded-full shadow-lg`} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Measurements */}
      {measurementMode === 'detailed' && (
        <div className="space-y-8 pt-8 border-t border-white/10">
          <div className="text-center">
            <h3 className="text-xl font-bold text-white mb-2 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Detailed Measurements
            </h3>
            <p className="text-sm text-white/60">Fine-tune every aspect of your model</p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Head and Neck */}
            <DetailedSection 
              title="Head & Neck" 
              icon="🧠" 
              color="blue"
              measurements={[
                {
                  label: 'Head Circumference',
                  value: (measurements as DetailedMeasurements).headCircumference || 56,
                  min: 50,
                  max: 65,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('headCircumference', value)
                },
                {
                  label: 'Neck Circumference',
                  value: (measurements as DetailedMeasurements).neckCircumference || 36,
                  min: 30,
                  max: 45,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('neckCircumference', value)
                }
              ]}
            />

            {/* Torso */}
            <DetailedSection 
              title="Torso" 
              icon="🫁" 
              color="emerald"
              measurements={[
                {
                  label: 'Chest Circumference',
                  value: (measurements as DetailedMeasurements).chestCircumference || 90,
                  min: 70,
                  max: 130,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('chestCircumference', value)
                },
                {
                  label: 'Waist Circumference',
                  value: (measurements as DetailedMeasurements).waistCircumference || 75,
                  min: 60,
                  max: 120,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('waistCircumference', value)
                },
                {
                  label: 'Hip Circumference',
                  value: (measurements as DetailedMeasurements).hipCircumference || 95,
                  min: 75,
                  max: 130,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('hipCircumference', value)
                }
              ]}
            />

            {/* Arms and Hands */}
            <DetailedSection 
              title="Arms & Hands" 
              icon="💪" 
              color="purple"
              measurements={[
                {
                  label: 'Arm Length',
                  value: (measurements as DetailedMeasurements).armLength || 60,
                  min: 50,
                  max: 80,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('armLength', value)
                },
                {
                  label: 'Wrist Circumference',
                  value: (measurements as DetailedMeasurements).wristCircumference || 16,
                  min: 12,
                  max: 22,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('wristCircumference', value)
                },
                {
                  label: 'Palm Length',
                  value: (measurements as DetailedMeasurements).palmLength || 18,
                  min: 15,
                  max: 22,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('palmLength', value)
                },
                {
                  label: 'Middle Finger Length',
                  value: (measurements as DetailedMeasurements).middleFingerLength || 7.5,
                  min: 6,
                  max: 10,
                  step: 0.1,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('middleFingerLength', value)
                }
              ]}
            />

            {/* Legs and Feet */}
            <DetailedSection 
              title="Legs & Feet" 
              icon="🦵" 
              color="orange"
              measurements={[
                {
                  label: 'Leg Length',
                  value: (measurements as DetailedMeasurements).legLength || 75,
                  min: 60,
                  max: 95,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('legLength', value)
                },
                {
                  label: 'Thigh Circumference',
                  value: (measurements as DetailedMeasurements).thighCircumference || 55,
                  min: 40,
                  max: 75,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('thighCircumference', value)
                },
                {
                  label: 'Ankle Circumference',
                  value: (measurements as DetailedMeasurements).ankleCircumference || 22,
                  min: 18,
                  max: 28,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('ankleCircumference', value)
                },
                {
                  label: 'Toe Length',
                  value: (measurements as DetailedMeasurements).toeLength || 25,
                  min: 20,
                  max: 32,
                  unit: 'cm',
                  onChange: (value) => handleDetailedChange('toeLength', value)
                }
              ]}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface ModernMeasurementInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  icon: string;
  color: string;
  description: string;
  onChange: (value: number) => void;
}

const ModernMeasurementInput: React.FC<ModernMeasurementInputProps> = ({
  label,
  value,
  min,
  max,
  unit,
  icon,
  color,
  description,
  onChange,
}) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { gradient: string; shadow: string; ring: string }> = {
      blue: { gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/25', ring: 'focus:ring-blue-500/50' },
      emerald: { gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/25', ring: 'focus:ring-emerald-500/50' },
      purple: { gradient: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/25', ring: 'focus:ring-purple-500/50' },
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(color);

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-3">
        <span className="text-2xl">{icon}</span>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-white">{label}</h3>
          <p className="text-sm text-white/60">{description}</p>
        </div>
        <div className={`px-3 py-1 bg-gradient-to-r ${colors.gradient} text-white text-sm font-bold rounded-lg shadow-lg ${colors.shadow}`}>
          {value} {unit}
        </div>
      </div>
      
      <div className="space-y-3">
        {/* Custom Range Slider */}
        <div className="relative">
          <input
            type="range"
            min={min}
            max={max}
            step="1"
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className="modern-range w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none"
            style={{
              background: `linear-gradient(to right, rgb(59 130 246 / 0.8) 0%, rgb(59 130 246 / 0.8) ${((value - min) / (max - min)) * 100}%, rgb(255 255 255 / 0.1) ${((value - min) / (max - min)) * 100}%, rgb(255 255 255 / 0.1) 100%)`
            }}
          />
        </div>
        
        {/* Number Input */}
        <div className="flex items-center space-x-3">
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            className={`flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:ring-2 ${colors.ring} focus:border-transparent transition-all duration-200 hover:bg-white/15`}
          />
          <span className="text-white/70 font-medium min-w-[2rem]">{unit}</span>
        </div>
      </div>
    </div>
  );
};

interface DetailedSectionProps {
  title: string;
  icon: string;
  color: string;
  measurements: Array<{
    label: string;
    value: number;
    min: number;
    max: number;
    step?: number;
    unit: string;
    onChange: (value: number) => void;
  }>;
}

const DetailedSection: React.FC<DetailedSectionProps> = ({ title, icon, color, measurements }) => {
  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { gradient: string; shadow: string }> = {
      blue: { gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/25' },
      emerald: { gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/25' },
      purple: { gradient: 'from-purple-500 to-pink-500', shadow: 'shadow-purple-500/25' },
      orange: { gradient: 'from-orange-500 to-amber-500', shadow: 'shadow-orange-500/25' },
    };
    return colorMap[color] || colorMap.blue;
  };

  const colors = getColorClasses(color);

  return (
    <div className="space-y-6 p-6 bg-white/5 rounded-2xl border border-white/10">
      <div className="flex items-center space-x-3">
        <div className={`p-3 bg-gradient-to-r ${colors.gradient} rounded-xl shadow-lg ${colors.shadow}`}>
          <span className="text-xl">{icon}</span>
        </div>
        <h4 className="text-lg font-bold text-white">{title}</h4>
      </div>
      
      <div className="space-y-4">
        {measurements.map((measurement) => (
          <DetailedMeasurementInput
            key={measurement.label}
            {...measurement}
          />
        ))}
      </div>
    </div>
  );
};

interface DetailedMeasurementInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (value: number) => void;
}

const DetailedMeasurementInput: React.FC<DetailedMeasurementInputProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <label className="text-sm font-medium text-white/90">{label}</label>
      <span className="text-sm font-bold text-white px-2 py-1 bg-white/10 rounded-md">
        {value} {unit}
      </span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer focus:outline-none hover:bg-white/15 transition-colors"
      style={{
        background: `linear-gradient(to right, rgb(59 130 246 / 0.6) 0%, rgb(59 130 246 / 0.6) ${((value - min) / (max - min)) * 100}%, rgb(255 255 255 / 0.1) ${((value - min) / (max - min)) * 100}%, rgb(255 255 255 / 0.1) 100%)`
      }}
    />
  </div>
);