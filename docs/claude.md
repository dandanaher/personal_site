# Claude.md - Personal Site Reference Guide

## Project Overview
**Dan Danaher's Personal Website** - A modern portfolio site featuring 3D glass orb navigation with a sophisticated, minimal design inspired by light mint/seafoam green glass marbles.

- **Type**: Single-page application with section-based navigation
- **Author**: Dan Danaher
- **Current Status**: MVP in development
- **Repository**: https://github.com/dandanaher/personal_site

## Tech Stack

### Core
- **React 19.2.0** - Latest React with concurrent features
- **TypeScript 5.9.3** - Strict mode enabled
- **Vite 7.1.12** - Build tool and dev server

### 3D Graphics
- **Three.js 0.180.0** - WebGL 3D library
- **@react-three/fiber 9.4.0** - React renderer for Three.js
- **@react-three/drei 10.7.6** - R3F helper components

### Animation
- **Framer Motion 12.23.24** - Page transitions and UI animations

### Build Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production (runs tsc && vite build)
npm run preview  # Preview production build
```

## Architecture & File Structure

```
src/
├── components/        # Reusable UI components
│   └── ThemeToggle.tsx
├── scenes/           # Three.js 3D scene components
│   ├── GlassOrb.tsx
│   ├── IconBillboard.tsx
│   └── LandingScene.tsx
├── pages/            # Page/section components
│   ├── Me.tsx
│   ├── Library.tsx
│   ├── Projects.tsx
│   └── Thoughts.tsx
├── styles/           # Global styles and CSS modules
├── utils/            # Helper functions and custom hooks
│   └── ThemeContext.tsx
├── App.tsx           # Main application component
└── main.tsx         # Application entry point

public/
└── icons/           # Icon assets for orb billboards
    ├── me_icon.png
    ├── library_icon.png
    ├── projects_icon.png
    └── thoughts_icon.png
```

### Component Organization Principles
- **Components**: Reusable UI elements (buttons, toggles, cards)
- **Scenes**: 3D-specific components using R3F
- **Pages**: Full page/section views
- **Utils**: Hooks, contexts, and helper functions

## Design System

### Color Palette

#### Light Mode (Default)
```css
--bg-primary: #f8fafc        /* Very light blue-gray */
--bg-surface: #ffffff        /* Pure white */
--text-primary: #0f172a      /* Very dark blue */
--text-secondary: #475569    /* Medium gray-blue */
--accent: #9dcdb4            /* Soft mint/seafoam - buttons/UI */
--glass-tint: #f5fdf9        /* Nearly transparent mint - orb base */
--glass-hover: #f0f9f5       /* Slightly more visible mint - orb hover */
--glow: #d4f0e3              /* Subtle mint glow effect */
```

#### Dark Mode
```css
--bg-primary: #0a0e12        /* Deep dark blue-black */
--bg-surface: #141a21        /* Slightly lighter surface */
--text-primary: #e8eef5      /* Off-white */
--text-secondary: #94a3b8    /* Muted blue-gray */
/* Accent and glass colors same as light mode */
```

### Typography
- **Headings**: 'Playfair Display', serif (elegant, impactful)
- **Body**: 'Inter', sans-serif (clean, readable)
- **Code**: 'Fira Code', monospace

**Sizes**: Hero (3.5rem), H1 (2.5rem), H2 (2rem), H3 (1.5rem), Body (1rem), Small (0.875rem)

### Spacing System (8px grid)
- xs: 4px, sm: 8px, md: 16px, lg: 24px, xl: 32px, 2xl: 48px, 3xl: 64px, 4xl: 96px

### Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 3D Implementation Details

### Glass Orb Material (`GlassOrb.tsx`)
Uses `MeshTransmissionMaterial` from drei for realistic glass:

```typescript
<MeshTransmissionMaterial
  transmission={0.95}           // Full transmission for depth
  thickness={0.4}               // Thin glass
  roughness={0.05}              // Extremely smooth/glossy
  ior={1.5}                     // Glass index of refraction
  chromaticAberration={0.025}   // Subtle color separation
  color={hovered ? '#b8e6cf' : '#cceedd'}  // Nearly transparent mint
  emissive={hovered ? '#a8d4bd' : '#000000'}
  emissiveIntensity={hovered ? 0.3 : 0}
  samples={32}                  // High quality rendering
  resolution={1024}             // Transmission texture quality
  transparent={true}
  toneMapped={false}
/>
```

**Key Properties:**
- Nearly transparent with subtle seafoam green tint
- Hover state: slightly more visible mint + subtle glow
- Scale effect: 1.0 → 1.15 on hover (smooth lerp)
- Gentle bobbing animation: `Math.sin(time + angle) * 0.1`

### Icon Billboard System
Camera-facing sprites inside each orb displaying section icons:

- **Implementation**: Plane geometry with `lookAt()` for camera-facing behavior
- **Positioning**: Centered at orb origin (0, 0, 0)
- **Scaling**: 0.8 units (80% of orb diameter)
- **Material**: `meshBasicMaterial` with transparency
- **Asset Requirements**: 512x512 or 1024x1024 PNG with transparency, white/light colored
- **Location**: `/public/icons/` directory

### Lighting Setup
```typescript
// Ambient light
intensity: 0.3 (dark) / 0.5 (light)
color: #ffffff

