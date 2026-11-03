import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const output = path.resolve(root, process.argv[2] || 'dist');
if (output === root || root.startsWith(output + path.sep)) throw new Error('Choose a separate build directory.');
const routes = [];
async function collect(directory) {
  for (const item of await fs.readdir(directory, { withFileTypes: true })) {
    if (['.git', '.agents', 'assets', 'dist', 'scripts'].includes(item.name)) continue;
    const fullPath = path.join(directory, item.name);
    if (item.isDirectory()) await collect(fullPath);
    else if (item.name.endsWith('.html')) routes.push(fullPath);
  }
}
await collect(root);
const failures = [];
for (const file of routes) {
  const source = await fs.readFile(file, 'utf8');
  const pagePath = '/' + path.relative(root, file).split(path.sep).join('/').replace(/index\.html$/, '');
  for (const match of source.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const reference = match[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(reference)) continue;
    const url = new URL(reference, 'https://arekhandia.ch' + pagePath);
    let target = path.join(root, decodeURIComponent(url.pathname));
    try {
      const stat = await fs.stat(target);
      if (stat.isDirectory()) target = path.join(target, 'index.html');
      await fs.access(target);
      if (url.hash && target.endsWith('.html')) {
        const body = await fs.readFile(target, 'utf8');
        if (!body.includes('id="' + decodeURIComponent(url.hash.slice(1)) + '"')) failures.push(pagePath + ': missing anchor ' + reference);
      }
    } catch { failures.push(pagePath + ': missing resource ' + reference); }
  }
  if ((source.match(/<h1(?:\s|>)/g) || []).length !== 1) failures.push(pagePath + ': expected exactly one H1');
  if (!source.includes('rel="canonical"') || !source.includes('name="description"')) failures.push(pagePath + ': missing SEO metadata');
}
if (failures.length) throw new Error(failures.join('\n'));
await fs.mkdir(output, { recursive: true });
for (const file of routes) {
  const destination = path.join(output, path.relative(root, file));
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(file, destination);
}
for (const file of ['atelier.css', 'atelier.js', 'service-led.css', 'service-led.js', 'sitemap.xml', 'robots.txt', 'CNAME', '.nojekyll']) {
  try { await fs.copyFile(path.join(root, file), path.join(output, file)); } catch (error) { if (error.code !== 'ENOENT') throw error; }
}
await fs.cp(path.join(root, 'assets'), path.join(output, 'assets'), { recursive: true });
console.log(`Static production build passed: ${routes.length} HTML entries; internal routes, anchors and resources valid. Output: ${output}`);
