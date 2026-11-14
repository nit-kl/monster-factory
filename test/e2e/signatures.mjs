import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

// 固有技で倒した場合も、途中で戦闘が終了しないことと一時停止を確認する。
const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
await mkdir('test/e2e/materials', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  await page.goto(process.env.E2E_URL ?? 'http://127.0.0.1:5190');
  for (const [recipe, first, second, enemy] of [
    ['prism', 'glass', 'moon', '弓兵'], ['bell', 'glass', 'spirit', '魔法使い'], ['furnace', 'iron', 'ember', '剣士'],
  ]) {
    const design = { first, second };
    await page.evaluate(save => localStorage.setItem('monster-factory/save', JSON.stringify(save)), {
      version: 3, progress: { step: 11, queue: [], seen: ['birth'], flags: [] }, design,
      roster: [{ id: 1, design, wins: 0, losses: 0 }], nextId: 2, battles: 5, moved: 0, discovered: [recipe],
    });
    await page.reload(); await page.getByTestId('continue').click();
    await page.locator('.segmented button', { hasText: enemy }).click();
    await page.getByTestId('go-battle').click();
    await page.getByTestId('signature').waitFor({ timeout: 30000 });
    await page.waitForTimeout(550);
    await page.getByRole('button', { name: '一時停止', exact: true }).click();
    const header = await page.locator('.duel').innerText();
    await page.waitForTimeout(500);
    expect(await page.locator('.duel').innerText()).toBe(header);
    await expect(page.getByTestId('signature')).toBeVisible();
    await page.screenshot({ path: `test/e2e/materials/signature-final-${recipe}.png` });
    await page.getByRole('button', { name: '再開', exact: true }).click();
    await expect(page.getByTestId('outcome')).toHaveText('勝利', { timeout: 40000 });
  }
  expect(errors).toEqual([]);
  console.log('signature playback: pause, effects, automatic finishing blows ok');
} finally { await browser.close(); }
