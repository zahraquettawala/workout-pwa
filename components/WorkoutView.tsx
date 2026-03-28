'use client';

import { useState, useEffect } from 'react';
import { WorkoutDay } from '@/lib/workoutData';
import ExerciseItem from './ExerciseItem';
import AbsTimer from './AbsTimer';

type Props = { workout: WorkoutDay };

export default function WorkoutView({ workout }: Props) {
  const storageKey = `workout_done_${workout.id}`;
  const [completedAt, setCompletedAt] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const ts = parseInt(saved, 10);
      if (Date.now() - ts < 24 * 60 * 60 * 1000) {
        setCompletedAt(ts);
      } else {
        localStorage.removeItem(storageKey);
      }
    }
  }, [storageKey]);

  const markDone = () => {
    const now = Date.now();
    localStorage.setItem(storageKey, now.toString());
    setCompletedAt(now);
  };

  const undone = () => {
    localStorage.removeItem(storageKey);
    setCompletedAt(null);
  };

  const isDone = completedAt !== null;

  return (
    <div className="px-4 pb-6 space-y-4 pt-5">
      {/* Header */}
      <div className="pb-1">
        <p className="text-xs font-medium tracking-[0.12em] uppercase mb-2" style={{ color: 'var(--accent)' }}>
          Hey Zahra, keep going!
        </p>
        <h1
          className="text-3xl tracking-tight leading-none"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
        >
          {workout.title}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{workout.subtitle}</p>
      </div>

      {/* Completion banner */}
      {isDone && (
        <div
          className="rounded-2xl px-4 py-4 flex items-center gap-3"
          style={{ background: 'var(--sage-bg)', border: '1px solid var(--sage-border)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
            style={{ background: 'var(--sage)' }}
          >
            <svg width="14" height="12" viewBox="0 0 14 12" fill="none">
              <path d="M1 6l4 4L13 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Workout complete!</p>
            <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>Resets in 24 hours</p>
          </div>
          <button
            onClick={undone}
            className="text-xs font-medium px-3 py-1.5 rounded-full"
            style={{ background: 'var(--surface)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
          >
            Undo
          </button>
        </div>
      )}

      {/* Cardio Card */}
      <section className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--sage)' }} />
          <h2 className="font-medium text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--sage)' }}>Cardio Lead-In</h2>
          <span className="ml-auto text-[11px]" style={{ color: 'var(--text-muted)' }}>15 min</span>
        </div>
        <div className="px-4 py-4">
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text)' }}>{workout.cardio}</p>
        </div>
      </section>

      {/* The Work Card */}
      <section className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
          <h2 className="font-medium text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--accent)' }}>The Work</h2>
          <span className="ml-auto text-[11px]" style={{ color: 'var(--text-muted)' }}>{workout.workLabel}</span>
        </div>
        <div className="px-4">
          {workout.exercises.map((ex) => (
            <div key={ex.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
              <ExerciseItem
                dayId={workout.id}
                id={ex.id}
                name={ex.name}
                reps={ex.reps}
                weight={ex.weight}
                weightUnit={ex.weightUnit}
                isBodyweight={ex.isBodyweight}
                note={ex.note}
                durationSec={ex.durationSec}
                forceChecked={isDone}
              />
              {ex.supersetWith && (
                <ExerciseItem
                  dayId={workout.id}
                  id={ex.supersetWith.id}
                  name={ex.supersetWith.name}
                  reps={ex.supersetWith.reps}
                  weight={ex.supersetWith.weight}
                  weightUnit={ex.supersetWith.weightUnit}
                  isBodyweight={ex.supersetWith.isBodyweight}
                  note={ex.supersetWith.note}
                  durationSec={ex.supersetWith.durationSec}
                  forceChecked={isDone}
                  isSuperset
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Abs Card */}
      <section className="rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-light)' }}>
          <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--mauve)' }} />
          <h2 className="font-medium text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--mauve)' }}>Abs Circuit</h2>
          <span className="ml-auto text-[11px]" style={{ color: 'var(--text-muted)' }}>10 min · 45s on / 15s off</span>
        </div>
        <AbsTimer exercises={workout.abs} forceCompleted={isDone} />
      </section>

      {/* Done button */}
      {!isDone && (
        <button
          onClick={markDone}
          className="w-full py-4 rounded-2xl text-sm font-semibold tracking-wide transition-all"
          style={{ background: 'var(--surface)', color: 'var(--text-2)', border: '1px solid var(--border)' }}
        >
          I finished today's workout
        </button>
      )}
    </div>
  );
}
