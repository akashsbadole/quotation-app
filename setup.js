#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Quotation Management System...\n');

// Function to run commands
function runCommand(command, cwd = process.cwd()) {
  try {
    console.log(`📦 Running: ${command}`);
    execSync(command, { stdio: 'inherit', cwd });
    console.log('✅ Success!\n');
  } catch (error) {
    console.error(`❌ Error running command: ${command}`);
    console.error(error.message);
    process.exit(1);
  }
}

// Function to copy file if it doesn't exist
function copyFileIfNotExists(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    console.log(`📄 Created ${dest}`);
  } else {
    console.log(`📄 ${dest} already exists, skipping...`);
  }
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

// Install root dependencies
console.log('📦 Installing root dependencies...');
runCommand('npm install');

// Install server dependencies
console.log('📦 Installing server dependencies...');
runCommand('npm install', path.join(process.cwd(), 'server'));

// Copy environment files
console.log('📄 Setting up environment files...');
copyFileIfNotExists('.env.example', '.env');
copyFileIfNotExists('server/.env.example', 'server/.env');

// Generate Prisma client
console.log('🔧 Generating Prisma client...');
runCommand('npx prisma generate', path.join(process.cwd(), 'server'));

// Run database migrations
console.log('🗄️ Running database migrations...');
runCommand('npx prisma migrate dev --name init', path.join(process.cwd(), 'server'));

// Seed the database
console.log('🌱 Seeding database with sample data...');
runCommand('npm run db:seed', path.join(process.cwd(), 'server'));

console.log('🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Run "npm run dev" to start the development servers');
console.log('2. Open http://localhost:5173 in your browser');
console.log('3. The API will be available at http://localhost:3001');
console.log('\n💡 Tips:');
console.log('- Use "npm run db:studio" to open Prisma Studio for database management');
console.log('- Check the README.md for more detailed documentation');
console.log('- For PostgreSQL setup, see the Database Configuration section in README.md');
