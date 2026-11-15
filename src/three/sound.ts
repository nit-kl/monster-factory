// 外部音源不要の効果音・アンビエントBGM。ユーザー操作でのみAudioContextを起動する。
export type SceneMood = 'title' | 'story' | 'hub' | 'design' | 'manufacture' | 'battle' | 'ending';

let context: AudioContext | null = null;
let enabled = false;
let currentMood: SceneMood = 'title';
let bgmTimer: number | null = null;
let stepIndex = 0;

const moodScales: Record<SceneMood, { notes: readonly number[]; intervalMs: number; wave: OscillatorType; volume: number }> = {
  title: { notes: [220, 261.63, 329.63, 392, 329.63, 261.63], intervalMs: 1400, wave: 'sine', volume: 0.025 },
  story: { notes: [196, 246.94, 293.66, 329.63, 293.66, 246.94], intervalMs: 1600, wave: 'sine', volume: 0.02 },
  hub: { notes: [146.83, 220, 293.66, 220, 174.61, 220], intervalMs: 1100, wave: 'triangle', volume: 0.024 },
  design: { notes: [329.63, 392, 493.88, 587.33, 493.88, 392], intervalMs: 1200, wave: 'sine', volume: 0.024 },
  manufacture: { notes: [164.81, 220, 246.94, 329.63, 246.94, 440], intervalMs: 850, wave: 'triangle', volume: 0.028 },
  battle: { notes: [146.83, 146.83, 174.61, 220, 164.81, 130.81], intervalMs: 550, wave: 'sawtooth', volume: 0.022 },
  ending: { notes: [261.63, 329.63, 392, 523.25, 392, 329.63], intervalMs: 1500, wave: 'sine', volume: 0.028 },
};

function stopBgmLoop() {
  if (bgmTimer !== null && typeof window !== 'undefined') {
    window.clearInterval(bgmTimer);
    bgmTimer = null;
  }
}

function playBgmTick() {
  if (!enabled || !context) return;
  try {
    const cfg = moodScales[currentMood];
    const freq = cfg.notes[stepIndex % cfg.notes.length];
    stepIndex++;
    const t = context.currentTime;
    const dur = Math.min(1.2, (cfg.intervalMs / 1000) * 0.85);
    const osc = context.createOscillator(), gain = context.createGain();
    osc.type = cfg.wave;
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(cfg.volume, t + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain).connect(context.destination);
    osc.start(t);
    osc.stop(t + dur);
  } catch {
    /* ignore audio errors in headless environments */
  }
}

function startBgmLoop() {
  stopBgmLoop();
  if (!enabled || !context || typeof window === 'undefined') return;
  playBgmTick();
  bgmTimer = window.setInterval(playBgmTick, moodScales[currentMood].intervalMs);
}

export function setSceneMood(mood: SceneMood) {
  if (currentMood === mood && bgmTimer !== null) return;
  currentMood = mood;
  stepIndex = 0;
  if (enabled) startBgmLoop();
}

export function toggleSound() {
  enabled = !enabled;
  if (enabled) {
    try {
      context ??= new AudioContext();
      void context.resume();
      startBgmLoop();
    } catch {
      enabled = false;
      stopBgmLoop();
    }
  } else {
    stopBgmLoop();
  }
  return enabled;
}

export const soundEnabled = () => enabled;

export function impactSound(special: boolean, tone: number) {
  if (!enabled || !context) return;
  try {
    const t = context.currentTime, duration = special ? 0.55 : 0.16;
    const osc = context.createOscillator(), gain = context.createGain();
    osc.type = special ? 'sawtooth' : 'triangle';
    osc.frequency.setValueAtTime(tone, t);
    osc.frequency.exponentialRampToValueAtTime(Math.max(30, tone * 0.16), t + duration);
    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(special ? 0.09 : 0.05, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + duration);
    osc.connect(gain).connect(context.destination);
    osc.start(t);
    osc.stop(t + duration);
  } catch {
    /* ignore */
  }
}

export function chimeSound(kind: 'birth' | 'win' | 'loss') {
  if (!enabled || !context) return;
  try {
    const notes = kind === 'birth' ? [392, 493.88, 587.33, 783.99] : kind === 'win' ? [329.63, 392, 523.25, 659.25] : [246.94, 220, 174.61];
    notes.forEach((freq, i) => {
      if (!context) return;
      const t = context.currentTime + i * 0.11;
      const osc = context.createOscillator(), gain = context.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.055, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.32);
      osc.connect(gain).connect(context.destination);
      osc.start(t);
      osc.stop(t + 0.34);
    });
  } catch {
    /* ignore */
  }
}
