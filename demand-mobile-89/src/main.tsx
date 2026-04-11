
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

console.log('🚀 Main.tsx: Starting application initialization');

const container = document.getElementById("root");
if (!container) {
  console.error('❌ Main.tsx: Root element not found');
  throw new Error("Root element not found");
}

console.log('✅ Main.tsx: Root element found, creating React root');

const root = createRoot(container);

console.log('✅ Main.tsx: React root created, rendering App component');

try {
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log('✅ Main.tsx: App component rendered successfully');
} catch (error) {
  console.error('❌ Main.tsx: Error rendering App component:', error);
}
