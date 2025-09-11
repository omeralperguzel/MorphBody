import { Scene3D } from './components/Scene3D';
import { TabNavigation } from './components/TabNavigation';
import { MeasurementsTab } from './components/MeasurementsTab';
import { ClothingTab } from './components/ClothingTab';
import { CosplayTab } from './components/CosplayTab';
import { useAppState } from './hooks/useAppState';
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
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white flex items-center">
            <span className="mr-3">👤</span>
            Human Dresser 3D
          </h1>
          <div className="text-sm text-gray-400">
            3D Human Model Customization Tool
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-120px)]">
          {/* 3D Scene */}
          <div className="lg:col-span-2">
            <Scene3D
              measurements={measurements}
              selectedClothing={selectedClothing}
              selectedAccessories={selectedAccessories}
              measurementMode={measurementMode}
            />
          </div>

          {/* Controls Panel */}
          <div className="bg-gray-800 rounded-lg p-6 overflow-y-auto">
            {/* Tab Navigation */}
            <div className="mb-6">
              <TabNavigation
                activeTab={activeTab}
                onTabChange={handleTabChange}
              />
            </div>

            {/* Tab Content */}
            <div className="h-full">
              {renderActiveTab()}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 px-6 py-4 mt-auto">
        <div className="max-w-7xl mx-auto text-center text-sm text-gray-400">
          <p>
            Built with React, Three.js, and Tailwind CSS • 
            3D models are placeholders - replace with actual GLTF/GLB files
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