// Point lights (2-3 strategic)
intensity: 1.0
color: #fff9f0 (warm white)
distance: 10
decay: 2 (realistic falloff)

// Environment map
preset: "studio" or "city" (drei Environment component)
```

### Canvas Configuration
```typescript
<Canvas
  camera={{ position: [0, 2, 10], fov: 50 }}
  gl={{
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  }}
  dpr={[1, 2]}  // Device pixel ratio
>
```

## Navigation & State Management

### Navigation Strategy
- **Landing**: 4 glass orbs in circular orbit (sections: Me, Library, Projects, Thoughts)
- **Interaction**: Click orb → transition to section page
- **Return**: Back button returns to landing scene
- **State**: Simple `useState<Section>` in App.tsx

### Section Types
```typescript
type Section = 'landing' | 'me' | 'library' | 'projects' | 'thoughts'
```

### Page Transitions
Uses Framer Motion `AnimatePresence` with `mode="wait"`:
- Fast: 200ms (micro-interactions)
- Medium: 400ms (hover states, transitions)
- Slow: 800ms (page transitions)
- Easing: `cubic-bezier(0.4, 0, 0.2, 1)`

## Component Patterns & Conventions

### File Naming
- Components: PascalCase (`GlassOrb.tsx`)
- Hooks: camelCase with "use" prefix (`useTheme.ts`)
- Utils: camelCase (`formatDate.ts`)
- Styles: Match component name (`GlassOrb.module.css`)

### React Patterns
- Functional components with hooks only
- TypeScript interfaces for all props
- Descriptive component and prop names
- Extract reusable logic to custom hooks

### TypeScript Configuration
- Strict mode enabled
- noUnusedLocals and noUnusedParameters enforced
- Target: ES2020
- JSX: react-jsx

## Important Development Notes

### Task Completion Philosophy
**Complete implementations fully.** Don't leave partial work or expect users to finish tasks. If there are limitations (e.g., binary file handling), communicate immediately with clear instructions for manual steps.

### UI/UX Rules
- **No emojis in UI** - Use symbols, unicode, or text instead for professional aesthetic
- Respect `prefers-reduced-motion` for animation-sensitive users
- Maintain WCAG AA contrast ratios (4.5:1 for body text)
- Provide keyboard navigation for orb selection
- Include aria-labels for 3D elements

### Performance Considerations
- 4 glass orbs with complex materials may be heavy on some devices
- Consider LOD (level of detail) if performance issues arise
- Simplified materials on mobile if needed
- Optimize texture/environment map resolution as needed
- Test on mobile devices thoroughly

### React 19 Compatibility
- Using latest React 19.2.0
- Watch for deprecation warnings in R3F/drei
- Test with concurrent features

## Current Project Status

### Completed
- Project initialization and structure
- Three.js ecosystem setup
- Glass orb implementation with billboards
- Basic navigation system
- Theme toggle component

### In Progress (MVP)
- Theme system (dark/light mode)
- Landing page 3D scene
- Orb animations and interactivity
- Page sections
- Page transitions

### Next Phases
See [docs/TODO.md](TODO.md) for detailed roadmap:
- Phase 2: Content & Polish (Me/Library/Projects/Thoughts pages)
- Phase 3: Enhancements (performance, accessibility, SEO)
- Future: Advanced 3D effects, easter eggs, blog features

## Key References
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)
- [Drei Components](https://github.com/pmndrs/drei)
- [Style Guide](STYLE_GUIDE.md) - Complete design specifications
- [Stack Documentation](STACK.md) - Technology choices and rationale
- [Development Notes](NOTES.md) - Architecture decisions and challenges

## Common Tasks Quick Reference

### Adding a New Page Section
1. Create component in `src/pages/`
2. Add section type to `Section` union in `App.tsx`
3. Add case to `renderPage()` switch
4. Update navigation handler

### Creating a New 3D Component
1. Create in `src/scenes/`
2. Use R3F hooks (`useFrame`, `useThree`)
3. Wrap textures/assets in `<Suspense>`
4. Follow material property conventions from style guide

### Adding Icons
1. Place PNG files in `/public/icons/`
2. Use 512x512 or 1024x1024 resolution
3. Ensure transparency and light colors
4. Reference with path: `/icons/filename.png`

### Styling Components
1. Use CSS custom properties for theming
2. Respect spacing system (8px grid)
3. Follow typography hierarchy
4. Test in both light and dark modes
