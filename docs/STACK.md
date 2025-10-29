# Tech Stack

## Core Framework
- **React 19** - UI library with latest features
- **TypeScript** - Type safety and better DX
- **Vite 7** - Fast build tool and dev server

## 3D Graphics
- **Three.js 0.180** - WebGL 3D library
- **@react-three/fiber 9.4** - React renderer for Three.js
- **@react-three/drei 10.7** - Useful helpers and abstractions for R3F
  - OrbitControls for camera manipulation
  - Helper components for materials and geometries

## Animation & Motion
- **Framer Motion 12** - Animation library for page transitions and UI interactions
- Three.js built-in animation for 3D scene animations

## Styling
- CSS Modules / vanilla CSS for component styles
- CSS custom properties (variables) for theming
- Dark/light mode support via CSS variables and React context

## Development Tools
- ESLint (future) - Code linting
- Prettier (future) - Code formatting

## Future Considerations
- React Router - If multi-page routing is needed beyond single-page sections
- Zustand/Context API - Global state management if needed
- GSAP - Advanced animations if Framer Motion proves insufficient
- Vercel/Netlify - Deployment platform

## Why These Choices?

### Vite over Create React App
- Faster dev server with HMR
- Better build performance
- Native ES modules support
- Modern and actively maintained

### React Three Fiber over vanilla Three.js
- Declarative 3D scene composition
- Better integration with React lifecycle
- Cleaner component-based architecture
- Automatic cleanup and memory management

### Framer Motion
- Smooth, performant animations
- Great React integration
- Excellent documentation
- Powerful animation orchestration

### TypeScript
- Catch errors at compile time
- Better IDE support and autocomplete
- Self-documenting code with types
- Safer refactoring
