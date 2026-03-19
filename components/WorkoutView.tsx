import { WorkoutDay } from '@/lib/workoutData';
import ExerciseItem from './ExerciseItem';
import AbsTimer from './AbsTimer';

type Props = { workout: WorkoutDay };

export default function WorkoutView({ workout }: Props) {
  return (
    <div className="px-4 pb-6 space-y-4 pt-5">
      {/* Header */}
      <div className="pb-1">
        <h1
          className="text-3xl tracking-tight leading-none"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--text)' }}
        >
          {workout.title}
        </h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{workout.subtitle}</p>
      </div>

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
        <div className="px-4" style={{ borderTop: 'none' }}>
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
        <AbsTimer exercises={workout.abs} />
      </section>
    </div>
  );
}
