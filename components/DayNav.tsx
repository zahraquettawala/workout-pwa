'use client';

const DAYS = [
  { id: 'monday', label: 'MON' },
  { id: 'tuesday', label: 'TUE' },
  { id: 'thursday', label: 'THU' },
  { id: 'friday', label: 'FRI' },
  { id: 'weekend', label: 'SAT/SUN' },
];

type DayNavProps = {
  selected: string;
  today: string;
  onChange: (id: string) => void;
};

export default function DayNav({ selected, today, onChange }: DayNavProps) {
  return (
    <div className="flex gap-2 px-4 py-4 overflow-x-auto scrollbar-none" style={{ borderBottom: '1px solid var(--border-light)' }}>
      {DAYS.map((d) => {
        const isActive = selected === d.id;
        const isToday = today === d.id;
        return (
          <button
            key={d.id}
            onClick={() => onChange(d.id)}
            className="relative shrink-0 px-4 py-2 rounded-full text-[11px] font-semibold tracking-[0.12em] uppercase transition-all"
            style={isActive ? {
              background: 'var(--accent)',
              color: '#fff',
            } : {
              background: 'transparent',
              color: 'var(--text-2)',
              border: '1px solid var(--border)',
            }}
          >
            {d.label}
            {isToday && (
              <span
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
                style={{
                  background: isActive ? '#fff' : 'var(--accent)',
                  border: '2px solid var(--bg)',
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
