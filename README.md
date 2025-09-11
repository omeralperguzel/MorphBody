# Human Dresser 3D

A modern web application for customizing 3D human models with measurements, clothing, and cosplay accessories. Built with React, Three.js, and Tailwind CSS.

![Human Dresser 3D](https://img.shields.io/badge/React-18.0+-blue?style=flat-square&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-Latest-green?style=flat-square&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.0+-06B6D4?style=flat-square&logo=tailwindcss)

## ✨ Features

### 🔧 Measurement System

- **Basic Mode**: Simple controls for height, weight, and gender
- **Detailed Mode**: Comprehensive body measurements including:
  - Head and neck circumference
  - Chest, waist, and hip measurements
  - Arm and leg dimensions
  - Hand and foot measurements

### 👕 Clothing System

- Virtual try-on for various clothing types:
  - T-shirts, hoodies, pants, suits
  - Size selection (S/M/L) with automatic scaling
  - Real-time clothing switching

### 🎭 Cosplay & Kigurumi Mode

- **Accessories**: Masks, wigs, corsets, and padding
- **Body Modifications**: Accessories that alter body proportions
- **Mix & Match**: Create unique combinations

### 🎮 3D Experience

- **Interactive Controls**: Rotate, zoom, and pan around the model
- **Real-time Updates**: See changes instantly as you adjust measurements
- **Responsive Design**: Works on desktop and tablet devices

## 🚀 Quick Start

### Prerequisites

- Node.js 16+
- npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start development server**

   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── Scene3D.tsx      # Main 3D scene
│   ├── HumanModel.tsx   # Human model renderer
│   ├── ClothingModel.tsx # Clothing system
│   ├── AccessoryModel.tsx # Accessory system
│   ├── TabNavigation.tsx # Tab interface
│   ├── MeasurementsTab.tsx # Measurement controls
│   ├── ClothingTab.tsx   # Clothing selection
│   └── CosplayTab.tsx    # Cosplay accessories
├── hooks/               # Custom React hooks
│   └── useAppState.ts   # Main application state
├── types/               # TypeScript definitions
│   └── index.ts         # Type definitions
└── App.tsx              # Main application component

public/assets/           # 3D Model assets
├── models/              # Human base models
├── clothing/            # Clothing 3D models
└── accessories/         # Accessory 3D models
```

## 🎨 Usage Guide

### 1. Measurements Tab

- Switch between Basic and Detailed modes
- Use sliders or numeric inputs to adjust measurements
- Changes reflect in real-time on the 3D model

### 2. Clothing Tab

- Select clothing items by category
- Choose size (S/M/L) for each item
- Only one size per clothing type can be active
- Click "Remove All" to clear all clothing

### 3. Cosplay Mode Tab

- Mix and match accessories
- Some items modify body proportions (corsets, padding)
- Only one mask and wig can be active at a time
- Multiple padding items can be combined

## 🔧 Customization

### Adding New Clothing Items

1. Add GLTF/GLB models to `public/assets/clothing/`
2. Update the `availableClothing` array in `ClothingTab.tsx`
3. Follow naming convention: `{type}_{size}.glb`

### Adding New Accessories

1. Add GLTF/GLB models to `public/assets/accessories/`
2. Update the `availableAccessories` array in `CosplayTab.tsx`
3. Configure body modifications if needed

### Replacing the Human Model

1. Replace placeholder geometry in `HumanModel.tsx`
2. Use `useGLTF` hook to load your model:
   ```tsx
   const { scene } = useGLTF("/assets/models/your_model.glb");
   ```
3. Adjust scaling logic in `calculateScale` function

## 📦 Asset Requirements

### Human Base Model

- **Format**: GLTF 2.0 (.glb preferred)
- **Poly Count**: Under 10K triangles for performance
- **Scale**: Metric units (approximately 1.7m tall)
- **Textures**: PBR materials recommended

### Clothing Models

- **Format**: GLTF 2.0 (.glb)
- **Sizing**: Slightly larger than base model to avoid clipping
- **Variations**: Separate files for S/M/L sizes
- **Textures**: Consistent material workflow

### Accessories

- **Format**: GLTF 2.0 (.glb)
- **Scale**: Compatible with base human model
- **Positioning**: Centered for automatic placement

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### Tech Stack

- **Frontend**: React 18 + TypeScript
- **3D**: Three.js + React Three Fiber + Drei
- **Styling**: Tailwind CSS
- **Build**: Vite
- **State**: Custom hooks with React state

## 🎯 Next Steps

**IMPORTANT**: This application currently uses placeholder 3D models (simple geometric shapes).

To make it fully functional:

1. **Replace placeholder models** with actual GLTF/GLB files in the `public/assets/` folders
2. **Update model loading** in `HumanModel.tsx`, `ClothingModel.tsx`, and `AccessoryModel.tsx`
3. **Adjust scaling calculations** based on your specific models
4. **Fine-tune measurements** to match your model's proportions

## 📄 License

This project is licensed under the MIT License.
