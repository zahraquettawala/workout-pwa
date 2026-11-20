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
    case 'glute-bridge':
      return (
        <>
          <ellipse cx="92" cy="102" rx="12" ry="9" {...m} />
          <g {...LINE}>
            <polyline points="46,128 88,104 116,94 124,133 138,133" />
            <polyline points="46,131 80,132" />
            <circle cx="30" cy="126" r="8" />
          </g>
        </>
      );
    case 'reverse-crunch':
      return (
        <>
          <ellipse cx="62" cy="126" rx="20" ry="7" {...m} />
          <g {...LINE}>
            <polyline points="44,130 84,124" />
            <polyline points="84,124 88,92 122,96" />
            <polyline points="44,131 74,133" />
            <circle cx="30" cy="126" r="8" />
          </g>
        </>
      );
    case 'dead-bug':
      return (
        <>
          <ellipse cx="62" cy="126" rx="20" ry="7" {...m} />
          <g {...LINE}>
            <polyline points="44,130 82,128" />
            <polyline points="82,128 88,94 124,98" />
            <polyline points="82,128 150,122" />
            <polyline points="44,130 46,96" />
            <polyline points="48,130 56,98" />
            <circle cx="30" cy="126" r="8" />
          </g>
        </>
      );
    case 'toe-taps':
      return (
        <>
          <ellipse cx="62" cy="126" rx="20" ry="7" {...m} />
          <g {...LINE}>
            <polyline points="44,130 82,128" />
            <polyline points="82,128 88,94 124,98" />
            <polyline points="82,128 96,104 122,132" />
            <polyline points="44,131 74,133" />
            <circle cx="30" cy="126" r="8" />
          </g>
        </>
      );
    case 'russian-twist':
      return (
        <>
          <ellipse cx="70" cy="108" rx="14" ry="10" {...m} />
          <g {...LINE}>
            <polyline points="80,126 56,88" />
            <polyline points="80,126 112,108 130,124" />
            <polyline points="58,90 76,96 96,102" />
            <circle cx="50" cy="78" r="8" />
          </g>
          <rect x="92" y="96" width="14" height="12" rx="2" {...BELL} />
        </>
      );
    case 'pull-apart':
      return (
        <>
          <ellipse cx="87" cy="66" rx="20" ry="8" {...m} />
          <g {...LINE}>
            <polyline points="87,64 87,100" />
            <polyline points="75,133 87,100 99,133" />
            <polyline points="70,64 34,64" />
            <polyline points="104,64 140,64" />
            <circle cx="87" cy="48" r="8" />
          </g>
          <line x1="34" y1="68" x2="140" y2="68" stroke={color} strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case 'jump-rope':
      return (
        <>
          <circle cx="75" cy="118" r="7" {...m} />
          <circle cx="99" cy="118" r="7" {...m} />
          <path d="M58,90 C44,16 130,16 116,90" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" />
          <g {...LINE}>
            <polyline points="87,56 87,96" />
            <polyline points="75,126 87,96 99,126" />
            <polyline points="70,60 62,78 58,90" />
            <polyline points="104,60 112,78 116,90" />
            <polyline points="70,60 104,60" />
            <circle cx="87" cy="44" r="8" />
          </g>
        </>
      );
    case 'rdl':
      return (
        <>
          <ellipse cx="80" cy="100" rx="16" ry="7" transform="rotate(-80 80 100)" {...m} />
          <g {...LINE}>
            <polyline points="98,133 84,133 84,110 78,86" />
            <polyline points="78,86 120,70" />
            <polyline points="118,72 116,104" />
            <circle cx="132" cy="64" r="8" />
          </g>
          <rect x="106" y="104" width="20" height="7" rx="2" {...BELL} />
        </>
      );
    case 'lateral-walk':
      return (
        <>
          <circle cx="78" cy="98" r="8" {...m} />
          <circle cx="96" cy="98" r="8" {...m} />
          <g {...LINE}>
            <polyline points="87,62 87,98" />
            <polyline points="74,64 100,64" />
            <polyline points="74,64 78,82 87,80" />
            <polyline points="100,64 96,82 87,80" />
            <polyline points="64,133 70,114 87,98 104,114 110,133" />
            <circle cx="87" cy="50" r="8" />
          </g>
          <line x1="71" y1="113" x2="103" y2="113" stroke={color} strokeWidth="2.4" strokeLinecap="round" />
          <g {...LINE} strokeWidth={2}>
            <polyline points="128,110 154,110" />
            <polyline points="148,104 154,110 148,116" />
          </g>
        </>
      );
    case 'march':
      return (
        <>
          <ellipse cx="98" cy="100" rx="13" ry="6" {...m} />
          <g {...LINE}>
            <polyline points="87,60 87,98" />
            <polyline points="84,133 86,116 87,98" />
            <polyline points="87,98 108,98 106,120" />
            <polyline points="87,64 100,78 110,70" />
            <polyline points="87,64 78,82 72,94" />
            <circle cx="88" cy="47" r="8" />
          </g>
        </>
      );
    case 'stretch':
      return (
        <>
          <ellipse cx="96" cy="128" rx="24" ry="5" {...m} />
          <g {...LINE}>
            <polyline points="50,130 136,130 140,120" />
            <polyline points="50,130 86,100" />
            <polyline points="84,102 124,122" />
            <circle cx="96" cy="92" r="8" />
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
  'glute-bridge',
  'reverse-crunch',
  'dead-bug',
  'toe-taps',
  'russian-twist',
  'pull-apart',
  'jump-rope',
  'rdl',
  'lateral-walk',
  'march',
  'stretch',
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
