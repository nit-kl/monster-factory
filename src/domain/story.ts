// 会話劇の台本形式と、その読み進め方（純粋な状態機械）。
export type CastId = 'lisette' | 'vargas' | 'orphen' | 'poyon' | 'pluru' | 'zelva' | 'maou' | 'maid' | 'captain';
export type BgId = 'black' | 'throne' | 'study' | 'corridor' | 'exterior' | 'floor' | 'lab' | 'roof' | 'workshop' | 'tank' | 'gate';
export type Fx = 'shake' | 'flash' | 'glow';
export type Option = { label: string; flag?: string; then: readonly Line[] };
export type Line =
  | { t: 'say'; who: CastId; text: string; as?: string }
  | { t: 'narr'; text: string }
  | { t: 'title'; over: string; main: string }
  | { t: 'bg'; bg: BgId }
  | { t: 'fx'; fx: Fx }
  | { t: 'clear' }
  | { t: 'choice'; options: readonly Option[] }
  | { t: 'if'; flag: string; then: readonly Line[]; else?: readonly Line[] };

export const say = (who: CastId, text: string, as?: string): Line => ({ t: 'say', who, text, as });
export const narr = (text: string): Line => ({ t: 'narr', text });
export const title = (over: string, main: string): Line => ({ t: 'title', over, main });
export const bg = (id: BgId): Line => ({ t: 'bg', bg: id });
export const fx = (f: Fx): Line => ({ t: 'fx', fx: f });
export const clear: Line = { t: 'clear' };
export const opt = (label: string, then: readonly Line[], flag?: string): Option => ({ label, then, flag });
export const choice = (...options: Option[]): Line => ({ t: 'choice', options });
export const when = (flag: string, then: readonly Line[], otherwise?: readonly Line[]): Line => ({ t: 'if', flag, then, else: otherwise });

export type Cursor = { stack: readonly { lines: readonly Line[]; i: number }[] };

/** 表示できる行まで進める。条件分岐はここで解決する。 */
function settle(stack: { lines: readonly Line[]; i: number }[], flags: ReadonlySet<string>): Cursor {
  for (;;) {
    const top = stack[stack.length - 1];
    if (!top) return { stack };
    if (top.i >= top.lines.length) { stack.pop(); continue; }
    const line = top.lines[top.i];
    if (line.t !== 'if') return { stack };
    stack[stack.length - 1] = { lines: top.lines, i: top.i + 1 };
    const branch = flags.has(line.flag) ? line.then : line.else;
    if (branch?.length) stack.push({ lines: branch, i: 0 });
  }
}
export const begin = (lines: readonly Line[], flags: ReadonlySet<string>): Cursor => settle([{ lines, i: 0 }], flags);
export function current(c: Cursor): Line | null {
  const top = c.stack[c.stack.length - 1];
  return top ? top.lines[top.i] : null;
}
/** 1行進める。選択肢の行では choiceIndex が必要。選んだ選択肢のフラグを返す。 */
export function advance(c: Cursor, flags: ReadonlySet<string>, choiceIndex = 0): { cursor: Cursor; flag?: string } {
  const line = current(c);
  if (!line) return { cursor: c };
  const stack = c.stack.map(f => ({ ...f }));
  stack[stack.length - 1].i++;
  let flag: string | undefined, nextFlags = flags;
  if (line.t === 'choice') {
    const option = line.options[Math.max(0, Math.min(line.options.length - 1, choiceIndex))];
    flag = option.flag;
    if (flag) nextFlags = new Set([...flags, flag]);
    if (option.then.length) stack.push({ lines: option.then, i: 0 });
  }
  return { cursor: settle(stack, nextFlags), flag };
}
