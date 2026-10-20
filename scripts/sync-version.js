// Runs from the `version` lifecycle script (`pnpm version`) to keep src/version.ts in sync with package.json.
import { readFileSync, writeFileSync } from 'fs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
writeFileSync(new URL('../src/version.ts', import.meta.url), `export const VERSION = '${version}';\n`);
