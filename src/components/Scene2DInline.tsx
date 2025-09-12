import React, { useRef, useEffect, useState, useCallback } from 'react';
import type { BasicMeasurements, DetailedMeasurements } from '../types';

type ViewType = 'front' | 'right' | 'left' | 'back';

interface Scene2DProps {
  measurements: BasicMeasurements | DetailedMeasurements;
  measurementMode: 'basic' | 'detailed';
}

// Inline styles to replace CSS classes
const styles = {
  mainContainer: {
    width: '100%',
    height: '100%',
    position: 'relative' as const,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    overflow: 'hidden' as const,
  },
  fullViewport: {
    width: '100vw',
    height: '100vh',
    position: 'fixed' as const,
    top: 0,
    left: 0,
    zIndex: 0,
    background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    overflow: 'hidden' as const,
  },
  canvas: {
    display: 'block',
    width: '100%',
    height: '100%',
    cursor: 'grab' as const,
  },
  canvasDragging: {
    cursor: 'grabbing' as const,
  },
  topLeftOverlay: {
    position: 'absolute' as const,
    top: '16px',
    left: '24px',
    zIndex: 10,
    pointerEvents: 'auto' as const,
  },
  viewIndicator: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
  },
  indicatorContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  iconContainer: {
    padding: '8px',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    borderRadius: '12px',
    boxShadow: '0 4px 6px rgba(168, 85, 247, 0.25)',
  },
  icon: {
    fontSize: '20px',
  },
  indicatorText: {
    margin: 0,
  },
  indicatorTitle: {
    fontSize: '18px',
    fontWeight: 'bold' as const,
    color: 'white',
    background: 'linear-gradient(135deg, white 0%, #d1d5db 100%)',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '4px',
  },
  indicatorSubtitle: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
    margin: 0,
  },
  rightSideControls: {
    position: 'absolute' as const,
    top: 'calc(50% + 120px)',
    right: '24px',
    transform: 'translateY(-50%)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    pointerEvents: 'auto' as const,
  },
  controlsPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
  },
  controlsTitle: {
    fontSize: '16px',
    fontWeight: '600' as const,
    color: 'white',
    marginBottom: '12px',
    textAlign: 'center' as const,
  },
  viewButtonsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '8px',
    marginBottom: '16px',
  },
  viewButton: {
    padding: '12px 16px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600' as const,
    cursor: 'pointer' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '4px',
    minWidth: '80px',
  },
  activeViewButton: {
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    color: 'white',
    boxShadow: '0 4px 8px rgba(168, 85, 247, 0.25)',
    transform: 'scale(1.05)',
  },
  inactiveViewButton: {
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.7)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  buttonIcon: {
    fontSize: '16px',
  },
  buttonLabel: {
    fontSize: '12px',
  },
  zoomControls: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
  },
  controlButton: {
    padding: '10px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '10px',
    background: 'rgba(255, 255, 255, 0.05)',
    color: 'rgba(255, 255, 255, 0.7)',
    cursor: 'pointer' as const,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomRightOverlay: {
    position: 'absolute' as const,
    bottom: '16px',
    right: '24px',
    zIndex: 10,
    pointerEvents: 'auto' as const,
  },
  statsPanel: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)',
  },
  statsContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '14px',
  },
  statItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statIcon: {
    padding: '6px',
    background: 'linear-gradient(135deg, #a855f7, #ec4899)',
    borderRadius: '8px',
    boxShadow: '0 4px 6px rgba(168, 85, 247, 0.25)',
    fontSize: '14px',
  },
  statText: {
    margin: 0,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '12px',
    margin: 0,
  },
  statValue: {
    color: 'white',
    fontWeight: '600' as const,
    margin: 0,
  },
  divider: {
    width: '1px',
    height: '30px',
    background: 'rgba(255, 255, 255, 0.1)',
  },
  keyboardHints: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
  hint: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  hintKey: {
    padding: '2px 4px',
    background: 'rgba(255, 255, 255, 0.1)',
    borderRadius: '4px',
    fontSize: '10px',
    fontFamily: 'monospace',
  },
};

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
  const drawGrid = useCallback((ctx: CanvasRenderingContext2D) => {
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
  const drawSilhouette = useCallback((ctx: CanvasRenderingContext2D) => {
    const { width, height } = dimensions;
    const params = get2DParameters();
    
    // Calculate base dimensions
    const baseHeight = 300 * zoom * params.height;
    const baseWidth = baseHeight * 0.25; // Body width relative to height
    
    // Center the figure
    const centerX = width / 2 + panOffset.x;
    const centerY = height / 2 + panOffset.y;
    const figureY = centerY - baseHeight / 2;

    ctx.fillStyle = 'rgba(168, 85, 247, 0.8)';
    ctx.strokeStyle = 'rgba(168, 85, 247, 1.0)';
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
      case 'back':
        drawBackSilhouette(ctx, params, centerX, figureY, baseWidth, baseHeight);
        break;
      case 'left':
      case 'right':
        drawSideSilhouette(ctx, params, centerX, figureY, baseWidth, baseHeight, view);
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
      ctx.quadraticCurveTo(centerX + chestWidth * 1.2, chestY - baseHeight * 0.05, centerX + chestWidth, chestY);
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
      ctx.lineTo(centerX - chestWidth, chestY);
      ctx.quadraticCurveTo(centerX - chestWidth * 1.2, chestY - baseHeight * 0.05, centerX - shoulderWidth, shoulderY);
    } else {
      ctx.lineTo(centerX - chestWidth, chestY);
      ctx.lineTo(centerX - shoulderWidth, shoulderY);
    }
    
    ctx.lineTo(centerX - neckWidth, neckY);

    ctx.closePath();
  };

  // Draw side view silhouette
  const drawSideSilhouette = (ctx: CanvasRenderingContext2D, params: any, centerX: number, figureY: number, baseWidth: number, baseHeight: number, side: 'left' | 'right') => {
    const headRadius = baseWidth * 0.15;
    const neckDepth = baseWidth * 0.06;
    const chestDepth = baseWidth * params.chestDepth * 0.5;
    const waistDepth = baseWidth * params.waistCircumference * 0.4;
    const hipDepth = baseWidth * params.hipCircumference * 0.45;
    const legDepth = baseWidth * 0.25;

    const headY = figureY + baseHeight * 0.05;
    const neckY = figureY + baseHeight * 0.12;
    const shoulderY = figureY + baseHeight * 0.18;
    const chestY = figureY + baseHeight * 0.35;
    const waistY = figureY + baseHeight * 0.5;
    const hipY = figureY + baseHeight * 0.65;
    const legEndY = figureY + baseHeight * 0.95;

    const multiplier = side === 'left' ? -1 : 1;

    // Head (circle)
    ctx.arc(centerX, headY, headRadius, 0, Math.PI * 2);
    ctx.moveTo(centerX + headRadius * multiplier, headY);

    // Profile outline
    ctx.lineTo(centerX + neckDepth * multiplier, neckY);
    ctx.lineTo(centerX + chestDepth * multiplier, shoulderY);
    
    // Gender-specific curves
    if (params.gender === 'female') {
      ctx.quadraticCurveTo(centerX + chestDepth * multiplier * 1.3, chestY, centerX + waistDepth * multiplier, waistY);
    } else {
      ctx.lineTo(centerX + chestDepth * multiplier, chestY);
      ctx.lineTo(centerX + waistDepth * multiplier, waistY);
    }
    
    ctx.lineTo(centerX + hipDepth * multiplier, hipY);
    ctx.lineTo(centerX + legDepth * multiplier, hipY);
    ctx.lineTo(centerX + legDepth * multiplier, legEndY);

    // Bottom and back
    ctx.lineTo(centerX - legDepth * multiplier, legEndY);
    ctx.lineTo(centerX - legDepth * multiplier, hipY);
    ctx.lineTo(centerX - hipDepth * multiplier * 0.8, hipY);
    ctx.lineTo(centerX - waistDepth * multiplier * 0.7, waistY);
    ctx.lineTo(centerX - chestDepth * multiplier * 0.6, chestY);
    ctx.lineTo(centerX - chestDepth * multiplier * 0.5, shoulderY);
    ctx.lineTo(centerX - neckDepth * multiplier * 0.5, neckY);

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

    // Head (circle)
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

    // Set canvas size to match container
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Draw grid and silhouette
    drawGrid(ctx);
    drawSilhouette(ctx);
  }, [drawGrid, drawSilhouette, dimensions]);

  // Handle canvas resize - Use viewport dimensions like Scene3D
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Use viewport dimensions for fullscreen behavior like Scene3D
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    // Only resize if dimensions are valid
    if (width > 0 && height > 0) {
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      
      setDimensions({ width, height });
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
      y: prev.y + deltaY,
    }));
    
    setLastMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setZoom(prev => Math.max(0.1, Math.min(5, prev * delta)));
  };

  // Effects
  useEffect(() => {
    // Initial call to set dimensions
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    render();
  }, [render]);

  // Re-render when canvas is resized
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeObserver = new ResizeObserver(() => {
      render();
    });

    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, [render]);

  const resetView = () => {
    setZoom(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(5, prev * 1.2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(0.1, prev / 1.2));
  };

  // View button data
  const viewButtons = [
    { view: 'front' as ViewType, label: 'Front', icon: '👤' },
    { view: 'right' as ViewType, label: 'Right', icon: '👉' },
    { view: 'left' as ViewType, label: 'Left', icon: '👈' },
    { view: 'back' as ViewType, label: 'Back', icon: '🔄' },
  ];

  return (
    <div style={styles.fullViewport}>
      {/* 2D View Indicator - Top Left */}
      <div style={styles.topLeftOverlay}>
        <div style={styles.viewIndicator}>
          <div style={styles.indicatorContent}>
            <div style={styles.iconContainer}>
              <span style={styles.icon}>📐</span>
            </div>
            <div style={styles.indicatorText}>
              <h3 style={styles.indicatorTitle}>2D Blueprint Mode</h3>
              <p style={styles.indicatorSubtitle}>{currentView.charAt(0).toUpperCase() + currentView.slice(1)} View</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side Controls */}
      <div style={styles.rightSideControls}>
        <div style={styles.controlsPanel}>
          <h4 style={styles.controlsTitle}>2D Blueprint Mode</h4>
          <p style={{
            fontSize: '12px',
            color: 'rgba(255, 255, 255, 0.6)',
            margin: '0 0 16px 0',
            textAlign: 'center' as const,
            lineHeight: 1.4,
          }}>
            View technical blueprints from front, back, left, and right angles.
          </p>
          
          {/* View Buttons in 2x2 Grid */}
          <div style={styles.viewButtonsGrid}>
            {viewButtons.map(({ view, label, icon }) => (
              <button
                key={view}
                onClick={() => setCurrentView(view)}
                style={{
                  ...styles.viewButton,
                  ...(currentView === view ? styles.activeViewButton : styles.inactiveViewButton),
                }}
                onMouseEnter={(e) => {
                  if (currentView !== view) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = 'white';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentView !== view) {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }
                }}
              >
                <span style={styles.buttonIcon}>{icon}</span>
                <span style={styles.buttonLabel}>{label}</span>
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div style={styles.zoomControls}>
            <button
              onClick={handleZoomIn}
              style={styles.controlButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              🔍+
            </button>
            <button
              onClick={handleZoomOut}
              style={styles.controlButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              🔍-
            </button>
            <button
              onClick={resetView}
              style={styles.controlButton}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
              }}
            >
              🎯
            </button>
          </div>
        </div>
      </div>

      {/* Stats Panel - Bottom Right */}
      <div style={styles.bottomRightOverlay}>
        <div style={styles.statsPanel}>
          <div style={styles.statsContent}>
            <div style={styles.statItem}>
              <div style={styles.statIcon}>
                <span>📏</span>
              </div>
              <div style={styles.statText}>
                <p style={styles.statLabel}>Current View</p>
                <p style={styles.statValue}>{currentView.charAt(0).toUpperCase() + currentView.slice(1)}</p>
              </div>
            </div>

            <div style={styles.divider} />

            <div style={styles.keyboardHints}>
              <div style={styles.hint}>
                <span style={styles.hintKey}>Drag</span>
                <span>Pan</span>
              </div>
              <div style={styles.hint}>
                <span style={styles.hintKey}>Wheel</span>
                <span>Zoom</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          ...styles.canvas,
          ...(isDragging ? styles.canvasDragging : {}),
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
      />
    </div>
  );
};