# Development Notes

## Development Principles

**Task Completion Ownership**: When implementing a feature, complete it fully. Don't leave partial implementations or expect the user to finish tasks. If there are limitations (e.g., inability to save binary files), be upfront about them immediately and provide clear, complete instructions for any manual steps required.

## Project Initialization - 2025-10-29

### Initial Setup
- Created React + TypeScript project with Vite
- Installed Three.js ecosystem (@react-three/fiber, @react-three/drei)
- Added Framer Motion for page transitions
- Set up clean folder structure with dedicated folders for components, scenes, pages

### Architecture Decisions

#### Component Organization
- `/components` - Reusable UI components (buttons, theme toggle, etc.)
- `/scenes` - Three.js 3D scene components (GlassOrb, LandingScene, etc.)
- `/pages` - Page/section components (Me, Library, Projects, Thoughts)
- `/styles` - Global styles and CSS modules
- `/utils` - Helper functions and custom hooks

#### 3D Implementation Approach
Using React Three Fiber (R3F) instead of vanilla Three.js for:
1. Better React integration and component composition
2. Automatic cleanup of 3D resources
3. Declarative scene graph
4. Easier state management with React hooks

#### Glass Material Implementation
Using `MeshTransmissionMaterial` from drei for realistic glass:
- Supports transmission, IOR, thickness, chromatic aberration
- Subtle mint/seafoam green tint (#cceedd)
- Environment map ("studio" preset) for depth and reflections
- High blur (0.8) for subtle, minimal reflections

#### Icon Billboard System
Each orb contains a camera-facing billboard sprite displaying an icon:
- **Implementation**: `IconBillboard` component using plane geometry with `lookAt()` for camera-facing behavior
- **Texture Loading**: Suspense-wrapped texture loader for graceful handling of missing assets
- **Positioning**: Centered at orb origin (0, 0, 0) relative to orb group
- **Scaling**: 0.8 units (80% of orb diameter) for visibility through glass
- **Material**: `meshBasicMaterial` with transparency for clean appearance

**Icon Assets Required** (place in `/public/icons/`):
- `me_icon.png` - Clipboard/notepad icon
- `library_icon.png` - Person/user icon
- `projects_icon.png` - Rocket icon
- `thoughts_icon.png` - Thought bubble icon

Recommended specs: 512x512px or 1024x1024px PNG with transparency, white/light colored

#### Navigation Strategy
- Single-page application with section-based navigation
- Clicking an orb transitions to that section (Framer Motion AnimatePresence)
- Sections will overlay/replace the 3D scene or integrate with it
- Back button or escape returns to landing page with orbs

### Known Challenges & Solutions

#### Performance Considerations
- **Challenge**: 4 glass orbs with complex materials might be heavy
- **Solution**: Start simple, optimize as needed. Consider:
  - Level of detail (LOD) if performance issues arise
  - Simplified materials on mobile
  - Texture/environment map resolution optimization

#### React 19 Compatibility
- Using latest React 19.2.0
- R3F and drei should be compatible, but watch for any deprecation warnings
- Test thoroughly with concurrent features

#### Mobile Experience
- Touch interactions for orb selection
- Simplified 3D effects on mobile if performance issues
- Responsive sizing of orbs and canvas

### Development Workflow
1. Build core 3D scene first (orbs, lighting, animation)
2. Add interactivity (hover, click)
3. Implement theme system
4. Create page sections
5. Add transitions
6. Polish animations and materials
7. Optimize performance
8. Test cross-browser and responsive

### References & Inspiration
- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Three.js MeshPhysicalMaterial](https://threejs.org/docs/#api/en/materials/MeshPhysicalMaterial)
- [Drei Components](https://github.com/pmndrs/drei)

## Next Steps
- [ ] Create theme context for dark/light mode
- [ ] Build GlassOrb component with basic sphere geometry
- [ ] Set up Three.js canvas with lighting
- [ ] Implement circular orbit animation
- [ ] Add hover/click interactivity
- [ ] Create placeholder page components
- [ ] Wire up navigation system
