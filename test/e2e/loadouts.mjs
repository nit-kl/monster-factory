import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
// Isolated browser storage; exercises the same save/resume path as a real player.
const url = process.env.E2E_URL ?? 'http://127.0.0.1:5191';
const browser = await chromium.launch({ channel: 'chrome' });
await mkdir('tmp/loadouts', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  await page.goto(url);
  const cases = [
    ['wraith', 'guard', 'drain', 'iron', 'spirit'], ['furnace', 'guard', 'drain', 'iron', 'ember'],
    ['bloom', 'rush', 'mend', 'seed', 'ember'], ['thorn', 'venom', 'mend', 'seed', 'spirit'],
    ['prism', 'pierce', 'rush', 'glass', 'moon'], ['bell', 'guard', 'mend', 'glass', 'spirit'],
  ];
  for (const [species, first, second, material1, material2] of cases) {
    if (process.env.E2E_SPECIES && !process.env.E2E_SPECIES.split(',').includes(species)) continue;
    await page.evaluate(({ material1, material2 }) => {
      localStorage.setItem('monster-factory/save', JSON.stringify({ version: 3, progress: { step: 16, queue: [], seen: ['birth'], flags: [] }, design: { first: material1, second: material2 }, discovered: ['wraith', 'furnace', 'bloom', 'thorn', 'prism', 'bell'], roster: [], nextId: 1, battles: 0, moved: 0 }));
    }, { material1, material2 });
    await page.reload(); await page.getByTestId('continue').click(); await page.getByTestId('go-design').click();
    await page.getByLabel('通常技 1', { exact: true }).selectOption(first);
    await page.getByLabel('通常技 2', { exact: true }).selectOption(second);
    await page.locator('.specimen-art img').evaluate(img => img.decode());
    await page.screenshot({ path: `tmp/loadouts/design-${species}.png` });
    await page.getByTestId('manufacture').click();
    await page.getByTestId('skip-line').click();
    await page.waitForTimeout(500);
    await page.getByTestId('to-hangar').click();
    await expect(page.getByLabel('通常技 1', { exact: true })).toHaveValue(first);
    await expect(page.getByLabel('通常技 2', { exact: true })).toHaveValue(second);
    // Confirm reconfiguration saves without creating another individual.
    await page.getByLabel('通常技 1', { exact: true }).selectOption('bolt');
    await page.getByLabel('通常技 1', { exact: true }).selectOption(first);
    await page.reload(); await page.getByTestId('continue').click();
    await expect(page.getByLabel('通常技 1', { exact: true })).toHaveValue(first);
    expect(await page.locator('[data-failed="true"]').count()).toBe(0);
  }
  expect(errors).toEqual([]);
} finally { await browser.close(); }
