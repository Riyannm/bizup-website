// Renders landscape.html to bizup-landscape.png (3840x2160). Needs Chrome and puppeteer-core.
import puppeteer from 'puppeteer-core';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));

const browser = await puppeteer.launch({
  executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe',
  headless: 'new',
  args: ['--allow-file-access-from-files'],
});
const page = await browser.newPage();
await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.join(dir, 'landscape.html')).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
const el = await page.$('#land');
await el.screenshot({ path: path.join(dir, 'bizup-landscape.png') });
console.log('bizup-landscape.png');
await browser.close();
