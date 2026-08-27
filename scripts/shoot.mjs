// 按尺寸截图，用于人工核对观感。
// 用法：node scripts/shoot.mjs 1600x900 390x844 ...
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.URL ?? 'http://localhost:4173/';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

const args = process.argv.slice(2);
const sizes = (args.length ? args : ['1600x900', '1024x1366', '390x844', '667x375']).map((s) => {
  const [w, h] = s.split('x').map(Number);
  return [w, h];
});

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage();

for (const [w, h] of sizes) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(URL, { waitUntil: 'networkidle' });
  // 打一局，让箭头出现
  await page.locator('.result-button').first().click();
  await page.waitForTimeout(600);
  const file = `${OUT}/${w}x${h}.png`;
  await page.screenshot({ path: file });
  console.log('✓', file);
}

await browser.close();
