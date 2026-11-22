// 会話劇の台本形式と、その読み進め方（純粋な状態機械）。
export type CastId =
  | 'lisette' | 'vargas' | 'orphen' | 'poyon' | 'pluru'
  | 'vera' | 'mimi' | 'arachnea' | 'gradius' | 'noah'
  | 'zelva' | 'maou' | 'maid' | 'captain'
  | 'nephira' | 'seil' | 'luka' | 'grave' | 'gardran'
  | 'rouga' | 'iris' | 'eleanor';
export type BgId = 'black' | 'throne' | 'study' | 'corridor' | 'road' | 'exterior' | 'floor' | 'lab' | 'roof' | 'workshop' | 'tank' | 'gate';
export type Fx = 'shake' | 'flash' | 'glow';
export type Mood = 'normal' | 'angry' | 'cold' | 'sad' | 'surprised' | 'smile' | 'serious';
export type CgId =
  | 'throne_puppet'
  | 'maid_ring'
  | 'world_map'
  | 'cold_welcome'
  | 'first_birth'
  | 'gate_defense'
  | 'broken_seal'
  | 'white_flag'
  | 'broken_horn_memory'
  | 'pluru_crown'
  | 'pluru_encounter'
  | 'quiet_repair'
  | 'last_vigil'
  | 'empty_design'
  | 'factory_morning';
export type Option = { label: string; flag?: string; then: readonly Line[] };
export type Line =
  | { t: 'say'; who: CastId; text: string; as?: string; mood?: Mood }
  | { t: 'narr'; text: string }
  | { t: 'title'; over: string; main: string }
  | { t: 'bg'; bg: BgId }
  | { t: 'cg'; cg: CgId | null; caption?: string; mapStep?: MapStep }
  | { t: 'fx'; fx: Fx }
  | { t: 'clear' }
  | { t: 'choice'; options: readonly Option[] }
  | { t: 'if'; flag: string; then: readonly Line[]; else?: readonly Line[] };

export const say = (who: CastId, text: string, as?: string, mood?: Mood): Line => ({ t: 'say', who, text, as, mood });
export const narr = (text: string): Line => ({ t: 'narr', text });
export const title = (over: string, main: string): Line => ({ t: 'title', over, main });
export const bg = (id: BgId): Line => ({ t: 'bg', bg: id });
export type MapStep = 'war' | 'castle' | 'closed' | 'destination';
export const cg = (id: CgId | null, caption?: string, mapStep?: MapStep): Line => ({ t: 'cg', cg: id, caption, mapStep });
export const fx = (f: Fx): Line => ({ t: 'fx', fx: f });
export const clear: Line = { t: 'clear' };
export const opt = (label: string, then: readonly Line[], flag?: string): Option => ({ label, then, flag });
export const choice = (...options: Option[]): Line => ({ t: 'choice', options });
export const when = (flag: string, then: readonly Line[], otherwise?: readonly Line[]): Line => ({ t: 'if', flag, then, else: otherwise });

/** 台詞の文脈から立ち絵の表情・ポーズ変化を自動推定する（明示指定があればそれを優先）。 */
export function resolveMood(line: Extract<Line, { t: 'say' }>): Mood {
  if (line.mood) return line.mood;
  const t = line.text;
  if (/！？|\?!|なんだと|まさか|しゃべったか|うそ、/.test(t)) return 'surprised';
  if (/触るな|指図するな|ふざけるな|帰れ|追い出|黙ってたのか|隠して|許さない|ぶっ飛ばす|破れええ/.test(t)) return 'angry';
  if (/結構です|お帰り|信用したわけでは|よそ者|事務|線を引|知りません|報告だけ|不適格|冷ややか/.test(t)) return 'cold';
  if (/……|すまない|恨め|死んだ|崩御|寂し|つらい|ごめんなさい/.test(t)) return 'sad';
  if (/ありがとう|よかった|ようこそ|ふふ|嬉しい|大好き|誇り|頑張り|おかえり/.test(t)) return 'smile';
  if (/記録|設計|報告|命令|規約|約束|王命|総員|迎撃/.test(t)) return 'serious';
  return 'normal';
}

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
