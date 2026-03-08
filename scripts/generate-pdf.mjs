import puppeteer from 'puppeteer';
import { spawn } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = 3099;
const OUTPUT = join(__dirname, '../public/files/jack-morrison-cv.pdf');

async function waitForServer(url, timeout = 30_000) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    try {
      await fetch(url);
      return;
    } catch {
      // not ready yet
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server not ready after ${timeout}ms`);
}

const server = spawn('npx', ['next', 'start', '-p', String(PORT)], { stdio: 'inherit' });

try {
  await waitForServer(`http://localhost:${PORT}`);
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  // A4 at 96dpi: 210mm = 793.7px → 794px. Match viewport to page width so
  // margin:auto on .cvWrapper produces zero side margins.
  await page.setViewport({ width: 794, height: 1123 });
  // Set dark theme in localStorage before page load so next-themes picks it up during init.
  await page.evaluateOnNewDocument(() => {
    localStorage.setItem('theme', 'dark');
  });
  await page.goto(`http://localhost:${PORT}/cv/pdf`, { waitUntil: 'networkidle0' });
  await page.pdf({
    path: OUTPUT,
    format: 'A4',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
  });
  await browser.close();
  console.log(`PDF saved to ${OUTPUT}`);
} finally {
  server.kill();
}
