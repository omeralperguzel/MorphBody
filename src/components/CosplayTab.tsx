import React from 'react';
import type { Accessory } from '../types';

interface CosplayTabProps {
  selectedAccessories: Accessory[];
  onAccessoriesChange: (accessories: Accessory[]) => void;
}

const availableAccessories: Accessory[] = [
  // Masks
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
  
  // Wigs
  {
    id: 'long_hair',
    name: 'Long Hair Wig',
    type: 'wig',
    category: 'wigs',
    modelPath: '/assets/accessories/wigs/long_hair.glb',
  },
  {
    id: 'short_hair',
    name: 'Short Hair Wig',
    type: 'wig',
    category: 'wigs',
    modelPath: '/assets/accessories/wigs/short_hair.glb',
  },
  
  // Corsets
  {
    id: 'basic_corset',
    name: 'Waist Corset',
    type: 'corset',
    category: 'corsets',
    modelPath: '/assets/accessories/corsets/basic_corset.glb',
    bodyModifications: {
      waistScale: 0.8,
    },
  },
  
  // Padding
  {
    id: 'chest_padding',
    name: 'Chest Padding',
    type: 'padding',
    category: 'padding',
    modelPath: '/assets/accessories/padding/chest_padding.glb',
    bodyModifications: {
      chestScale: 1.3,
    },
  },
  {
    id: 'hip_padding',
    name: 'Hip Padding',
    type: 'padding',
    category: 'padding',
    modelPath: '/assets/accessories/padding/hip_padding.glb',
    bodyModifications: {
      hipScale: 1.2,
    },
  },
];

export const CosplayTab: React.FC<CosplayTabProps> = ({ selectedAccessories, onAccessoriesChange }) => {
  const toggleAccessory = (accessory: Accessory) => {
    const isSelected = selectedAccessories.some((a) => a.id === accessory.id);
    
    if (isSelected) {
      // Remove the accessory
      onAccessoriesChange(selectedAccessories.filter((a) => a.id !== accessory.id));
    } else {
      // For certain types, remove others of the same type first
      if (accessory.type === 'mask' || accessory.type === 'wig') {
        const filtered = selectedAccessories.filter((a) => a.type !== accessory.type);
        onAccessoriesChange([...filtered, accessory]);
      } else {
        // For padding and corsets, allow multiple
        onAccessoriesChange([...selectedAccessories, accessory]);
      }
    }
  };

  const removeAllAccessories = () => {
    onAccessoriesChange([]);
  };

  const groupedAccessories = availableAccessories.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, Accessory[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Cosplay & Kigurumi Mode</h3>
        <button
          onClick={removeAllAccessories}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Remove All
        </button>
      </div>

      {/* Selected accessories summary */}
      {selectedAccessories.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Active Accessories:</h4>
          <div className="space-y-2">
            {selectedAccessories.map((accessory) => (
              <div key={accessory.id} className="flex items-center justify-between">
                <span className="px-3 py-1 bg-purple-600 text-white rounded-full text-sm">
                  {accessory.name}
                </span>
                {accessory.bodyModifications && (
                  <span className="text-xs text-gray-400">
                    Body modifications applied
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accessory categories */}
      <div className="grid grid-cols-1 gap-6">
        {Object.entries(groupedAccessories).map(([category, items]) => (
          <div key={category} className="space-y-3">
            <h4 className="text-md font-semibold text-white capitalize flex items-center">
              {getCategoryIcon(category)} {category}
            </h4>
            
            <div className="grid grid-cols-2 gap-3">
              {items.map((accessory) => {
                const isSelected = selectedAccessories.some((a) => a.id === accessory.id);
                
                return (
                  <button
                    key={accessory.id}
                    onClick={() => toggleAccessory(accessory)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-purple-500 bg-purple-600/20 text-white'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{getAccessoryIcon(accessory.type)}</div>
                      <div className="font-medium text-sm">{accessory.name}</div>
                      {accessory.bodyModifications && (
                        <div className="text-xs text-gray-400 mt-1">
                          Modifies body shape
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Body modification preview */}
      {selectedAccessories.some((a) => a.bodyModifications) && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-3">Body Modifications:</h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            {selectedAccessories
              .filter((a) => a.bodyModifications)
              .map((accessory) => (
                <div key={accessory.id} className="text-center">
                  <div className="text-purple-400 font-medium">{accessory.name}</div>
                  {accessory.bodyModifications?.waistScale && (
                    <div className="text-gray-400">
                      Waist: {Math.round((accessory.bodyModifications.waistScale - 1) * 100)}%
                    </div>
                  )}
                  {accessory.bodyModifications?.chestScale && (
                    <div className="text-gray-400">
                      Chest: +{Math.round((accessory.bodyModifications.chestScale - 1) * 100)}%
                    </div>
                  )}
                  {accessory.bodyModifications?.hipScale && (
                    <div className="text-gray-400">
                      Hips: +{Math.round((accessory.bodyModifications.hipScale - 1) * 100)}%
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Cosplay Mode:</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Mix and match accessories to create unique looks</li>
          <li>• Only one mask and one wig can be selected at a time</li>
          <li>• Corsets and padding modify body proportions</li>
          <li>• Combine with clothing for complete cosplay outfits</li>
          <li>• All models are placeholders - replace with actual GLTF files</li>
        </ul>
      </div>
    </div>
  );
};

function getCategoryIcon(category: string): string {
  switch (category) {
    case 'masks':
      return '🎭';
    case 'wigs':
      return '💇';
    case 'corsets':
      return '👗';
    case 'padding':
      return '🎈';
    default:
      return '✨';
  }
}

function getAccessoryIcon(type: Accessory['type']): string {
  switch (type) {
    case 'mask':
      return '🎭';
    case 'wig':
      return '💇';
    case 'corset':
      return '👗';
    case 'padding':
      return '🎈';
    default:
      return '✨';
  }
}