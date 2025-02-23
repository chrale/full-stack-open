import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  //plugins: [react()],
  plugins: [
    react({
      jsxRuntime: 'automatic', // Enables the modern JSX transform
    }),
  ],
  esbuild: {
    loader: 'jsx', // Tells Vite to treat .js files as JSX
    include: /\.(js|jsx)$/, // Apply to all JS and JSX files
    //include: /src\/.*\.js?$/, // Applies to JS files in the src folder
  }
})
