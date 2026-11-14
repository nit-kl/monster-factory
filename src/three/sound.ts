// 外部音源不要の短い効果音。ユーザー操作でのみAudioContextを起動する。
let context: AudioContext | null = null;
let enabled = false;
export function toggleSound() {
  enabled = !enabled;
  if (enabled) { try { context ??= new AudioContext(); void context.resume(); } catch { enabled = false; } }
  return enabled;
}
export const soundEnabled = () => enabled;
export function impactSound(special: boolean, tone: number) {
  if (!enabled || !context) return;
  const t = context.currentTime, duration = special ? 0.55 : 0.16;
  const osc = context.createOscillator(), gain = context.createGain();
  osc.type = special ? 'sawtooth' : 'triangle'; osc.frequency.setValueAtTime(tone, t); osc.frequency.exponentialRampToValueAtTime(Math.max(30, tone * 0.16), t + duration);
  gain.gain.setValueAtTime(0.0001, t); gain.gain.exponentialRampToValueAtTime(special ? 0.09 : 0.05, t + 0.015); gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
  osc.connect(gain).connect(context.destination); osc.start(t); osc.stop(t + duration);
}
