// 推进若干级后截图，核对灯带弧长分布的观感。
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';

const URL = process.env.URL ?? 'http://localhost:4173/';
const OUT = 'screenshots';
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH
    ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage();

// [标签, 宽, 高]，每个尺寸下分别截 1 级 / 4 级 / 8 级
const SIZES = [['desk', 1600, 900], ['phone', 390, 844]];
const STEPS = [1, 4, 8];

for (const [tag, w, h] of SIZES) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(URL, { waitUntil: 'networkidle' });
  let done = 0;
  for (const target of STEPS) {
    while (done < target) {
      await page.locator('.result-button').first().click();
      await page.waitForTimeout(120);
      done++;
    }
    await page.waitForTimeout(700);
    const file = `${OUT}/lamp-${tag}-lv${done}.png`;
    await page.screenshot({ path: file });
    console.log('✓', file);
  }
}

await browser.close();
