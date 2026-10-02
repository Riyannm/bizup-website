// Renders posters.html to PNGs (2160x2700). Needs Chrome and: npm i --no-save puppeteer-core
import puppeteer from 'puppeteer-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const NAMES = { p1: 'bizup-poster-1-brand', p2: 'bizup-poster-2-automation', p3: 'bizup-poster-3-services', p4: 'bizup-poster-4-direct', p5: 'bizup-poster-5-contact' };

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--allow-file-access-from-files'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1200, height: 1500, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.join(dir, 'posters.html')).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
for (const [id, name] of Object.entries(NAMES)) {
  const el = await page.$(`#${id}`);
  await el.screenshot({ path: path.join(dir, `${name}.png`) });
  console.log(name);
}
await browser.close();
