import { useCallback, useEffect, useRef, useState } from 'react';
import { cast } from '../data/cast';
import { enemies } from '../data/enemies';
import { describe, diagnose } from '../domain/battle';
import { useGame } from '../state/store';
import { Arena } from '../three/arena';
import { Canvas3D } from './common';
import { Thumb } from './Portrait';
import { CreatureArt } from './CreatureArt';
import { MonsterIcon } from './RecipeArt';
import { recipeFor } from '../domain/design';
import { unitTitle } from '../domain/manufacture';
import { chimeSound, toggleSound, soundEnabled } from '../three/sound';
import { enemySkills } from '../data/skills';
import { MoveSummary } from './MoveEditor';

type Pop = { id: number; side: 'monster' | 'enemy'; text: string; tone: string };

export function BattleScreen() {
  const battle = useGame(s => s.battle), conclude = useGame(s => s.concludeBattle), go = useGame(s => s.go);
  const [i, setI] = useState(0), [paused, setPaused] = useState(false), [fast, setFast] = useState(false), [report, setReport] = useState(false);
  const [pops, setPops] = useState<Pop[]>([]);
  const [sound, setSound] = useState(soundEnabled);
  const arena = useRef<Arena | null>(null), popId = useRef(0);
  const ready = useCallback((a: Arena | null) => { arena.current = a; }, []);
  useEffect(() => { if (arena.current) { arena.current.paused = paused; arena.current.speed = fast ? 2 : 1; } }, [paused, fast]);
  const log = battle?.result.log ?? [], ended = i >= log.length;

  useEffect(() => {
    if (!battle || paused || report) return;
    if (ended) {
      // 最後の一撃も最後まで見せてから、倒れる動作と結果へ進む。
      const duration = (log.at(-1)?.special ? 1800 : 1000) / (fast ? 2 : 1);
      const finish = window.setTimeout(() => {
        arena.current?.finish(battle.result.outcome);
        chimeSound(battle.result.outcome === 'win' ? 'win' : 'loss');
      }, duration);
      const id = window.setTimeout(() => setReport(true), duration + 1500);
      return () => { window.clearTimeout(finish); window.clearTimeout(id); };
    }
    const id = window.setTimeout(() => {
      const e = log[i];
      arena.current?.play(e);
      const add: Pop[] = [];
      const pop = (side: Pop['side'], text: string, tone: string) => add.push({ id: popId.current++, side, text, tone });
      if (e.actor === 'monster') { pop('enemy', `-${e.damage}`, 'hit'); if (e.selfBurn) pop('monster', `自分の炎 -${e.selfBurn}`, 'burn'); }
      if (e.actor === 'enemy') pop('monster', `-${e.damage}${e.cold ? '　冷気！' : ''}`, e.cold ? 'cold' : 'hit');
      if (e.poison) pop('enemy', `毒 -${e.poison}`, 'poison');
      if (e.heal) pop('monster', `+${e.heal}`, 'heal');
      if (e.guard) pop(e.actor === 'enemy' ? 'enemy' : 'monster', `防御 +${e.guard}`, 'cold');
      setPops(p => [...p.slice(-6), ...add]);
      setI(n => n + 1);
    }, i === 0 ? 900 : (log[i - 1]?.special ? 1800 : 1000) / (fast ? 2 : 1));
    return () => window.clearTimeout(id);
  }, [battle, i, paused, fast, ended, report, log]);

  if (!battle) return null;
  const { unit, enemy, result } = battle, foe = enemies[enemy];
  const shown = i ? log[i - 1] : null, monsterHp = shown ? shown.monsterHp : result.maxHp, enemyHp = shown ? shown.enemyHp : foe.hp;
  const won = result.outcome === 'win', t = result.totals, findings = diagnose(result), hurt = Math.max(1, t.taken + t.selfBurn);
  const recipe = recipeFor(unit.design)!;
  const attacks = log.slice(0, i).filter(e => e.actor === 'monster').length;
  const leave = (toDesign: boolean) => { conclude(); if (toDesign) go('design'); };
  return (
    <div className="screen battle" data-testid="battle" data-outcome={report ? result.outcome : ''} data-skill={shown?.skill ?? ''} data-actor={shown?.actor ?? ''}>
      <Canvas3D className="fill" create={h => new Arena(h, unit.design, enemy)} onReady={ready} />
      <div className="shade-top" /><div className="shade-bottom" />
      <header className="duel">
        <div className="side">
          <MonsterIcon id={recipeFor(unit.design)!.id} />
          <strong>{unitTitle(unit)}</strong>
          <div className="hpbar"><i style={{ width: `${(monsterHp / result.maxHp) * 100}%` }} /></div>
          <span data-testid="monster-hp">{monsterHp} / {result.maxHp}</span>
          <div className="ability-charge"><span>{recipe.skill}</span><span>{[0, 1, 2].map(n => <i key={n} className={n < attacks % 3 ? 'charged' : ''} />)}</span><small>3回目の攻撃で発動</small></div>
          <MoveSummary recipe={recipe.id} selected={unit.stats.moves} />
        </div>
        <div className="turn"><small>巡目</small><b>{shown?.turn ?? 1}</b></div>
        <div className="side foe">
          <CreatureArt id={enemy} />
          <strong>{foe.name}</strong>
          <div className="hpbar"><i style={{ width: `${(enemyHp / foe.hp) * 100}%` }} /></div>
          <span>{enemyHp} / {foe.hp}</span>
          <p className="move-summary">{enemySkills[enemy].map(s => s.name).join(' → ')}</p>
        </div>
      </header>
      {shown && shown.actor !== 'effects' && !report && <div className={`ability-banner ${shown.special ? '' : 'normal-skill'}`} key={i} style={{ borderColor: shown.color }} data-testid={shown.special ? 'signature' : 'normal-skill'}><small>{shown.actor === 'monster' ? unitTitle(unit) : foe.name} · {shown.special ? '固有技' : '通常技'}</small><strong style={{ color: shown.color }}>{shown.skillName}</strong><span>{shown.damage} DAMAGE{shown.heal ? ` ／ 回復 ${shown.heal}` : ''}{shown.guard ? ` ／ 防御 ${shown.guard}` : ''}</span></div>}
      <div className="pops" aria-hidden="true">{pops.map(p => <span key={p.id} className={`pop ${p.side} ${p.tone}`}>{p.text}</span>)}</div>
      {!report && (
        <>
          <ul className="ticker" aria-live="polite">
            {log.slice(Math.max(0, i - 3), i).map((e, k) => <li key={`${i}-${k}`} className={e.actor}>{describe(e, foe.name)}</li>)}
          </ul>
          <footer className="hud-bottom right">
            <button onClick={() => setSound(toggleSound())} aria-pressed={sound}>効果音：{sound ? '入' : '切'}</button>
            <button onClick={() => setPaused(p => !p)} aria-pressed={paused}>{paused ? '再開' : '一時停止'}</button>
            <button onClick={() => setFast(f => !f)} aria-pressed={fast}>早送り{fast ? '：入' : ''}</button>
            <button onClick={() => { setI(log.length); setReport(true); arena.current?.finish(result.outcome); }} data-testid="skip-battle">結果へ</button>
          </footer>
        </>
      )}
      {report && (
        <div className="report panel" role="dialog" aria-label="戦後報告">
          <header className={won ? 'win' : 'loss'}>
            <small>戦後報告</small>
            <h1 data-testid="outcome">{won ? '勝利' : result.outcome === 'draw' ? '引き分け' : '敗北'}</h1>
            <p>{result.turns}巡目で決着 ／ {result.enemyFirst ? `${foe.name}が先手` : '味方が先手'} ／ 残り耐久 {result.monsterHp}</p>
          </header>
          <div className="report-grid">
            <section>
              <h2>損害の内訳</h2>
              <div className="split" title="受けた損害の内訳">
                <i className="foe" style={{ flex: Math.max(0, t.taken - t.cold) }} /><i className="cold" style={{ flex: t.cold }} /><i className="burn" style={{ flex: t.selfBurn }} />
              </div>
              <dl>
                <div><dt><i className="dot foe" />{foe.name}の攻撃</dt><dd>{t.taken - t.cold}</dd></div>
                {t.cold > 0 && <div><dt><i className="dot cold" />冷気の弱点</dt><dd>{t.cold}</dd></div>}
                {t.selfBurn > 0 && <div><dt><i className="dot burn" />自分の炎</dt><dd>{t.selfBurn}（{Math.round((t.selfBurn / hurt) * 100)}%）</dd></div>}
                {t.heal > 0 && <div><dt><i className="dot heal" />生命の再生</dt><dd>+{t.heal}</dd></div>}
                {t.frozenRegen && <div><dt><i className="dot cold" />再生能力</dt><dd>凍結して回復なし</dd></div>}
                <div className="sep"><dt>与えた損害</dt><dd>{t.dealt}{t.poison ? ` ＋ 毒 ${t.poison}` : ''}</dd></div>
                {t.blocked > 0 && <div><dt>盾に防がれた</dt><dd>{t.blocked}</dd></div>}
                {t.extraShots > 0 && <div><dt>受けた追撃</dt><dd>{t.extraShots}回</dd></div>}
              </dl>
            </section>
            <section>
              <h2>分析</h2>
              <ul className="findings">
                {findings.map(f => (
                  <li key={f.title}><Thumb id={f.who} /><div><strong>{f.title}</strong><p><b style={{ color: cast[f.who].color }}>{cast[f.who].name}</b>「{f.text}」</p></div></li>
                ))}
              </ul>
            </section>
          </div>
          <footer className="row end">
            {!won && <button className="big" onClick={() => leave(true)} data-testid="redesign"><b>配合を見直す</b><small>配合台へ</small></button>}
            <button className="big primary" onClick={() => leave(false)} data-testid="leave-battle"><b>{won ? '記録して戻る' : '工場へ戻る'}</b></button>
          </footer>
        </div>
      )}
    </div>
  );
}
