import React, { useState } from 'react';
import type { ClothingItem } from '../types';

interface ClothingTabProps {
  selectedClothing: ClothingItem[];
  onClothingChange: (clothing: ClothingItem[]) => void;
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '32px',
  } as React.CSSProperties,

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as React.CSSProperties,

  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,

  headerIcon: {
    padding: '12px',
    background: 'linear-gradient(135deg, #10b981 0%, #14b8a6 100%)',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(16, 185, 129, 0.25)',
    fontSize: '20px',
  } as React.CSSProperties,

  headerTextContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
  } as React.CSSProperties,

  headerTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#ffffff',
    margin: 0,
  } as React.CSSProperties,

  headerSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  } as React.CSSProperties,

  clearButton: {
    padding: '8px 16px',
    background: 'rgba(239, 68, 68, 0.2)',
    border: '1px solid rgba(239, 68, 68, 0.4)',
    borderRadius: '12px',
    color: 'rgba(252, 165, 165, 1)',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 10px 25px rgba(239, 68, 68, 0.1)',
  } as React.CSSProperties,

  clearButtonHover: {
    background: 'rgba(239, 68, 68, 0.3)',
    border: '1px solid rgba(239, 68, 68, 0.6)',
    color: 'rgba(254, 202, 202, 1)',
    transform: 'scale(1.05)',
  } as React.CSSProperties,

  clearButtonContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,

  outfitSummary: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  } as React.CSSProperties,

  outfitHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,

  outfitIcon: {
    padding: '8px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(59, 130, 246, 0.25)',
    fontSize: '14px',
  } as React.CSSProperties,

  outfitTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
  } as React.CSSProperties,

  outfitGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '12px',
  } as React.CSSProperties,

  outfitItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  outfitItemHover: {
    border: '1px solid rgba(255, 255, 255, 0.2)',
  } as React.CSSProperties,

  outfitItemLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,

  outfitItemIcon: {
    fontSize: '18px',
  } as React.CSSProperties,

  outfitItemTextContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
  } as React.CSSProperties,

  outfitItemName: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#ffffff',
    margin: 0,
  } as React.CSSProperties,

  outfitItemSize: {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  } as React.CSSProperties,

  removeButton: {
    padding: '6px',
    color: 'rgba(255, 255, 255, 0.6)',
    background: 'transparent',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  } as React.CSSProperties,

  removeButtonHover: {
    color: '#f87171',
    background: 'rgba(239, 68, 68, 0.1)',
  } as React.CSSProperties,

  categoriesContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '32px',
  } as React.CSSProperties,

  categorySection: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  } as React.CSSProperties,

  categoryHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  } as React.CSSProperties,

  categoryIconContainer: {
    padding: '12px',
    borderRadius: '12px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    fontSize: '20px',
  } as React.CSSProperties,

  categoryTextContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
  } as React.CSSProperties,

  categoryTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'capitalize',
    margin: 0,
  } as React.CSSProperties,

  categoryDescription: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  } as React.CSSProperties,

  itemGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  } as React.CSSProperties,

  clothingItem: {
    position: 'relative' as const,
    padding: '20px',
    borderRadius: '16px',
    border: '2px solid rgba(255, 255, 255, 0.1)',
    background: 'rgba(255, 255, 255, 0.05)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    overflow: 'hidden',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
  } as React.CSSProperties,

  clothingItemSelected: {
    border: '2px solid rgba(255, 255, 255, 0.4)',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#ffffff',
    transform: 'scale(1.05)',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
  } as React.CSSProperties,

  clothingItemHover: {
    color: '#ffffff',
    background: 'rgba(255, 255, 255, 0.1)',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    transform: 'scale(1.02)',
    boxShadow: '0 15px 30px rgba(0, 0, 0, 0.25)',
  } as React.CSSProperties,

  selectedOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.2,
    borderRadius: '16px',
  } as React.CSSProperties,

  hoverOverlay: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
    borderRadius: '16px',
  } as React.CSSProperties,

  itemContent: {
    position: 'relative' as const,
    zIndex: 10,
    textAlign: 'center' as const,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px',
  } as React.CSSProperties,

  itemIcon: {
    fontSize: '32px',
    transition: 'transform 0.3s ease',
  } as React.CSSProperties,

  itemIconHover: {
    transform: 'scale(1.1)',
  } as React.CSSProperties,

  itemTextContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
  } as React.CSSProperties,

  itemName: {
    fontWeight: 'bold',
    fontSize: '16px',
    margin: 0,
  } as React.CSSProperties,

  itemSize: {
    fontSize: '14px',
    transition: 'color 0.3s ease',
    margin: 0,
  } as React.CSSProperties,

  selectionIndicator: {
    position: 'absolute' as const,
    top: '12px',
    right: '12px',
    width: '12px',
    height: '12px',
    borderRadius: '50%',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.3)',
    animation: 'pulse 2s infinite',
  } as React.CSSProperties,

  sizeIndicator: {
    position: 'absolute' as const,
    bottom: '12px',
    left: '12px',
    padding: '4px 8px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
  } as React.CSSProperties,

  sizeIndicatorSelected: {
    background: 'rgba(255, 255, 255, 0.3)',
    color: '#ffffff',
  } as React.CSSProperties,

  sizeIndicatorDefault: {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.6)',
  } as React.CSSProperties,

  sizeIndicatorHover: {
    background: 'rgba(255, 255, 255, 0.2)',
    color: 'rgba(255, 255, 255, 0.8)',
  } as React.CSSProperties,

  tipsSection: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(8px)',
    borderRadius: '16px',
    padding: '24px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  } as React.CSSProperties,

  tipsHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  } as React.CSSProperties,

  tipsIcon: {
    padding: '8px',
    background: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)',
    borderRadius: '8px',
    boxShadow: '0 10px 25px rgba(139, 92, 246, 0.25)',
    fontSize: '14px',
  } as React.CSSProperties,

  tipsTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    margin: 0,
  } as React.CSSProperties,

  tipsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
  } as React.CSSProperties,

  tipsColumn: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  } as React.CSSProperties,

  tipItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  } as React.CSSProperties,

  tipDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  } as React.CSSProperties,
};

