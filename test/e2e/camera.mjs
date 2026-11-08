import { chromium,expect } from '@playwright/test';
const browser=await chromium.launch({headless:true,channel:'chrome'});
try{
 const page=await browser.newPage({viewport:{width:1440,height:1000}});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:5190');await page.locator('canvas').waitFor();
 await page.waitForTimeout(2500);
 const label=page.getByRole('button',{name:'出撃ゲートを選択',exact:true});
 const initial=await label.boundingBox();const canvas=await page.locator('canvas').boundingBox();
 const x=canvas.x+canvas.width*.6,y=canvas.y+130;
 await page.mouse.move(x,y);await page.mouse.down();await page.mouse.move(x-100,y+30,{steps:15});await page.mouse.up();
 await page.waitForTimeout(1200);const moved=await label.boundingBox();
 if(Math.hypot(initial.x-moved.x,initial.y-moved.y)<8)throw Error('drag did not rotate view');
 await expect(page.getByRole('button',{name:'培養槽を選択',exact:true})).toHaveAttribute('aria-pressed','true');
 await page.waitForTimeout(1200);const settled=await label.boundingBox();
 if(Math.hypot(moved.x-settled.x,moved.y-settled.y)>3)throw Error('camera snapped back after drag');
 await page.getByRole('button',{name:'視点を戻す',exact:true}).click();await page.waitForTimeout(1800);
 await page.getByRole('button',{name:'階段 → 研究フロア',exact:true}).click();await page.waitForTimeout(1800);
 await expect(page.locator('.factory-three')).toHaveAttribute('data-floor','research');
 const researchCanvas=await page.locator('canvas').boundingBox();
 await page.mouse.move(researchCanvas.x+researchCanvas.width*.6,researchCanvas.y+130);await page.mouse.down();await page.mouse.move(researchCanvas.x+researchCanvas.width*.6+70,researchCanvas.y+150,{steps:10});await page.mouse.up();
 await page.getByRole('button',{name:'視点を戻す',exact:true}).click();await page.waitForTimeout(1800);
 await page.getByRole('button',{name:'設計台を選択',exact:true}).click();
 await expect(page.locator('.equipment-detail h2')).toContainText('設計台');
 if(errors.length)throw Error(errors.join('\n'));
 console.log('PASS: drag rotation, no snap-back, reset, floor navigation and equipment selection');
}finally{await browser.close()}

