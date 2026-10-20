'use client';

import { useEffect, useState } from 'react';
import ItemTimer from './ItemTimer';

type TodayItem = {
  id: string;
  name: string;
  detail?: string;
  durationSec?: number;
  timer?: boolean;
};
type TodaySection = {
  label: string;
  color: 'sage' | 'accent' | 'mauve' | 'neutral';
  items: TodayItem[];
};
type TodayWorkout = {
  date: string;
  title: string;
  subtitle?: string;
  feeling?: string;
  note?: string;
  sections: TodaySection[];
};

const COLORS: Record<TodaySection['color'], { main: string; bg: string; border: string }> = {
  sage: { main: 'var(--sage)', bg: 'var(--sage-bg)', border: 'var(--sage-border)' },
  accent: { main: 'var(--accent)', bg: 'var(--accent-bg)', border: 'var(--accent-border)' },
  mauve: { main: 'var(--mauve)', bg: 'var(--mauve-bg)', border: 'var(--mauve-border)' },
  neutral: { main: 'var(--text-2)', bg: 'var(--bg)', border: 'var(--border)' },
};

function formatDate(dateStr: string): string {
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
}

// Timer length for an item: an explicit durationSec wins, otherwise a detail that
// starts with a time ("30 sec", "30 sec/side", "12 min") gets a timer automatically.
// Set "timer": false on an item to turn it off.
function timerSeconds(item: TodayItem): number | null {
  if (item.timer === false) return null;
  if (item.durationSec && item.durationSec > 0) return item.durationSec;
  const m = item.detail?.match(/^(\d+(?:\.\d+)?)\s*(sec|secs|s|min|mins|m)\b/i);
  if (!m) return null;
  const n = parseFloat(m[1]);
  const secs = Math.round(/^m/i.test(m[2]) ? n * 60 : n);
  return secs > 0 ? secs : null;
}

export default function TodayView() {
  const [workout, setWorkout] = useState<TodayWorkout | null>(null);
  const [error, setError] = useState(false);
  const [done, setDone] = useState<string[]>([]);

  useEffect(() => {
    fetch('/today.json', { cache: 'no-store' })
      .then((res) => {
        if (!res.ok) throw new Error('missing');
        return res.json();
      })
      .then((data: TodayWorkout) => {
        setWorkout(data);
        try {
          const saved = localStorage.getItem(`today_done_${data.date}`);
          if (saved) setDone(JSON.parse(saved));
        } catch {}
      })
      .catch(() => setError(true));
  }, []);

  if (error) {
    return (
      <p className="px-4 pt-8 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
        No workout posted yet. Check back after your next chat with Claude.
      </p>
    );
  }
  if (!workout) {
    return (
      <p className="px-4 pt-8 text-sm text-center" style={{ color: 'var(--text-muted)' }}>
        Loading…
      </p>
    );
  }

  const allIds = workout.sections.flatMap((s) => s.items.map((i) => i.id));
  const doneCount = allIds.filter((id) => done.includes(id)).length;

  const persist = (next: string[]) => {
    setDone(next);
    try {
      localStorage.setItem(`today_done_${workout.date}`, JSON.stringify(next));
    } catch {}
  };

  const toggle = (id: string) => {
    persist(done.includes(id) ? done.filter((d) => d !== id) : [...done, id]);
  };

  const markDone = (id: string) => {
    if (!done.includes(id)) persist([...done, id]);
  };

  return (
    <div className="px-4 pb-6 space-y-4 pt-5">
      <div className="pb-1">
        <p className="text-xs font-medium tracking-[0.12em] uppercase mb-2" style={{ color: 'var(--accent)' }}>
          {formatDate(workout.date)}
        </p>
        <h1 className="text-3xl tracking-tight leading-none" style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}>
          {workout.title}
        </h1>
        {workout.subtitle && (
          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{workout.subtitle}</p>
        )}
      </div>

      {(workout.feeling || workout.note) && (
        <section className="rounded-2xl px-4 py-4 space-y-2" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          {workout.feeling && (
            <p className="text-sm" style={{ color: 'var(--text)' }}>
              <span className="text-[10px] font-medium tracking-[0.18em] uppercase mr-2" style={{ color: 'var(--mauve)' }}>
                How I feel
              </span>
              {workout.feeling}
            </p>
          )}
          {workout.note && (
            <p className="text-sm" style={{ color: 'var(--text-2)', fontFamily: 'var(--font-serif)' }}>
              {workout.note}
            </p>
          )}
        </section>
      )}

      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-medium" style={{ color: 'var(--text-2)' }}>
          {doneCount === allIds.length ? 'All done' : `${doneCount} of ${allIds.length} done`}
        </span>
        {doneCount > 0 && (
          <button
            onClick={() => persist([])}
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            Reset
          </button>
        )}
      </div>

      {workout.sections.map((section) => {
        const c = COLORS[section.color] ?? COLORS.neutral;
        return (
          <section
            key={section.label}
            className="rounded-2xl overflow-hidden"
            style={{ background: c.bg, border: `1px solid ${c.border}` }}
          >
            <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: `1px solid ${c.border}` }}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: c.main }} />
              <h2 className="font-medium text-[10px] tracking-[0.18em] uppercase" style={{ color: c.main }}>
                {section.label}
              </h2>
            </div>
            <div className="px-4">
              {section.items.map((item, i) => {
                const isDone = done.includes(item.id);
                const secs = timerSeconds(item);
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-2"
                    style={i < section.items.length - 1 ? { borderBottom: `1px solid ${c.border}` } : {}}
                  >
                    <button
                      onClick={() => toggle(item.id)}
                      className={`flex-1 min-w-0 flex items-center gap-3 py-3.5 text-left transition-opacity ${isDone ? 'opacity-40' : ''}`}
                    >
                      <span
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center"
                        style={isDone ? { background: c.main, border: `2px solid ${c.main}` } : { border: `1.5px solid ${c.main}` }}
                      >
                        {isDone && (
                          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 4l2.5 2.5L9 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>
                      <span className="flex-1 min-w-0 font-medium text-sm leading-snug" style={{ color: 'var(--text)' }}>
                        {item.name}
                      </span>
                      {item.detail && (
                        <span className="text-xs shrink-0" style={{ color: c.main }}>{item.detail}</span>
                      )}
                    </button>
                    {secs !== null && !isDone && (
                      <ItemTimer
                        key={`${item.id}-${secs}`}
                        durationSec={secs}
                        color={c.main}
                        onComplete={() => markDone(item.id)}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
