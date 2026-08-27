// 验证矩阵：实测各尺寸下的渲染尺寸与比例。
// 用法：npm run build && npx vite preview --port 4173 & node scripts/verify-proportions.mjs
import { chromium } from 'playwright';

const URL = process.env.URL ?? 'http://localhost:4173/';

const SIZES = [
  ['4K', 3840, 2160],
  ['2K', 2560, 1440],
  ['桌面宽屏', 1920, 1080],
  ['桌面标准', 1600, 900],
  ['笔记本', 1440, 900],
  ['上网本', 1366, 768],
  ['平板横屏', 1024, 768],
  ['iPad Pro 竖屏', 1024, 1366],
  ['iPad Air 竖屏', 820, 1180],
  ['平板竖屏', 768, 1024],
  ['手机竖屏', 390, 844],
  ['小手机竖屏', 320, 568],
  ['手机横屏', 844, 390],
  ['矮横屏', 667, 375],
  ['极矮横屏', 568, 320],
  ['中间尺寸A', 900, 500],
  ['中间尺寸B', 1100, 620],
  ['分屏窗口', 600, 800],
];

// 取第一个真正可见的匹配元素（同一选择器可能同时命中被 CSS 隐藏的副本）
const box = async (page, sel) => {
  const els = page.locator(sel);
  for (let i = 0; i < (await els.count()); i++) {
    const el = els.nth(i);
    if (await el.isVisible()) return el.boundingBox();
  }
  return null;
};

// 复用系统已装的 Chrome，避免再下载 playwright 自带的浏览器
const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage();
const rows = [];
const problems = [];

for (const [label, w, h] of SIZES) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto(URL, { waitUntil: 'networkidle' });

  // 触发一局，让箭头显示出来
  await page.locator('.result-button').first().click();
  await page.waitForTimeout(450);

  const panel = await box(page, '.side-panel-root');
  const btn = await box(page, '.result-button');
  const undo = await box(page, '.undo-action');
  // 竖屏箭头在 .arrow-rail 内，横屏在侧栏内；取当前实际可见的那份
  const arrow =
    (await box(page, '.arrow-rail .arrow-wrapper')) ??
    (await box(page, '.side-panel-root .arrow-wrapper'));
  const scoreArea = await box(page, '.score-area');

  const numFont = await page
    .locator('.score-number')
    .first()
    .evaluate((el) => parseFloat(getComputedStyle(el).fontSize));

  // 操作区填充率：四个按钮实占高度 / 侧栏高度，用于发现死区
  const stackH = await page.evaluate(() => {
    const btns = [...document.querySelectorAll('.result-button')].slice(0, 3);
    const u = document.querySelector('.undo-action');
    if (!btns.length || !u) return null;
    const top = Math.min(...btns.map((b) => b.getBoundingClientRect().top));
    const bottom = Math.max(
      ...btns.map((b) => b.getBoundingClientRect().bottom),
      u.getBoundingClientRect().bottom,
    );
    return bottom - Math.min(top, u.getBoundingClientRect().top);
  });

  const row = {
    label: `${label} ${w}×${h}`,
    panelH: panel && Math.round(panel.height),
    btnH: btn && Math.round(btn.height),
    undoH: undo && Math.round(undo.height),
    arrowH: arrow && Math.round(arrow.height),
    'arrow/btn': arrow && btn ? (arrow.height / btn.height).toFixed(2) : null,
    numFont: Math.round(numFont),
    '填充率': panel && stackH ? `${Math.round((stackH / panel.height) * 100)}%` : null,
  };
  rows.push(row);

  // 断言：触控目标不低于 44px
  for (const [name, b] of [['result', btn], ['undo', undo]]) {
    if (b && (b.height < 43.5 || b.width < 43.5)) {
      problems.push(`${row.label}: ${name} ${Math.round(b.width)}×${Math.round(b.height)} < 44px`);
    }
  }

  // 断言：无横向溢出
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  if (overflow > 1) problems.push(`${row.label}: 横向溢出 ${overflow}px`);

  // 断言：箭头与按钮不重叠
  if (arrow && btn && arrow.y + arrow.height > btn.y + 1 && arrow.x < btn.x + btn.width && btn.x < arrow.x + arrow.width) {
    problems.push(`${row.label}: 箭头与按钮重叠`);
  }
}

await browser.close();

console.table(rows);
if (problems.length) {
  console.log('\n发现问题:');
  for (const p of problems) console.log('  ✗', p);
  process.exitCode = 1;
} else {
  console.log('\n✓ 全部 %d 个尺寸通过：触控 ≥44px、无溢出、无重叠', SIZES.length);
}
