'use client';

import { useState } from 'react';
import { workouts, getTodayWorkoutId } from '@/lib/workoutData';
import DayNav from '@/components/DayNav';
import WorkoutView from '@/components/WorkoutView';
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
        <p className="text-center text-sm pb-10 pt-2" style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-serif)' }}>
          don't forget to stretch babe!
        </p>
      </div>
    </div>
  );
}