interface ClothingTabProps {
  selectedClothing: ClothingItem[];
  onClothingChange: (clothing: ClothingItem[]) => void;
}

const availableClothing: Omit<ClothingItem, 'id'>[] = [
  { name: 'T-Shirt', type: 'tshirt', size: 'S', modelPath: '/assets/clothing/tshirt_s.glb' },
  { name: 'T-Shirt', type: 'tshirt', size: 'M', modelPath: '/assets/clothing/tshirt_m.glb' },
  { name: 'T-Shirt', type: 'tshirt', size: 'L', modelPath: '/assets/clothing/tshirt_l.glb' },
  { name: 'Hoodie', type: 'hoodie', size: 'S', modelPath: '/assets/clothing/hoodie_s.glb' },
  { name: 'Hoodie', type: 'hoodie', size: 'M', modelPath: '/assets/clothing/hoodie_m.glb' },
  { name: 'Hoodie', type: 'hoodie', size: 'L', modelPath: '/assets/clothing/hoodie_l.glb' },
  { name: 'Pants', type: 'pants', size: 'S', modelPath: '/assets/clothing/pants_s.glb' },
  { name: 'Pants', type: 'pants', size: 'M', modelPath: '/assets/clothing/pants_m.glb' },
  { name: 'Pants', type: 'pants', size: 'L', modelPath: '/assets/clothing/pants_l.glb' },
  { name: 'Dress', type: 'dress', size: 'S', modelPath: '/assets/clothing/dress_s.glb' },
  { name: 'Dress', type: 'dress', size: 'M', modelPath: '/assets/clothing/dress_m.glb' },
  { name: 'Dress', type: 'dress', size: 'L', modelPath: '/assets/clothing/dress_l.glb' },
  { name: 'Skirt', type: 'skirt', size: 'S', modelPath: '/assets/clothing/skirt_s.glb' },
  { name: 'Skirt', type: 'skirt', size: 'M', modelPath: '/assets/clothing/skirt_m.glb' },
  { name: 'Skirt', type: 'skirt', size: 'L', modelPath: '/assets/clothing/skirt_l.glb' },
  { name: 'Suit', type: 'suit', size: 'S', modelPath: '/assets/clothing/suit_s.glb' },
  { name: 'Suit', type: 'suit', size: 'M', modelPath: '/assets/clothing/suit_m.glb' },
  { name: 'Suit', type: 'suit', size: 'L', modelPath: '/assets/clothing/suit_l.glb' },
];

