import { chromium } from '@playwright/test';
const browser=await chromium.launch({headless:true,channel:"chrome"});
const page=await browser.newPage({viewport:{width:1440,height:1000}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:5190');
await page.locator('canvas').waitFor();
await page.waitForTimeout(1500);
if(await page.locator('.staff-hotspot').count())throw Error('factory worker labels remain');
await page.screenshot({path:'test/e2e/factory-3d.png',fullPage:true});
await page.getByRole('button',{name:'視点を戻す'}).click();
await page.getByRole('button',{name:'階段 → 研究フロア',exact:true}).click();
if(await page.locator('.factory-three').getAttribute('data-floor')!=='research')throw Error('research floor navigation failed');
await page.waitForTimeout(1200);
if(await page.getByRole('button',{name:'培養槽を選択',exact:true}).isVisible())throw Error('wrong floor labels visible');
await page.getByRole('button',{name:'器官標本庫を選択',exact:true}).click();
await page.waitForTimeout(1200);
await page.screenshot({path:'test/e2e/research-floor.png',fullPage:true});
await page.getByRole('button',{name:'担当者に相談：オルフェン',exact:true}).click();
await page.locator('.conversation-stage img').evaluate(image=>image.decode());
if(!await page.locator('.dialogue-line').textContent().then(t=>t.includes('研究主任')))throw Error('floor conversation failed');
await page.getByRole('button',{name:'会話を閉じる',exact:true}).click();
if(await page.locator('.factory-three').getAttribute('data-floor')!=='research')throw Error('floor not retained after dialogue');
await page.getByRole('button',{name:'階段 → 製造フロア',exact:true}).click();
await page.waitForTimeout(1200);
if(await page.locator('.factory-three').getAttribute('data-floor')!=='production')throw Error('production return failed');
await page.getByRole('button',{name:'器官接合機を選択'}).click();
if(await page.locator('.equipment-detail h2').textContent() !== '⚒ 器官接合機')throw Error('equipment selection failed');
await page.getByRole('navigation').getByRole('button',{name:'設計'}).click();
await page.getByRole('button',{name:'石殻',exact:true}).click();
if(!await page.locator('.compatibility').textContent().then(t=>t.includes('防ぎます')))throw Error('heat compatibility failed');
await page.getByRole('button',{name:'この設計で製造する'}).click();
await page.getByRole('heading',{name:'完成個体 No.1'}).waitFor({timeout:10000});
if(!await page.locator('.production-panel').textContent().then(t=>t.includes('火炎自傷：0')))throw Error('manufactured stats failed');
await page.getByRole('navigation').getByRole('button',{name:'戦闘'}).click();

await page.getByRole('button',{name:'自動戦闘を実行'}).click();
await page.getByRole('button',{name:'一時停止',exact:true}).click();
const paused=await page.locator('.battle-result summary').textContent();
await page.waitForTimeout(1000);
if(paused!==await page.locator('.battle-result summary').textContent())throw Error('pause failed');
await page.getByRole('button',{name:'結果までスキップ'}).click();
if(!await page.locator('.battle-result h3').textContent().then(t=>t.includes('勝利')))throw Error('battle victory failed');
await page.locator('.battle-sprite').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
await page.screenshot({path:'test/e2e/battle.png',fullPage:true});
await page.getByRole('button',{name:'工場へ戻る'}).click();
await page.locator('canvas').waitFor();
await page.waitForTimeout(1000);
if(await page.locator('canvas').count()!==1)throw Error('canvas lifecycle failed');
await page.getByRole('button',{name:'保存',exact:true}).click();
await page.getByText('このブラウザに保存しました',{exact:true}).waitFor();
await page.reload();
page.once('dialog',dialog=>dialog.accept());
await page.getByRole('button',{name:'読込',exact:true}).click();
await page.getByText('読み込みました',{exact:true}).waitFor();
await page.getByRole('heading',{name:'完成個体 No.1'}).waitFor();
if(!await page.locator('.production-panel').textContent().then(t=>t.includes('火炎自傷：0')))throw Error('save reload failed');
await page.screenshot({path:'test/e2e/factory.png',fullPage:true});
await page.getByRole('button',{name:'バルガスの会話を開く',exact:true}).click();
if(!await page.locator('.dialogue-line').textContent().then(t=>t.includes('設備主任')))throw Error('worker dialogue failed');
await page.getByRole('button',{name:'次へ',exact:true}).click();
await page.getByRole('button',{name:'次へ',exact:true}).click();
await page.getByRole('button',{name:'防御器官を見直す'}).click();
await page.getByRole('button',{name:'石殻',exact:true}).waitFor();
await page.getByRole('button',{name:'オルフェンの会話を開く'}).click();
if(!await page.locator('.dialogue-line').textContent().then(t=>t.includes('研究主任')))throw Error('conversation reset failed');
await page.getByRole('button',{name:'リゼット',exact:true}).click();
await page.locator('.conversation-stage img').evaluate(image=>image.decode());
await page.screenshot({path:'test/e2e/story.png',fullPage:true});
await page.getByRole('navigation').getByRole('button',{name:'設計'}).click();
await page.getByRole('button',{name:'軽装甲',exact:true}).click();
await page.getByRole('button',{name:'高温培養',exact:true}).click();
if(!await page.locator('.compatibility').textContent().then(t=>t.includes('高温培養')))throw Error('process compatibility failed');
await page.getByRole('button',{name:'この設計で製造する'}).click();
await page.getByRole('heading',{name:'完成個体 No.2'}).waitFor({timeout:13000});
if(!await page.locator('.production-panel').textContent().then(t=>t.includes('高温培養')&&t.includes('火炎自傷：0')))throw Error('heated production failed');
await page.getByRole('button',{name:'保存',exact:true}).click();
await page.getByText('このブラウザに保存しました',{exact:true}).waitFor();
await page.reload();
page.once('dialog',dialog=>dialog.accept());
await page.getByRole('button',{name:'読込',exact:true}).click();
await page.getByText('読み込みました',{exact:true}).waitFor();
if(!await page.locator('.production-panel').textContent().then(t=>t.includes('高温培養')))throw Error('process persistence failed');
await page.getByRole('navigation').getByRole('button',{name:'戦闘'}).click();
await page.getByRole('button',{name:'魔法使い',exact:true}).click();
await page.getByText('高温培養の冷気弱点：この相手から受ける攻撃は毎回+5ダメージになります。',{exact:true}).waitFor();
await page.getByRole('button',{name:'自動戦闘を実行'}).click();
await page.getByRole('button',{name:'結果までスキップ'}).click();
if(!await page.locator('.battle-analysis').textContent().then(t=>/追加ダメージ合計：[1-9]/.test(t)))throw Error('cold analysis failed');
await page.locator('.enemy-options img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));
await page.screenshot({path:'test/e2e/mage-battle.png',fullPage:true});
await page.getByRole('button',{name:'弓兵',exact:true}).click();
if(await page.locator('.battle-result').count())throw Error('old enemy replay was not cleared');
await page.getByRole('button',{name:'自動戦闘を実行'}).click();
await page.getByRole('button',{name:'結果までスキップ'}).click();
await page.getByRole('progressbar',{name:'弓兵の耐久力'}).waitFor();
if(errors.length)throw Error(errors.join('\n'));
await browser.close();
console.log('PASS: render, equipment selection, navigation, canvas lifecycle, no page errors');















