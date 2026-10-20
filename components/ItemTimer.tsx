'use client';

import { useEffect, useRef, useState } from 'react';

export type Segment = { label?: string; sec: number; tone?: 'work' | 'rest' };

type ItemTimerProps = {
  segments: Segment[];
  color: string;
  onComplete: () => void;
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

export default function ItemTimer({ segments, color, onComplete }: ItemTimerProps) {
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(segments[0].sec);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const completeRef = useRef(onComplete);
  const segRef = useRef(segments);

  useEffect(() => {
    completeRef.current = onComplete;
    segRef.current = segments;
  });

  const seg = segments[idx];
  const isLast = idx === segments.length - 1;

  // Count down, move between steps, and finish.
  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      try {
        navigator.vibrate?.([200, 100, 200]);
      } catch {}
      if (!isLast) {
        beep(988, 300);
        setIdx(idx + 1);
        setLeft(segRef.current[idx + 1].sec);
      } else {
        beep(988, 700);
        setRunning(false);
        setFinished(true);
      }
      return;
    }
    if (left <= 3) beep(660, 90);
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, left, idx, isLast]);

  // After "Done" shows for a moment, check the item off.
  useEffect(() => {
    if (!finished) return;
    const id = setTimeout(() => completeRef.current(), 2500);
    return () => clearTimeout(id);
  }, [finished]);

  // Keep the screen awake while the timer is running.
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
  }, [running]);

  const reset = () => {
    setRunning(false);
    setFinished(false);
    setIdx(0);
    setLeft(segments[0].sec);
  };

  const startOrPause = () => {
    ensureAudio();
    setRunning((r) => !r);
  };

  const started = idx > 0 || left !== segments[0].sec;
  const progress = seg.sec > 0 ? left / seg.sec : 1;

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
            transition: 'width 1s linear',
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
