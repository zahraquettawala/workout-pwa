'use client';

import { useEffect, useRef, useState } from 'react';

export type Segment = { label?: string; sec: number; tone?: 'work' | 'rest' };

type ItemTimerProps = {
  segments: Segment[];
  color: string;
  onComplete: () => void;
  // Saves the timer so it survives the app being backgrounded, locked or reloaded.
  storageKey?: string;
};

let audioCtx: AudioContext | null = null;

function ensureAudio() {
  try {
    if (!audioCtx) {
      const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtx = new AC();
    }
    void audioCtx.resume();
  } catch {}
}

function beep(freq: number, ms: number) {
  try {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.frequency.value = freq;
    gain.gain.value = 0.15;
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start();
    osc.stop(audioCtx.currentTime + ms / 1000);
  } catch {}
}

function fmt(total: number): string {
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

type Saved = { acc: number; startedAt: number | null };

function load(key?: string): Saved {
  if (!key) return { acc: 0, startedAt: null };
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const v = JSON.parse(raw) as Saved;
      if (typeof v.acc === 'number') return { acc: v.acc, startedAt: typeof v.startedAt === 'number' ? v.startedAt : null };
    }
  } catch {}
  return { acc: 0, startedAt: null };
}

function save(key: string | undefined, v: Saved | null) {
  if (!key) return;
  try {
    if (v) localStorage.setItem(key, JSON.stringify(v));
    else localStorage.removeItem(key);
  } catch {}
}

// Where are we, given total elapsed seconds? Time is always measured from the
// clock (not by counting ticks), so it stays right when the app is in the
// background, the phone is locked, or the browser pauses timers.
function locate(segments: Segment[], elapsedSec: number) {
  let start = 0;
  for (let i = 0; i < segments.length; i++) {
    const end = start + segments[i].sec;
    if (elapsedSec < end) return { idx: i, remaining: end - elapsedSec };
    start = end;
  }
  const last = segments.length - 1;
  return { idx: last, remaining: 0 };
}

