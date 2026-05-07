const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'docs', 'diagrams', 'exports');
fs.mkdirSync(outDir, { recursive: true });

const palette = {
  ink: '#111827',
  muted: '#5b6575',
  line: '#c7d2e2',
  panel: '#ffffff',
  page: '#f5f7fb',
  blue: '#1d4ed8',
  blueSoft: '#dbeafe',
  teal: '#0f766e',
  tealSoft: '#ccfbf1',
  green: '#15803d',
  greenSoft: '#dcfce7',
  amber: '#b45309',
  amberSoft: '#fef3c7',
  rose: '#be185d',
  roseSoft: '#fce7f3',
  violet: '#6d28d9',
  violetSoft: '#ede9fe',
  slate: '#334155',
  slateSoft: '#e2e8f0',
  red: '#b91c1c',
  redSoft: '#fee2e2',
};

const esc = (value) => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

function wrap(text, width = 24) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > width && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function multiline(text, x, y, options = {}) {
  const {
    size = 18,
    weight = 500,
    color = palette.ink,
    anchor = 'middle',
    width = 24,
    lineHeight = 24,
  } = options;
  const lines = String(text).split('\n').flatMap((line) => wrap(line, width));
  return lines.map((line, index) =>
    `<text x="${x}" y="${y + index * lineHeight}" text-anchor="${anchor}" font-size="${size}" font-weight="${weight}" fill="${color}">${esc(line)}</text>`
  ).join('');
}

function card({ x, y, w, h, title, body = '', fill = palette.panel, stroke = palette.line, titleColor = palette.ink, icon = '', shadow = true }) {
  const lines = body ? String(body).split('\n').flatMap((line) => wrap(line, Math.max(16, Math.floor(w / 11)))) : [];
  const iconSvg = icon ? `<text x="${x + 22}" y="${y + 36}" font-size="22" font-weight="800" fill="${titleColor}">${esc(icon)}</text>` : '';
  const titleX = icon ? x + 54 : x + w / 2;
  const anchor = icon ? 'start' : 'middle';
  const titleY = y + 34;
  const titleWidth = Math.max(12, Math.floor((w - (icon ? 72 : 28)) / 11));
  const titleLines = wrap(title, titleWidth);
  const bodyStart = y + 62 + Math.max(0, titleLines.length - 1) * 22;
  return `
    <g filter="${shadow ? 'url(#shadow)' : ''}">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${fill}" stroke="${stroke}" stroke-width="2"/>
      ${iconSvg}
      ${titleLines.map((line, i) => `<text x="${titleX}" y="${titleY + i * 23}" text-anchor="${anchor}" font-size="19" font-weight="800" fill="${titleColor}">${esc(line)}</text>`).join('')}
      ${lines.map((line, i) => `<text x="${x + w / 2}" y="${bodyStart + i * 24}" text-anchor="middle" font-size="15" font-weight="500" fill="${palette.muted}">${esc(line)}</text>`).join('')}
    </g>`;
}

function pill(x, y, text, fill, color = palette.ink) {
  const w = Math.max(150, text.length * 9 + 36);
  return `<rect x="${x}" y="${y}" width="${w}" height="34" rx="17" fill="${fill}" stroke="${color}" stroke-opacity=".25"/><text x="${x + w / 2}" y="${y + 22}" text-anchor="middle" font-size="14" font-weight="800" fill="${color}">${esc(text)}</text>`;
}

function arrow(x1, y1, x2, y2, color = palette.slate, dashed = false) {
  const dash = dashed ? 'stroke-dasharray="8 8"' : '';
  return `<path d="M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3" ${dash} marker-end="url(#arrow)"/>`;
}

function straight(x1, y1, x2, y2, color = palette.slate, dashed = false) {
  const dash = dashed ? 'stroke-dasharray="8 8"' : '';
  return `<path d="M ${x1} ${y1} L ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="3" ${dash} marker-end="url(#arrow)"/>`;
}

