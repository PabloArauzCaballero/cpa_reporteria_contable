import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SOURCE_ROOT = 'src';
const MAX_TSX_LINES = 140;
const MAX_DOMAIN_LINES = 170;
const forbiddenPatterns = [
  { label: 'any explícito', pattern: /\bany\b/ },
  { label: 'TODO/FIXME pendiente', pattern: /\b(?:TODO|FIXME)\b/ },
  { label: 'fetch directo fuera del httpClient', pattern: /\bfetch\s*\(/, allowed: (file) => file.endsWith('src/shared/api/httpClient.ts') },
  { label: 'llamada API desde JSX', pattern: /httpClient\.|listMovimientosContables\(/, allowed: (file) => !file.endsWith('.tsx') },
];

function walk(directory) {
  return readdirSync(directory).flatMap((entry) => {
    const path = join(directory, entry);
    const stats = statSync(path);
    if (stats.isDirectory()) return walk(path);
    return path;
  });
}

const files = walk(SOURCE_ROOT).filter((file) => /\.(ts|tsx)$/.test(file));
const problems = [];

for (const file of files) {
  const content = readFileSync(file, 'utf8');
  const lineCount = content.split('\n').length;
  const displayPath = relative(process.cwd(), file);

  if (file.endsWith('.tsx') && lineCount > MAX_TSX_LINES) {
    problems.push(`${displayPath}: ${lineCount} líneas. Supera límite TSX de ${MAX_TSX_LINES}.`);
  }

  if (file.includes('/domain/') && lineCount > MAX_DOMAIN_LINES) {
    problems.push(`${displayPath}: ${lineCount} líneas. Supera límite de dominio de ${MAX_DOMAIN_LINES}.`);
  }

  for (const rule of forbiddenPatterns) {
    if (rule.allowed?.(displayPath)) continue;
    if (rule.pattern.test(content)) problems.push(`${displayPath}: contiene ${rule.label}.`);
  }
}

if (problems.length > 0) {
  console.error('Arquitectura inválida:\n' + problems.map((problem) => `- ${problem}`).join('\n'));
  process.exit(1);
}

console.log(`Arquitectura OK: ${files.length} archivos revisados.`);
