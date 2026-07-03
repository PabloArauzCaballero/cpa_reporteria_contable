import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const root = process.cwd();
const sourceDir = join(root, 'src');
const maxLinesByKind = {
  source: 220,
  styles: 220,
};

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function isSourceFile(path) {
  return /\.(ts|tsx)$/.test(path);
}

function isStyleFile(path) {
  return /\.css$/.test(path);
}

function isIgnoredLongFile(path) {
  return path.endsWith('vite-env.d.ts');
}

const files = walk(sourceDir);
const failures = [];

for (const file of files) {
  const rel = relative(root, file).replaceAll('\\\\', '/');
  const content = readFileSync(file, 'utf8');
  const lines = content.split('\n').length;

  if (isSourceFile(file) && !isIgnoredLongFile(rel) && lines > maxLinesByKind.source) {
    failures.push(`${rel} tiene ${lines} líneas; dividir responsabilidades.`);
  }

  if (isStyleFile(file) && !isIgnoredLongFile(rel) && lines > maxLinesByKind.styles) {
    failures.push(`${rel} tiene ${lines} líneas CSS; dividir estilos por sección.`);
  }

  if (isSourceFile(file) && /\bany\b/.test(content)) {
    failures.push(`${rel} usa any; mantener tipado estricto.`);
  }

  if (/(TODO|FIXME)/.test(content)) {
    failures.push(`${rel} contiene TODO/FIXME.`);
  }

  if (/components\/.*\.tsx$/.test(rel) && /fetch\(|httpClient|get<|post</.test(content)) {
    failures.push(`${rel} consume API en componente visual.`);
  }
}

if (failures.length > 0) {
  console.error(failures.join('\n'));
  process.exit(1);
}

console.log('Auditoría de calidad OK');
