'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export type Segment = { label?: string; sec: number; tone?: 'work' | 'rest' };

type ItemTimerProps = {
  name: string;
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

export default function ItemTimer({ name, segments, color, onComplete }: ItemTimerProps) {
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(segments[0].sec);
  const [running, setRunning] = useState(false);
  const [open, setOpen] = useState(false);
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

  // Keep the screen awake while the big timer is up.
  useEffect(() => {
    if (!open) return;
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
  }, [open]);

  const reset = () => {
    setRunning(false);
    setFinished(false);
    setIdx(0);
    setLeft(segments[0].sec);
  };

  const startOrPause = () => {
    ensureAudio();
    if (running) {
      setRunning(false);
      return;
    }
    setRunning(true);
  };

  const openBig = () => {
    ensureAudio();
    setOpen(true);
    if (!running && !finished) setRunning(true);
  };

  const started = idx > 0 || left !== segments[0].sec;
  const progress = seg.sec > 0 ? left / seg.sec : 1;

  const bg = finished || seg.tone === 'rest' ? 'var(--sage)' : seg.tone === 'work' ? 'var(--accent)' : 'var(--bg)';
  const fg = finished || seg.tone ? '#fff' : 'var(--text)';
  const barBg = finished || seg.tone ? 'rgba(255,255,255,0.3)' : 'var(--border)';
  const barFg = finished || seg.tone ? '#fff' : 'var(--accent)';

  const r = 5;
  const circ = 2 * Math.PI * r;

  return (
    <>
      <button
        onClick={started ? () => setOpen(true) : openBig}
        aria-label="Open timer"
        className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-semibold tabular-nums transition-all"
        style={
          running
            ? { background: 'var(--surface)', color, border: `1px solid ${color}` }
            : { background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)' }
        }
      >
        <svg width="14" height="14" viewBox="0 0 14 14" className="rotate-[-90deg]">
          <circle cx="7" cy="7" r={r} fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
          <circle
            cx="7"
            cy="7"
            r={r}
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray={`${circ * progress} ${circ}`}
            strokeLinecap="round"
          />
        </svg>
        {fmt(left)}
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-label={`${name} timer`}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between text-center"
            style={{
              background: bg,
              color: fg,
              padding: 'max(env(safe-area-inset-top), 20px) 20px max(env(safe-area-inset-bottom), 24px)',
            }}
          >
            <div className="w-full flex items-center justify-between gap-3">
              <p className="text-sm font-medium tracking-[0.12em] uppercase text-left min-w-0 truncate">{name}</p>
              <button
                onClick={() => setOpen(false)}
                className="shrink-0 px-4 py-2.5 rounded-full text-sm font-semibold"
                style={{ background: 'rgba(0,0,0,0.12)', color: fg }}
              >
                Minimize
              </button>
            </div>

            <div className="w-full">
              <p
                className="font-semibold uppercase tracking-[0.08em] mb-2"
                style={{ fontSize: 'min(11vw, 7vh)', minHeight: '1.2em' }}
              >
                {finished ? 'Done' : (seg.label ?? '')}
              </p>
              <div
                className="font-semibold tabular-nums"
                style={{ fontSize: 'min(30vw, 22vh)', lineHeight: 1, fontFamily: 'var(--font-sans)' }}
              >
                {fmt(left)}
              </div>
              <div className="mt-6 h-2 rounded-full overflow-hidden mx-auto max-w-sm" style={{ background: barBg }}>
                <div
                  className="h-full rounded-full"
                  style={{ width: `${Math.max(0, Math.min(1, progress)) * 100}%`, background: barFg, transition: 'width 1s linear' }}
                />
              </div>
            </div>

            <div className="w-full max-w-sm flex gap-3">
              <button
                onClick={startOrPause}
                disabled={finished}
                className="flex-1 py-5 rounded-2xl text-xl font-semibold"
                style={{ background: '#fff', color: 'var(--text)', opacity: finished ? 0.5 : 1 }}
              >
                {running ? 'Pause' : started ? 'Resume' : 'Start'}
              </button>
              <button
                onClick={reset}
                className="px-6 py-5 rounded-2xl text-lg font-medium"
                style={{ background: 'rgba(0,0,0,0.12)', color: fg }}
              >
                Reset
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
