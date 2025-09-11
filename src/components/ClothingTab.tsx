import React from 'react';
import type { ClothingItem } from '../types';

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
  { name: 'Suit', type: 'suit', size: 'S', modelPath: '/assets/clothing/suit_s.glb' },
  { name: 'Suit', type: 'suit', size: 'M', modelPath: '/assets/clothing/suit_m.glb' },
  { name: 'Suit', type: 'suit', size: 'L', modelPath: '/assets/clothing/suit_l.glb' },
];

export const ClothingTab: React.FC<ClothingTabProps> = ({ selectedClothing, onClothingChange }) => {
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

  return (
    <div className="space-y-6">
      {/* Header with clear all button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-white">Clothing Selection</h3>
        <button
          onClick={removeAllClothing}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition-colors"
        >
          Remove All
        </button>
      </div>

      {/* Selected clothing summary */}
      {selectedClothing.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-300 mb-2">Currently Wearing:</h4>
          <div className="flex flex-wrap gap-2">
            {selectedClothing.map((item) => (
              <span
                key={item.id}
                className="px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
              >
                {item.name} ({item.size})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Clothing categories */}
      <div className="grid grid-cols-1 gap-6">
        {Object.entries(groupedClothing).map(([type, items]) => (
          <div key={type} className="space-y-3">
            <h4 className="text-md font-semibold text-white capitalize flex items-center">
              {getClothingIcon(type as ClothingItem['type'])} {type}
            </h4>
            
            <div className="grid grid-cols-3 gap-3">
              {items.map((item) => {
                const id = `${item.type}_${item.size}`;
                const isSelected = selectedClothing.some((c) => c.id === id);
                
                return (
                  <button
                    key={id}
                    onClick={() => toggleClothing(item)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-600/20 text-white'
                        : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{getClothingIcon(item.type)}</div>
                      <div className="font-medium text-sm">{item.name}</div>
                      <div className="text-xs text-gray-400">Size {item.size}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Instructions */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h4 className="text-sm font-medium text-gray-300 mb-2">Instructions:</h4>
        <ul className="text-sm text-gray-400 space-y-1">
          <li>• Click on clothing items to try them on</li>
          <li>• Only one size per clothing type can be selected</li>
          <li>• Models are placeholder - replace with actual GLTF files</li>
          <li>• Clothing automatically scales based on body measurements</li>
        </ul>
      </div>
    </div>
  );
};

function getClothingIcon(type: ClothingItem['type']): string {
  switch (type) {
    case 'tshirt':
      return '👕';
    case 'hoodie':
      return '🧥';
    case 'pants':
      return '👖';
    case 'suit':
      return '🤵';
    default:
      return '👔';
  }
}