export const ClothingTab: React.FC<ClothingTabProps> = ({ selectedClothing, onClothingChange }) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [hoveredClearButton, setHoveredClearButton] = useState(false);

  const toggleClothing = (item: Omit<ClothingItem, 'id'>) => {
    const id = `${item.type}_${item.size}`;
    const clothingWithId = { ...item, id };
    
    const isSelected = selectedClothing.some((c) => c.id === id);
    
    if (isSelected) {
      // Remove the item
      onClothingChange(selectedClothing.filter((c) => c.id !== id));
    } else {
      // Remove other sizes of the same type first, then add the new one
      const filtered = selectedClothing.filter((c) => c.type !== item.type);
      onClothingChange([...filtered, clothingWithId]);
    }
  };

  const removeAllClothing = () => {
    onClothingChange([]);
  };

  const groupedClothing = availableClothing.reduce((acc, item) => {
    if (!acc[item.type]) {
      acc[item.type] = [];
    }
    acc[item.type].push(item);
    return acc;
  }, {} as Record<string, Omit<ClothingItem, 'id'>[]>);

  const getClearButtonStyle = () => ({
    ...styles.clearButton,
    ...(hoveredClearButton ? styles.clearButtonHover : {}),
  });

  const getClothingItemStyle = (id: string, isSelected: boolean) => {
    const isHovered = hoveredItem === id;
    
    let itemStyle = { ...styles.clothingItem };
    
    if (isSelected) {
      itemStyle = { ...itemStyle, ...styles.clothingItemSelected };
    } else if (isHovered) {
      itemStyle = { ...itemStyle, ...styles.clothingItemHover };
    }
    
    return itemStyle;
  };

  return (
    <div style={styles.container}>
      {/* Header with enhanced design */}
      <div style={styles.header}>
        <div style={styles.headerLeft}>
          <div style={styles.headerIcon}>
            <span>👕</span>
          </div>
          <div style={styles.headerTextContainer}>
            <h3 style={styles.headerTitle}>Clothing Studio</h3>
            <p style={styles.headerSubtitle}>Mix and match apparel</p>
          </div>
        </div>
        
        {selectedClothing.length > 0 && (
          <button
            onClick={removeAllClothing}
            style={getClearButtonStyle()}
            onMouseEnter={() => setHoveredClearButton(true)}
            onMouseLeave={() => setHoveredClearButton(false)}
          >
            <div style={styles.clearButtonContent}>
              <span>🗑️</span>
              <span>Clear All</span>
            </div>
          </button>
        )}
      </div>

      {/* Selected clothing summary - Enhanced */}
      {selectedClothing.length > 0 && (
        <div style={styles.outfitSummary}>
          <div style={styles.outfitHeader}>
            <div style={styles.outfitIcon}>
              <span>👗</span>
            </div>
            <h4 style={styles.outfitTitle}>Current Outfit</h4>
          </div>
          
          <div style={styles.outfitGrid}>
            {selectedClothing.map((item) => (
              <div
                key={item.id}
                style={styles.outfitItem}
                onMouseEnter={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.border = '1px solid rgba(255, 255, 255, 0.1)';
                }}
              >
                <div style={styles.outfitItemLeft}>
                  <span style={styles.outfitItemIcon}>{getClothingIcon(item.type)}</span>
                  <div style={styles.outfitItemTextContainer}>
                    <div style={styles.outfitItemName}>{item.name}</div>
                    <div style={styles.outfitItemSize}>Size {item.size}</div>
                  </div>
                </div>
                
                <button
                  onClick={() => toggleClothing(item)}
                  style={styles.removeButton}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = '#f87171';
                    e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.6)';
                    e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Clothing categories - Enhanced grid */}
      <div style={styles.categoriesContainer}>
        {Object.entries(groupedClothing).map(([type, items]) => (
          <div key={type} style={styles.categorySection}>
            <div style={styles.categoryHeader}>
              <div style={{
                ...styles.categoryIconContainer,
                background: `linear-gradient(135deg, ${getClothingGradientColors(type as ClothingItem['type'])})`,
              }}>
                <span>{getClothingIcon(type as ClothingItem['type'])}</span>
              </div>
              <div style={styles.categoryTextContainer}>
                <h4 style={styles.categoryTitle}>{type}</h4>
                <p style={styles.categoryDescription}>{getClothingDescription(type as ClothingItem['type'])}</p>
              </div>
            </div>
            
            <div style={styles.itemGrid}>
              {items.map((item) => {
                const id = `${item.type}_${item.size}`;
                const isSelected = selectedClothing.some((c) => c.id === id);
                const isHovered = hoveredItem === id;
                
                return (
                  <button
                    key={id}
                    onClick={() => toggleClothing(item)}
                    onMouseEnter={() => setHoveredItem(id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    style={getClothingItemStyle(id, isSelected)}
                  >
                    {/* Background gradient for selected items */}
                    {isSelected && (
                      <div style={{
                        ...styles.selectedOverlay,
                        background: `linear-gradient(135deg, ${getClothingGradientColors(item.type)})`,
                      }} />
                    )}
                    
                    {/* Hover effect */}
                    {isHovered && !isSelected && (
                      <div style={styles.hoverOverlay} />
                    )}
                    
                    <div style={styles.itemContent}>
                      <div style={{
                        ...styles.itemIcon,
                        ...(isHovered ? styles.itemIconHover : {}),
                      }}>
                        {getClothingIcon(item.type)}
                      </div>
                      
                      <div style={styles.itemTextContainer}>
                        <div style={styles.itemName}>{item.name}</div>
                        <div style={{
                          ...styles.itemSize,
                          color: isSelected ? 'rgba(255, 255, 255, 0.9)' : 'rgba(255, 255, 255, 0.6)',
                        }}>
                          Size {item.size}
                        </div>
                      </div>
                    </div>

                    {/* Selection indicator */}
                    {isSelected && (
                      <div style={{
                        ...styles.selectionIndicator,
                        background: `linear-gradient(135deg, ${getClothingGradientColors(item.type)})`,
                      }} />
                    )}

                    {/* Size indicator */}
                    <div style={{
                      ...styles.sizeIndicator,
                      ...(isSelected 
                        ? styles.sizeIndicatorSelected 
                        : isHovered 
                          ? styles.sizeIndicatorHover 
                          : styles.sizeIndicatorDefault
                      ),
                    }}>
                      {item.size}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Enhanced instructions */}
      <div style={styles.tipsSection}>
        <div style={styles.tipsHeader}>
          <div style={styles.tipsIcon}>
            <span>💡</span>
          </div>
          <h4 style={styles.tipsTitle}>Usage Tips</h4>
        </div>
        
        <div style={styles.tipsGrid}>
          <div style={styles.tipsColumn}>
            <div style={styles.tipItem}>
              <div style={{ ...styles.tipDot, background: '#10b981' }}></div>
              <span>Click items to try them on instantly</span>
            </div>
            <div style={styles.tipItem}>
              <div style={{ ...styles.tipDot, background: '#3b82f6' }}></div>
              <span>Only one size per clothing type</span>
            </div>
          </div>
          
          <div style={styles.tipsColumn}>
            <div style={styles.tipItem}>
              <div style={{ ...styles.tipDot, background: '#8b5cf6' }}></div>
              <span>Auto-scales to body measurements</span>
            </div>
            <div style={styles.tipItem}>
              <div style={{ ...styles.tipDot, background: '#f59e0b' }}></div>
              <span>Combine with accessories for complete looks</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function getClothingIcon(type: ClothingItem['type']): string {
  switch (type) {
    case 'tshirt': return '👕';
    case 'hoodie': return '🧥';
    case 'pants': return '👖';
    case 'dress': return '👗';
    case 'skirt': return '👚';
    case 'suit': return '🤵';
    default: return '👔';
  }
}

function getClothingGradientColors(type: ClothingItem['type']): string {
  switch (type) {
    case 'tshirt': return '#3b82f6 0%, #06b6d4 100%';
    case 'hoodie': return '#8b5cf6 0%, #ec4899 100%';
    case 'pants': return '#10b981 0%, #14b8a6 100%';
    case 'dress': return '#f59e0b 0%, #f97316 100%';
    case 'skirt': return '#8b5cf6 0%, #a855f7 100%';
    case 'suit': return '#6b7280 0%, #374151 100%';
    default: return '#6b7280 0%, #4b5563 100%';
  }
}

function getClothingDescription(type: ClothingItem['type']): string {
  switch (type) {
    case 'tshirt': return 'Casual everyday wear';
    case 'hoodie': return 'Comfortable streetwear';
    case 'pants': return 'Versatile bottom wear';
    case 'dress': return 'Elegant one-piece';
    case 'skirt': return 'Stylish bottom piece';
    case 'suit': return 'Professional formal wear';
    default: return 'Clothing item';
  }
}