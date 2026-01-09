import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF6B35', // 橙色主色，参考 Sincerely
          light: '#FF8C66',
          dark: '#E55A2B',
        },
        background: {
          DEFAULT: '#FEFBF8', // 浅米色背景
          light: '#FFFCF9',
        },
      },
    },
  },
  plugins: [],
}
export default config
