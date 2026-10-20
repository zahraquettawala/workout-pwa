'use client';

import { useEffect, useRef, useState } from 'react';

type ItemTimerProps = {
  durationSec: number;
  color: string;
  onComplete: () => void;
};

export default function ItemTimer({ durationSec, color, onComplete }: ItemTimerProps) {
  const [left, setLeft] = useState(durationSec);
  const [running, setRunning] = useState(false);
  const completeRef = useRef(onComplete);

  useEffect(() => {
    completeRef.current = onComplete;
  });

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      setRunning(false);
      try {
        navigator.vibrate?.([200, 100, 200]);
      } catch {}
      completeRef.current();
      return;
    }
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, left]);

  const toggle = () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (left <= 0) setLeft(durationSec);
    setRunning(true);
  };

  const reset = () => {
    setRunning(false);
    setLeft(durationSec);
  };

  const mins = Math.floor(left / 60);
  const secs = left % 60;
  const progress = durationSec > 0 ? left / durationSec : 1;
  const r = 5;
  const circ = 2 * Math.PI * r;
  const started = left !== durationSec;

  return (
    <div className="shrink-0 flex items-center gap-1.5">
      {started && !running && (
        <button
          onClick={reset}
          aria-label="Reset timer"
          className="text-[11px] font-medium px-2 py-1 rounded-full"
          style={{ color: 'var(--text-muted)', border: '1px solid var(--border)', background: 'var(--surface)' }}
        >
          Reset
        </button>
      )}
      <button
        onClick={toggle}
        aria-label={running ? 'Pause timer' : 'Start timer'}
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold tabular-nums transition-all"
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
        {`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`}
      </button>
    </div>
  );
}
