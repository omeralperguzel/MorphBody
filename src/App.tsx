import { Scene3D } from './components/Scene3D';
import type { Scene3DRef } from './components/Scene3D';
import { TabNavigation } from './components/TabNavigation';
import { MeasurementsTab } from './components/MeasurementsTab';
import { ClothingTab } from './components/ClothingTab';
import { CosplayTab } from './components/CosplayTab';
import { useAppState } from './hooks/useAppState';
import { useState, useRef } from 'react';
import './App.css';

function App() {
  const {
    activeTab,
    measurementMode,
    measurements,
    selectedClothing,
    selectedAccessories,
    handleTabChange,
    handleModeChange,
    handleMeasurementsChange,
    handleClothingChange,
    handleAccessoriesChange,
  } = useAppState();

  const [isPanelOpen, setIsPanelOpen] = useState(true);
  const sceneRef = useRef<Scene3DRef>(null);

  const handleResetCamera = () => {
    sceneRef.current?.resetCamera();
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'measurements':
        return (
          <MeasurementsTab
            measurements={measurements}
            measurementMode={measurementMode}
            onMeasurementsChange={handleMeasurementsChange}
            onModeChange={handleModeChange}
          />
        );
      case 'clothing':
        return (
          <ClothingTab
            selectedClothing={selectedClothing}
            onClothingChange={handleClothingChange}
          />
        );
      case 'cosplay':
        return (
          <CosplayTab
            selectedAccessories={selectedAccessories}
            onAccessoriesChange={handleAccessoriesChange}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="h-screen w-screen bg-slate-900 text-white relative overflow-hidden">
      {/* Full-Screen 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <Scene3D
          ref={sceneRef}
          measurements={measurements}
          selectedClothing={selectedClothing}
          selectedAccessories={selectedAccessories}
          measurementMode={measurementMode}
        />
      </div>

      {/* Mobile Toggle Button - Aligned with 20px padding */}
      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className="lg:hidden fixed z-50 bg-gray-800/90 backdrop-blur-sm text-white p-3 rounded-xl shadow-lg border border-gray-700/50 hover:bg-gray-700/90 transition-all duration-200"
        style={{
          top: '20px',
          left: '20px'
        }}
        aria-label="Toggle settings panel"
      >
        {isPanelOpen ? (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {/* Left Settings Panel - Almost Full Height with 20px padding */}
      <div
        className={`fixed bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-600/30 z-40 transition-transform duration-300 ease-out ${
          isPanelOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        style={{
          left: '20px',
          top: '20px',
          bottom: '20px',
          width: '320px',
          maxWidth: 'calc(100vw - 40px)'
        }}
      >
        <div className="h-full flex flex-col p-6 overflow-hidden">
          {/* Header */}
          <div className="flex-shrink-0 mb-6">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-white flex items-center">
                <span className="mr-3 text-2xl">👤</span>
                MorphBody 3D
              </h1>
              <button
                onClick={() => setIsPanelOpen(false)}
                className="lg:hidden text-gray-400 hover:text-white p-1 rounded-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-2">Customize your 3D human model</p>
          </div>

          {/* Tab Navigation */}
          <div className="flex-shrink-0 mb-6">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Tab Content - Scrollable */}
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="space-y-1">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>

      {/* Top-Right Orbit Controls Panel - Dynamically positioned with 20px padding */}
      <div 
        className="fixed bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-600/30 p-4 z-40 transition-all duration-300"
        style={{
          top: '20px',
          right: '20px',
          maxWidth: 'calc(100vw - 40px)', // Ensure it doesn't exceed viewport with 20px padding on both sides
        }}
      >
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">Camera Controls</h3>
          <div className="space-y-2 text-xs text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span>Left Click: Rotate</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
              <span>Right Click: Pan</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
              <span>Scroll: Zoom</span>
            </div>
          </div>
          <div className="border-t border-gray-600 pt-3">
            <button
              onClick={handleResetCamera}
              className="w-full px-3 py-2 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset View
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isPanelOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsPanelOpen(false)}
        />
      )}
    </div>
  );
}

export default App;
