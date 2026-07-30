// RankBadge — medalla SVG con efecto de relieve para los 3 primeros puestos
// del ranking. Sustituye a los emojis 🥇🥈🥉.

const PALETTES = {
  1: { light: '#fff4cf', base: '#f0a500', dark: '#8a5900', rim1: '#fff8e0', rim2: '#6b4600', textShadow: '#5c3c00', textFace: '#fff8e6' },
  2: { light: '#ffffff', base: '#c7cbd1', dark: '#767b85', rim1: '#ffffff', rim2: '#565b63', textShadow: '#41454c', textFace: '#ffffff' },
  3: { light: '#f0b98a', base: '#c97a3d', dark: '#7a4419', rim1: '#f5c99a', rim2: '#5c330f', textShadow: '#3d2109', textFace: '#fde8d2' },
};

export default function RankBadge({ rank, size = 30 }) {
  const p = PALETTES[rank];
  if (!p) return null;

  const gradId = `rb-grad-${rank}`;
  const rimId = `rb-rim-${rank}`;
  const glossId = `rb-gloss-${rank}`;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 34 34"
      aria-label={`Puesto ${rank}`}
      role="img"
      style={{ display: 'block', flexShrink: 0 }}
    >
      <defs>
        <radialGradient id={gradId} cx="35%" cy="30%" r="75%">
          <stop offset="0%" stopColor={p.light} />
          <stop offset="55%" stopColor={p.base} />
          <stop offset="100%" stopColor={p.dark} />
        </radialGradient>
        <linearGradient id={rimId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={p.rim1} />
          <stop offset="100%" stopColor={p.rim2} />
        </linearGradient>
        <radialGradient id={glossId} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Sombra de contacto */}
      <ellipse cx="17" cy="30.5" rx="10" ry="1.6" fill="#000000" opacity="0.22" />

      {/* Aro exterior (relieve) */}
      <circle cx="17" cy="17" r="16" fill={`url(#${rimId})`} />
      {/* Disco interior */}
      <circle cx="17" cy="16.6" r="13.2" fill={`url(#${gradId})`} stroke="rgba(0,0,0,0.28)" strokeWidth="0.6" />
      {/* Brillo superior */}
      <ellipse cx="13" cy="9.5" rx="7.5" ry="4.2" fill={`url(#${glossId})`} />
      {/* Anillo interior fino, para dar sensación de bisel */}
      <circle cx="17" cy="16.6" r="13.2" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.5" />

      {/* Número — sombra (relieve hundido) */}
      <text
        x="17" y="22.3"
        textAnchor="middle"
        fontFamily="'Cinzel', serif"
        fontSize="15"
        fontWeight="700"
        fill={p.textShadow}
        opacity="0.6"
      >
        {rank}
      </text>
      {/* Número — cara (relieve elevado) */}
      <text
        x="17" y="21.3"
        textAnchor="middle"
        fontFamily="'Cinzel', serif"
        fontSize="15"
        fontWeight="700"
        fill={p.textFace}
      >
        {rank}
      </text>
    </svg>
  );
}
