import { readFileSync } from 'fs';
import { join } from 'path';
import { VERSION } from './version';

describe('version', () => {
  it('should match package.json', () => {
    const { version } = JSON.parse(readFileSync(join(__dirname, '../package.json'), 'utf8'));
    expect(VERSION).toEqual(version);
  });
});
