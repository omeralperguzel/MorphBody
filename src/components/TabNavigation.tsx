import React from 'react';
import type { Tab } from '../types';

interface TabNavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({ activeTab, onTabChange }) => {
  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'measurements', label: 'Measurements', icon: '📏' },
    { id: 'clothing', label: 'Clothing', icon: '👕' },
    { id: 'cosplay', label: 'Cosplay Mode', icon: '🎭' },
  ];

  return (
    <div className="flex flex-col space-y-2">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 text-left ${
            activeTab === tab.id
              ? 'bg-blue-600 text-white shadow-lg transform scale-105'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/70 hover:scale-105'
          }`}
        >
          <span className="text-xl">{tab.icon}</span>
          <span className="font-medium">{tab.label}</span>
        </button>
      ))}
    </div>
  );
};