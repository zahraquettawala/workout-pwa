const LINE = {
  fill: 'none',
  stroke: 'var(--text)',
  strokeWidth: 3.4,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const FURN = { fill: 'var(--border)', stroke: 'var(--text-muted)', strokeWidth: 0.8 } as const;
const BELL = { fill: 'var(--text-muted)', stroke: 'var(--text)', strokeWidth: 0.8 } as const;
const LEG = { stroke: 'var(--text-muted)', strokeWidth: 3, strokeLinecap: 'round' } as const;

function Figure({ name, color }: { name: string; color: string }) {
  const m = { fill: color, fillOpacity: 0.32 } as const;
  switch (name) {
    case 'split-squat':
      return (
        <>
          <rect x="8" y="105" width="34" height="6" {...FURN} />
          <line x1="12" y1="111" x2="12" y2="135" {...LEG} />
          <line x1="38" y1="111" x2="38" y2="135" {...LEG} />
          <ellipse cx="103" cy="97" rx="22" ry="9" transform="rotate(14 103 97)" {...m} />
          <g {...LINE}>
            <polyline points="20,102 30,100 62,126 84,92" />
            <polyline points="84,92 86,52" />
            <polyline points="84,92 122,101 114,133 128,133" />
            <polyline points="86,54 88,92" />
            <circle cx="87" cy="40" r="8" />
          </g>
          <rect x="80" y="94" width="16" height="7" rx="2" {...BELL} />
        </>
      );
    case 'pushup':
      return (
        <>
          <ellipse cx="116" cy="114" rx="11" ry="8" {...m} />
          <g {...LINE}>
            <polyline points="22,133 70,121 118,112" />
            <polyline points="118,112 106,124 120,134" />
            <circle cx="132" cy="106" r="8" />
          </g>
        </>
      );
    case 'row':
      return (
        <>
          <rect x="120" y="95" width="42" height="6" {...FURN} />
          <line x1="124" y1="101" x2="124" y2="135" {...LEG} />
          <line x1="158" y1="101" x2="158" y2="135" {...LEG} />
          <ellipse cx="88" cy="79" rx="22" ry="7" transform="rotate(-15 88 79)" {...m} />
          <g {...LINE}>
            <polyline points="62,133 48,133 60,108 66,84" />
            <polyline points="66,84 110,72" />
            <polyline points="110,74 128,93" />
            <polyline points="104,77 88,84 96,104" />
            <circle cx="121" cy="68" r="8" />
          </g>
          <rect x="88" y="104" width="16" height="7" rx="2" {...BELL} />
        </>
      );
    case 'hip-thrust':
      return (
        <>
          <rect x="8" y="100" width="42" height="35" {...FURN} />
          <ellipse cx="86" cy="92" rx="12" ry="9" {...m} />
          <g {...LINE}>
            <polyline points="42,96 84,90" />
            <polyline points="84,90 118,94 124,133 138,133" />
            <circle cx="26" cy="90" r="8" />
          </g>
          <rect x="76" y="79" width="16" height="7" rx="2" {...BELL} />
        </>
      );
    case 'sl-rdl':
      return (
        <>
          <ellipse cx="58" cy="80" rx="24" ry="7" transform="rotate(-10 58 80)" {...m} />
          <g {...LINE}>
            <polyline points="92,133 80,133 82,108 80,84" />
            <polyline points="80,84 122,70" />
            <polyline points="80,84 34,76" />
            <polyline points="120,72 120,104" />
            <circle cx="134" cy="66" r="8" />
          </g>
          <rect x="112" y="104" width="16" height="7" rx="2" {...BELL} />
        </>
      );
    case 'shoulder-press':
      return (
        <>
          <circle cx="70" cy="62" r="9" {...m} />
          <circle cx="104" cy="62" r="9" {...m} />
          <g {...LINE}>
            <polyline points="87,62 87,100" />
            <polyline points="70,62 104,62" />
            <polyline points="75,133 87,100 99,133" />
            <polyline points="70,62 64,32" />
            <polyline points="104,62 110,32" />
            <circle cx="87" cy="48" r="8" />
          </g>
          <rect x="54" y="29" width="20" height="6" rx="2" {...BELL} />
          <rect x="100" y="29" width="20" height="6" rx="2" {...BELL} />
        </>
      );
    case 'goblet-squat':
      return (
        <>
          <ellipse cx="93" cy="111" rx="21" ry="8" transform="rotate(-5 93 111)" {...m} />
          <g {...LINE}>
            <polyline points="98,133 86,133 112,108 74,114" />
            <polyline points="74,114 90,68" />
            <polyline points="90,70 98,94 104,82" />
            <circle cx="93" cy="56" r="8" />
          </g>
          <rect x="101" y="72" width="7" height="16" rx="2" {...BELL} />
        </>
      );
    case 'thruster':
      return (
        <>
          <ellipse cx="87" cy="108" rx="24" ry="8" {...m} />
          <g {...LINE}>
            <polyline points="87,70 87,104" />
            <polyline points="70,70 104,70" />
            <polyline points="66,133 62,114 87,104 112,114 108,133" />
            <polyline points="70,70 66,84 72,66" />
            <polyline points="104,70 108,84 102,66" />
            <circle cx="87" cy="57" r="8" />
          </g>
          <rect x="60" y="62" width="20" height="6" rx="2" {...BELL} />
          <rect x="94" y="62" width="20" height="6" rx="2" {...BELL} />
          <g {...LINE} strokeWidth={2}>
            <polyline points="87,44 87,28" />
            <polyline points="82,33 87,28 92,33" />
          </g>
        </>
      );
    default:
      return null;
  }
}

export const FIGURE_NAMES = [
  'split-squat',
  'pushup',
  'row',
  'hip-thrust',
  'sl-rdl',
  'shoulder-press',
  'goblet-squat',
  'thruster',
];

export default function MoveFigure({ name, color }: { name: string; color: string }) {
  if (!FIGURE_NAMES.includes(name)) return null;
  return (
    <svg
      viewBox="0 24 175 114"
      className="shrink-0 w-[104px] h-auto rounded-xl"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      role="img"
      aria-label={name.replace(/-/g, ' ')}
    >
      <line x1="6" y1="135" x2="169" y2="135" stroke="var(--border)" strokeWidth="1.5" />
      <Figure name={name} color={color} />
    </svg>
  );
}
