#!/usr/bin/env node

/**
 * Script to fix peer dependency issues in Angular project
 * This script will update package.json to resolve version conflicts
 */

const fs = require('fs');
const path = require('path');

console.log('🔧 Fixing peer dependency issues...\n');

// Read current package.json
const packageJsonPath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

console.log('📦 Current Angular version:', packageJson.dependencies['@angular/core']);

// Define fixes for peer dependency issues
const fixes = {
  // Update Angular packages to consistent versions
  '@angular/common': '~11.2.14',
  '@angular/compiler': '~11.2.14',
  '@angular/core': '~11.2.14',
  '@angular/forms': '~11.2.14',
  '@angular/platform-browser': '~11.2.14',
  '@angular/router': '~11.2.14',
  '@angular/service-worker': '~11.2.14',
  '@angular/compiler-cli': '~11.2.14',
  '@angular/localize': '~11.2.14',

  // Update CDK to match Angular version
  '@angular/cdk': '^11.2.4',
  '@angular/material': '^11.2.4',

  // Remove or replace incompatible packages
  '@angular-material-components/datetime-picker': '^5.0.0', // Downgrade to compatible version
  'mat-sidenav-menu': '^0.9.0', // Downgrade to compatible version
  '@agm/core': '^3.0.0-beta.0', // Keep as is, but note compatibility issues
  'ng-apexcharts': '^1.3.0', // Downgrade to compatible version
  'ngx-avatar': '^3.0.0', // Downgrade to compatible version

  // Remove problematic packages
  'angularfire': null, // Remove old angularfire, use @angular/fire
  'angular-material': null, // Remove old angular-material, use @angular/material
  'angular': null, // Remove if present
  'angular-animate': null, // Remove if present
  'angular-aria': null, // Remove if present
  'angular-messages': null, // Remove if present

  // Add missing dependencies
  'popper.js': '^1.16.1', // Required by bootstrap
  'jasmine-core': '~3.6.0', // Required by karma
  'marked': '^2.1.0', // Required by marked-terminal
  '@firebase/app-compat': '^0.1.0', // Required by @firebase/database-compat
  '@angular-material-extensions/password-strength': '^8.1.1', // Required by ngx-auth-firebaseui
};

console.log('🔍 Applying fixes...\n');

let changesMade = 0;

// Apply fixes to dependencies
Object.keys(fixes).forEach(packageName => {
  const newVersion = fixes[packageName];

  if (newVersion === null) {
    // Remove package
    if (packageJson.dependencies[packageName]) {
      console.log(`❌ Removing incompatible package: ${packageName}`);
      delete packageJson.dependencies[packageName];
      changesMade++;
    }
    if (packageJson.devDependencies[packageName]) {
      console.log(`❌ Removing incompatible package from devDependencies: ${packageName}`);
      delete packageJson.devDependencies[packageName];
      changesMade++;
    }
  } else {
    // Update package version
    if (packageJson.dependencies[packageName]) {
      const oldVersion = packageJson.dependencies[packageName];
      if (oldVersion !== newVersion) {
        console.log(`🔄 Updating ${packageName}: ${oldVersion} → ${newVersion}`);
        packageJson.dependencies[packageName] = newVersion;
        changesMade++;
      }
    } else if (packageJson.devDependencies[packageName]) {
      const oldVersion = packageJson.devDependencies[packageName];
      if (oldVersion !== newVersion) {
        console.log(`🔄 Updating ${packageName} in devDependencies: ${oldVersion} → ${newVersion}`);
        packageJson.devDependencies[packageName] = newVersion;
        changesMade++;
      }
    } else {
      // Add new package to dependencies
      console.log(`➕ Adding new package: ${packageName}@${newVersion}`);
      packageJson.dependencies[packageName] = newVersion;
      changesMade++;
    }
  }
});

// Write updated package.json
if (changesMade > 0) {
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
  console.log(`\n✅ Applied ${changesMade} changes to package.json`);
  console.log('\n📋 Next steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm audit fix');
  console.log('3. Run: npm list --json (to check for remaining issues)');
} else {
  console.log('\n✅ No changes needed - package.json is already up to date');
}

console.log('\n🎯 Summary of fixes:');
console.log('- Updated Angular packages to consistent 11.2.14 versions');
console.log('- Downgraded incompatible packages to Angular 11 compatible versions');
console.log('- Removed old/conflicting packages (angularfire, angular-material)');
console.log('- Added missing peer dependencies');
console.log('\n⚠️  Note: Some packages may still show warnings due to Angular 11 vs 12 requirements');
console.log('   Consider upgrading to Angular 12+ for full compatibility with all packages.');
