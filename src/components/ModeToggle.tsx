import React from 'react';

interface ModeToggleProps {
  mode: '3d' | '2d';
  onModeChange: (mode: '3d' | '2d') => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-600/30 p-2 flex space-x-2">
        <button
          onClick={() => onModeChange('3d')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === '3d'
              ? 'bg-blue-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <span className="flex items-center space-x-2">
            <span className="text-lg">🎯</span>
            <span>3D Mode</span>
          </span>
        </button>
        <button
          onClick={() => onModeChange('2d')}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
            mode === '2d'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
          }`}
        >
          <span className="flex items-center space-x-2">
            <span className="text-lg">📐</span>
            <span>2D Mode</span>
          </span>
        </button>
      </div>
    </div>
  );
};