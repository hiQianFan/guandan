// 验证 A3 → 2 是退潮：采样退潮过程中的 dashoffset 与末端坐标，
// 应看到末端沿原路单调缩回底边中点，且全程可见（非 opacity 抹除）。
import { chromium } from 'playwright';

const URL = process.env.URL ?? 'http://localhost:4173/';
const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH
    ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1600, height: 900 });
await page.goto(URL, { waitUntil: 'networkidle' });

// 一路点到 A3（红方连胜），再点一次让它不过 A 回 2
const probe = () => page.evaluate(() => {
  const el = document.querySelector('.lamp-red');
  if (!el) return null;
  const cs = getComputedStyle(el);
  const off = parseFloat(cs.strokeDashoffset);
  const L = el.getTotalLength();
  const lit = (1 - off) * L;
  const tip = el.getPointAtLength(Math.max(0, Math.min(lit, L)));
  return {
    off: +off.toFixed(3), litPx: +lit.toFixed(1),
    tip: `${tip.x.toFixed(0)},${tip.y.toFixed(0)}`,
    opacity: cs.opacity, dur: cs.transitionDuration,
    lv: document.querySelector('.score-number')?.textContent?.trim(),
  };
});

for (let i = 0; i < 14; i++) {
  await page.locator('.result-button').first().click();
  await page.waitForTimeout(150);
}
await page.waitForTimeout(900);
console.log('抵达 A3:', JSON.stringify(await probe()));

// 触发回退：让红方不再是头游（点最后一个结果按钮）
const before = await probe();
await page.locator('.result-button').last().click();
console.log('\n退潮采样（每 120ms）:');
for (let i = 0; i < 11; i++) {
  await page.waitForTimeout(120);
  console.log(' ', JSON.stringify(await probe()));
}
const after = await probe();
console.log('\n起:', JSON.stringify(before), '\n终:', JSON.stringify(after));
await browser.close();
