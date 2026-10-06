'use client';

import { useState } from 'react';

const ROLE_SETS = {
  5: ['Vampiro', 'Espantapájaros', 'Vidente de Ultratumba', 'Aldeano del Cementerio', 'Momia'],
  6: ['Vampiro', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Aldeano del Cementerio', 'Momia'],
  7: ['Vampiro', 'Hombre Lobo Calabaza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Momia', 'Aldeano del Cementerio'],
  8: ['Vampiro', 'Hombre Lobo Calabaza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Aldeano del Cementerio', 'Momia'],
  9: ['Vampiro', 'Hombre Lobo Calabaza', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Momia', 'Médium', 'Aldeano del Cementerio'],
  10: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Aldeano del Cementerio'],
  11: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Gato Negro', 'Aldeano del Cementerio'],
  12: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Gato Negro', 'Cazador de Calabazas', 'Aldeano del Cementerio'],
  13: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Sepulturero', 'Gato Negro', 'Cazador de Calabazas', 'Aldeano del Cementerio'],
  14: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Sepulturero', 'Gato Negro', 'Cazador de Calabazas', 'Aldeano del Cementerio', 'Niña Fantasma'],
  15: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Sepulturero', 'Gato Negro', 'Cazador de Calabazas', 'Aldeano del Cementerio', 'Niña Fantasma', 'Momia'],
};

const ROLES = {
  village: [
    { name: 'Vidente de Ultratumba', emoji: '🔮', night: true, desc: 'Cada noche investigas a un jugador y descubres si pertenece al equipo de los Lobos.' },
    { name: 'Bruja del Caldero', emoji: '🧙‍♀️', night: true, desc: 'Tienes una poción para salvar a la víctima de los Lobos y otra para eliminar a un jugador.' },
    { name: 'Guardiana de las Velas', emoji: '🕯️', night: true, desc: 'Cada noche proteges a una persona del ataque de los Lobos.' },
    { name: 'Médium', emoji: '👻', night: true, desc: 'Visitas a una persona y bloqueas su acción nocturna. Si los Lobos atacan a quien visitas, podrías morir en su lugar.' },
    { name: 'Sepulturero', emoji: '⚰️', night: true, desc: 'Una vez por partida puedes heredar el rol de un aldeano fallecido recientemente.' },
    { name: 'Gato Negro', emoji: '🐈‍⬛', night: true, desc: 'Una vez por partida olfateas un grupo de tres jugadores y descubres si hay Lobos entre ellos.' },
    { name: 'Cazador de Calabazas', emoji: '🏹', night: false, desc: 'Cuando mueres puedes disparar a un jugador y llevártelo contigo.' },
    { name: 'Aldeano del Cementerio', emoji: '🪦', night: false, desc: 'No tienes un poder nocturno. Usa tu voto para descubrir a los Lobos.' },
    { name: 'Niña Fantasma', emoji: '👻', night: true, desc: 'Eliges a una persona como referente. Si muere, te conviertes en Hombre Lobo y pasas al equipo de los Lobos.' },
    { name: 'Momia', emoji: '🧟', night: false, desc: 'Tus vendas encantadas te permiten sobrevivir al primer ataque de los Lobos.' },
  ],
  wolves: [
    { name: 'Vampiro', emoji: '🧛', night: false, desc: 'Formas parte de la manada y compartes su ataque nocturno. Es el rol base del equipo de los Lobos.' },
    { name: 'Hombre Lobo Calabaza', emoji: '🎃', night: true, desc: 'En las noches pares, si ningún Lobo ha muerto, eliges en secreto una segunda víctima para la manada.' },
    { name: 'Brujo de las Sombras', emoji: '🕯️', night: true, desc: 'Una vez por partida puedes infectar a la víctima de la manada en lugar de matarla. Si no está protegida, se convierte en Hombre Lobo y se une a vuestro equipo.' },
  ],
  solo: [
    { name: 'Espantapájaros', emoji: '🌾', night: false, desc: 'Ganas en solitario si la Aldea te lincha durante una votación.' },
    { name: 'Jinete sin Cabeza', emoji: '🎃', night: false, desc: 'Ganas en solitario si terminas como la última persona viva.' },
  ],
};

const FILTERS = [
  { id: 'village', label: '🏡 Aldea' },
  { id: 'wolves', label: '🐺 Lobos' },
  { id: 'solo', label: '🎭 Solitarios' },
];

const TEAMS = [
  { id: 'village', label: 'Aldea', emoji: '🏡', bar: 'village' },
  { id: 'wolves', label: 'Lobos', emoji: '🐺', bar: 'wolves' },
  { id: 'solo', label: 'Solitarios', emoji: '🎭', bar: 'solo' },
];

function RoleBars({ roles, selectedRoles, team }) {
  return (
    <div className="role-grid">
      {roles.map((role) => {
        const spawn = selectedRoles.includes(role.name) ? 100 : 0;
        return (
          <div key={role.name} className={`role-bar-item ${spawn === 0 ? 'pct-zero' : ''}`}>
            <span style={{ fontSize: '1.2rem' }}>{role.emoji}</span>
            <span className="role-name">{role.name}</span>
            <div className="bar-container"><div className={`bar-fill bar-${team}`} style={{ width: `${spawn}%` }} /></div>
            <span className={`role-pct ${spawn === 0 ? 'pct-zero' : 'pct-high'}`}>{spawn}%</span>
          </div>
        );
      })}
    </div>
  );
}

export default function HalloweenPage() {
  const [players, setPlayers] = useState(10);
  const [filter, setFilter] = useState('village');
  const [open, setOpen] = useState({});
  const selectedRoles = ROLE_SETS[players];
  const counts = Object.fromEntries(TEAMS.map(({ id }) => [
    id,
    selectedRoles.filter((name) => ROLES[id].some((role) => role.name === name)).length,
  ]));

  return (
    <main className="main-content">
      <div className="presets-header">
        <h1 className="page-title">🎃 Modo Halloween</h1>
      </div>
      <p className="page-subtitle">15 roles especiales para partidas de 5 a 15 jugadores. Inícialo con <code>,ww start halloween</code>.</p>

      <section className="card fade-in" style={{ marginBottom: '2rem' }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          El modo concede XP global y semanal. Las partidas y victorias cuentan para las estadísticas y los logros existentes; no añade logros nuevos. Cada tamaño tiene una composición fija de este catálogo.
        </p>
      </section>

      <section aria-labelledby="halloween-roles-title">
        <h2 className="page-title" id="halloween-roles-title">👻 Roles de Halloween</h2>
        <p className="page-subtitle">Pulsa una tarjeta para consultar la habilidad y el objetivo del rol.</p>
        <div className="filter-bar">
          {FILTERS.map(({ id, label }) => (
            <button key={id} className={`filter-btn ${filter === id ? 'active' : ''}`} onClick={() => setFilter(id)}>
              {label} ({ROLES[id].length})
            </button>
          ))}
        </div>
        <section className="team-section">
          <div className="section-header">
            <div className={`dot dot-${filter === 'village' ? 'village' : filter}`} />
            <h2>{TEAMS.find((team) => team.id === filter)?.emoji} {TEAMS.find((team) => team.id === filter)?.label}</h2>
          </div>
          <div className="roles-grid">
            {ROLES[filter].map((role) => {
              const expanded = !!open[role.name];
              return (
                <div key={role.name} className={`role-card ${expanded ? 'open' : ''}`} role="button" tabIndex={0} aria-expanded={expanded}
                  onClick={() => setOpen((current) => ({ ...current, [role.name]: !current[role.name] }))}
                  onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setOpen((current) => ({ ...current, [role.name]: !current[role.name] })); } }}>
                  <div className="role-card-header">
                    <span className="role-emoji">{role.emoji}</span>
                    <span className="role-name">{role.name}</span>
                    <span className={`role-night ${role.night ? 'yes' : 'no'}`}>{role.night ? '🌙 Nocturno' : '☀️ Pasivo'}</span>
                    <span className="chevron">▼</span>
                  </div>
                  <div className="role-card-body"><p>{role.desc}</p></div>
                </div>
              );
            })}
          </div>
        </section>
      </section>

      <section style={{ marginTop: '3rem' }} aria-labelledby="halloween-spawn-title">
        <h2 className="page-title" id="halloween-spawn-title">📊 Composición y aparición</h2>
        <p className="page-subtitle">Mueve el control para ver la cantidad de roles por bando y la aparición de cada rol.</p>
        <div className="controls-card card fade-in">
          <div className="slider-group">
            <label htmlFor="halloween-player-slider">Jugadores: <span id="player-count-display">{players}</span></label>
            <input type="range" min="5" max="15" step="1" value={players} id="halloween-player-slider" className="styled-slider" onChange={(event) => setPlayers(Number(event.target.value))} />
          </div>
        </div>
        <div className="summary-grid fade-in">
          <div className="sum-card"><span className="sum-label">Aldea</span><span className="sum-value val-aldea">{counts.village}</span></div>
          <div className="sum-card"><span className="sum-label">Lobos</span><span className="sum-value val-lobos">{counts.wolves}</span></div>
          <div className="sum-card"><span className="sum-label">Solitarios</span><span className="sum-value val-solo">{counts.solo}</span></div>
          <div className="sum-card"><span className="sum-label">Total</span><span className="sum-value">{players}</span></div>
        </div>
        <div className="fade-in">
          {TEAMS.map((team) => (
            <section className="section" key={team.id}>
              <div className="section-header">{team.emoji} {team.label}</div>
              <RoleBars roles={ROLES[team.id]} selectedRoles={selectedRoles} team={team.bar} />
            </section>
          ))}
        </div>
        <div className="notes-container card fade-in">
          <p className="note-text">Los roles mostrados al 100 % están garantizados en la composición elegida. Un 0 % indica que no aparece con ese número de jugadores. La composición incluye entre 1 y 3 Lobos y entre 1 y 2 Solitarios.</p>
        </div>
      </section>
    </main>
  );
}
