// Verification script for two-line clamp fix
// Run with: node verifications/now-line-clamp.js

const fs = require('fs');
const path = require('path');

console.log('=== Line-Clamp Verification ===\n');

// 1. Check CSS file has correct declarations
const cssPath = path.join(__dirname, '..', 'app', 'globals.css');
const css = fs.readFileSync(cssPath, 'utf-8');

const homeActionPreviewMatch = css.match(/\.home-action-preview\s*\{([^}]+)\}/);
if (homeActionPreviewMatch) {
  const content = homeActionPreviewMatch[1];
  const hasWebkitClamp2 = content.includes('-webkit-line-clamp: 2;');
  const hasLineClamp2 = content.includes('line-clamp: 2;');
  const hasMinWidth0 = content.includes('min-width: 0;');
  const hasWhiteSpace = content.includes('white-space: normal;');

  console.log('.home-action-preview class:');
  console.log('  -webkit-line-clamp: 2:', hasWebkitClamp2 ? '✓' : '✗');
  console.log('  line-clamp: 2:', hasLineClamp2 ? '✓' : '✗');
  console.log('  min-width: 0:', hasMinWidth0 ? '✓' : '✗');
  console.log('  white-space: normal:', hasWhiteSpace ? '✓' : '✗');
  console.log('  Status:', (hasWebkitClamp2 && hasLineClamp2 && hasMinWidth0 && hasWhiteSpace) ? 'FIXED ✓' : 'BROKEN ✗');
}

const collectionRowTitleMatch = css.match(/\.collection-row-title\s*\{([^}]+)\}/);
if (collectionRowTitleMatch) {
  const content = collectionRowTitleMatch[1];
  const hasWebkitClamp2 = content.includes('-webkit-line-clamp: 2');
  const hasLineClamp2 = content.includes('line-clamp: 2');

  console.log('\n.collection-row-title class:');
  console.log('  -webkit-line-clamp: 2:', hasWebkitClamp2 ? '✓' : '✗');
  console.log('  line-clamp: 2:', hasLineClamp2 ? '✓' : '✗');
  console.log('  Status:', (hasWebkitClamp2 && hasLineClamp2) ? 'FIXED ✓' : 'MISSING ✗');
}

const collectionPreviewMatch = css.match(/\.collection-preview\s*\{([^}]+)\}/);
if (collectionPreviewMatch) {
  const content = collectionPreviewMatch[1];
  const hasWebkitClamp2 = content.includes('-webkit-line-clamp: 2');
  const hasLineClamp2 = content.includes('line-clamp: 2');

  console.log('\n.collection-preview class (default):');
  console.log('  -webkit-line-clamp: 2:', hasWebkitClamp2 ? '✓' : '✗');
  console.log('  line-clamp: 2:', hasLineClamp2 ? '✓' : '✗');
}

console.log('\n=== Verification Complete ===');