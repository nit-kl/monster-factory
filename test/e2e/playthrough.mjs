// 序章から第1章の終わりまでを通しで遊ぶブラウザ検証。
// 事前に `npm run build` と `npx vite preview --host 127.0.0.1 --port 5190` を実行しておく。
import { chromium, expect } from '@playwright/test';

const url = process.env.E2E_URL ?? 'http://127.0.0.1:5190';
const shots = process.env.E2E_SHOTS !== '0';
const browser = await chromium.launch({ headless: true, channel: 'chrome', args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
try {
  const page = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  const errors = [];
  page.on('pageerror', e => errors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
  const shot = async name => { if (shots) await page.screenshot({ path: `test/e2e/${name}.png` }); };
  const id = name => page.getByTestId(name);

  /** 会話を最後まで進める。選択肢は first=true なら1番目、false なら最後を選ぶ。 */
  const sceneNow = async () => ((await id('story').count()) ? id('story').getAttribute('data-scene').catch(() => null) : null);
  /** all=false なら、いまの場面が終わったところで止まる。 */
  const passStory = async (first = true, all = true) => {
    const started = await sceneNow();
    for (let i = 0; i < 200; i++) {
      const now = await sceneNow();
      if (!now || (!all && now !== started)) return;
      const choices = page.locator('.choices button');
      if (await choices.count()) await (first ? choices.first() : choices.last()).click();
      else await page.getByRole('button', { name: 'スキップ' }).click().catch(() => {});
      await page.waitForTimeout(60);
    }
    throw Error('会話が終わりません');
  };
  const design = async parts => {
    await id('go-design').click();
    for (const [slot, part] of Object.entries(parts)) await id(`part-${slot}-${part}`).click();
  };
  const manufacture = async () => {
    await id('manufacture').click();
    await id('manufacture-screen').waitFor();
    await id('skip-line').click();
    await id('to-hangar').click();
    await passStory();
    await id('hub').waitFor();
  };
  const fight = async (unitName, expected) => {
    await page.locator('.hangar .unit', { hasText: unitName }).click();
    await id('go-battle').click();
    await id('battle').waitFor();
    await id('skip-battle').click();
    await expect(id('outcome')).toHaveText(expected);
  };

  // ---- タイトル〜序章 ----
  await page.goto(url);
  await page.evaluate(() => localStorage.clear());
  await page.reload();
  await id('title').waitFor();
  await page.waitForTimeout(1200);
  await shot('01-title');
  await id('new-game').click();
  await id('story').waitFor();
  await expect(page.locator('.titlecard')).toContainText('特命');
  await page.locator('.titlecard').click();
  for (let i = 0; i < 6; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(120); await page.keyboard.press('Enter'); await page.waitForTimeout(200); }
  await shot('02-prologue-throne');
  for (let i = 0; i < 6; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(120); await page.keyboard.press('Enter'); await page.waitForTimeout(200); }
  await shot('03-prologue-study');
  await page.getByRole('button', { name: 'ログ' }).click();
  await expect(page.locator('.log-body')).toContainText('面を上げよ');
  await page.keyboard.press('Escape');
  await passStory(false, false);        // 序章の残り
  await id('story').waitFor();
  await expect(id('story')).toHaveAttribute('data-scene', 'arrival');
  await page.locator('.titlecard').click();
  for (let i = 0; i < 16; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); if (await page.locator('.choices button').count()) await page.locator('.choices button').first().click(); }
  await shot('04-arrival');
  await passStory();
  await id('hub').waitFor();
  await page.waitForTimeout(1200);
  await shot('05-hub-empty');
  await expect(id('go-battle')).toBeDisabled();

  // ---- 1日目：初期設計で製造 → 自分の炎で敗北 ----
  await id('go-design').click();
  await id('design').waitFor();
  await expect(page.locator('.notes')).toContainText('自分も');
  await expect(id('part-body-beast')).toBeDisabled();
  await page.waitForTimeout(1200);
  await shot('06-design');
  await id('part-process-heated').click(); await id('part-defense-shell').click();
  await expect(id('manufacture')).toBeDisabled();          // 容量超過
  await id('part-process-standard').click(); await id('part-defense-light').click();
  await id('manufacture').click();
  await id('manufacture-screen').waitFor();
  await page.waitForTimeout(3500); await shot('07-line-culture');
  await page.waitForTimeout(6600); await shot('08-line-graft-attack');
  await page.waitForTimeout(3400); await shot('09-line-graft-defense');
  await page.waitForTimeout(4400); await shot('10-line-inspect');
  await id('to-hangar').waitFor({ timeout: 15000 });
  await page.waitForTimeout(600); await shot('11-line-complete');
  await id('to-hangar').click();
  await expect(id('story')).toHaveAttribute('data-scene', 'birth');
  await passStory();
  await id('hub').waitFor();
  await page.waitForTimeout(1500);
  await shot('12-hub-unit');
  await id('go-battle').click();
  await id('battle').waitFor();
  await page.waitForTimeout(3300);
  await shot('13-battle');
  await id('skip-battle').click();
  await expect(id('outcome')).toHaveText('敗北');
  await expect(page.locator('.report')).toContainText('自分の炎');
  await page.waitForTimeout(700);
  await shot('14-report-loss');
  await id('leave-battle').click();
  await expect(id('story')).toHaveAttribute('data-scene', 'swordLoss');
  await passStory();

  // ---- 石殻に直して勝利 ----
  await design({ defense: 'shell' });
  await page.waitForTimeout(900);
  await shot('15-design-shell');
  await manufacture();
  await fight('焔スライム 002号', '勝利');
  await page.waitForTimeout(700);
  await shot('16-report-win');
  await id('leave-battle').click();
  await passStory(false);               // 勝利・屋上の夜・3日目の説明

  // ---- 3日目：石殻は弓兵に負け、獣型で勝つ ----
  await id('hub').waitFor();
  await expect(page.locator('.chapter strong')).toHaveText('3日目');
  await fight('焔スライム 002号', '敗北');
  await expect(page.locator('.report')).toContainText('追撃');
  await id('leave-battle').click();
  await passStory();
  await design({ body: 'beast', attack: 'claws', defense: 'light' });
  await page.waitForTimeout(900);
  await shot('17-design-beast');
  await manufacture();
  await fight('爪獣型 003号', '勝利');
  await id('leave-battle').click();
  await passStory();

  // ---- 5日目：格納庫の石殻スライムで魔法使いに勝つ ----
  await id('hub').waitFor();
  await expect(page.locator('.chapter strong')).toHaveText('5日目');
  await page.getByRole('button', { name: '仲間に相談' }).click();
  await page.locator('.consult-tabs button', { hasText: 'オルフェン' }).click();
  await expect(page.locator('.consult')).toContainText('再生核は冷気で凍る');
  await page.waitForTimeout(500);
  await shot('18-consult');
  await page.keyboard.press('Escape');
  await id('go-design').click();
  await id('part-body-golem').click(); await id('part-attack-venom').click(); await id('part-defense-regen').click();
  await page.waitForTimeout(900);
  await shot('19-design-golem');
  await page.getByRole('button', { name: '工場へ戻る' }).click();
  await fight('焔スライム 002号', '勝利');
  await id('leave-battle').click();
  await passStory();

  // ---- 7日目：先遣隊を相手ごとの個体で迎え撃つ ----
  await id('hub').waitFor();
  await expect(page.locator('.chapter')).toContainText('先遣隊');
  await fight('焔スライム 002号', '勝利'); await id('leave-battle').click(); await passStory();
  await fight('爪獣型 003号', '勝利'); await id('leave-battle').click(); await passStory();
  await page.locator('.hangar .unit', { hasText: '焔スライム 002号' }).click();
  await id('go-battle').click(); await id('battle').waitFor();
  await page.waitForTimeout(2600); await shot('20-raid-mage');
  await id('skip-battle').click(); await expect(id('outcome')).toHaveText('勝利');
  await id('leave-battle').click();
  await expect(id('story')).toHaveAttribute('data-scene', 'victory');
  await passStory(true, false);
  await expect(id('story')).toHaveAttribute('data-scene', 'night');
  for (let i = 0; i < 7; i++) { await page.keyboard.press('Enter'); await page.waitForTimeout(100); await page.keyboard.press('Enter'); await page.waitForTimeout(150); }
  await page.waitForTimeout(500);
  await shot('21-night');
  await passStory();
  await id('ending').waitFor();
  await page.waitForTimeout(1200);
  await shot('22-ending');

  // ---- 自動保存と再開 ----
  await page.reload();
  await expect(id('continue')).toContainText('第1章 完');
  await id('continue').click();
  await id('ending').waitFor();
  if (errors.length) throw Error(`ページでエラー：\n${errors.join('\n')}`);
  console.log('playthrough: ok');
} finally {
  await browser.close();
}
