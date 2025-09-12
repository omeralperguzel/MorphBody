import React from 'react';
import type { BasicMeasurements, DetailedMeasurements, MeasurementMode } from '../types';

interface MeasurementsTabProps {
  measurements: BasicMeasurements | DetailedMeasurements;
  measurementMode: MeasurementMode;
  onMeasurementsChange: (measurements: BasicMeasurements | DetailedMeasurements) => void;
  onModeChange: (mode: MeasurementMode) => void;
}

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
};

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
          value={measurements.height}
          min={140}
          max={200}
          unit="cm"
          icon="📏"
          description="Total body height from head to toe"
          onChange={(value) => handleBasicChange('height', value)}
        />

        <MeasurementInput
          label="Weight"
          value={measurements.weight}
          min={40}
          max={150}
          unit="kg"
          icon="⚖️"
          description="Body weight for proportional scaling"
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

      {/* Note for detailed measurements */}
      {measurementMode === 'detailed' && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center' as const,
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '8px',
            background: 'linear-gradient(135deg, white 0%, #d1d5db 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Detailed Measurements
          </h3>
          <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>
            Detailed measurement controls would be implemented here with additional body part measurements
          </p>
        </div>
      )}
    </div>
  );
};