import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SRC = 'src';
const ICON_IMPORT = /from ['"]lucide-react['"]/g;

const files = [];
function crawl(dir) {
  for (const f of readdirSync(dir, { withFileTypes: true })) {
    if (f.isDirectory()) { 
      if (!dir.includes('node_modules')) crawl(join(dir, f.name)); 
      continue; 
    }
    if (f.name.endsWith('.tsx') || f.name.endsWith('.ts')) {
      files.push(join(dir, f.name));
    }
  }
}
crawl(SRC);

const icons = new Set();
for (const f of files) {
  const s = readFileSync(f, 'utf8');
  if (!ICON_IMPORT.test(s)) continue;
  const matches = s.match(/import\s*\{([^}]+)\}\s*from\s*['"]lucide-react['"];?/g);
  if (!matches) continue;
  
  matches.forEach(match => {
    const iconList = match.match(/\{([^}]+)\}/);
    if (iconList) {
      iconList[1].split(',').forEach(iconStr => {
        const icon = iconStr.trim().split(' as ')[0].trim();
        if (icon && !icon.startsWith('//')) {
          icons.add(icon);
        }
      });
    }
  });
}

const sorted = Array.from(icons).sort();
const header = `// AUTO-GENERATED. Do not edit manually. Run: node scripts/generate-icon-barrel.mjs
export { 
  ${sorted.join(', ')}
} from 'lucide-react';
`;
writeFileSync('src/ui/icons.ts', header);
console.log(`Exported ${sorted.length} icons to src/ui/icons.ts`);