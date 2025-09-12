import React, { useState, useMemo } from 'react';
import type { Accessory } from '../types';

interface CosplayTabProps {
  selectedAccessories: Accessory[];
  onAccessoriesChange: (accessories: Accessory[]) => void;
}

const styles = {
  container: {
    minHeight: '400px',
    padding: '24px',
    background: 'rgba(10, 10, 20, 0.7)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
  } as React.CSSProperties,

  header: {
    marginBottom: '32px',
  } as React.CSSProperties,

  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    textAlign: 'center' as const,
    marginBottom: '16px',
  } as React.CSSProperties,

  description: {
    textAlign: 'center' as const,
    color: '#a0a0a0',
    fontSize: '16px',
    lineHeight: '1.6',
  } as React.CSSProperties,

  categoriesContainer: {
    display: 'grid',
    gap: '24px',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  } as React.CSSProperties,

  categorySection: {
    background: 'rgba(20, 20, 40, 0.6)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    padding: '20px',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '16px',
  } as React.CSSProperties,

  categoryTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
  } as React.CSSProperties,

  categoryIconContainer: {
    width: '40px',
    height: '40px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  } as React.CSSProperties,

  categoryCount: {
    background: 'rgba(103, 126, 234, 0.2)',
    color: '#667eea',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '500',
    border: '1px solid rgba(103, 126, 234, 0.3)',
  } as React.CSSProperties,

  accessoryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
  } as React.CSSProperties,

  accessoryItem: {
    background: 'rgba(30, 30, 60, 0.8)',
    backdropFilter: 'blur(8px)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    padding: '16px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative' as const,
  } as React.CSSProperties,

  accessoryItemHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(103, 126, 234, 0.15)',
    border: '1px solid rgba(103, 126, 234, 0.3)',
  } as React.CSSProperties,

  accessoryIcon: {
    fontSize: '32px',
    marginBottom: '8px',
    display: 'block',
  } as React.CSSProperties,

  accessoryName: {
    color: '#ffffff',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '1.3',
  } as React.CSSProperties,
};

const availableAccessories: Accessory[] = [
  {
    id: 'cat_mask',
    name: 'Cat Mask',
    type: 'mask',
    category: 'masks',
    modelPath: '/assets/accessories/masks/cat_mask.glb',
  },
  {
    id: 'fox_mask',
    name: 'Fox Mask',
    type: 'mask',
    category: 'masks',
    modelPath: '/assets/accessories/masks/fox_mask.glb',
  },
  {
    id: 'wolf_mask',
    name: 'Wolf Mask',
    type: 'mask',
    category: 'masks',
    modelPath: '/assets/accessories/masks/wolf_mask.glb',
  },
  {
    id: 'long_wig',
    name: 'Long Hair Wig',
    type: 'wig',
    category: 'wigs',
    modelPath: '/assets/accessories/wigs/long_wig.glb',
  },
  {
    id: 'short_wig',
    name: 'Short Hair Wig',
    type: 'wig',
    category: 'wigs',
    modelPath: '/assets/accessories/wigs/short_wig.glb',
  },
  {
    id: 'basic_corset',
    name: 'Basic Corset',
    type: 'corset',
    category: 'corsets',
    modelPath: '/assets/accessories/corsets/basic_corset.glb',
    bodyModifications: {
      waistScale: 0.7,
    },
  },
  {
    id: 'chest_padding',
    name: 'Chest Padding',
    type: 'padding',
    category: 'padding',
    modelPath: '/assets/accessories/padding/chest_padding.glb',
    bodyModifications: {
      chestScale: 1.5,
    },
  },
];

export const CosplayTab: React.FC<CosplayTabProps> = ({ selectedAccessories, onAccessoriesChange }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const groupedAccessories = useMemo(() => {
    return availableAccessories.reduce((acc, accessory) => {
      if (!acc[accessory.category]) {
        acc[accessory.category] = [];
      }
      acc[accessory.category].push(accessory);
      return acc;
    }, {} as Record<string, Accessory[]>);
  }, []);

  const getCategoryIcon = (category: string): string => {
    const icons: Record<string, string> = {
      masks: '🎭',
      wigs: '💇',
      corsets: '👗',
      padding: '🛡️'
    };
    return icons[category] || '✨';
  };

  const getCategoryGradient = (category: string): string => {
    const gradients: Record<string, string> = {
      masks: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      wigs: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      corsets: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      padding: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
    };
    return gradients[category] || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
  };

  const toggleAccessory = (accessory: Accessory) => {
    const isSelected = selectedAccessories.some(item => item.id === accessory.id);
    
    if (isSelected) {
      onAccessoriesChange(selectedAccessories.filter(item => item.id !== accessory.id));
    } else {
      onAccessoriesChange([...selectedAccessories, accessory]);
    }
  };

  const getAccessoryItemStyle = (accessoryId: string) => {
    const isSelected = selectedAccessories.some(item => item.id === accessoryId);
    const isHovered = hoveredItem === accessoryId;
    
    let itemStyle = { ...styles.accessoryItem };
    
    if (isSelected) {
      itemStyle = {
        ...itemStyle,
        background: 'rgba(103, 126, 234, 0.2)',
        border: '2px solid #667eea',
        boxShadow: '0 0 20px rgba(103, 126, 234, 0.3)',
      };
    }
    
    if (isHovered) {
      itemStyle = {
        ...itemStyle,
        ...styles.accessoryItemHover,
      };
    }
    
    return itemStyle;
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Cosplay Accessories</h2>
        <p style={styles.description}>
          Transform your character with masks, wigs, corsets, and body modifications. 
          Mix and match to create unique cosplay combinations.
        </p>
      </div>

      <div style={styles.categoriesContainer}>
        {Object.entries(groupedAccessories).map(([category, items]) => (
          <div key={category} style={styles.categorySection}>
            <div style={styles.categoryHeader}>
              <div style={styles.categoryTitle}>
                <div style={{
                  ...styles.categoryIconContainer,
                  background: getCategoryGradient(category),
                }}>
                  <span style={{ fontSize: '20px' }}>{getCategoryIcon(category)}</span>
                </div>
                <span style={{ textTransform: 'capitalize' }}>{category}</span>
              </div>
              <div style={styles.categoryCount}>
                {items.length} items
              </div>
            </div>
            
            <div style={styles.accessoryGrid}>
              {items.map(accessory => (
                <div
                  key={accessory.id}
                  style={getAccessoryItemStyle(accessory.id)}
                  onClick={() => toggleAccessory(accessory)}
                  onMouseEnter={() => setHoveredItem(accessory.id)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <span style={styles.accessoryIcon}>
                    {getCategoryIcon(accessory.category)}
                  </span>
                  <div style={styles.accessoryName}>
                    {accessory.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};