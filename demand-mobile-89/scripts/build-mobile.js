
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building GoHandyMate for mobile deployment...');

try {
  // Build the web app
  console.log('📦 Building web app...');
  execSync('npm run build', { stdio: 'inherit' });

  // Sync with Capacitor
  console.log('📱 Syncing with Capacitor...');
  execSync('npx cap sync', { stdio: 'inherit' });

  console.log('✅ Mobile build completed successfully!');
  console.log('\nNext steps:');
  console.log('1. For iOS: npx cap open ios');
  console.log('2. For Android: npx cap open android');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
