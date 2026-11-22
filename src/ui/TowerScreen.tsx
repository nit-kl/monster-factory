import { useEffect, useState } from 'react';
import { monsterArt } from '../data/monsterArt';
import { unitTitle } from '../domain/manufacture';
import type { Order } from '../domain/towerBattle';
import { useGame } from '../state/store';
import { impactSound, chimeSound } from '../three/sound';
import './tower.css';

function Fighter({ name, art, hp, max }: { name: string; art: string; hp: number; max: number }) {
  return <div className={'tower-fighter' + (hp <= 0 ? ' down' : '')}>
    <img src={art} alt="" /><div><strong>{name}</strong><progress value={hp} max={max} aria-label={name + 'の耐久'} /></div>
  </div>;
}

export function TowerScreen() {
  const fight = useGame(s => s.towerBattle)!;
  const order = useGame(s => s.orderTower), conclude = useGame(s => s.concludeBattle);
  const [selected, select] = useState(fight.allies[0].unit.id);
  const [animating, animate] = useState(false);
  const [lastOrder, remember] = useState<Order>('cover');
  useEffect(() => {
    if (!animating) return;
    const timer = setTimeout(() => animate(false), 850);
    return () => clearTimeout(timer);
  }, [animating]);
  const living = fight.allies.filter(a => a.hp > 0);
  const actor = living.find(a => a.unit.id === selected) ?? living[0];
  const exposed = fight.round % 2 === 1;
  function command(action: Order) {
    if (!actor || animating || fight.outcome) return;
    remember(action); animate(true); order(actor.unit.id, action);
    const result = useGame.getState().towerBattle?.outcome;
    if (result) chimeSound(result); else impactSound(action === 'focus', 1);
  }
  return <main className="tower-stage" data-testid="battle" data-outcome={fight.outcome ?? ''}>
    <header><small>第2章　外門防衛線</small><h1>第二換気塔の防衛</h1>
    <div>換気塔 <b>{'◆'.repeat(fight.tower)}{'◇'.repeat(3 - fight.tower)}</b>　 防衛 {fight.round} / 5 巡</div></header>
    <section className={'tower-field ' + (animating ? 'resolving ' + lastOrder : '')} aria-label="戦場">
      <div className="tower-team">{fight.allies.map(a => <Fighter key={a.unit.id} name={unitTitle(a.unit)} art={monsterArt[a.unit.stats.recipe]} hp={a.hp} max={a.unit.stats.hp} />)}</div>
      <div className="tower-team foes"><Fighter name="近衛盾兵" art="/assets/battle/swordsman-v1.png" hp={fight.guard} max={72} /><Fighter name="焼夷弓兵" art="/assets/battle/archer-v1.png" hp={fight.archer} max={62} /></div>
    </section>
    <footer><div aria-live="polite" className="tower-orders"><h2>{fight.outcome ? (fight.outcome === 'win' ? '換気塔を防衛した' : '防衛線が突破された') : fight.archer <= 0 ? '残る盾兵を押し返せ' : exposed ? '弓兵が盾の外へ。迎撃の好機！' : '盾の背後から、弓兵が塔を狙う'}</h2>
    {fight.outcome ? <button className="primary" onClick={conclude} data-testid="leave-battle">工場へ帰還</button> : <>
    <div className="tower-select">{living.map(a => <button key={a.unit.id} disabled={animating} aria-pressed={actor?.unit.id === a.unit.id} onClick={() => select(a.unit.id)}>{unitTitle(a.unit)}</button>)}</div>
    <div className="tower-commands">{([['cover','かばう','射線に入り塔を守る'],['intercept','迎撃','隙を突くか速度14で射撃阻止'],['focus','集中攻撃','護衛を抜け弓兵を狙う']] as const).map(([id,title,detail]) => <button key={id} disabled={animating} onClick={() => command(id)}><b>{title}</b><small>{detail}</small></button>)}</div></>}
    </div><div className="tower-log">{fight.log.length ? fight.log.map((entry,i) => <div key={i}>{entry}</div>) : '味方を選んで指示を出してください。両敵の撃破、または5巡の防衛で勝利します。'}</div></footer>
  </main>;
}
