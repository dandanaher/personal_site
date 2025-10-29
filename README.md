# Dan Danaher - Personal Website v2

Modern personal website featuring 3D floating glass orbs navigation built with React, Three.js, and TypeScript.

## Features

- Interactive 3D glass orb navigation
- Four main sections: Me, Library, Projects, Thoughts
- Dark/Light mode toggle
- Smooth animations and transitions
- Responsive design
- Modern glass/marble aesthetic

## Tech Stack

- **React 19** with TypeScript
- **Vite 7** for blazing fast development
- **Three.js** with React Three Fiber for 3D graphics
- **@react-three/drei** for useful Three.js helpers
- **Framer Motion** for smooth animations

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

The dev server will start at `http://localhost:3000`

### Icon Assets Setup

**Required**: The glass orbs are configured to display icons. Save the 4 icon PNG files to `/public/icons/`:

- `me_icon.png` - Clipboard/notepad icon (white/light, 512x512px recommended)
- `library_icon.png` - Person/user icon (white/light)
- `projects_icon.png` - Rocket icon (white/light)
- `thoughts_icon.png` - Thought bubble icon (white/light)

The code is already configured to load these files. Once saved, the icons will appear as camera-facing billboards inside each glass orb.

## Project Structure

```
personal_site/
├── docs/               # Project documentation
│   ├── STACK.md       # Tech stack decisions
│   ├── STYLE_GUIDE.md # Design system and guidelines
│   ├── NOTES.md       # Development notes
│   └── TODO.md        # Feature roadmap
├── public/            # Static assets
├── src/
│   ├── components/    # Reusable UI components
│   ├── scenes/        # Three.js 3D scenes
│   ├── pages/         # Page/section components
│   ├── styles/        # Global styles
│   ├── utils/         # Helper functions and hooks
│   ├── App.tsx        # Main app component
│   └── main.tsx       # Application entry point
└── package.json
```

## Development

The landing page features 4 glass orbs that orbit slowly in a circle:
- 🧑 **Me** - About/introduction
- 📚 **Library** - Book collection
- 🚀 **Projects** - Portfolio
- 💭 **Thoughts** - Blog

Click an orb to navigate to that section. Use the back button to return to the landing page.

## Design Philosophy

Modern, minimal, and unique. The site embraces negative space with subtle animations and a focus on the 3D glass marble aesthetic inspired by a green glass marble profile picture.

See [docs/STYLE_GUIDE.md](docs/STYLE_GUIDE.md) for detailed design guidelines.

## License

MIT

---

Built with ❤️ by Dan Danaher
