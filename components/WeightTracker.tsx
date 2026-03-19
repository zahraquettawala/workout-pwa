'use client';

import { useState, useEffect, useRef } from 'react';
import { getTodayWorkoutId } from '@/lib/workoutData';

type WeightEntry = { date: string; weight: number };

const MESSAGES = [
  "Progress is built one small choice at a time. You're building something real.",
  "Consistency is the only cheat code. You already have it.",
  "Your body is adapting. Trust the process and trust yourself.",
  "Strength isn't just physical — showing up is the hardest rep.",
  "Every week you log is a week you chose yourself. That matters.",
  "You don't have to be perfect. You just have to keep going.",
  "The woman who shows up on hard days is who you're becoming.",
  "Small changes compound. What feels slow is actually steady.",
  "Rest is part of the work. You're recovering forward.",
  "You are not the same person you were a month ago. That's the whole point.",
  "Celebrate what your body can do, not just what it weighs.",
  "Health is a long game. You're already winning by playing.",
];

function getISOWeekKey(date: Date): string {
  const d = new Date(date);
  const thursday = new Date(d);
  thursday.setDate(d.getDate() - ((d.getDay() + 6) % 7) + 3);
  const yearStart = new Date(thursday.getFullYear(), 0, 1);
  const weekNum = Math.ceil(((thursday.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${thursday.getFullYear()}-W${String(weekNum).padStart(2, '0')}`;
}

function getWeekMessage(): string {
  const now = new Date();
  const weekNum = Math.ceil(((now.getTime() - new Date(now.getFullYear(), 0, 1).getTime()) / 86400000 + 1) / 7);
  return MESSAGES[weekNum % MESSAGES.length];
}

function toISODate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// SVG sparkline — returns point strings for given entries in viewBox 300x60
function sparklinePoints(entries: WeightEntry[]): { points: string; dots: { cx: number; cy: number; date: string }[] } {
  const PAD = 10;
  const W = 300;
  const H = 60;
  if (entries.length === 0) return { points: '', dots: [] };

  const weights = entries.map((e) => e.weight);
  const min = Math.min(...weights);
  const max = Math.max(...weights);
  const range = max - min || 1;

  const coords = entries.map((entry, i) => {
    const x = entries.length === 1 ? W / 2 : PAD + (i / (entries.length - 1)) * (W - PAD * 2);
    const y = H - PAD - ((entry.weight - min) / range) * (H - PAD * 2);
    return { x, y, date: entry.date };
  });

  return {
    points: coords.map((c) => `${c.x},${c.y}`).join(' '),
    dots: coords.map((c) => ({ cx: c.x, cy: c.y, date: c.date })),
  };
}

export default function WeightTracker() {
  const [log, setLog] = useState<WeightEntry[]>([]);
  const [unit, setUnit] = useState<'lbs' | 'kg'>('lbs');
  const [inputVal, setInputVal] = useState('');
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const isWeekend = getTodayWorkoutId() === 'weekend';
  const today = toISODate(new Date());
  const thisWeek = getISOWeekKey(new Date());
  const existingEntry = log.find((e) => getISOWeekKey(new Date(e.date + 'T12:00:00')) === thisWeek);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('weightLog');
      if (saved) setLog(JSON.parse(saved));
      const savedUnit = localStorage.getItem('weightUnit') as 'lbs' | 'kg' | null;
      if (savedUnit) setUnit(savedUnit);
    } catch {}
  }, []);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const saveWeight = () => {
    const num = parseFloat(inputVal);
    if (isNaN(num) || num <= 0) { setEditing(false); return; }

    const newEntry: WeightEntry = { date: today, weight: num };
    const filtered = log.filter((e) => getISOWeekKey(new Date(e.date + 'T12:00:00')) !== thisWeek);
    const newLog = [...filtered, newEntry].sort((a, b) => a.date.localeCompare(b.date));
    setLog(newLog);
    localStorage.setItem('weightLog', JSON.stringify(newLog));
    setInputVal('');
    setEditing(false);
  };

  const setUnitPref = (u: 'lbs' | 'kg') => {
    setUnit(u);
    localStorage.setItem('weightUnit', u);
  };

  const chartData = log.slice(-12);
  const { points, dots } = sparklinePoints(chartData);
  const recentEntries = log.slice(-5).reverse();

  // Weight change vs last entry
  let changeLabel = '';
  if (existingEntry && log.length >= 2) {
    const prev = log[log.length - (existingEntry === log[log.length - 1] ? 2 : 1)];
    if (prev) {
      const diff = existingEntry.weight - prev.weight;
      changeLabel = diff === 0 ? 'No change' : `${diff > 0 ? '+' : ''}${diff.toFixed(1)} ${unit}`;
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-light)' }}>
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--sage)' }} />
        <h2 className="font-medium text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--sage)' }}>
          Weight Tracker
        </h2>
        {existingEntry && (
          <span className="ml-auto text-[11px] font-medium" style={{ color: 'var(--accent)' }}>
            {existingEntry.weight} {unit}
          </span>
        )}
      </div>

      <div className="px-4 pt-4 pb-5 space-y-5">
        {/* Encouragement */}
        <div>
          <p
            className="text-lg leading-snug"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
          >
            {getWeekMessage()}
          </p>
        </div>

        {/* Weekend nudge */}
        {isWeekend && !existingEntry && (
          <p className="text-xs" style={{ color: 'var(--sage)' }}>
            Today's a great day to log your weekly weigh-in.
          </p>
        )}

        {/* Log / Edit area */}
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              ref={inputRef}
              type="number"
              step="0.1"
              placeholder={`Weight in ${unit}`}
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && saveWeight()}
              className="flex-1 text-sm px-3 py-2 rounded-xl outline-none"
              style={{
                background: 'var(--accent-bg)',
                color: 'var(--accent)',
                border: '1px solid var(--accent-border)',
              }}
            />
            <button
              onClick={saveWeight}
              className="px-4 py-2 rounded-xl text-sm font-semibold"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-3 py-2 rounded-xl text-sm font-medium"
              style={{ background: 'var(--bg)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
            >
              Cancel
            </button>
          </div>
        ) : existingEntry ? (
          <div className="flex items-center gap-3">
            <div>
              <span className="text-2xl font-semibold" style={{ color: 'var(--text)' }}>
                {existingEntry.weight}
              </span>
              <span className="text-sm ml-1" style={{ color: 'var(--text-muted)' }}>{unit}</span>
              {changeLabel && (
                <span
                  className="ml-2 text-xs font-medium"
                  style={{ color: changeLabel.startsWith('+') ? 'var(--text-muted)' : 'var(--sage)' }}
                >
                  {changeLabel}
                </span>
              )}
            </div>
            <button
              onClick={() => { setInputVal(existingEntry.weight.toString()); setEditing(true); }}
              className="ml-auto text-xs font-medium px-3 py-1.5 rounded-full"
              style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
            >
              Edit
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEditing(true)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all"
              style={{ background: 'var(--accent)', color: '#fff' }}
            >
              Log this week's weight
            </button>
            {/* Unit toggle */}
            <div className="flex rounded-xl overflow-hidden" style={{ border: '1px solid var(--border)' }}>
              {(['lbs', 'kg'] as const).map((u) => (
                <button
                  key={u}
                  onClick={() => setUnitPref(u)}
                  className="px-3 py-2 text-xs font-semibold transition-all"
                  style={unit === u ? {
                    background: 'var(--accent)',
                    color: '#fff',
                  } : {
                    background: 'var(--surface)',
                    color: 'var(--text-muted)',
                  }}
                >
                  {u}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sparkline + history */}
        {log.length >= 2 && (
          <div className="space-y-3">
            {/* Chart */}
            <div className="rounded-xl overflow-hidden px-1" style={{ background: 'var(--bg)' }}>
              <svg width="100%" viewBox="0 0 300 60" preserveAspectRatio="none" style={{ display: 'block' }}>
                <line x1="10" y1="50" x2="290" y2="50" stroke="var(--border)" strokeWidth="1" />
                <polyline
                  points={points}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                {dots.map((d) => (
                  <circle
                    key={d.date}
                    cx={d.cx}
                    cy={d.cy}
                    r="3.5"
                    fill="var(--surface)"
                    stroke="var(--accent)"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>

            {/* Recent entries */}
            <div>
              {recentEntries.map((entry, i) => {
                const prev = recentEntries[i + 1];
                const diff = prev ? entry.weight - prev.weight : null;
                return (
                  <div
                    key={entry.date}
                    className="flex items-center py-2"
                    style={{ borderBottom: i < recentEntries.length - 1 ? '1px solid var(--border-light)' : 'none' }}
                  >
                    <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                      {formatDate(entry.date)}
                    </span>
                    <span className="ml-auto text-sm font-medium" style={{ color: 'var(--text)' }}>
                      {entry.weight} {unit}
                    </span>
                    {diff !== null && (
                      <span
                        className="ml-3 text-xs w-14 text-right"
                        style={{ color: diff <= 0 ? 'var(--sage)' : 'var(--text-muted)' }}
                      >
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* First-time empty state */}
        {log.length === 0 && !editing && (
          <p className="text-xs text-center pb-1" style={{ color: 'var(--text-muted)' }}>
            Log your first weigh-in to start tracking progress.
          </p>
        )}
      </div>
    </div>
  );
}
