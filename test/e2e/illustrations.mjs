import { chromium, expect } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const browser = await chromium.launch({ headless: true, channel: 'chrome' });
const ids = ['throne_puppet', 'maid_ring', 'world_map', 'cold_welcome', 'first_birth', 'gate_defense', 'broken_seal', 'white_flag', 'broken_horn_memory', 'pluru_crown', 'pluru_encounter', 'quiet_repair', 'last_vigil', 'empty_design', 'factory_morning'];
await mkdir('test/e2e/illustrations', { recursive: true });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(process.env.E2E_URL ?? 'http://127.0.0.1:5191');
  for (const id of ids) {
    // Inject a short scene in this isolated browser only; never touch saved progress.
    await page.evaluate(async () => {
      const { useGame } = await import('/src/state/store.ts');
      useGame.getState().toTitle();
    });
    await expect(page.getByTestId('title')).toBeVisible();
    await page.evaluate(async id => {
      const { scenes } = await import('/src/data/script/index.ts');
      const { useGame } = await import('/src/state/store.ts');
      scenes.prologue = [{ t: 'bg', bg: 'floor' }, { t: 'cg', cg: id }, { t: 'narr', text: '工場に、新しい物語が生まれる。' }, { t: 'cg', cg: null }, { t: 'say', who: 'pluru', text: 'ぷる！' }];
      useGame.getState().newGame();
    }, id);
    const figure = page.getByTestId(`cg-${id}`);
    await expect(figure).toBeVisible();
    await figure.locator('img').evaluate(image => image.decode());
    expect(await figure.locator('img').evaluate(image => image.naturalWidth)).toBeGreaterThan(1000);
    await expect(page.locator('.portraits')).toBeHidden();
    await page.waitForTimeout(600);
    const art = await figure.boundingBox(), box = await page.locator('.textbox').boundingBox();
    expect(art.y + art.height).toBeLessThan(box.y);
    if (['first_birth', 'pluru_encounter', 'factory_morning'].includes(id)) await page.screenshot({ path: `test/e2e/illustrations/${id}.png` });
    await page.keyboard.press('Enter');
    await page.keyboard.press('Enter');
    await expect(figure).toHaveCount(0);
    await expect(page.locator('.portraits')).toBeVisible();
  }
  expect(errors).toEqual([]);
  console.log(`Verified ${ids.length} illustrations: load, layout, display and dismissal.`);
} finally {
  await browser.close();
}
