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
  const fight = async (name, outcome, capture, automatic = false) => {
    await page.locator('.hangar .unit', { hasText: name }).first().click();
    await id('go-battle').click(); await id('battle').waitFor();
    if (capture) {
      await id('signature').waitFor({ timeout: 25000 });
      await page.waitForTimeout(700);
      await page.getByRole('button', { name: '一時停止', exact: true }).click();
      await shot(`skill-${capture}`);
      await page.getByRole('button', { name: '再開', exact: true }).click();
    }
    if (automatic) await id('outcome').waitFor({ timeout: 90000 });
    else await id('skip-battle').click();
    if (outcome) await expect(id('outcome')).toHaveText(outcome);
    await id('leave-battle').click(); await passStory();
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
  await fight('熔炉巨人', '勝利', 'furnace');
  await expect(page.locator('.chapter strong')).toHaveText('3日目');
  await fight('熔炉巨人', '敗北');
  await make('seed', 'ember', '焔花竜');
  await fight('焔花竜', '勝利', 'bloom');
  await expect(page.locator('.chapter strong')).toHaveText('5日目');
  // 既知の相手で、初期個体の固有技も確認する。
  await page.locator('.segmented button', { hasText: '剣士' }).click();
  await fight('鉄霊騎士', null, 'wraith');
  await make('seed', 'spirit', '冥樹の番人');
  await page.locator('.segmented button', { hasText: '剣士' }).click();
  await fight('冥樹の番人', null, 'thorn');
  await make('glass', 'moon', '月晶狼');
  await page.locator('.segmented button', { hasText: '弓兵' }).click();
  await fight('月晶狼', '勝利', 'prism');
  await make('glass', 'spirit', '幽鐘クラゲ');
  await id('go-design').click(); await expect(id('discovery-count')).toHaveText('6 / 6');
  for (const recipe of ['wraith', 'furnace', 'bloom', 'thorn', 'prism', 'bell']) {
    await id(`recipe-${recipe}`).click(); await page.waitForTimeout(500); await shot(`model-${recipe}`);
  }
  await page.getByRole('button', { name: '工場へ戻る', exact: true }).click();
  await fight('幽鐘クラゲ', '勝利', 'bell');
  await expect(page.locator('.chapter')).toContainText('先遣隊');
  await fight('熔炉巨人', '勝利'); await fight('焔花竜', '勝利'); await fight('幽鐘クラゲ', '勝利', null, true);
  await id('ending').waitFor(); await shot('ending');
  await page.reload(); await id('continue').click(); await id('ending').waitFor();
  const save = await page.evaluate(() => JSON.parse(localStorage.getItem('monster-factory/save')));
  expect(save.version).toBe(3); expect(save.discovered).toHaveLength(6);
  expect(errors).toEqual([]);
  console.log('materials playthrough: all six recipes, signatures, chapter ending and resume ok');
} finally { await browser.close(); }
