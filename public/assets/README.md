# Assets Documentation

This folder contains 3D models and assets for the Human Dresser application.

## Structure

```
assets/
├── models/           # Human base models
│   └── human_base.glb    # Main low-poly human model (placeholder)
├── clothing/         # Clothing items
│   ├── tshirt_s.glb     # T-shirt small size
│   ├── tshirt_m.glb     # T-shirt medium size
│   ├── tshirt_l.glb     # T-shirt large size
│   ├── hoodie_s.glb     # Hoodie small size
│   ├── hoodie_m.glb     # Hoodie medium size
│   ├── hoodie_l.glb     # Hoodie large size
│   ├── pants_s.glb      # Pants small size
│   ├── pants_m.glb      # Pants medium size
│   ├── pants_l.glb      # Pants large size
│   ├── suit_s.glb       # Suit small size
│   ├── suit_m.glb       # Suit medium size
│   └── suit_l.glb       # Suit large size
└── accessories/      # Cosplay/Kigurumi accessories
    ├── masks/
    │   ├── cat_mask.glb
    │   └── fox_mask.glb
    ├── wigs/
    │   ├── long_hair.glb
    │   └── short_hair.glb
    ├── corsets/
    │   └── basic_corset.glb
    └── padding/
        ├── chest_padding.glb
        └── hip_padding.glb
```

## Placeholder Models

**IMPORTANT**: All models listed above are placeholders. You need to replace them with actual GLTF/GLB files.

### Recommended Model Specifications:

- **Format**: GLTF 2.0 or GLB
- **Poly count**: Low-poly (under 10K triangles for base model)
- **Textures**: PBR materials preferred
- **Scale**: Metric units (human ~1.7m tall)
- **Rigging**: Optional but recommended for clothing

### Base Human Model Requirements:

- Gender-neutral base model
- Clean topology suitable for morphing/scaling
- Standard proportions for clothing fitting
- Proper UV mapping

### Clothing Model Requirements:

- Models should be slightly larger than base human to avoid intersection
- Include morph targets or scaling points for size variations
- Consistent naming convention: `{item}_{size}.glb`

### Accessory Requirements:

- Modular design for easy attachment/detachment
- Compatible scale with base human model
- Consider physics constraints for realistic placement

## Usage in Application

Models are loaded dynamically based on user selection:

- Base model is loaded on application start
- Clothing items loaded on demand when selected
- Accessories applied as overlays with optional body modifications

## Model Sources

You can obtain models from:

- **Blender**: Create custom low-poly models
- **Sketchfab**: Free CC-licensed models
- **Mixamo**: Adobe's character models
- **Free3D**: Various free 3D models
- **CGTrader**: Professional models (paid)

Remember to respect licensing terms and attribution requirements.
