import type { Config } from 'tailwindcss'

export default {
  // 1. Configure dark mode to use the 'data-theme' selector
  darkMode: ['selector', '[data-theme="dark"]'],

  // 2. Configure files to scan
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],

  // 3. Replicate the V2 theme from globals.css
  theme: {
    extend: {
      // 4. Map CSS variables to Tailwind color names
      colors: {
        background: 'var(--color-bg)',
        surface: 'var(--color-surface)',
        primary: 'var(--color-text-primary)',
        secondary: 'var(--color-text-secondary)',
        accent: 'var(--color-accent)',
        'accent-glow': 'var(--color-accent-glow)',
      },
      // 5. Define the project's font families
      fontFamily: {
        // From STYLE_GUIDE.md and globals.css
        serif: ['Georgia', 'Times New Roman', 'serif'],
        sans: ['Inter', 'sans-serif'],
        display: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [
    function({ addUtilities }: any) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',
          /* Firefox */
          'scrollbar-width': 'none',
          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      })
    }
  ],
} satisfies Config
