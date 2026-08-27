// 量各尺寸下按钮/卡片的实际圆角与高度比，验证比例是否恒定。
import { chromium } from 'playwright';

const SIZES = [
  ['4K', 3840, 2160], ['2K', 2560, 1440], ['桌面', 1600, 900],
  ['平板横屏', 1024, 768], ['iPad Pro 竖屏', 1024, 1366],
  ['手机竖屏', 390, 844], ['小手机', 320, 568], ['矮横屏', 667, 375],
];

const browser = await chromium.launch({
  executablePath: process.env.CHROME_PATH
    ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage();
const rows = [];

for (const [label, w, h] of SIZES) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
  await page.locator('.result-button').first().click();
  await page.waitForTimeout(400);

  const m = await page.evaluate(() => {
    const px = (v) => parseFloat(v) || 0;
    const btn = document.querySelector('.result-button');
    const card = document.querySelector('.score-card');
    const ring = document.querySelector('.progress-ring');
    const bs = getComputedStyle(btn), cs = getComputedStyle(card), rs = getComputedStyle(ring);
    return {
      btnH: Math.round(btn.getBoundingClientRect().height),
      btnR: Math.round(px(bs.borderTopLeftRadius)),
      cardH: Math.round(card.getBoundingClientRect().height),
      cardR: Math.round(px(cs.borderTopLeftRadius)),
      ringR: Math.round(px(rs.borderTopLeftRadius)),
      ringW: Math.round(px(rs.borderTopWidth)),
    };
  });

  rows.push({
    尺寸: `${label} ${w}×${h}`,
    按钮高: m.btnH,
    按钮圆角: m.btnR,
    '圆角/高': (m.btnR / m.btnH).toFixed(3),
    卡片圆角: m.cardR,
    环圆角: m.ringR,
    '环-卡差': m.ringR - m.cardR,
    环线宽: m.ringW,
  });
}

await browser.close();
console.table(rows);

const ratios = rows.map((r) => parseFloat(r['圆角/高']));
const spread = Math.max(...ratios) - Math.min(...ratios);
console.log(`\n按钮圆角比率区间: ${Math.min(...ratios)} – ${Math.max(...ratios)}（跨度 ${spread.toFixed(3)}）`);

const bad = rows.filter((r) => r['环-卡差'] !== r.环线宽);
if (bad.length) {
  console.log('\n✗ 进度环与卡片圆角不同心:');
  for (const b of bad) console.log(`  ${b.尺寸}: 差 ${b['环-卡差']}px，应等于线宽 ${b.环线宽}px`);
  process.exitCode = 1;
} else {
  console.log('✓ 所有尺寸下进度环与卡片弧同心');
}
