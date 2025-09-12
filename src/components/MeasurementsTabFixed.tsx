import React, { useState } from 'react';
import type { BasicMeasurements, DetailedMeasurements, MeasurementMode } from '../types';

interface MeasurementsTabProps {
  measurements: BasicMeasurements | DetailedMeasurements;
  measurementMode: MeasurementMode;
  onMeasurementsChange: (measurements: BasicMeasurements | DetailedMeasurements) => void;
  onModeChange: (mode: MeasurementMode) => void;
}

// Component for compact measurement input with description
const CompactMeasurementInput: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    field: keyof Omit<DetailedMeasurements, 'height' | 'weight' | 'gender'>;
    description?: string;
    onChange: (field: keyof Omit<DetailedMeasurements, 'height' | 'weight' | 'gender'>, value: number) => void;
  }> = ({ label, value, min, max, field, description, onChange }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
      <div style={styles.compactMeasurementInput}>
        <div style={styles.compactInputHeader}>
          <div style={styles.compactInputInfo}>
            <p style={styles.compactInputLabel}>{label}</p>
            {description && (
              <p style={{ ...styles.inputDescription, fontSize: '12px', marginTop: '2px' }}>
                {description}
              </p>
            )}
          </div>
          <div style={styles.compactInputValue}>
            {value} cm
          </div>
        </div>
        
        <div style={styles.compactControls}>
          <input
            type="range"
            min={min}
            max={max}
            step="1"
            value={value}
            onChange={(e) => onChange(field, Number(e.target.value))}
            style={{
              ...styles.compactSlider,
              background: `linear-gradient(to right, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.8) ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
            }}
          />
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(field, Number(e.target.value))}
            style={styles.compactNumberInput}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          />
        </div>
      </div>
    );
  };

// Inline styles to replace CSS classes
const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '32px',
  },
  modeToggle: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  modeToggleHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between' as const,
  },
  modeLabel: {
    fontSize: '16px',
    fontWeight: '600' as const,
    color: 'white',
  },
  modeButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    background: 'rgba(255, 255, 255, 0.1)',
    padding: '4px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
  modeButton: {
    position: 'relative' as const,
    padding: '8px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: 'none',
    cursor: 'pointer' as const,
  },
  activeModeButton: {
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    color: 'white',
    boxShadow: '0 4px 8px rgba(59, 130, 246, 0.25)',
    transform: 'scale(1.05)',
  },
  inactiveModeButton: {
    background: 'transparent',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  modeDescription: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    lineHeight: 1.5,
  },
  measurementsGrid: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '24px',
  },
  measurementInput: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  inputHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  inputIcon: {
    fontSize: '32px',
  },
  inputInfo: {
    flex: 1,
  },
  inputLabel: {
    fontSize: '16px',
    fontWeight: '600' as const,
    color: 'white',
    margin: 0,
  },
  inputDescription: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  inputValue: {
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    color: 'white',
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    boxShadow: '0 4px 8px rgba(59, 130, 246, 0.25)',
  },
  sliderContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  rangeSlider: {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    outline: 'none',
    cursor: 'pointer' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    appearance: 'none' as const,
  },
  numberInputContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  numberInput: {
    flex: 1,
    padding: '12px 16px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    color: 'white',
    fontSize: '16px',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  unitLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500' as const,
    minWidth: '32px',
  },
  genderGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '12px',
  },
  genderButton: {
    position: 'relative' as const,
    padding: '16px',
    borderRadius: '12px',
    border: '2px solid',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer' as const,
    background: 'transparent',
  },
  genderButtonActive: {
    borderColor: 'rgba(255, 255, 255, 0.3)',
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    transform: 'scale(1.05)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  },
  genderButtonInactive: {
    borderColor: 'rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  genderButtonContent: {
    position: 'relative' as const,
    zIndex: 10,
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  genderIcon: {
    fontSize: '32px',
    display: 'block',
  },
  genderLabel: {
    fontSize: '14px',
    fontWeight: '600' as const,
  },
  sectionContainer: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    overflow: 'hidden' as const,
  },
  sectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '16px 20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    cursor: 'pointer' as const,
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  sectionIcon: {
    fontSize: '24px',
  },
  sectionTitle: {
    flex: 1,
    fontSize: '18px',
    fontWeight: '600' as const,
    color: 'white',
    margin: 0,
  },
  sectionToggle: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '18px',
    transition: 'transform 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  sectionContent: {
    padding: '20px',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '20px',
  },
  compactMeasurementInput: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  },
  compactInputHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between' as const,
  },
  compactInputInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  compactInputLabel: {
    fontSize: '14px',
    fontWeight: '500' as const,
    color: 'white',
    margin: 0,
  },
  compactInputValue: {
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold' as const,
    color: 'white',
    background: 'rgba(59, 130, 246, 0.6)',
    minWidth: '60px',
    textAlign: 'center' as const,
  },
  compactControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  compactSlider: {
    flex: 1,
    height: '6px',
    borderRadius: '3px',
    outline: 'none',
    cursor: 'pointer' as const,
    appearance: 'none' as const,
  },
  compactNumberInput: {
    width: '80px',
    padding: '8px 12px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    textAlign: 'center' as const,
  },
};

export const MeasurementsTab: React.FC<MeasurementsTabProps> = ({
  measurements,
  measurementMode,
  onMeasurementsChange,
  onModeChange,
}) => {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    headNeck: true,
    torso: true,
    armsHands: true,  // Expanded to show arm details
    legsFeet: true,   // Expanded to show leg details
  });

  const toggleSection = (sectionKey: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev[sectionKey]
    }));
  };
  const handleBasicChange = (field: keyof BasicMeasurements, value: number | string) => {
    onMeasurementsChange({
      ...measurements,
      [field]: value,
    } as BasicMeasurements);
  };

  const handleDetailedChange = (field: keyof Omit<DetailedMeasurements, 'height' | 'weight' | 'gender'>, value: number) => {
    onMeasurementsChange({
      ...measurements,
      [field]: value,
    } as DetailedMeasurements);
  };

  // Measurement ranges for detailed measurements
  const measurementRanges = {
    headCircumference: { min: 50, max: 70 },
    neckCircumference: { min: 25, max: 50 },
    chestCircumference: { min: 70, max: 140 },
    waistCircumference: { min: 50, max: 120 },
    hipCircumference: { min: 70, max: 140 },
    armLength: { min: 45, max: 80 },
    legLength: { min: 60, max: 100 },
    thighCircumference: { min: 35, max: 80 },
    wristCircumference: { min: 12, max: 25 },
    palmLength: { min: 12, max: 25 },
    middleFingerLength: { min: 5, max: 12 },
    ankleCircumference: { min: 15, max: 35 },
    toeLength: { min: 15, max: 35 },
  };

  // Get measurement value with fallback to defaults
  const getMeasurementValue = (field: keyof Omit<DetailedMeasurements, 'height' | 'weight' | 'gender'>): number => {
    const detailed = measurements as DetailedMeasurements;
    if (detailed[field] !== undefined) {
      return detailed[field] as number;
    }
    
    // Realistic anthropometric defaults based on gender
    const defaults = {
      male: {
        headCircumference: 58, neckCircumference: 38,
        chestCircumference: 98, waistCircumference: 84, hipCircumference: 96,
        armLength: 62, legLength: 78, thighCircumference: 55,
        wristCircumference: 17, palmLength: 19, middleFingerLength: 8.5,
        ankleCircumference: 23, toeLength: 26,
      },
      female: {
        headCircumference: 56, neckCircumference: 34,
        chestCircumference: 90, waistCircumference: 70, hipCircumference: 98,
        armLength: 59, legLength: 75, thighCircumference: 57,
        wristCircumference: 15, palmLength: 18, middleFingerLength: 7.8,
        ankleCircumference: 21, toeLength: 24,
      },
      other: {
        headCircumference: 57, neckCircumference: 36,
        chestCircumference: 94, waistCircumference: 77, hipCircumference: 97,
        armLength: 60, legLength: 76, thighCircumference: 56,
        wristCircumference: 16, palmLength: 18.5, middleFingerLength: 8.1,
        ankleCircumference: 22, toeLength: 25,
      }
    };
    
    return defaults[measurements.gender][field];
  };

  const createRangeSlider = (value: number, min: number, max: number, onChange: (value: number) => void) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
      <input
        type="range"
        min={min}
        max={max}
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          ...styles.rangeSlider,
          background: `linear-gradient(to right, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.8) ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
        }}
      />
    );
  };

  const MeasurementInput: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    unit: string;
    icon: string;
    description: string;
    onChange: (value: number) => void;
  }> = ({ label, value, min, max, unit, icon, description, onChange }) => (
    <div style={styles.measurementInput}>
      <div style={styles.inputHeader}>
        <span style={styles.inputIcon}>{icon}</span>
        <div style={styles.inputInfo}>
          <h3 style={styles.inputLabel}>{label}</h3>
          <p style={styles.inputDescription}>{description}</p>
        </div>
        <div style={styles.inputValue}>
          {value} {unit}
        </div>
      </div>
      
      <div style={styles.sliderContainer}>
        {createRangeSlider(value, min, max, onChange)}
        
        <div style={styles.numberInputContainer}>
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(Number(e.target.value))}
            style={styles.numberInput}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          />
          <span style={styles.unitLabel}>{unit}</span>
        </div>
      </div>
    </div>
  );

  const CompactMeasurementInput: React.FC<{
    label: string;
    value: number;
    min: number;
    max: number;
    field: keyof Omit<DetailedMeasurements, 'height' | 'weight' | 'gender'>;
    onChange: (field: keyof Omit<DetailedMeasurements, 'height' | 'weight' | 'gender'>, value: number) => void;
  }> = ({ label, value, min, max, field, onChange }) => {
    const percentage = ((value - min) / (max - min)) * 100;
    
    return (
      <div style={styles.compactMeasurementInput}>
        <div style={styles.compactInputHeader}>
          <div style={styles.compactInputInfo}>
            <label style={styles.compactInputLabel}>{label}</label>
          </div>
          <div style={styles.compactInputValue}>
            {value} cm
          </div>
        </div>
        
        <div style={styles.compactControls}>
          <input
            type="range"
            min={min}
            max={max}
            step="1"
            value={value}
            onChange={(e) => onChange(field, Number(e.target.value))}
            style={{
              ...styles.compactSlider,
              background: `linear-gradient(to right, rgba(59, 130, 246, 0.8) 0%, rgba(59, 130, 246, 0.8) ${percentage}%, rgba(255, 255, 255, 0.1) ${percentage}%, rgba(255, 255, 255, 0.1) 100%)`,
            }}
          />
          <input
            type="number"
            min={min}
            max={max}
            value={value}
            onChange={(e) => onChange(field, Number(e.target.value))}
            style={styles.compactNumberInput}
            onFocus={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
          />
        </div>
      </div>
    );
  };

  const MeasurementSection: React.FC<{
    title: string;
    icon: string;
    sectionKey: string;
    children: React.ReactNode;
  }> = ({ title, icon, sectionKey, children }) => {
    const isExpanded = expandedSections[sectionKey];
    
    return (
      <div style={styles.sectionContainer}>
        <div 
          style={styles.sectionHeader}
          onClick={() => toggleSection(sectionKey)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
        >
          <span style={styles.sectionIcon}>{icon}</span>
          <h3 style={styles.sectionTitle}>{title}</h3>
          <span style={{
            ...styles.sectionToggle,
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}>
            ▼
          </span>
        </div>
        
        {isExpanded && (
          <div style={styles.sectionContent}>
            {children}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      {/* Mode Toggle */}
      <div style={styles.modeToggle}>
        <div style={styles.modeToggleHeader}>
          <label style={styles.modeLabel}>
            Measurement Mode
          </label>
          <div style={styles.modeButtons}>
            <button
              onClick={() => onModeChange('basic')}
              style={{
                ...styles.modeButton,
                ...(measurementMode === 'basic' ? styles.activeModeButton : styles.inactiveModeButton),
              }}
            >
              <span style={{ position: 'relative', zIndex: 10 }}>Basic</span>
            </button>
            <button
              onClick={() => onModeChange('detailed')}
              style={{
                ...styles.modeButton,
                ...(measurementMode === 'detailed' 
                  ? { ...styles.activeModeButton, background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 100%)' } 
                  : styles.inactiveModeButton),
              }}
            >
              <span style={{ position: 'relative', zIndex: 10 }}>Detailed</span>
            </button>
          </div>
        </div>
        
        <div style={styles.modeDescription}>
          {measurementMode === 'basic' 
            ? 'Essential measurements for quick model generation'
            : 'Comprehensive body measurements for precise customization'
          }
        </div>
      </div>

      {/* Basic Measurements */}
      <div style={styles.measurementsGrid}>
        <MeasurementInput
          label="Height"
          value={measurements.height || 170}  // Default to 170cm
          min={140}
          max={200}
          unit="cm"
          icon="📏"
          description="Total body height from head to toe (170cm optimal for detailed anatomy)"
          onChange={(value) => handleBasicChange('height', value)}
        />

        <MeasurementInput
          label="Weight"
          value={measurements.weight || 70}   // Default to 70kg
          min={40}
          max={150}
          unit="kg"
          icon="⚖️"
          description="Body weight for proportional muscle and fat distribution (70kg for athletic build)"
          onChange={(value) => handleBasicChange('weight', value)}
        />

        {/* Gender Selection */}
        <div style={styles.measurementInput}>
          <div style={styles.inputHeader}>
            <span style={styles.inputIcon}>⚧️</span>
            <div style={styles.inputInfo}>
              <h3 style={styles.inputLabel}>Gender</h3>
              <p style={styles.inputDescription}>Affects default body proportions</p>
            </div>
          </div>
          
          <div style={styles.genderGrid}>
            {[
              { value: 'male', label: 'Male', icon: '♂️', gradient: 'linear-gradient(135deg, #3b82f6, #2563eb)' },
              { value: 'female', label: 'Female', icon: '♀️', gradient: 'linear-gradient(135deg, #ec4899, #be185d)' },
              { value: 'other', label: 'Other', icon: '⚧️', gradient: 'linear-gradient(135deg, #a855f7, #7c3aed)' }
            ].map(({ value, label, icon, gradient }) => (
              <button
                key={value}
                onClick={() => handleBasicChange('gender', value)}
                style={{
                  ...styles.genderButton,
                  ...(measurements.gender === value ? styles.genderButtonActive : styles.genderButtonInactive),
                }}
                onMouseEnter={(e) => {
                  if (measurements.gender !== value) {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'rgba(255, 255, 255, 0.1)';
                    target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    target.style.color = 'white';
                  }
                }}
                onMouseLeave={(e) => {
                  if (measurements.gender !== value) {
                    const target = e.target as HTMLButtonElement;
                    target.style.background = 'rgba(255, 255, 255, 0.05)';
                    target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    target.style.color = 'rgba(255, 255, 255, 0.7)';
                  }
                }}
              >
                {measurements.gender === value && (
                  <div style={{
                    position: 'absolute',
                    inset: '0',
                    background: gradient,
                    opacity: 0.2,
                    borderRadius: '12px',
                  }} />
                )}
                
                <div style={styles.genderButtonContent}>
                  <span style={styles.genderIcon}>{icon}</span>
                  <span style={styles.genderLabel}>{label}</span>
                </div>
                
                {measurements.gender === value && (
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                  }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: gradient,
                      borderRadius: '50%',
                      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                    }} />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Measurements Sections */}
      {measurementMode === 'detailed' && (
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: '24px' }}>
          {/* Head & Neck */}
          <MeasurementSection title="Head & Neck" icon="🗣️" sectionKey="headNeck">
            <CompactMeasurementInput
              label="Head Circumference"
              value={getMeasurementValue('headCircumference')}
              min={measurementRanges.headCircumference.min}
              max={measurementRanges.headCircumference.max}
              field="headCircumference"
              onChange={handleDetailedChange}
            />
            <CompactMeasurementInput
              label="Neck Circumference"
              value={getMeasurementValue('neckCircumference')}
              min={measurementRanges.neckCircumference.min}
              max={measurementRanges.neckCircumference.max}
              field="neckCircumference"
              onChange={handleDetailedChange}
            />
          </MeasurementSection>

          {/* Torso */}
          <MeasurementSection title="Torso" icon="🫁" sectionKey="torso">
            <CompactMeasurementInput
              label="Chest Circumference"
              value={getMeasurementValue('chestCircumference')}
              min={measurementRanges.chestCircumference.min}
              max={measurementRanges.chestCircumference.max}
              field="chestCircumference"
              onChange={handleDetailedChange}
            />
            <CompactMeasurementInput
              label="Waist Circumference"
              value={getMeasurementValue('waistCircumference')}
              min={measurementRanges.waistCircumference.min}
              max={measurementRanges.waistCircumference.max}
              field="waistCircumference"
              onChange={handleDetailedChange}
            />
            <CompactMeasurementInput
              label="Hip Circumference"
              value={getMeasurementValue('hipCircumference')}
              min={measurementRanges.hipCircumference.min}
              max={measurementRanges.hipCircumference.max}
              field="hipCircumference"
              onChange={handleDetailedChange}
            />
          </MeasurementSection>

          {/* Arms & Hands */}
          <MeasurementSection title="Arms & Hands" icon="💪" sectionKey="armsHands">
            <CompactMeasurementInput
              label="Arm Length"
              value={getMeasurementValue('armLength')}
              min={measurementRanges.armLength.min}
              max={measurementRanges.armLength.max}
              field="armLength"
              onChange={handleDetailedChange}
            />
            <CompactMeasurementInput
              label="Wrist Circumference"
              value={getMeasurementValue('wristCircumference')}
              min={measurementRanges.wristCircumference.min}
              max={measurementRanges.wristCircumference.max}
              field="wristCircumference"
              onChange={handleDetailedChange}
            />
            <CompactMeasurementInput
              label="Palm Length"
              value={getMeasurementValue('palmLength')}
              min={measurementRanges.palmLength.min}
              max={measurementRanges.palmLength.max}
              field="palmLength"
              onChange={handleDetailedChange}
            />
            <CompactMeasurementInput
              label="Middle Finger Length"
              value={getMeasurementValue('middleFingerLength')}
              min={measurementRanges.middleFingerLength.min}
              max={measurementRanges.middleFingerLength.max}
              field="middleFingerLength"
              onChange={handleDetailedChange}
            />
          </MeasurementSection>

          {/* Legs & Feet */}
          <MeasurementSection title="Legs & Feet" icon="🦵" sectionKey="legsFeet">
            <CompactMeasurementInput
              label="Leg Length"
              value={getMeasurementValue('legLength')}
              min={measurementRanges.legLength.min}
              max={measurementRanges.legLength.max}
              field="legLength"
              onChange={handleDetailedChange}
            />
            <CompactMeasurementInput
              label="Thigh Circumference"
              value={getMeasurementValue('thighCircumference')}
              min={measurementRanges.thighCircumference.min}
              max={measurementRanges.thighCircumference.max}
              field="thighCircumference"
              onChange={handleDetailedChange}
            />
            <CompactMeasurementInput
              label="Ankle Circumference"
              value={getMeasurementValue('ankleCircumference')}
              min={measurementRanges.ankleCircumference.min}
              max={measurementRanges.ankleCircumference.max}
              field="ankleCircumference"
              onChange={handleDetailedChange}
            />
            <CompactMeasurementInput
              label="Toe Length"
              value={getMeasurementValue('toeLength')}
              min={measurementRanges.toeLength.min}
              max={measurementRanges.toeLength.max}
              field="toeLength"
              onChange={handleDetailedChange}
            />
          </MeasurementSection>
        </div>
      )}
    </div>
  );
};