function shell({ title, subtitle, width = 1800, height = 1200, content }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${esc(title)}">
  <defs>
    <style>
      text { font-family: "Segoe UI", Arial, Helvetica, sans-serif; }
    </style>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f172a"/>
      <stop offset="58%" stop-color="#1e3a8a"/>
      <stop offset="100%" stop-color="#0f766e"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="150%">
      <feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#0f172a" flood-opacity=".16"/>
    </filter>
    <marker id="arrow" markerWidth="14" markerHeight="14" refX="10" refY="5" orient="auto" markerUnits="strokeWidth">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="${palette.slate}"/>
    </marker>
  </defs>
  <rect width="${width}" height="${height}" fill="${palette.page}"/>
  <rect x="0" y="0" width="${width}" height="170" fill="url(#hero)"/>
  <text x="70" y="78" font-size="38" font-weight="900" fill="#ffffff">${esc(title)}</text>
  <text x="72" y="122" font-size="20" font-weight="500" fill="#dbeafe">${esc(subtitle)}</text>
  <g>${content}</g>
</svg>`;
}

function automationWorkflow() {
  const laneY = 220;
  const laneH = 770;
  const lanes = [
    { x: 70, title: 'Phase 0', sub: 'Bootstrap', color: palette.blue, fill: '#eff6ff' },
    { x: 640, title: 'Phase 1', sub: 'Live execution', color: palette.teal, fill: '#f0fdfa' },
    { x: 1210, title: 'Phase 2', sub: 'Generation + write-back', color: palette.rose, fill: '#fff1f2' },
  ];
  let content = lanes.map((l) => `
    <rect x="${l.x}" y="${laneY}" width="520" height="${laneH}" rx="28" fill="${l.fill}" stroke="${l.color}" stroke-opacity=".45" stroke-width="3"/>
    <text x="${l.x + 34}" y="${laneY + 50}" font-size="28" font-weight="900" fill="${l.color}">${l.title}</text>
    <text x="${l.x + 34}" y="${laneY + 82}" font-size="18" font-weight="700" fill="${palette.muted}">${l.sub}</text>
  `).join('');

  content += pill(70, 1040, 'All writes are local only', palette.slateSoft, palette.slate);
  content += pill(340, 1040, 'Git sync happens only via /kb-sync', palette.amberSoft, palette.amber);

  const nodes = [
    [110, 330, 210, 110, 'Parse Excel', 'TCs, personas,\nmodules, steps', palette.blueSoft, palette.blue, '1'],
    [350, 330, 200, 110, 'Load KB', 'local pages,\nrules, selectors', palette.greenSoft, palette.green, '2'],
    [190, 500, 280, 120, 'Choose mode', 'HYBRID reuses selectors\nEXPLORE discovers fresh', palette.violetSoft, palette.violet, '3'],
    [190, 680, 280, 120, 'Group by persona', 'ready for browser run', palette.blueSoft, palette.blue, '4'],
    [700, 315, 210, 110, 'Login + navigate', 'fresh context\nper persona', palette.tealSoft, palette.teal, '5'],
    [955, 315, 200, 110, 'Execute steps', 'actions and\nvalidations', palette.tealSoft, palette.teal, '6'],
    [760, 500, 320, 120, 'Selector decision', 'confirm existing or\nexplore DOM snapshot', palette.amberSoft, palette.amber, '7'],
    [760, 680, 320, 120, 'Repair pass', 'fix stale and failed\nselectors before writes', palette.redSoft, palette.red, '8'],
    [790, 815, 260, 125, 'Write gate', 'user confirms\nbefore Phase 2', '#ffffff', palette.slate, '9'],
    [1270, 315, 260, 120, 'Generate code', 'Page Object, spec,\nfixtures, constants', palette.roseSoft, palette.rose, '10'],
    [1540, 315, 140, 120, 'KB write', 'selectors +\nreport', palette.greenSoft, palette.green, '11'],
    [1360, 545, 250, 110, 'Cleanup', 'delete parsed_tests.json', palette.slateSoft, palette.slate, '12'],
    [1360, 720, 250, 110, 'Complete', 'run /kb-sync\nwhen ready', palette.greenSoft, palette.green, '13'],
  ];
  content += nodes.map(([x, y, w, h, title, body, fill, stroke, icon]) => card({ x, y, w, h, title, body, fill, stroke, titleColor: stroke, icon })).join('');
  content += straight(320, 385, 350, 385) + arrow(450, 620, 330, 680) + straight(470, 740, 700, 370);
  content += straight(910, 370, 955, 370) + arrow(1050, 425, 920, 500) + straight(920, 620, 920, 680) + straight(920, 800, 920, 850);
  content += straight(1050, 895, 1270, 375) + straight(1530, 375, 1540, 375) + arrow(1610, 435, 1490, 545) + straight(1485, 655, 1485, 720);
  return shell({ title: 'CG Playwright Automation Workflow', subtitle: 'Excel-driven runtime from intake to local KB write-back', content });
}

function projectArchitecture() {
  let content = '';
  const columns = [
    ['Inputs', 80, palette.blue, '#eff6ff'],
    ['Generator', 420, palette.violet, '#f5f3ff'],
    ['Source', 760, palette.rose, '#fff1f2'],
    ['Runtime', 1110, palette.teal, '#f0fdfa'],
    ['Outputs', 1450, palette.slate, '#f8fafc'],
  ];
  for (const [title, x, color, fill] of columns) {
    content += `<rect x="${x}" y="220" width="280" height="820" rx="26" fill="${fill}" stroke="${color}" stroke-opacity=".45" stroke-width="3"/>`;
    content += `<text x="${x + 28}" y="270" font-size="26" font-weight="900" fill="${color}">${title}</text>`;
  }
  const nodes = [
    [110, 330, 'Excel workbook', 'test cases\nand steps', palette.blueSoft, palette.blue],
    [110, 500, '.env', 'BASE_URL and\ncredentials', palette.amberSoft, palette.amber],
    [110, 670, 'Local KB', 'reference docs\nand selectors', palette.greenSoft, palette.green],
    [450, 330, 'Parse', 'normalize Excel\nmerged rows', palette.violetSoft, palette.violet],
    [450, 500, 'Derive', 'modules, routes,\nselector keys', palette.violetSoft, palette.violet],
    [450, 670, 'Live run', 'confirm, discover,\nrepair selectors', palette.tealSoft, palette.teal],
    [790, 300, 'BasePage', 'login and shared\nhelpers', palette.roseSoft, palette.rose],
    [790, 450, 'ModulePage', 'selectors, actions,\nassertions', palette.roseSoft, palette.rose],
    [790, 600, 'Spec file', 'persona-aware\nTC coverage', palette.roseSoft, palette.rose],
    [790, 750, 'Fixtures + data', 'page fixtures,\nfactories, types', palette.roseSoft, palette.rose],
    [1140, 390, 'Playwright config', 'workers, retries,\nreporters', palette.tealSoft, palette.teal],
    [1140, 590, 'Desktop Chrome', 'isolated context\nper test', palette.tealSoft, palette.teal],
    [1480, 300, 'HTML report', 'local browsing', palette.slateSoft, palette.slate],
    [1480, 450, 'JUnit XML', 'CI integration', palette.slateSoft, palette.slate],
    [1480, 600, 'Artifacts', 'screenshots,\nvideos, traces', palette.slateSoft, palette.slate],
    [1480, 800, 'GitHub KB', '/kb-sync and\n/kb-pull only', '#111827', '#111827'],
  ];
  content += nodes.map(([x, y, title, body, fill, stroke]) => card({ x, y, w: 220, h: 115, title, body, fill, stroke, titleColor: stroke === '#111827' ? '#ffffff' : stroke, shadow: true })).join('');
  content += straight(330, 385, 450, 385) + straight(330, 725, 450, 725) + straight(560, 445, 560, 500) + straight(560, 615, 560, 670);
  content += straight(670, 730, 790, 505) + straight(670, 560, 790, 655) + straight(670, 390, 790, 805);
  content += straight(1010, 655, 1140, 445) + straight(1250, 505, 1250, 590);
  content += straight(1360, 645, 1480, 355) + straight(1360, 645, 1480, 505) + straight(1360, 645, 1480, 655);
  content += arrow(900, 565, 1480, 855, palette.green, true);
  content += arrow(1580, 800, 220, 725, palette.green, true);
  return shell({ title: 'CG Playwright Project Architecture', subtitle: 'How input knowledge becomes generated tests, runtime reports, and reusable KB memory', content });
}

function kbEcosystem() {
  let content = '';
  const hubs = [
    [105, 350, 310, 250, '/cg-automate', 'Writes selectors and reports locally after confirmed execution', palette.blueSoft, palette.blue],
    [565, 300, 320, 360, 'Local KB', 'Tracked project memory:\nselectors, reports,\nreference docs', palette.greenSoft, palette.green],
    [1035, 350, 310, 250, 'GitHub KB', 'Remote shared KB accessed only through MCP commands', '#111827', '#111827'],
    [1420, 350, 270, 250, 'Team machines', 'New or stale machines refresh with /kb-pull', palette.amberSoft, palette.amber],
  ];
  content += hubs.map(([x, y, w, h, title, body, fill, stroke]) => card({ x, y, w, h, title, body, fill, stroke, titleColor: stroke === '#111827' ? '#ffffff' : stroke, icon: title[0] })).join('');
  content += arrow(415, 475, 565, 430, palette.green);
  content += arrow(885, 430, 1035, 430, palette.violet);
  content += arrow(1035, 530, 885, 530, palette.violet);
  content += arrow(1345, 475, 1420, 475, palette.amber);
  content += `<text x="493" y="405" font-size="17" font-weight="800" fill="${palette.green}">write-back</text>`;
  content += `<text x="925" y="392" font-size="17" font-weight="800" fill="${palette.violet}">/kb-sync</text>`;
  content += `<text x="925" y="590" font-size="17" font-weight="800" fill="${palette.violet}">/kb-pull</text>`;
  const details = [
    [130, 720, 'Selectors', 'Only confirmed, repaired,\nor user-approved selectors\nenter kb/selectors.', palette.greenSoft, palette.green],
    [455, 720, 'Reports', 'Run history captures source,\nsummary, failures, and\nwritten scripts.', palette.slateSoft, palette.slate],
    [780, 720, 'Reference docs', 'pages, rules, personas,\nflows, validations are read\nduring automation.', palette.blueSoft, palette.blue],
    [1105, 720, 'MCP boundary', 'GitHub tools are used only\nby /kb-sync and /kb-pull.', palette.violetSoft, palette.violet],
    [1430, 720, 'Local first', 'No automatic upload.\nDeveloper controls sync.', palette.amberSoft, palette.amber],
  ];
  content += details.map(([x, y, title, body, fill, stroke]) => card({ x, y, w: 260, h: 170, title, body, fill, stroke, titleColor: stroke })).join('');
  content += pill(685, 955, 'The KB is automation memory, not a runtime dependency on GitHub', palette.slateSoft, palette.slate);
  return shell({ title: 'CG Playwright KB Ecosystem', subtitle: 'Local-first automation memory with explicit sync and pull commands', content });
}

function fileStructure() {
  let content = '';
  const rootX = 760;
  content += card({ x: rootX, y: 230, w: 280, h: 110, title: 'cg-playwright-v2/', body: 'project root', fill: '#111827', stroke: '#111827', titleColor: '#ffffff' });
  const groups = [
    [80, 430, 'Root config', 'AGENTS.md\nplaywright.config.ts\npackage.json\ntsconfig.json\n.env local only', palette.blueSoft, palette.blue],
    [410, 430, 'scripts/', 'parse_excel.py\nkey_derivation.py\nopen-latest-report.js', palette.violetSoft, palette.violet],
    [740, 430, 'kb/', 'pages, rules, personas\nflows, validations\nselectors, reports', palette.greenSoft, palette.green],
    [1070, 430, 'docs/diagrams/', 'Mermaid source files\nstatic exports\nlocal previews', palette.slateSoft, palette.slate],
    [1400, 430, 'reports/', 'HTML, JUnit, JSON\nscreenshots, videos,\ntraces - not committed', palette.amberSoft, palette.amber],
  ];
  content += groups.map(([x, y, title, body, fill, stroke]) => card({ x, y, w: 290, h: 185, title, body, fill, stroke, titleColor: stroke })).join('');
  for (const [x] of groups) content += straight(rootX + 140, 340, x + 145, 430);
  content += `<rect x="170" y="715" width="1460" height="310" rx="28" fill="#fff1f2" stroke="${palette.rose}" stroke-opacity=".45" stroke-width="3"/>`;
  content += `<text x="220" y="770" font-size="28" font-weight="900" fill="${palette.rose}">src/ - Playwright TypeScript</text>`;
  const src = [
    [220, 825, 'constants/', 'routes, tags,\npersonas'],
    [450, 825, 'data/', 'factories for\ndynamic data'],
    [680, 825, 'fixtures/', 'page object\nbindings'],
    [910, 825, 'pages/', 'BasePage +\nmodule pages'],
    [1140, 825, 'tests/e2e/', 'Excel TC IDs\nby module'],
    [1370, 825, 'types/', 'domain\ninterfaces'],
  ];
  content += src.map(([x, y, title, body]) => card({ x, y, w: 180, h: 125, title, body, fill: palette.roseSoft, stroke: palette.rose, titleColor: palette.rose, shadow: false })).join('');
  content += straight(1000, 890, 1140, 890, palette.rose);
  content += straight(760, 890, 680, 890, palette.rose);
  content += arrow(885, 615, 1000, 825, palette.green, true);
  content += arrow(225, 615, 1140, 825, palette.blue, true);
  return shell({ title: 'CG Playwright File and Folder Structure', subtitle: 'Expected local project shape for generated tests, tracked KB files, and local-only outputs', content });
}

const diagrams = [
  ['01-automation-workflow', automationWorkflow()],
  ['02-project-architecture', projectArchitecture()],
  ['03-kb-ecosystem', kbEcosystem()],
  ['04-file-structure', fileStructure()],
];

for (const [name, svg] of diagrams) {
  fs.writeFileSync(path.join(outDir, `${name}.svg`), svg, 'utf8');
}

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1800, height: 1200 }, deviceScaleFactor: 2 });
  for (const [name] of diagrams) {
    const svgPath = path.join(outDir, `${name}.svg`);
    await page.goto(`file:///${svgPath.replace(/\\/g, '/')}`, { waitUntil: 'load', timeout: 30_000 });
    await page.screenshot({
      path: path.join(outDir, `${name}.png`),
      clip: { x: 0, y: 0, width: 1800, height: 1200 },
      timeout: 120_000,
    });
  }
  await browser.close();
  console.log(`Rendered ${diagrams.length} SVG and PNG diagram pairs to ${outDir}`);
})();
