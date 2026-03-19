'use client';

import { useState, useEffect } from 'react';

const WORK = 45;
const REST = 15;

type Props = { exercises: string[]; forceCompleted?: boolean };

export default function AbsTimer({ exercises, forceCompleted }: Props) {
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'work' | 'rest'>('idle');
  const [seconds, setSeconds] = useState(WORK);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      if (phase === 'work') {
        if (idx >= exercises.length - 1) {
          setRunning(false);
          setDone(true);
          return;
        }
        setPhase('rest');
        setSeconds(REST);
      } else {
        setIdx((i) => i + 1);
        setPhase('work');
        setSeconds(WORK);
      }
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, seconds, phase, idx, exercises.length]);

  const start = () => {
    setIdx(0);
    setPhase('work');
    setSeconds(WORK);
    setRunning(true);
    setDone(false);
  };

  const toggle = () => {
    if (phase === 'idle' || done) { start(); return; }
    setRunning((r) => !r);
  };

  const reset = () => {
    setRunning(false);
    setDone(false);
    setPhase('idle');
    setIdx(0);
    setSeconds(WORK);
  };

  const isWork = phase === 'work';
  const total = isWork ? WORK : REST;
  const progress = phase === 'idle' ? 1 : seconds / total;
  const radius = 34;
  const circ = 2 * Math.PI * radius;
  const dash = circ * progress;

  // Color: work = mauve, rest = sage, idle/done = muted
  const isDone = done || !!forceCompleted;
  const color = isDone ? 'var(--text-muted)' : isWork ? 'var(--mauve)' : 'var(--sage)';
  const label = isDone ? 'DONE' : phase === 'idle' ? 'READY' : isWork ? 'WORK' : 'REST';

  return (
    <div className="px-4 pb-5 pt-4 space-y-4">
      {/* Timer row */}
      <div className="flex items-center gap-5">
        <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
          <svg className="absolute inset-0 rotate-[-90deg]" width="80" height="80" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--border)" strokeWidth="4" />
            <circle
              cx="40" cy="40" r={radius} fill="none"
              stroke={color} strokeWidth="4"
              strokeDasharray={`${dash} ${circ}`}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <div className="z-10 text-center">
            <div className="text-xl font-semibold tabular-nums" style={{ color, fontVariantNumeric: 'tabular-nums' }}>
              {String(Math.floor(seconds / 60)).padStart(2, '0')}:{String(seconds % 60).padStart(2, '0')}
            </div>
            <div className="text-[9px] font-semibold tracking-[0.15em] uppercase mt-0.5" style={{ color }}>
              {label}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          {phase !== 'idle' && !done && (
            <>
              <p className="text-[10px] tracking-[0.12em] uppercase" style={{ color: 'var(--text-muted)' }}>
                {idx + 1} of {exercises.length}
              </p>
              <p className="text-sm font-medium leading-tight truncate" style={{ color: 'var(--text)' }}>
                {isWork
                  ? exercises[idx]
                  : idx < exercises.length - 1 ? `Next: ${exercises[idx + 1]}` : 'Last one!'}
              </p>
            </>
          )}
          {isDone && (
            <p className="text-sm font-medium" style={{ color: 'var(--sage)' }}>Circuit complete!</p>
          )}
          <div className="flex gap-2 mt-1">
            <button
              onClick={toggle}
              className="flex-1 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all"
              style={running ? {
                background: 'var(--bg)',
                color,
                border: `1px solid var(--border)`,
              } : {
                background: 'var(--mauve)',
                color: '#fff',
                border: 'none',
              }}
            >
              {running ? 'Pause' : done || phase !== 'idle' ? 'Resume' : 'Start'}
            </button>
            <button
              onClick={reset}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Exercise list */}
      <div>
        {exercises.map((ex, i) => {
          const isActive = phase !== 'idle' && i === idx;
          const isPast = i < idx || isDone;
          return (
            <div
              key={i}
              className="flex items-center gap-3 py-2.5 transition-all"
              style={{ borderTop: i === 0 ? 'none' : '1px solid var(--border-light)', opacity: isActive ? 1 : isPast ? 0.35 : 0.6 }}
            >
              <span
                className="text-[10px] font-semibold w-5 shrink-0 text-right"
                style={{ color: isActive ? 'var(--mauve)' : 'var(--text-muted)' }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="text-sm flex-1"
                style={{ color: isActive ? 'var(--text)' : 'var(--text-2)', fontWeight: isActive ? 500 : 400 }}
              >
                {ex}
              </span>
              {isPast && (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <path d="M2 7l3.5 3.5L12 3" stroke="var(--sage)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
