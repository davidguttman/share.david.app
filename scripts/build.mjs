import { cp, mkdir, rm, writeFile } from 'node:fs/promises';

await rm('dist', { recursive: true, force: true });
await mkdir('dist/assets', { recursive: true });
await cp('src/index.html', 'dist/index.html');
await cp('src/assets', 'dist/assets', { recursive: true });
await writeFile('dist/robots.txt', 'User-agent: *\nAllow: /\nDisallow: /p/\n');
await writeFile('dist/index.json', JSON.stringify({ pages: [] }, null, 2) + '\n');
console.log('Built dist/');
