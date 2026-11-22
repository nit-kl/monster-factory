import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
const url = process.env.E2E_URL ?? 'http://127.0.0.1:5190';
const shots = process.env.E2E_SHOTS !== '0';
const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
await mkdir('test/e2e/materials', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  const id = key => page.getByTestId(key);
  const shot = async name => {
    await page.locator('img').evaluateAll(images => Promise.all(images.map(img => img.decode())));
    expect(await page.locator('[data-failed="true"]').count()).toBe(0);
    if (shots) await page.screenshot({ path: `test/e2e/materials/${name}.png` });
  };
  const passStory = async () => {
    for (let n = 0; n < 150; n++) {
      if (!await id('story').count()) return;
      const choices = page.locator('.choices button');
      if (await choices.count()) await choices.first().click();
      else await page.getByRole('button', { name: 'スキップ', exact: true }).click();
      await page.waitForTimeout(70);
    }
    throw Error('会話が終了しません');
  };
  const select = async (first, second) => {
    await id('slot-first').click(); await id(`material-${first}`).click();
    await id('slot-second').click(); await id(`material-${second}`).click();
  };
  const make = async (first, second, name, full = false) => {
    await id('go-design').click(); await select(first, second);
    await expect(id('manufacture')).toBeEnabled();
    await id('manufacture').click(); await id('manufacture-screen').waitFor();
    if (full) {
      await page.waitForTimeout(1600); await shot('02-material-resonance');
      await page.waitForTimeout(6000); await shot('03-life-formation');
      await id('to-hangar').waitFor({ timeout: 30000 });
    } else await id('skip-line').click();
    await expect(page.locator('.finished')).toContainText(name);
    await page.waitForTimeout(400); await shot(`birth-${name}`);
    await id('to-hangar').click(); await passStory(); await id('hub').waitFor();
  };
  const proceed = async () => {
    await id('continue-story').click();
    await passStory();
  };
  await page.goto(url); await page.evaluate(() => localStorage.clear()); await page.reload();
  await id('new-game').click(); await passStory(); await id('hub').waitFor();
  await id('go-design').click();
  await expect(id('material-seed')).toBeDisabled();
  await select('iron', 'iron'); await expect(id('manufacture')).toBeDisabled();
  await select('iron', 'spirit'); await expect(page.locator('.specimen-label')).toContainText('未知');
  await shot('01-unknown-recipe');
  await page.getByRole('button', { name: '工場へ戻る', exact: true }).click();
  await make('iron', 'spirit', '鉄霊騎士', true);
  await make('iron', 'ember', '熔炉巨人');
  await proceed();
  await expect(page.locator('.chapter strong')).toHaveText('3日目');

  await make('seed', 'ember', '焔花竜');
  await proceed();
  await expect(page.locator('.chapter strong')).toHaveText('5日目');

  await make('seed', 'spirit', '冥樹の番人');

  await make('glass', 'moon', '月晶狼');

  await make('glass', 'spirit', '幽鐘クラゲ');
  await id('go-design').click(); await expect(id('discovery-count')).toHaveText('6 / 6');
  for (const recipe of ['wraith', 'furnace', 'bloom', 'thorn', 'prism', 'bell']) {
    await id(`recipe-${recipe}`).click(); await page.waitForTimeout(500); await shot(`model-${recipe}`);
  }
  await page.getByRole('button', { name: '工場へ戻る', exact: true }).click();
  await proceed();
  // 第1章完 → 第2章「孤立無援の防衛戦」へ進む
  await id('ending').waitFor();
  await id('start-chapter2').click();
  await passStory();
  for (let i = 0; i < 5; i++) await proceed();
  await id('ending').waitFor(); await shot('ending');
  await page.reload(); await id('continue').click(); await id('ending').waitFor();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('monster-factory/save')));
  expect(save.version).toBe(3); expect(save.discovered).toHaveLength(6);
  expect(errors).toEqual([]);
  console.log('materials playthrough: all six recipes, chapter ending and resume ok');
} finally { await browser.close(); }
