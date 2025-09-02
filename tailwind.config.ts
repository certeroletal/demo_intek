import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}', // This covers all files in src
  ],
  theme: {
    extend: {
      // You can add custom Tailwind CSS theme extensions here if needed
    },
  },
  plugins: [],
}
export default config
