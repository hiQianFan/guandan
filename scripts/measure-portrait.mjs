// 量竖屏各元素的实际位置与空隙，定位死区来源。
import { chromium } from 'playwright';

const browser = await chromium.launch({
  executablePath:
    process.env.CHROME_PATH ??
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
});
const page = await browser.newPage();
await page.setViewportSize({ width: 1024, height: 1366 });
await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });
await page.locator('.result-button').first().click();
await page.waitForTimeout(600);

const data = await page.evaluate(() => {
  const r = (sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) };
  };
  const btns = [...document.querySelectorAll('.result-button')].slice(0, 3).map((e) => {
    const b = e.getBoundingClientRect();
    return { y: Math.round(b.y), h: Math.round(b.height), bottom: Math.round(b.bottom) };
  });
  return {
    layout: r('.scoreboard-layout'),
    scoreArea: r('.score-area'),
    rail: r('.arrow-rail'),
    arrow: r('.arrow-rail .arrow-wrapper'),
    progressRoot: r('.level-progress-root'),
    card: r('.score-area [role="status"]'),
    redPanel: r('.red-area'),
    stack: r('.side-panel-stack'),
    btns,
    undo: r('.undo-action'),
  };
});

const { scoreArea, rail, arrow, progressRoot, card, redPanel, btns, undo } = data;
console.log(JSON.stringify(data, null, 2));
console.log('\n--- 关键空隙 ---');
console.log('轨底 → 卡片顶:', card.y - (rail.y + rail.h));
console.log('卡片底 → 级数区底:', scoreArea.y + scoreArea.h - (card.y + card.h));
console.log('级数区底 → 首个按钮顶:', btns[0].y - (scoreArea.y + scoreArea.h));
console.log('按钮间距:', btns[1].y - btns[0].bottom);
console.log('末按钮底 → 撤销顶:', undo.y - btns[2].bottom);
console.log('撤销底 → 侧栏底:', redPanel.y + redPanel.h - (undo.y + undo.h));
console.log('\n--- 宽度 ---');
console.log('级数区宽:', scoreArea.w, ' 卡片外框宽:', progressRoot.w, ' 卡片宽:', card.w);
console.log('轨宽:', rail.w, ' 箭头 x:', arrow.x, ' 卡片 x:', card.x);

await browser.close();
