import { useCallback, useEffect, useRef, useState } from 'react';
import { cast } from '../data/cast';
import { enemies } from '../data/enemies';
import { describe, diagnose } from '../domain/battle';
import { useGame } from '../state/store';
import { Arena } from '../three/arena';
import { Canvas3D } from './common';
import { Thumb } from './Portrait';
import { CreatureArt } from './CreatureArt';

type Pop = { id: number; side: 'monster' | 'enemy'; text: string; tone: string };

export function BattleScreen() {
  const battle = useGame(s => s.battle), conclude = useGame(s => s.concludeBattle), go = useGame(s => s.go);
  const [i, setI] = useState(0), [paused, setPaused] = useState(false), [fast, setFast] = useState(false), [report, setReport] = useState(false);
  const [pops, setPops] = useState<Pop[]>([]);
  const arena = useRef<Arena | null>(null), popId = useRef(0);
  const ready = useCallback((a: Arena | null) => { arena.current = a; }, []);
  const log = battle?.result.log ?? [], ended = i >= log.length;

  useEffect(() => {
    if (!battle || paused || report) return;
    if (ended) {
      arena.current?.finish(battle.result.outcome);
      const id = window.setTimeout(() => setReport(true), 1500);
      return () => window.clearTimeout(id);
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
      setPops(p => [...p.slice(-6), ...add]);
      setI(n => n + 1);
    }, i === 0 ? 900 : fast ? 380 : 950);
    return () => window.clearTimeout(id);
  }, [battle, i, paused, fast, ended, report, log]);

  if (!battle) return null;
  const { unit, enemy, result } = battle, foe = enemies[enemy];
  const shown = i ? log[i - 1] : null, monsterHp = shown ? shown.monsterHp : result.maxHp, enemyHp = shown ? shown.enemyHp : foe.hp;
  const won = result.outcome === 'win', t = result.totals, findings = diagnose(result), hurt = Math.max(1, t.taken + t.selfBurn);
  const leave = (toDesign: boolean) => { conclude(); if (toDesign) go('design'); };
  return (
    <div className="screen battle" data-testid="battle" data-outcome={report ? result.outcome : ''}>
      <Canvas3D className="fill" create={h => new Arena(h, unit.design, enemy)} onReady={ready} />
      <div className="shade-top" /><div className="shade-bottom" />
      <header className="duel">
        <div className="side">
          <CreatureArt id={unit.design.body} />
          <strong>{unit.name}</strong>
          <div className="hpbar"><i style={{ width: `${(monsterHp / result.maxHp) * 100}%` }} /></div>
          <span data-testid="monster-hp">{monsterHp} / {result.maxHp}</span>
        </div>
        <div className="turn"><small>巡目</small><b>{shown?.turn ?? 1}</b></div>
        <div className="side foe">
          <CreatureArt id={enemy} />
          <strong>{foe.name}</strong>
          <div className="hpbar"><i style={{ width: `${(enemyHp / foe.hp) * 100}%` }} /></div>
          <span>{enemyHp} / {foe.hp}</span>
        </div>
      </header>
      <div className="pops" aria-hidden="true">{pops.map(p => <span key={p.id} className={`pop ${p.side} ${p.tone}`}>{p.text}</span>)}</div>
      {!report && (
        <>
          <ul className="ticker" aria-live="polite">
            {log.slice(Math.max(0, i - 3), i).map((e, k) => <li key={`${i}-${k}`} className={e.actor}>{describe(e, foe.name)}</li>)}
          </ul>
          <footer className="hud-bottom right">
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
                {t.heal > 0 && <div><dt><i className="dot heal" />再生核の回復</dt><dd>+{t.heal}</dd></div>}
                {t.frozenRegen && <div><dt><i className="dot cold" />再生核</dt><dd>凍結して回復なし</dd></div>}
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
            {!won && <button className="big" onClick={() => leave(true)} data-testid="redesign"><b>設計を見直す</b><small>設計台へ</small></button>}
            <button className="big primary" onClick={() => leave(false)} data-testid="leave-battle"><b>{won ? '記録して戻る' : '工場へ戻る'}</b></button>
          </footer>
        </div>
      )}
    </div>
  );
}
