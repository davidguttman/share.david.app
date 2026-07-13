import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

await import('../scripts/build.mjs');

test('build emits the static entrypoint and versioned assets', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const css = await readFile('dist/assets/app.v1.css', 'utf8');
  const js = await readFile('dist/assets/app.v1.js', 'utf8');
  assert.match(html, /David’s share shelf/);
  assert.match(html, /assets\/app\.v1\.css/);
  assert.match(css, /--accent/);
  assert.match(js, /index\.json/);
  assert.match(js, /metaParts\.join\(' · '\)/);
});
