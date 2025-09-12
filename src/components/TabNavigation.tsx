import React from 'react';
import type { Tab } from '../types';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'row' as const,
    gap: '6px',
    width: '100%',
    flexWrap: 'nowrap' as const,
  } as React.CSSProperties,

  tabButton: {
    position: 'relative' as const,
    flex: '1 1 calc(33.333% - 4px)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '8px',
    padding: '12px 8px',
    borderRadius: '12px',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    textAlign: 'center' as const,
    overflow: 'hidden',
    border: 'none',
    cursor: 'pointer',
    background: 'transparent',
    minHeight: '80px',
    minWidth: 0,
    maxWidth: 'calc(33.333% - 4px)',
  } as React.CSSProperties,

  tabButtonActive: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
    transform: 'scale(1.05)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  } as React.CSSProperties,

  tabButtonInactive: {
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid transparent',
  } as React.CSSProperties,

  tabButtonHover: {
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.1)',
    transform: 'scale(1.02)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  } as React.CSSProperties,

  backgroundGradient: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
    borderRadius: '12px',
  } as React.CSSProperties,

  iconContainer: {
    position: 'relative' as const,
    zIndex: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  iconContainerActive: {
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.25)',
  } as React.CSSProperties,

  iconContainerInactive: {
    background: 'rgba(255, 255, 255, 0.1)',
  } as React.CSSProperties,

  iconContainerInactiveHover: {
    background: 'rgba(255, 255, 255, 0.2)',
  } as React.CSSProperties,

  icon: {
    fontSize: '18px',
    filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))',
  } as React.CSSProperties,

  textContent: {
    position: 'relative' as const,
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '2px',
  } as React.CSSProperties,

  tabLabel: {
    fontWeight: 'bold',
    fontSize: '13px',
    lineHeight: 1.2,
    marginBottom: '2px',
    margin: 0,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    maxWidth: '100%',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,

  tabDescription: {
    fontSize: '11px',
    transition: 'color 0.3s ease',
    margin: 0,
    textOverflow: 'ellipsis',
    overflow: 'hidden',
    opacity: 0.8,
    maxWidth: '100%',
    whiteSpace: 'nowrap',
  } as React.CSSProperties,

  tabDescriptionActive: {
    color: 'rgba(255, 255, 255, 0.8)',
  } as React.CSSProperties,

  tabDescriptionInactive: {
    color: 'rgba(255, 255, 255, 0.5)',
  } as React.CSSProperties,

  tabDescriptionInactiveHover: {
    color: 'rgba(255, 255, 255, 0.7)',
  } as React.CSSProperties,

  activeIndicator: {
    position: 'absolute' as const,
    bottom: '6px',
    left: '50%',
    transform: 'translateX(-50%)',
    width: '24px',
    height: '4px',
    borderRadius: '2px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
  } as React.CSSProperties,

  borderAnimation: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: '12px',
    transition: 'all 0.3s ease',
    pointerEvents: 'none' as const,
  } as React.CSSProperties,

  borderAnimationActive: {
    boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.3)',
  } as React.CSSProperties,

  borderAnimationInactiveHover: {
    boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.2)',
  } as React.CSSProperties,

  decorativeElement: {
    display: 'flex',
    justifyContent: 'center',
    paddingTop: '8px',
    width: '100%',
  } as React.CSSProperties,

  decorativeLine: {
    width: '80px',
    height: '2px',
    background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%)',
    borderRadius: '1px',
  } as React.CSSProperties,
};

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const [hoveredTab, setHoveredTab] = React.useState<Tab | null>(null);

  const tabs: { id: Tab; label: string; icon: string; gradient: string; description: string }[] = [
    { 
      id: 'measurements', 
      label: 'Measurements', 
      icon: '📏', 
      gradient: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
      description: 'Body dimensions'
    },
    { 
      id: 'clothing', 
      label: 'Clothing', 
      icon: '👕', 
      gradient: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
      description: 'Apparel & outfits'
    },
    { 
      id: 'cosplay', 
      label: 'Cosplay', 
      icon: '🎭', 
      gradient: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
      description: 'Masks & accessories'
    },
  ];

  const getTabButtonStyle = (tab: { id: Tab; gradient: string }) => {
    const isActive = activeTab === tab.id;
    const isHovered = hoveredTab === tab.id && !isActive;

    let buttonStyle = { ...styles.tabButton };

    if (isActive) {
      buttonStyle = { ...buttonStyle, ...styles.tabButtonActive };
    } else {
      buttonStyle = { ...buttonStyle, ...styles.tabButtonInactive };
      
      if (isHovered) {
        buttonStyle = { ...buttonStyle, ...styles.tabButtonHover };
      }
    }

    return buttonStyle;
  };

  const getIconContainerStyle = (tab: { id: Tab; gradient: string }) => {
    const isActive = activeTab === tab.id;
    const isHovered = hoveredTab === tab.id && !isActive;

    let iconStyle = { ...styles.iconContainer };

    if (isActive) {
      iconStyle = {
        ...iconStyle,
        ...styles.iconContainerActive,
        background: tab.gradient,
      };
    } else {
      iconStyle = { ...iconStyle, ...styles.iconContainerInactive };
      
      if (isHovered) {
        iconStyle = { ...iconStyle, ...styles.iconContainerInactiveHover };
      }
    }

    return iconStyle;
  };

  const getTabDescriptionStyle = (tab: { id: Tab }) => {
    const isActive = activeTab === tab.id;
    const isHovered = hoveredTab === tab.id && !isActive;

    let descriptionStyle = { ...styles.tabDescription };

    if (isActive) {
      descriptionStyle = { ...descriptionStyle, ...styles.tabDescriptionActive };
    } else {
      descriptionStyle = { ...descriptionStyle, ...styles.tabDescriptionInactive };
      
      if (isHovered) {
        descriptionStyle = { ...descriptionStyle, ...styles.tabDescriptionInactiveHover };
      }
    }

    return descriptionStyle;
  };

  const getBorderAnimationStyle = (tab: { id: Tab }) => {
    const isActive = activeTab === tab.id;
    const isHovered = hoveredTab === tab.id && !isActive;

    let borderStyle = { ...styles.borderAnimation };

    if (isActive) {
      borderStyle = { ...borderStyle, ...styles.borderAnimationActive };
    } else if (isHovered) {
      borderStyle = { ...borderStyle, ...styles.borderAnimationInactiveHover };
    }

    return borderStyle;
  };

  return (
    <div style={styles.container}>
      {tabs.map((tab, index) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          style={{
            ...getTabButtonStyle(tab),
            animationDelay: `${index * 100}ms`,
          }}
          onMouseEnter={() => setHoveredTab(tab.id)}
          onMouseLeave={() => setHoveredTab(null)}
        >
          {/* Background gradient for active tab */}
          {activeTab === tab.id && (
            <div style={{
              ...styles.backgroundGradient,
              background: tab.gradient,
            }} />
          )}
          
          {/* Icon with modern styling */}
          <div style={getIconContainerStyle(tab)}>
            <span style={styles.icon}>{tab.icon}</span>
          </div>
          
          {/* Text content */}
          <div style={styles.textContent}>
            <div style={styles.tabLabel}>
              {tab.label}
            </div>
            <div style={getTabDescriptionStyle(tab)}>
              {tab.description}
            </div>
          </div>

          {/* Active indicator */}
          {activeTab === tab.id && (
            <div style={{
              ...styles.activeIndicator,
              background: tab.gradient,
            }} />
          )}

          {/* Subtle border animation */}
          <div style={getBorderAnimationStyle(tab)} />
        </button>
      ))}
    </div>
  );
};