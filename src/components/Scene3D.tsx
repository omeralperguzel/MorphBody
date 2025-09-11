import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import { HumanModel } from './HumanModel';
import { ClothingModel } from './ClothingModel';
import { AccessoryModel } from './AccessoryModel';
import type { BasicMeasurements, DetailedMeasurements, ClothingItem, Accessory } from '../types';

interface Scene3DProps {
  measurements: BasicMeasurements | DetailedMeasurements;
  selectedClothing: ClothingItem[];
  selectedAccessories: Accessory[];
  measurementMode: 'basic' | 'detailed';
}

export const Scene3D: React.FC<Scene3DProps> = ({
  measurements,
  selectedClothing,
  selectedAccessories,
  measurementMode,
}) => {
  const controlsRef = useRef<any>(null);

  return (
    <div className="w-full h-full bg-gray-900 rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'linear-gradient(to bottom, #1a1a2e, #16213e)' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[5, 10, 5]}
          intensity={1}
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          castShadow
        />
        <pointLight position={[-5, 5, 5]} intensity={0.3} />

        {/* Environment */}
        <Environment preset="studio" />

        {/* Controls */}
        <OrbitControls
          ref={controlsRef}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          minDistance={2}
          maxDistance={10}
          autoRotate={false}
          autoRotateSpeed={0.5}
        />

        {/* Models */}
        <Suspense fallback={<LoadingIndicator />}>
          <Center>
            {/* Human Base Model */}
            <HumanModel
              measurements={measurements}
              measurementMode={measurementMode}
            />
            
            {/* Clothing Items */}
            {selectedClothing.map((item) => (
              <ClothingModel
                key={item.id}
                item={item}
                measurements={measurements}
              />
            ))}
            
            {/* Accessories */}
            {selectedAccessories.map((accessory) => (
              <AccessoryModel
                key={accessory.id}
                accessory={accessory}
                measurements={measurements}
              />
            ))}
          </Center>
        </Suspense>

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <shadowMaterial opacity={0.2} />
        </mesh>
      </Canvas>
    </div>
  );
};

const LoadingIndicator: React.FC = () => {
  return (
    <mesh>
      <boxGeometry args={[1, 2, 0.5]} />
      <meshStandardMaterial color="#646cff" opacity={0.5} transparent />
    </mesh>
  );
};