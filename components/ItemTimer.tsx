'use client';

import { useEffect, useRef, useState } from 'react';

export type Segment = { label?: string; sec: number };

type ItemTimerProps = {
  segments: Segment[];
  color: string;
  onComplete: () => void;
};

export default function ItemTimer({ segments, color, onComplete }: ItemTimerProps) {
  const [idx, setIdx] = useState(0);
  const [left, setLeft] = useState(segments[0].sec);
  const [running, setRunning] = useState(false);
  const completeRef = useRef(onComplete);
  const segRef = useRef(segments);

  useEffect(() => {
    completeRef.current = onComplete;
    segRef.current = segments;
  });

  const seg = segments[idx];
  const isLast = idx === segments.length - 1;

  useEffect(() => {
    if (!running) return;
    if (left <= 0) {
      try {
        navigator.vibrate?.([200, 100, 200]);
      } catch {}
      if (!isLast) {
        setIdx(idx + 1);
        setLeft(segRef.current[idx + 1].sec);
      } else {
        setRunning(false);
        completeRef.current();
      }
      return;
    }
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [running, left, idx, isLast]);

  const reset = () => {
    setRunning(false);
    setIdx(0);
    setLeft(segments[0].sec);
  };

  const toggle = () => {
    if (running) {
      setRunning(false);
      return;
    }
    if (isLast && left <= 0) {
      setIdx(0);
      setLeft(segments[0].sec);
    }
    setRunning(true);
  };

  const mins = Math.floor(left / 60);
  const secs = left % 60;
  const progress = seg.sec > 0 ? left / seg.sec : 1;
  const r = 5;
  const circ = 2 * Math.PI * r;
  const started = idx > 0 || left !== segments[0].sec;

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
        {seg.label && <span className="text-xs font-medium">{seg.label}</span>}
        {`${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`}
      </button>
    </div>
  );
}
