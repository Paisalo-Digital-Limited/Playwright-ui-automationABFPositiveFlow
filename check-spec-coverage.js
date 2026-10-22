const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'pages');
const testsDir = path.join(__dirname, 'tests', 'e2e');

const pageFiles = fs.readdirSync(pagesDir)
  .filter(f => f.endsWith('.page.ts'))
  .map(f => f.replace('.page.ts', ''));

const testFiles = fs.readdirSync(testsDir)
  .filter(f => f.endsWith('.spec.ts'))
  .map(f => f.replace('.spec.ts', ''));

const missingTests = pageFiles.filter(page => !testFiles.includes(page));

if (missingTests.length > 0) {
  console.error('\n❌ Missing .spec.ts test files for the following pages:');
  missingTests.forEach(p => console.error(`- ${p}.page.ts`));
  process.exit(1);
} else {
  console.log('✅ All pages have corresponding .spec.ts tests.');
}
