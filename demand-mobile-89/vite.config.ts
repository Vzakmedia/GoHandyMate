import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Core framework
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // Data fetching
          query: ['@tanstack/react-query'],
          // Supabase client
          supabase: ['@supabase/supabase-js'],
          // Charts (heavy)
          charts: ['recharts'],
          // Radix UI (split from vendor since it's large)
          ui: [
            '@radix-ui/react-dialog',
            '@radix-ui/react-select',
            '@radix-ui/react-tabs',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-tooltip',
            '@radix-ui/react-popover',
          ],
          // Utilities
          utils: ['date-fns', 'clsx', 'tailwind-merge', 'class-variance-authority'],
        },
      },
    },
    // Enable source maps only in dev
    sourcemap: mode === 'development',
    // Increase chunk size warning limit (recharts is large)
    chunkSizeWarningLimit: 600,
  },
}));
