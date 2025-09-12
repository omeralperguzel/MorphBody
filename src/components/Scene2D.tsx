import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { BasicMeasurements, DetailedMeasurements } from '../types';

type ViewType = 'front' | 'right' | 'left' | 'back';

interface Scene2DProps {
  measurements: BasicMeasurements | DetailedMeasurements;
  measurementMode: 'basic' | 'detailed';
}

export const Scene2D: React.FC<Scene2DProps> = ({ measurements, measurementMode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentView, setCurrentView] = useState<ViewType>('front');
  const [zoom, setZoom] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastMousePos, setLastMousePos] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Convert measurements to 2D parameters (same as HumanModel)
  const get2DParameters = useCallback(() => {
    const baselines = {
      male: {
        height: 175, weight: 70, headCircumference: 58, neckCircumference: 38,
        chestCircumference: 100, waistCircumference: 85, hipCircumference: 95,
        armLength: 63, wristCircumference: 17, palmLength: 19, fingerLength: 8,
        legLength: 85, thighCircumference: 58, ankleCircumference: 24, toeLength: 26,
        shoulderWidth: 1.2, hipWidth: 0.9, chestDepth: 0.8, waistTaper: 1.0,
      },
      female: {
        height: 165, weight: 60, headCircumference: 56, neckCircumference: 34,
        chestCircumference: 90, waistCircumference: 70, hipCircumference: 100,
        armLength: 58, wristCircumference: 15, palmLength: 17, fingerLength: 7.5,
        legLength: 78, thighCircumference: 55, ankleCircumference: 22, toeLength: 24,
        shoulderWidth: 0.9, hipWidth: 1.2, chestDepth: 1.3, waistTaper: 1.4,
      },
      other: {
        height: 170, weight: 65, headCircumference: 57, neckCircumference: 36,
        chestCircumference: 95, waistCircumference: 77, hipCircumference: 97,
        armLength: 60, wristCircumference: 16, palmLength: 18, fingerLength: 7.8,
        legLength: 81, thighCircumference: 56, ankleCircumference: 23, toeLength: 25,
        shoulderWidth: 1.05, hipWidth: 1.05, chestDepth: 1.05, waistTaper: 1.2,
      }
    };

    const baseline = baselines[measurements.gender];
    const detailed = measurements as DetailedMeasurements;

    return {
      height: measurements.height / baseline.height,
      weight: measurements.weight / baseline.weight,
      gender: measurements.gender,
      shoulderWidth: baseline.shoulderWidth,
      hipWidth: baseline.hipWidth,
      chestDepth: baseline.chestDepth,
      waistTaper: baseline.waistTaper,
      chestCircumference: ((detailed.chestCircumference || baseline.chestCircumference) / baseline.chestCircumference),
      waistCircumference: ((detailed.waistCircumference || baseline.waistCircumference) / baseline.waistCircumference),
      hipCircumference: ((detailed.hipCircumference || baseline.hipCircumference) / baseline.hipCircumference),
      armLength: ((detailed.armLength || baseline.armLength) / baseline.armLength),
      legLength: ((detailed.legLength || baseline.legLength) / baseline.legLength),
    };
  }, [measurements, measurementMode]);

  // Draw grid background
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { width, height } = dimensions;
    ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
    ctx.lineWidth = 1;

    // Calculate grid size based on zoom
    const baseGridSize = 20;
    const gridSize = baseGridSize * zoom;
    
    // Calculate offset for centered panning
    const offsetX = (panOffset.x % gridSize + gridSize) % gridSize;
    const offsetY = (panOffset.y % gridSize + gridSize) % gridSize;

    // Draw vertical lines
    for (let x = offsetX; x < width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Draw horizontal lines
    for (let y = offsetY; y < height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Draw thicker lines every 5 grid units
    ctx.strokeStyle = 'rgba(150, 150, 150, 0.5)';
    ctx.lineWidth = 2;
    
    const majorGridSize = gridSize * 5;
    const majorOffsetX = (panOffset.x % majorGridSize + majorGridSize) % majorGridSize;
    const majorOffsetY = (panOffset.y % majorGridSize + majorGridSize) % majorGridSize;

    for (let x = majorOffsetX; x < width; x += majorGridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    for (let y = majorOffsetY; y < height; y += majorGridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }, [zoom, panOffset, dimensions]);

  // Draw 2D silhouette
  const drawSilhouette = useCallback((ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const { width, height } = dimensions;
    const params = get2DParameters();
    
    // Calculate base dimensions
    const baseHeight = 300 * zoom * params.height;
    const baseWidth = baseHeight * 0.25; // Body width relative to height
    
    // Center the figure
    const centerX = width / 2 + panOffset.x;
    const centerY = height / 2 + panOffset.y;
    const figureY = centerY - baseHeight / 2;

    ctx.fillStyle = 'rgba(100, 150, 255, 0.8)';
    ctx.strokeStyle = 'rgba(80, 120, 200, 1.0)';
    ctx.lineWidth = 2;

    // Draw silhouette based on current view and gender
    drawSilhouetteForView(ctx, currentView, params, centerX, figureY, baseWidth, baseHeight);
  }, [currentView, get2DParameters, zoom, panOffset, dimensions]);

  // Draw silhouette for specific view
  const drawSilhouetteForView = (
    ctx: CanvasRenderingContext2D,
    view: ViewType,
    params: any,
    centerX: number,
    figureY: number,
    baseWidth: number,
    baseHeight: number
  ) => {
    ctx.beginPath();

    switch (view) {
      case 'front':
        drawFrontSilhouette(ctx, params, centerX, figureY, baseWidth, baseHeight);
        break;
      case 'right':
        drawSideSilhouette(ctx, params, centerX, figureY, baseWidth, baseHeight, 'right');
        break;
      case 'left':
        drawSideSilhouette(ctx, params, centerX, figureY, baseWidth, baseHeight, 'left');
        break;
      case 'back':
        drawBackSilhouette(ctx, params, centerX, figureY, baseWidth, baseHeight);
        break;
    }

    ctx.fill();
    ctx.stroke();
  };

  // Draw front view silhouette
  const drawFrontSilhouette = (ctx: CanvasRenderingContext2D, params: any, centerX: number, figureY: number, baseWidth: number, baseHeight: number) => {
    const headRadius = baseWidth * 0.15;
    const neckWidth = baseWidth * 0.08;
    const shoulderWidth = baseWidth * params.shoulderWidth * params.chestCircumference * 0.6;
    const chestWidth = baseWidth * params.chestCircumference * 0.5;
    const waistWidth = baseWidth * params.waistCircumference * params.waistTaper * 0.45;
    const hipWidth = baseWidth * params.hipCircumference * params.hipWidth * 0.6;
    const legWidth = baseWidth * 0.3;

    const headY = figureY + baseHeight * 0.05;
    const neckY = figureY + baseHeight * 0.12;
    const shoulderY = figureY + baseHeight * 0.18;
    const chestY = figureY + baseHeight * 0.35;
    const waistY = figureY + baseHeight * 0.5;
    const hipY = figureY + baseHeight * 0.65;
    const legEndY = figureY + baseHeight * 0.95;

    // Head (circle)
    ctx.arc(centerX, headY, headRadius, 0, Math.PI * 2);
    ctx.moveTo(centerX + headRadius, headY);

    // Right side of body
    ctx.lineTo(centerX + neckWidth, neckY);
    ctx.lineTo(centerX + shoulderWidth, shoulderY);
    
    // Female breast curve
    if (params.gender === 'female') {
      const breastSize = params.chestCircumference * params.chestDepth * 0.15;
      ctx.quadraticCurveTo(centerX + chestWidth + breastSize, chestY - baseHeight * 0.05, centerX + chestWidth, chestY);
    } else {
      ctx.lineTo(centerX + chestWidth, chestY);
    }
    
    ctx.lineTo(centerX + waistWidth, waistY);
    ctx.lineTo(centerX + hipWidth, hipY);
    ctx.lineTo(centerX + legWidth, hipY);
    ctx.lineTo(centerX + legWidth, legEndY);

    // Bottom
    ctx.lineTo(centerX - legWidth, legEndY);

    // Left side of body (mirror)
    ctx.lineTo(centerX - legWidth, hipY);
    ctx.lineTo(centerX - hipWidth, hipY);
    ctx.lineTo(centerX - waistWidth, waistY);
    
    if (params.gender === 'female') {
      const breastSize = params.chestCircumference * params.chestDepth * 0.15;
      ctx.lineTo(centerX - chestWidth, chestY);
      ctx.quadraticCurveTo(centerX - chestWidth - breastSize, chestY - baseHeight * 0.05, centerX - chestWidth, chestY - baseHeight * 0.1);
    } else {
      ctx.lineTo(centerX - chestWidth, chestY);
    }
    
    ctx.lineTo(centerX - shoulderWidth, shoulderY);
    ctx.lineTo(centerX - neckWidth, neckY);

    ctx.closePath();
  };

  // Draw side view silhouette
  const drawSideSilhouette = (ctx: CanvasRenderingContext2D, params: any, centerX: number, figureY: number, baseWidth: number, baseHeight: number, side: 'left' | 'right') => {
    const headRadius = baseWidth * 0.15;
    const chestDepth = baseWidth * params.chestDepth * 0.4;
    const waistDepth = chestDepth * 0.7;
    const hipDepth = baseWidth * params.hipWidth * 0.35;
    
    const headY = figureY + baseHeight * 0.05;
    const neckY = figureY + baseHeight * 0.12;
    const shoulderY = figureY + baseHeight * 0.18;
    const chestY = figureY + baseHeight * 0.35;
    const waistY = figureY + baseHeight * 0.5;
    const hipY = figureY + baseHeight * 0.65;
    const legEndY = figureY + baseHeight * 0.95;

    // Head profile
    ctx.arc(centerX, headY, headRadius, 0, Math.PI * 2);
    ctx.moveTo(centerX + headRadius, headY);

    // Side profile
    const direction = side === 'right' ? 1 : -1;
    
    ctx.lineTo(centerX, neckY);
    ctx.lineTo(centerX + direction * chestDepth * 0.3, shoulderY);
    
    // Breast/chest profile
    if (params.gender === 'female') {
      ctx.quadraticCurveTo(centerX + direction * chestDepth * 1.2, chestY, centerX + direction * chestDepth * 0.8, chestY + baseHeight * 0.1);
    } else {
      ctx.lineTo(centerX + direction * chestDepth, chestY);
    }
    
    ctx.lineTo(centerX + direction * waistDepth, waistY);
    ctx.lineTo(centerX + direction * hipDepth, hipY);
    ctx.lineTo(centerX + direction * hipDepth * 0.5, legEndY);
    ctx.lineTo(centerX - direction * hipDepth * 0.5, legEndY);
    ctx.lineTo(centerX - direction * hipDepth, hipY);
    ctx.lineTo(centerX - direction * waistDepth, waistY);
    
    if (params.gender === 'female') {
      ctx.lineTo(centerX - direction * chestDepth * 0.8, chestY + baseHeight * 0.1);
      ctx.quadraticCurveTo(centerX - direction * chestDepth * 1.2, chestY, centerX - direction * chestDepth * 0.3, shoulderY);
    } else {
      ctx.lineTo(centerX - direction * chestDepth, chestY);
      ctx.lineTo(centerX - direction * chestDepth * 0.3, shoulderY);
    }
    
    ctx.lineTo(centerX, neckY);
    ctx.closePath();
  };

  // Draw back view silhouette (similar to front but flatter)
  const drawBackSilhouette = (ctx: CanvasRenderingContext2D, params: any, centerX: number, figureY: number, baseWidth: number, baseHeight: number) => {
    const headRadius = baseWidth * 0.15;
    const neckWidth = baseWidth * 0.08;
    const shoulderWidth = baseWidth * params.shoulderWidth * params.chestCircumference * 0.6;
    const chestWidth = baseWidth * params.chestCircumference * 0.45; // Slightly narrower than front
    const waistWidth = baseWidth * params.waistCircumference * params.waistTaper * 0.45;
    const hipWidth = baseWidth * params.hipCircumference * params.hipWidth * 0.6;
    const legWidth = baseWidth * 0.3;

    const headY = figureY + baseHeight * 0.05;
    const neckY = figureY + baseHeight * 0.12;
    const shoulderY = figureY + baseHeight * 0.18;
    const chestY = figureY + baseHeight * 0.35;
    const waistY = figureY + baseHeight * 0.5;
    const hipY = figureY + baseHeight * 0.65;
    const legEndY = figureY + baseHeight * 0.95;

    // Head
    ctx.arc(centerX, headY, headRadius, 0, Math.PI * 2);
    ctx.moveTo(centerX + headRadius, headY);

    // Right side
    ctx.lineTo(centerX + neckWidth, neckY);
    ctx.lineTo(centerX + shoulderWidth, shoulderY);
    ctx.lineTo(centerX + chestWidth, chestY);
    ctx.lineTo(centerX + waistWidth, waistY);
    ctx.lineTo(centerX + hipWidth, hipY);
    ctx.lineTo(centerX + legWidth, hipY);
    ctx.lineTo(centerX + legWidth, legEndY);

    // Bottom
    ctx.lineTo(centerX - legWidth, legEndY);

    // Left side (mirror)
    ctx.lineTo(centerX - legWidth, hipY);
    ctx.lineTo(centerX - hipWidth, hipY);
    ctx.lineTo(centerX - waistWidth, waistY);
    ctx.lineTo(centerX - chestWidth, chestY);
    ctx.lineTo(centerX - shoulderWidth, shoulderY);
    ctx.lineTo(centerX - neckWidth, neckY);

    ctx.closePath();
  };

  // Render canvas
  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    drawGrid(ctx, canvas);

    // Draw silhouette
    drawSilhouette(ctx, canvas);
  }, [drawGrid, drawSilhouette]);

  // Handle canvas resize - Use viewport dimensions like Scene3D
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use viewport dimensions for fullscreen behavior like Scene3D
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Only resize if dimensions are valid
    if (width > 0 && height > 0) {
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      
      // Update dimensions state
      setDimensions({ width, height });
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    }
  }, []);

  // Mouse handlers for pan and zoom
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    const deltaX = e.clientX - lastMousePos.x;
    const deltaY = e.clientY - lastMousePos.y;
    
    setPanOffset(prev => ({
      x: prev.x + deltaX,
      y: prev.y + deltaY
    }));
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.2, Math.min(3, prev * zoomFactor)));
  };

  // Effects
  useEffect(() => {
    // Initial resize
    handleResize();
    window.addEventListener('resize', handleResize);
    
    // Force initial resize after component mount
    const timer = setTimeout(() => {
      handleResize();
      render();
    }, 100);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, [handleResize]);

  useEffect(() => {
    render();
  }, [render]);

  // Re-render when canvas is resized
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const handleCanvasResize = () => {
      // Small delay to ensure resize is complete
      setTimeout(() => render(), 50);
    };
    
    window.addEventListener('resize', handleCanvasResize);
    return () => window.removeEventListener('resize', handleCanvasResize);
  }, [render]);

  // Keyboard shortcuts for view navigation
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target !== document.body) return; // Only when not focused on input
      
      switch (e.key.toLowerCase()) {
        case '1':
          setCurrentView('front');
          break;
        case '2':
          setCurrentView('right');
          break;
        case '3':
          setCurrentView('left');
          break;
        case '4':
          setCurrentView('back');
          break;
        case 'r':
          resetView();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Listen for reset event from App.tsx
  useEffect(() => {
    const handleReset = () => {
      resetView();
    };

    window.addEventListener('reset2DView', handleReset);
    return () => window.removeEventListener('reset2DView', handleReset);
  }, []);

  const resetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div 
      className="w-full h-full relative bg-gray-900 overflow-hidden"
      style={{ 
        width: '100vw', 
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 0
      }}
    >
      {/* View Navigation */}
      <div className="absolute top-4 left-4 z-10 bg-gray-800/95 backdrop-blur-md rounded-lg shadow-xl border border-gray-600/30 p-2">
        <div className="flex space-x-1">
          {(['front', 'right', 'left', 'back'] as ViewType[]).map((view) => (
            <button
              key={view}
              onClick={() => setCurrentView(view)}
              className={`px-3 py-1 rounded text-sm font-medium transition-all duration-200 ${
                currentView === view
                  ? 'bg-purple-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
              }`}
            >
              {view.charAt(0).toUpperCase() + view.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        style={{ 
          width: '100%', 
          height: '100%'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />

      {/* Current View Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-gray-800/95 backdrop-blur-md rounded-lg border border-gray-600/30 px-4 py-2">
        <div className="text-sm font-medium text-white">
          <span className="text-gray-400">Current View:</span>
          <span className="ml-2 text-purple-400">{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</span>
          <span className="ml-3 text-gray-400">|</span>
          <span className="ml-3 text-blue-400">{measurements.gender.charAt(0).toUpperCase() + measurements.gender.slice(1)}</span>
        </div>
      </div>
    </div>
  );
};