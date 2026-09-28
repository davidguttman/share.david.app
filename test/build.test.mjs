import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

await import('../scripts/build.mjs');

test('build emits the static entrypoint and versioned assets', async () => {
  const html = await readFile('dist/index.html', 'utf8');
  const css = await readFile('dist/assets/app.v2.css', 'utf8');
  const js = await readFile('dist/assets/app.v1.js', 'utf8');
  assert.match(html, /David’s share shelf/);
  assert.match(html, /assets\/app\.v2\.css/);
  assert.match(css, /--accent/);
  assert.match(css, /\.summary-card/);
  assert.match(css, /\.summary-stats/);
  assert.match(css, /\.masthead h1/);
  assert.match(css, /\.search::before/);
  assert.doesNotMatch(css, /↗/);
  assert.match(css, /cursor: pointer/);
  assert.match(js, /index\.json/);
  assert.match(js, /metaParts\.join\(' · '\)/);
  assert.match(js, /\.share-page article h2, \.masthead h1/);
  assert.match(js, /:scope > \.item > a/);
  assert.match(js, /MutationObserver/);
  assert.match(js, /li\.addEventListener\('click'/);
  assert.match(js, /link\.click\(\)/);
  assert.match(js, /\.share-page article h2, \.item > a/);
  assert.match(js, /\['red', 'green', 'blue'\]/);
});
