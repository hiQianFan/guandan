// 验证灯带不变量：红蓝弧长对称、进度映射方向、减少动画降级。
import { chromium } from 'playwright';

const URL = process.env.URL ?? 'http://localhost:4173/';
const EXE = process.env.CHROME_PATH
  ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const SIZES = [
  ['桌面', 1600, 900], ['2K', 2560, 1440],
  ['手机竖屏', 390, 844], ['小手机', 320, 568],
];

const browser = await chromium.launch({ executablePath: EXE });
const problems = [];
const rows = [];

for (const [label, w, h] of SIZES) {
  const page = await browser.newPage();
  await page.setViewportSize({ width: w, height: h });
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.locator('.result-button').first().click();
  await page.waitForTimeout(1300);

  const m = await page.evaluate(() => {
    const r = document.querySelector('.lamp-red');
    const b = document.querySelector('.lamp-blue');
    if (!r || !b) return null;
    return {
      redLen: r.getTotalLength(),
      blueLen: b.getTotalLength(),
      redOff: parseFloat(r.getAttribute('stroke-dashoffset')),
      blueOff: parseFloat(b.getAttribute('stroke-dashoffset')),
      sw: parseFloat(r.getAttribute('stroke-width')),
    };
  });

  if (!m) {
    problems.push(`${label}: 灯带未渲染`);
    await page.close();
    continue;
  }

  const diff = Math.abs(m.redLen - m.blueLen);
  rows.push({
    尺寸: `${label} ${w}×${h}`,
    红弧长: m.redLen.toFixed(1),
    蓝弧长: m.blueLen.toFixed(1),
    弧长差: diff.toFixed(2),
    红offset: m.redOff.toFixed(3),
    蓝offset: m.blueOff.toFixed(3),
    线宽: m.sw,
  });

  if (diff > 0.5) problems.push(`${label}: 红蓝弧长差 ${diff.toFixed(2)}px，同进度点亮不等长`);
  if (!(m.redOff > 0 && m.redOff < 1)) problems.push(`${label}: 红方已计分但 offset=${m.redOff}`);
  if (Math.abs(m.blueOff - 1) > 1e-6) problems.push(`${label}: 蓝方未计分但 offset=${m.blueOff}`);
  await page.close();
}

// 减少动画：灯带过渡应被降级
const rmPage = await browser.newPage();
await rmPage.emulateMedia({ reducedMotion: 'reduce' });
await rmPage.setViewportSize({ width: 1600, height: 900 });
await rmPage.goto(URL, { waitUntil: 'networkidle' });
await rmPage.locator('.result-button').first().click();
await rmPage.waitForTimeout(200);
const dur = await rmPage.evaluate(
  () => getComputedStyle(document.querySelector('.lamp-red')).transitionDuration,
);
if (parseFloat(dur) > 0.05) problems.push(`减少动画下灯带过渡仍为 ${dur}`);

await browser.close();
console.table(rows);
console.log(`减少动画下灯带过渡时长: ${dur}`);

if (problems.length) {
  for (const p of problems) console.log('✗', p);
  process.exitCode = 1;
} else {
  console.log('✓ 红蓝弧长对称、进度映射正确、减少动画生效');
}
