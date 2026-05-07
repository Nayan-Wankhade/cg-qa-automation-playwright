#!/usr/bin/env node
// Opens the most recent Playwright HTML report from reports/runs/.
// Usage: node scripts/open-latest-report.js  (or: npm run report)

const fs   = require('fs');
const path = require('path');
const cp   = require('child_process');

const runsDir = path.join(__dirname, '..', 'reports', 'runs');

if (!fs.existsSync(runsDir)) {
  console.error('No reports found. Run tests first:  npm test');
  process.exit(1);
}

const runs = fs.readdirSync(runsDir)
  .filter(n => fs.statSync(path.join(runsDir, n)).isDirectory())
  .sort();

if (!runs.length) {
  console.error('No runs found in reports/runs/. Run tests first:  npm test');
  process.exit(1);
}

const latest     = runs.at(-1);
const reportPath = path.join(runsDir, latest, 'html');

console.log(`Opening latest report: ${reportPath}`);
cp.spawnSync('npx', ['playwright', 'show-report', reportPath], { stdio: 'inherit', shell: true });