export default function ItemTimer({ segments, color, onComplete, storageKey }: ItemTimerProps) {
  const [saved, setSaved] = useState<Saved>(() => load(storageKey));
  const [now, setNow] = useState(() => Date.now());
  const [finished, setFinished] = useState(false);
  const [visTick, setVisTick] = useState(0);
  const completeRef = useRef(onComplete);
  const lastIdxRef = useRef<number | null>(null);
  const lastBeepRef = useRef('');

  useEffect(() => {
    completeRef.current = onComplete;
  });

  const totalSec = segments.reduce((a, s) => a + s.sec, 0);
  const running = saved.startedAt !== null && !finished;
  const elapsedMs = saved.acc + (saved.startedAt !== null ? Math.max(0, now - saved.startedAt) : 0);
  const elapsedSec = Math.min(totalSec, elapsedMs / 1000);
  const { idx, remaining } = finished ? { idx: segments.length - 1, remaining: 0 } : locate(segments, elapsedSec);
  const seg = segments[idx];
  const left = Math.ceil(remaining - 1e-6);

  // Tick while running, and catch up the moment the app comes back to the screen.
  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setNow(Date.now()), 250);
    const onVis = () => {
      setNow(Date.now());
      setVisTick((t) => t + 1);
    };
    document.addEventListener('visibilitychange', onVis);
    window.addEventListener('focus', onVis);
    window.addEventListener('pageshow', onVis);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVis);
      window.removeEventListener('focus', onVis);
      window.removeEventListener('pageshow', onVis);
    };
  }, [running]);

  // Cues: beep at step changes and the last 3 seconds (only while the app is visible).
  useEffect(() => {
    if (!running) {
      lastIdxRef.current = null;
      return;
    }
    const visible = document.visibilityState === 'visible';
    if (lastIdxRef.current !== null && idx !== lastIdxRef.current && visible) {
      beep(988, 300);
      try {
        navigator.vibrate?.([200, 100, 200]);
      } catch {}
    }
    lastIdxRef.current = idx;
    if (left > 0 && left <= 3 && visible) {
      const k = `${idx}-${left}`;
      if (lastBeepRef.current !== k) {
        lastBeepRef.current = k;
        beep(660, 90);
      }
    }
  }, [running, idx, left]);

  // Finish when the clock passes the total.
  useEffect(() => {
    if (!running || elapsedMs < totalSec * 1000) return;
    setFinished(true);
    setSaved({ acc: totalSec * 1000, startedAt: null });
    save(storageKey, { acc: totalSec * 1000, startedAt: null });
    if (document.visibilityState === 'visible') beep(988, 700);
    try {
      navigator.vibrate?.([200, 100, 200]);
    } catch {}
  }, [running, elapsedMs, totalSec, storageKey]);

  // A timer that was already complete when reopened.
  useEffect(() => {
    if (!finished && saved.startedAt === null && saved.acc >= totalSec * 1000 && totalSec > 0) setFinished(true);
  }, [finished, saved, totalSec]);

  // After "Done" shows for a moment, check the item off.
  useEffect(() => {
    if (!finished) return;
    const id = setTimeout(() => completeRef.current(), 2500);
    return () => clearTimeout(id);
  }, [finished]);

  // Keep the screen awake while the timer is running (re-requested when the app returns).
  useEffect(() => {
    if (!running) return;
    const holder: { lock: WakeLockSentinel | null } = { lock: null };
    let cancelled = false;
    navigator.wakeLock
      ?.request('screen')
      .then((l) => {
        if (cancelled) void l.release();
        else holder.lock = l;
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      holder.lock?.release().catch(() => {});
    };
  }, [running, visTick]);

  const reset = () => {
    setFinished(false);
    setSaved({ acc: 0, startedAt: null });
    save(storageKey, null);
    lastIdxRef.current = null;
  };

  const startOrPause = () => {
    ensureAudio();
    const t = Date.now();
    setNow(t);
    if (saved.startedAt !== null) {
      const next = { acc: saved.acc + Math.max(0, t - saved.startedAt), startedAt: null };
      setSaved(next);
      save(storageKey, next);
    } else {
      const next = { acc: saved.acc, startedAt: t };
      setSaved(next);
      save(storageKey, next);
    }
  };

  const started = saved.acc > 0 || saved.startedAt !== null;
  const progress = seg.sec > 0 ? Math.max(0, remaining) / seg.sec : 1;

  const tinted = finished || seg.tone !== undefined;
  const bg = finished || seg.tone === 'rest' ? 'var(--sage)' : seg.tone === 'work' ? 'var(--accent)' : 'var(--surface)';
  const fg = tinted ? '#fff' : 'var(--text)';
  const barBg = tinted ? 'rgba(255,255,255,0.3)' : 'var(--border)';
  const barFg = tinted ? '#fff' : color;

  return (
    <div
      className="rounded-2xl px-4 pt-3 pb-4 text-center transition-colors"
      style={{ background: bg, color: fg, border: `1px solid ${tinted ? 'transparent' : 'var(--border)'}` }}
    >
      <p
        className="text-sm font-semibold uppercase tracking-[0.12em]"
        style={{ minHeight: '1.25rem', opacity: finished || seg.label ? 1 : 0 }}
      >
        {finished ? 'Done' : (seg.label ?? '.')}
      </p>
      <div
        className="font-semibold tabular-nums"
        style={{ fontSize: 'clamp(56px, 22vw, 96px)', lineHeight: 1.05, fontFamily: 'var(--font-sans)' }}
      >
        {fmt(left)}
      </div>
      <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: barBg }}>
        <div
          className="h-full rounded-full"
          style={{
            width: `${Math.max(0, Math.min(1, progress)) * 100}%`,
            background: barFg,
            transition: 'width 0.25s linear',
          }}
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          onClick={startOrPause}
          disabled={finished}
          className="flex-1 py-3 rounded-xl text-base font-semibold"
          style={
            tinted
              ? { background: '#fff', color: 'var(--text)', opacity: finished ? 0.5 : 1 }
              : { background: running ? 'var(--bg)' : color, color: running ? 'var(--text)' : '#fff', border: running ? '1px solid var(--border)' : 'none' }
          }
        >
          {running ? 'Pause' : started ? 'Resume' : 'Start'}
        </button>
        <button
          onClick={reset}
          className="px-5 py-3 rounded-xl text-base font-medium"
          style={
            tinted
              ? { background: 'rgba(0,0,0,0.15)', color: '#fff' }
              : { background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)' }
          }
        >
          Reset
        </button>
      </div>
    </div>
  );
}
