'use client';

import { useState, useEffect, useRef } from 'react';

type ExerciseItemProps = {
  dayId: string;
  id: string;
  name: string;
  reps?: string;
  weight?: number;
  weightUnit?: string;
  isBodyweight?: boolean;
  note?: string;
  isSuperset?: boolean;
  durationSec?: number;
};

export default function ExerciseItem({
  dayId,
  id,
  name,
  reps,
  weight: defaultWeight,
  weightUnit = 'lbs',
  isBodyweight,
  note,
  isSuperset,
  durationSec,
}: ExerciseItemProps) {
  const storageKey = `weight_${dayId}_${id}`;
  const [checked, setChecked] = useState(false);
  const [weight, setWeight] = useState<number | undefined>(defaultWeight);
  const [editing, setEditing] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const [countdown, setCountdown] = useState<number>(durationSec ?? 0);
  const [counting, setCounting] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved !== null) setWeight(parseFloat(saved));
  }, [storageKey]);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  useEffect(() => {
    if (!counting) return;
    if (countdown <= 0) {
      setCounting(false);
      setChecked(true);
      return;
    }
    const tid = setInterval(() => setCountdown((s) => s - 1), 1000);
    return () => clearInterval(tid);
  }, [counting, countdown]);

  const startEdit = () => {
    setInputVal(weight?.toString() ?? '');
    setEditing(true);
  };

  const saveEdit = () => {
    const num = parseFloat(inputVal);
    if (!isNaN(num) && num > 0) {
      setWeight(num);
      localStorage.setItem(storageKey, num.toString());
    }
    setEditing(false);
  };

  const toggleTimer = () => {
    if (counting) {
      setCounting(false);
    } else {
      if (countdown <= 0) setCountdown(durationSec!);
      setCounting(true);
    }
  };

  const hasWeight = !isBodyweight && (defaultWeight !== undefined || weight !== undefined);
  const timerMins = Math.floor(countdown / 60);
  const timerSecs = countdown % 60;
  const timerProgress = durationSec ? countdown / durationSec : 1;

  return (
    <div
      className={`flex items-center gap-3 py-3.5 transition-opacity ${checked ? 'opacity-40' : ''} ${isSuperset ? 'pl-5' : ''}`}
      style={isSuperset ? { borderLeft: '2px solid var(--accent-border)' } : {}}
    >
      {/* Checkbox */}
      <button
        onClick={() => setChecked((c) => !c)}
        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center transition-all"
        style={checked ? {
          background: 'var(--accent)',
          border: '2px solid var(--accent)',
        } : {
          background: 'transparent',
          border: '1.5px solid var(--border)',
        }}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Name + reps */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          {isSuperset && (
            <span className="text-xs font-medium" style={{ color: 'var(--accent)' }}>↳</span>
          )}
          <span className="font-medium text-sm leading-snug" style={{ color: 'var(--text)' }}>{name}</span>
          {reps && (
            <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>× {reps}</span>
          )}
        </div>
        {note && <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{note}</p>}
      </div>

      {/* Right: timer | bodyweight | weight badge */}
      {durationSec ? (
        <button
          onClick={toggleTimer}
          className="relative shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-semibold transition-all"
          style={counting ? {
            background: 'var(--accent-bg)',
            color: 'var(--accent)',
            border: '1px solid var(--accent-border)',
          } : {
            background: 'var(--bg)',
            color: 'var(--text-2)',
            border: '1px solid var(--border)',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" className="rotate-[-90deg]">
            <circle cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1.5" />
            <circle
              cx="7" cy="7" r="5" fill="none" stroke="currentColor" strokeWidth="1.5"
              strokeDasharray={`${2 * Math.PI * 5 * timerProgress} ${2 * Math.PI * 5}`}
              strokeLinecap="round"
            />
          </svg>
          {`${String(timerMins).padStart(2, '0')}:${String(timerSecs).padStart(2, '0')}`}
        </button>
      ) : isBodyweight ? (
        <span className="text-xs shrink-0" style={{ color: 'var(--text-muted)' }}>Bodyweight</span>
      ) : editing ? (
        <div className="flex items-center gap-1 shrink-0">
          <input
            ref={inputRef}
            type="number"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
            className="w-16 text-right text-sm px-2 py-1 rounded-lg outline-none"
            style={{
              background: 'var(--accent-bg)',
              color: 'var(--accent)',
              border: '1px solid var(--accent-border)',
            }}
          />
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{weightUnit}</span>
        </div>
      ) : (
        <button
          onClick={startEdit}
          className="shrink-0 text-sm font-medium px-2.5 py-1 rounded-full transition-all"
          style={hasWeight ? {
            color: 'var(--accent)',
            background: 'var(--accent-bg)',
            border: '1px solid var(--accent-border)',
          } : {
            color: 'var(--text-muted)',
            background: 'var(--bg)',
            border: '1px solid var(--border)',
          }}
        >
          {weight !== undefined ? `${weight} ${weightUnit}` : '+ weight'}
        </button>
      )}
    </div>
  );
}
