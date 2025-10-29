# Style Guide

## Design Philosophy
Modern, minimal, unique. The site should feel sophisticated and technical without being overwhelming. Lots of negative space, subtle animations, and a focus on the 3D glass marble aesthetic inspired by a light mint/seafoam green glass marble.

**Note**: No emojis should be used in the UI. Use symbols, unicode characters, or text instead for a cleaner, more professional aesthetic.

## Color Palette

### Light Mode (Default)
- **Background**: `#f8fafc` - Very light blue-gray
- **Surface**: `#ffffff` - Pure white
- **Text Primary**: `#0f172a` - Very dark blue
- **Text Secondary**: `#475569` - Medium gray-blue
- **Accent**: `#9dcdb4` - Soft mint/seafoam (for UI elements like buttons)
- **Glass Tint**: `#f5fdf9` - Nearly transparent with hint of mint (orb color)
- **Glass Hover**: `#f0f9f5` - Slightly more visible mint on hover
- **Glow Effect**: `#d4f0e3` - Subtle mint glow

### Dark Mode
- **Background**: `#0a0e12` - Deep dark blue-black
- **Surface**: `#141a21` - Slightly lighter surface
- **Text Primary**: `#e8eef5` - Off-white
- **Text Secondary**: `#94a3b8` - Muted blue-gray
- **Accent**: `#9dcdb4` - Soft mint/seafoam (for UI elements)
- **Glass Tint**: `#f5fdf9` - Nearly transparent with hint of mint
- **Glass Hover**: `#f0f9f5` - Slightly more visible mint on hover
- **Glow Effect**: `#d4f0e3` - Subtle mint glow

### Utility Colors
- **Success**: `#22c55e`
- **Warning**: `#f59e0b`
- **Error**: `#ef4444`
- **Info**: `#3b82f6`

## Typography

### Font Families
- **Headings**: `'Playfair Display', serif` - Elegant serif for impact
- **Body**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif` - Clean, readable sans-serif
- **Code**: `'Fira Code', 'Consolas', monospace` - For any code snippets

### Font Sizes
- **Hero**: `3.5rem` (56px) - Large landing titles
- **H1**: `2.5rem` (40px)
- **H2**: `2rem` (32px)
- **H3**: `1.5rem` (24px)
- **Body**: `1rem` (16px)
- **Small**: `0.875rem` (14px)
- **Tiny**: `0.75rem` (12px)

### Font Weights
- **Light**: 300
- **Regular**: 400
- **Medium**: 500
- **Semi-bold**: 600
- **Bold**: 700

## Spacing System
Based on 8px grid system:
- **xs**: `0.25rem` (4px)
- **sm**: `0.5rem` (8px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)
- **2xl**: `3rem` (48px)
- **3xl**: `4rem` (64px)
- **4xl**: `6rem` (96px)

## 3D Material Properties

### Glass Orbs
The orbs should appear almost completely transparent with just a very subtle seafoam green tint - think of clear glass with the faintest hint of color.

- **Color**: Nearly clear with subtle mint tint (`#f5fdf9` - almost white)
- **Transparency**: Full transmission (1.0) for realistic glass
- **Opacity**: 0.95
- **Roughness**: 0.05 (extremely smooth/glossy)
- **Metalness**: 0 (non-metallic)
- **Index of Refraction (IOR)**: 1.45 (realistic glass)
- **Transmission**: 1 (full transmission for realistic glass)
- **Thickness**: 0.2 (thin glass for maximum transparency)
- **Chromatic Aberration**: 0.01 (very subtle color separation effect)
- **Samples**: 16 (quality of transmission)
- **Resolution**: 256 (transmission texture resolution)

### Hover/Active State
- **Color**: Very light mint (`#f0f9f5` - still nearly transparent)
- **Emission**: Subtle seafoam glow (`#d4f0e3`)
- **Emission Intensity**: 0 (default) → 0.15 (hover)
- **Scale**: 1.0 (default) → 1.15 (hover) with smooth lerp

## Lighting Setup

### Ambient Light
- **Intensity**: 0.3 (dark mode) / 0.5 (light mode)
- **Color**: White `#ffffff`

### Point Lights (for orb illumination)
- **Count**: 2-3 strategic lights
- **Intensity**: 1.0
- **Color**: Warm white `#fff9f0`
- **Distance**: 10 units
- **Decay**: 2 (realistic falloff)

### Environment Map
- HDRI environment map for reflections (consider using drei's Environment component)
- Subtle preset like "studio" or "city"

## Animation Guidelines

### Timing
- **Fast**: 200ms - UI micro-interactions
- **Medium**: 400ms - Hover states, transitions
- **Slow**: 800ms - Page transitions
- **Organic**: Use easing functions like `cubic-bezier(0.4, 0, 0.2, 1)`

### 3D Animations
- **Orbit Speed**: Very slow (0.3 - 0.5 rotations per minute)
- **Hover Response**: 300ms smooth transition
- **Click Feedback**: Quick pulse (150ms)

### Framer Motion Variants
Use consistent naming:
- `initial` - Starting state
- `animate` - End state
- `exit` - Exit state
- `hover` - Hover state
- `tap` - Click/tap state

## Layout

### Container Widths
- **Max Width**: `1280px`
- **Content Width**: `960px`
- **Narrow Content**: `720px`

### Breakpoints
- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

## Accessibility

- Maintain WCAG AA contrast ratios (4.5:1 for body text)
- Provide keyboard navigation for orb selection
- Include aria-labels for 3D elements
- Respect `prefers-reduced-motion` for users sensitive to animation
- Ensure focus states are visible

## Component Patterns

### Button Styling
- Rounded corners: `0.5rem`
- Padding: `0.75rem 1.5rem`
- Hover: Slight scale (1.02) and shadow
- Focus: Outline with accent color

### Card Styling
- Background: Surface color with subtle shadow
- Border radius: `1rem`
- Padding: `2rem`
- Hover: Lift effect with shadow

## Code Style

### React Components
- Use functional components with hooks
- TypeScript interfaces for props
- Descriptive component and prop names
- Extract reusable logic to custom hooks

### File Naming
- Components: PascalCase (e.g., `GlassOrb.tsx`)
- Hooks: camelCase with "use" prefix (e.g., `useTheme.ts`)
- Utils: camelCase (e.g., `formatDate.ts`)
- Styles: Match component name (e.g., `GlassOrb.module.css`)
