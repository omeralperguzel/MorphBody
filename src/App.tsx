import { Scene3D } from './components/Scene3D';
import { Scene2D } from './components/Scene2D';
import { ModeToggle } from './components/ModeToggle';
import type { Scene3DRef } from './components/Scene3D';
import { TabNavigation } from './components/TabNavigation';
import { MeasurementsTab } from './components/MeasurementsTab';
import { ClothingTab } from './components/ClothingTab';
import { CosplayTab } from './components/CosplayTab';
import { useAppState } from './hooks/useAppState';
import { useState, useRef } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState<'3d' | '2d'>('3d');
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const sceneRef = useRef<Scene3DRef>(null);

  const {
    activeTab,
    measurementMode,
    measurements,
    selectedClothing,
    selectedAccessories,
    setClothing,
    setAccessories,
    handleTabChange,
    handleModeChange,
    handleMeasurementsChange,
  } = useAppState();

  const handleResetCamera = () => {
    if (mode === '3d' && sceneRef.current) {
      sceneRef.current.resetCamera();
    } else if (mode === '2d') {
      // For 2D mode, we'll trigger a custom event that Scene2D can listen to
      window.dispatchEvent(new CustomEvent('reset2DView'));
    }
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
            onClothingChange={setClothing}
          />
        );
      case 'cosplay':
        return (
          <CosplayTab
            selectedAccessories={selectedAccessories}
            onAccessoriesChange={setAccessories}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-screen bg-gray-100 relative overflow-hidden">
      {/* Mode Toggle */}
      <ModeToggle mode={mode} onModeChange={setMode} />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsPanelOpen(true)}
        className="lg:hidden fixed top-20 left-4 bg-gray-800/95 backdrop-blur-md text-white p-3 rounded-xl shadow-xl border border-gray-600/30 z-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Left Settings Panel - Always visible on desktop, slide-in on mobile */}
      <div
        className={`fixed bg-gray-800/95 backdrop-blur-md rounded-xl shadow-2xl border border-gray-600/30 z-40 lg:translate-x-0 transition-transform duration-300 ease-out ${
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
                MorphBody {mode === '3d' ? '3D' : '2D'}
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
            <p className="text-sm text-gray-400 mt-2">
              Customize your {mode === '3d' ? '3D' : '2D'} human model
            </p>
          </div>

          {/* Tab Navigation */}
          <div className="flex-shrink-0 mb-6">
            <TabNavigation
              activeTab={activeTab}
              onTabChange={handleTabChange}
            />
          </div>

          {/* Tab Content - Scrollable */}
          <div className="flex-1 overflow-y-auto pl-2 pr-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
            <div className="space-y-1">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>

      {/* Top-Right Camera Controls Panel - Adapts to current mode */}
      <div 
        className="fixed bg-gray-800/95 backdrop-blur-md rounded-xl shadow-xl border border-gray-600/30 p-4 z-40 transition-all duration-300"
        style={{
          top: '20px',
          right: '20px',
          maxWidth: 'calc(100vw - 40px)',
        }}
      >
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-white">{mode === '3d' ? 'Camera Controls' : 'View Controls'}</h3>
          <div className="space-y-2 text-xs text-gray-300">
            {mode === '3d' ? (
              <>
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
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  <span>Drag: Pan view</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                  <span>Scroll: Zoom</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></div>
                  <span>Keys: 1-4 for views</span>
                </div>
              </>
            )}
          </div>
          <div className="border-t border-gray-600 pt-3">
            <button
              onClick={handleResetCamera}
              className="w-full px-3 py-2 text-xs font-medium bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Reset View {mode === '2d' ? '(R)' : ''}
            </button>
          </div>
        </div>
      </div>

      {/* Main Viewport - Full space utilization */}
      <div 
        className="absolute bg-gray-900 left-0 top-0 right-0 bottom-0 lg:left-[340px] lg:top-2 lg:right-2 lg:bottom-2"
      >
        {mode === '3d' ? (
          <Scene3D
            ref={sceneRef}
            measurements={measurements}
            selectedClothing={selectedClothing}
            selectedAccessories={selectedAccessories}
            measurementMode={measurementMode}
          />
        ) : (
          <Scene2D
            measurements={measurements}
            measurementMode={measurementMode}
          />
        )}
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
