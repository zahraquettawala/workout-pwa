'use client';

import { useState } from 'react';
import { workouts, getTodayWorkoutId } from '@/lib/workoutData';
import DayNav from '@/components/DayNav';
import WorkoutView from '@/components/WorkoutView';
import Timer from '@/components/Timer';
import WeightTracker from '@/components/WeightTracker';

const today = getTodayWorkoutId();

export default function Home() {
  const [selected, setSelected] = useState(today === 'rest' ? 'monday' : today);
  const workout = workouts.find((w) => w.id === selected)!;

  return (
    <div className="min-h-screen max-w-md mx-auto flex flex-col" style={{ background: 'var(--bg)' }}>
      <DayNav selected={selected} today={today} onChange={setSelected} />
      <div className="flex-1 overflow-y-auto">
        <WorkoutView workout={workout} />
        {selected === 'weekend' && (
          <section className="mx-4 mb-4 rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <WeightTracker />
          </section>
        )}
        {/* Rest Timer */}
        <section className="mx-4 mb-10 rounded-2xl overflow-hidden" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
          <div className="flex items-center gap-2 px-4 py-3" style={{ borderBottom: '1px solid var(--border-light)' }}>
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--text-muted)' }} />
            <h2 className="font-medium text-[10px] tracking-[0.18em] uppercase" style={{ color: 'var(--text-muted)' }}>Rest Timer</h2>
          </div>
          <Timer />
        </section>
      </div>
    </div>
  );
}
