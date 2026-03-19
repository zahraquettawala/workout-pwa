'use client';

import { useState, useEffect, useCallback } from 'react';

export default function Timer() {
  const DEFAULT = 10 * 60;
  const [initial, setInitial] = useState(DEFAULT);
  const [seconds, setSeconds] = useState(DEFAULT);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (seconds <= 0) {
      setRunning(false);
      setDone(true);
      return;
    }
    const id = setInterval(() => setSeconds((s) => s - 1), 1000);
    return () => clearInterval(id);
  }, [running, seconds]);

  const toggle = () => {
    setDone(false);
    setRunning((r) => !r);
  };

  const reset = useCallback(() => {
    setRunning(false);
    setDone(false);
    setSeconds(initial);
  }, [initial]);

  const adjustMinutes = (delta: number) => {
    const newInitial = Math.max(60, initial + delta * 60);
    setInitial(newInitial);
    if (!running) setSeconds(newInitial);
  };

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const progress = seconds / initial;
  const radius = 34;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * progress;
  const color = done ? 'var(--text-muted)' : running ? 'var(--accent)' : 'var(--border)';

  return (
    <div className="flex items-center gap-5 py-4 px-4">
      {/* Circular progress */}
      <div className="relative flex items-center justify-center w-20 h-20 shrink-0">
        <svg className="absolute inset-0 rotate-[-90deg]" width="80" height="80" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r={radius} fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle
            cx="40" cy="40" r={radius} fill="none"
            stroke={running ? 'var(--accent)' : done ? 'var(--text-muted)' : 'var(--border)'}
            strokeWidth="4"
            strokeDasharray={`${dash} ${circumference}`}
            strokeLinecap="round"
            className="transition-all duration-1000"
          />
        </svg>
        <div className="z-10 text-center">
          <div className="text-xl font-semibold tabular-nums" style={{ color: done ? 'var(--text-muted)' : 'var(--text)' }}>
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </div>
          {done && (
            <div className="text-[9px] font-semibold tracking-[0.15em] uppercase mt-0.5" style={{ color: 'var(--text-muted)' }}>
              Done
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-2 flex-1">
        <div className="flex gap-2">
          <button
            onClick={toggle}
            className="flex-1 py-2 rounded-xl text-sm font-semibold tracking-wide transition-all"
            style={running ? {
              background: 'var(--accent-bg)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            } : {
              background: 'var(--accent)',
              color: '#fff',
            }}
          >
            {running ? 'Pause' : 'Start'}
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
          >
            Reset
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => adjustMinutes(-1)}
            className="flex-1 py-1.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
          >
            −1 min
          </button>
          <button
            onClick={() => adjustMinutes(1)}
            className="flex-1 py-1.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
          >
            +1 min
          </button>
        </div>
      </div>
    </div>
  );
}
