#!/usr/bin/env ts-node
import { globby } from 'globby';
import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const modulePath = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(modulePath), '..', '..');

const emojiToIcon: Record<string, { name: string }> = {
  '🎮': { name: 'game' },
  '⭐': { name: 'sparkle' },
  '✨': { name: 'sparkle' },
  '📊': { name: 'analytics' },
  '🚀': { name: 'launch' },
  '⚡': { name: 'lightning' },
  '💬': { name: 'chat' },
  '🔔': { name: 'notifications' },
  '🎁': { name: 'rewards' },
  '👥': { name: 'community' },
  '⭐️': { name: 'sparkle' }
};

const DEFAULT_GLOB = ['src/**/*.{tsx,jsx}', 'apps/mobile/app/**/*.{tsx,jsx}', 'packages/ui/src/**/*.{tsx,jsx}'];

const args: string[] = process.argv.slice(2);
const isDryRun = !args.includes('--write');
const explicitPatterns = args.filter((arg) => !arg.startsWith('--'));

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const ensureImport = (contents: string, importPath: string) => {
  const importStatement = `import { Icon } from '${importPath}';`;
  if (contents.includes(importStatement)) {
    return contents;
  }

  const alreadyImportingIcon = /import\s+\{[^}]*Icon[^}]*\}\s+from\s+['"].+['"]/u.test(contents);
  if (alreadyImportingIcon) {
    return contents;
  }

  const lines = contents.split('\n');
  const lastImportIndex = lines.reduce((lastIndex, line, index) => {
    if (/^import\s/u.test(line)) {
      return index;
    }
    return lastIndex;
  }, -1);

  if (lastImportIndex >= 0) {
    lines.splice(lastImportIndex + 1, 0, importStatement);
    return lines.join('\n');
  }

  return `${importStatement}\n${contents}`;
};

const getImportPath = (filePath: string) => {
  const normalized = filePath.replace(/\\/g, '/');
  if (normalized.includes('/apps/mobile/')) {
    return '@streamlink/ui';
  }
  if (normalized.includes('/packages/ui/')) {
    const packageIconPath = path.relative(path.dirname(filePath), path.resolve(path.dirname(filePath), 'Icon')).replace(/\\/g, '/');
    return packageIconPath.startsWith('.') ? packageIconPath : `./${packageIconPath}`;
  }

  const relativePathToIcon = path.relative(path.dirname(filePath), path.resolve(rootDir, 'src/ui/Icon')).replace(/\\/g, '/');
  return relativePathToIcon.startsWith('.') ? relativePathToIcon : `./${relativePathToIcon}`;
};

const processFile = async (filePath: string) => {
  const contents = await fs.readFile(filePath, 'utf8');
  let updated = contents;
  let mutated = false;

  for (const [emoji, meta] of Object.entries(emojiToIcon)) {
    if (!updated.includes(emoji)) {
      continue;
    }

    const propPattern = new RegExp(`icon=(["'])${escapeRegex(emoji)}\\1`, 'gu');
    const propReplaced = updated.replace(propPattern, `icon={<Icon name="${meta.name}" aria-hidden />}`);
    if (propReplaced !== updated) {
      updated = propReplaced;
      mutated = true;
    }

    const jsxLiteralPattern = new RegExp(`\\{["']${escapeRegex(emoji)}["']\\}`, 'gu');
    const literalReplaced = updated.replace(jsxLiteralPattern, `{<Icon name="${meta.name}" aria-hidden />}`);
    if (literalReplaced !== updated) {
      updated = literalReplaced;
      mutated = true;
    }

    const textPattern = new RegExp(escapeRegex(emoji), 'gu');
    const textReplaced = updated.replace(textPattern, `<Icon name="${meta.name}" aria-hidden />`);
    if (textReplaced !== updated) {
      updated = textReplaced;
      mutated = true;
    }
  }

  if (!mutated) {
    return;
  }

  const importPath = getImportPath(filePath);
  updated = ensureImport(updated, importPath);

  if (isDryRun) {
    console.log(`[dry-run] ${path.relative(rootDir, filePath)}`);
    return;
  }

  await fs.writeFile(filePath, updated, 'utf8');
  console.log(`[updated] ${path.relative(rootDir, filePath)}`);
};

const run = async () => {
  const globPatterns = explicitPatterns.length > 0 ? explicitPatterns : DEFAULT_GLOB;
  const files: string[] = await globby(globPatterns, { cwd: rootDir, absolute: true });

  await Promise.all(files.map(async (filePath) => {
    await processFile(filePath);
  }));
};

run().catch((error) => {
  if (error instanceof Error) {
    console.error('[replace-emojis] Failed:', error.message);
    console.error(error.stack);
  } else {
    console.error('[replace-emojis] Failed with non-error:', error);
  }
  process.exitCode = 1;
});
