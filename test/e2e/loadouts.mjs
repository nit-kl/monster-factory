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
  const freezeAt = skill => page.evaluate(skill => {
    const observer = new MutationObserver(() => {
      const battle = document.querySelector('[data-testid="battle"]');
      if (battle?.getAttribute('data-skill') !== skill || battle.getAttribute('data-actor') !== 'monster') return;
      const pause = [...document.querySelectorAll('button')].find(b => b.textContent === '一時停止');
      if (pause) { observer.disconnect(); pause.click(); }
    });
    observer.observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['data-skill', 'data-actor'] });
  }, skill);
  const cases = [
    ['wraith', 'guard', 'drain', 'swordsman', 'iron', 'spirit'], ['furnace', 'guard', 'drain', 'archer', 'iron', 'ember'],
    ['bloom', 'rush', 'mend', 'archer', 'seed', 'ember'], ['thorn', 'venom', 'mend', 'swordsman', 'seed', 'spirit'],
    ['prism', 'pierce', 'rush', 'archer', 'glass', 'moon'], ['bell', 'guard', 'mend', 'mage', 'glass', 'spirit'],
  ];
  for (const [species, first, second, enemy, material1, material2] of cases) {
    if (process.env.E2E_SPECIES && !process.env.E2E_SPECIES.split(',').includes(species)) continue;
    await page.evaluate(({ material1, material2 }) => {
      localStorage.setItem('monster-factory/save', JSON.stringify({ version: 3, progress: { step: 16, queue: [], seen: ['birth'], flags: [] }, design: { first: material1, second: material2 }, discovered: ['wraith', 'furnace', 'bloom', 'thorn', 'prism', 'bell'], roster: [], nextId: 1, battles: 0, moved: 0 }));
    }, { material1, material2 });
    await page.reload(); await page.getByTestId('continue').click(); await page.getByTestId('go-design').click();
    await page.getByLabel('通常技 1', { exact: true }).selectOption(first);
    await page.getByLabel('通常技 2', { exact: true }).selectOption(second);
    const firstName = await page.getByLabel('通常技 1', { exact: true }).locator('option:checked').textContent();
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
    const names = { swordsman: '剣士', archer: '弓兵', mage: '魔法使い' };
    await page.locator('.segmented button', { hasText: names[enemy] }).click();
    await freezeAt(first);
    await page.getByTestId('go-battle').click();
    await page.getByRole('button', { name: '早送り', exact: true }).click();
    await expect(page.getByRole('button', { name: '再開', exact: true })).toBeVisible({ timeout: 20000 });
    await expect(page.locator(`[data-testid="battle"][data-actor="monster"][data-skill="${first}"]`)).toBeVisible({ timeout: 20000 });
    await expect(page.getByTestId('normal-skill')).toContainText(firstName);
    await page.screenshot({ path: `tmp/loadouts/battle-${species}.png` });
    const hp = await page.getByTestId('monster-hp').textContent();
    await page.waitForTimeout(700); await expect(page.getByTestId('monster-hp')).toHaveText(hp);
    if (species !== 'furnace') {
      await freezeAt(`signature-${species}`);
      await page.getByRole('button', { name: '再開', exact: true }).click();
      await expect(page.locator(`[data-testid="battle"][data-actor="monster"][data-skill="signature-${species}"]`)).toBeVisible({ timeout: 20000 });
      await expect(page.getByRole('button', { name: '再開', exact: true })).toBeVisible();
      await page.screenshot({ path: `tmp/loadouts/signature-${species}.png` });
    }
    await page.getByTestId('skip-battle').click();
    await expect(page.getByRole('dialog', { name: '戦後報告' })).toBeVisible();
    expect(await page.locator('[data-failed="true"]').count()).toBe(0);
    console.log(`${species}: art, manufacture, reconfigure, save/resume, ${first}/${second}, pause and report passed`);
  }
  expect(errors).toEqual([]);
} finally { await browser.close(); }
