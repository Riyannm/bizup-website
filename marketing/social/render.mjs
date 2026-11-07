// Renders every .post in an HTML file here to a PNG at 2x. Usage: node render.mjs [file.html] (default social.html). Needs Chrome and: npm i --no-save puppeteer-core
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
await page.setViewport({ width: 1200, height: 1800, deviceScaleFactor: 2 });
await page.goto(pathToFileURL(path.join(dir, process.argv[2] || 'social.html')).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
for (const el of await page.$$('.post')) {
  const name = await el.evaluate((node) => node.dataset.name);
  await el.screenshot({ path: path.join(dir, `${name}.png`) });
  console.log(name);
}
await browser.close();
