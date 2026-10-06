const ROLE_SETS = {
  5: ['Vampiro', 'Espantapájaros', 'Vidente de Ultratumba', 'Aldeano del Cementerio', 'Oráculo'],
  6: ['Vampiro', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Aldeano del Cementerio', 'Oráculo'],
  7: ['Vampiro', 'Hombre Lobo Calabaza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Oráculo', 'Aldeano del Cementerio'],
  8: ['Vampiro', 'Hombre Lobo Calabaza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Aldeano del Cementerio', 'Oráculo'],
  9: ['Vampiro', 'Hombre Lobo Calabaza', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Oráculo', 'Médium', 'Aldeano del Cementerio'],
  10: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Aldeano del Cementerio'],
  11: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Gato Negro', 'Aldeano del Cementerio'],
  12: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Gato Negro', 'Cazador de Calabazas', 'Aldeano del Cementerio'],
  13: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Sepulturero', 'Gato Negro', 'Cazador de Calabazas', 'Aldeano del Cementerio'],
  14: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Sepulturero', 'Gato Negro', 'Cazador de Calabazas', 'Aldeano del Cementerio', 'Niña Fantasma'],
  15: ['Vampiro', 'Hombre Lobo Calabaza', 'Brujo de las Sombras', 'Jinete sin Cabeza', 'Espantapájaros', 'Vidente de Ultratumba', 'Bruja del Caldero', 'Guardiana de las Velas', 'Médium', 'Sepulturero', 'Gato Negro', 'Cazador de Calabazas', 'Aldeano del Cementerio', 'Niña Fantasma', 'Oráculo'],
};

const ROLE_INFO = [
  ['Vampiro', '🧛', 'Lobos', 'Se une al ataque colectivo de la manada.'],
  ['Hombre Lobo Calabaza', '🎃', 'Lobos', 'Caza junto a los demás lobos cada noche.'],
  ['Brujo de las Sombras', '🕯️', 'Lobos', 'Forma parte de la manada y comparte su objetivo.'],
  ['Espantapájaros', '🌾', 'Solitario', 'Gana si la Aldea te lincha durante una votación.'],
  ['Jinete sin Cabeza', '🎃', 'Solitario', 'Gana si termina como la última persona viva.'],
  ['Vidente de Ultratumba', '🔮', 'Aldea', 'Investiga a una persona cada noche para descubrir si es lobo.'],
  ['Bruja del Caldero', '🧙‍♀️', 'Aldea', 'Tiene una poción para salvar y otra para eliminar.'],
  ['Guardiana de las Velas', '🕯️', 'Aldea', 'Protege a una persona del ataque de los lobos cada noche.'],
  ['Médium', '👻', 'Aldea', 'Visita a una persona y bloquea su acción nocturna; puede correr peligro si atacan a su objetivo.'],
  ['Sepulturero', '⚰️', 'Aldea', 'Una vez por partida puede heredar un rol de la Aldea fallecido recientemente.'],
  ['Gato Negro', '🐈‍⬛', 'Aldea', 'Una vez olfatea a un grupo de tres y averigua si hay lobos.'],
  ['Cazador de Calabazas', '🏹', 'Aldea', 'Al morir, puede disparar a una persona.'],
  ['Aldeano del Cementerio', '🪦', 'Aldea', 'Sin poder nocturno; su voto ayuda a descubrir a la manada.'],
  ['Niña Fantasma', '👻', 'Aldea', 'Elige a una persona de referencia; al morir esta, te conviertes en Hombre Lobo.'],
  ['Oráculo', '🪬', 'Aldea', 'Recibe dos revelaciones de la partida: una verdadera y otra falsa.'],
];

export const metadata = {
  title: 'Modo Halloween — Werewolf Bot',
  description: 'Reglas, roles y aparición por jugadores del modo temporal de Halloween.',
};

export default function HalloweenPage() {
  return (
    <main className="main-content">
      <h1 className="page-title">🎃 Modo Halloween</h1>
      <p className="page-subtitle">Un modo temporal de deducción y supervivencia para partidas de 5 a 15 jugadores. Inícialo con <code>,ww start halloween</code>.</p>
      <section className="card fade-in" style={{ marginBottom: '2rem' }}>
        <h2>Cómo se juega</h2>
        <p>El catálogo tiene 15 roles: 3 de Lobos, 2 Solitarios y 10 de Aldea. Cada partida selecciona una composición equilibrada dentro de ese catálogo según el número de participantes; el detalle de cada tamaño aparece en la tabla inferior. Las acciones de noche, el debate y la votación siguen las reglas habituales. Halloween concede XP global y semanal, y suma partidas y victorias a las estadísticas y al progreso de logros existentes. No añade logros nuevos.</p>
      </section>
      <section style={{ marginBottom: '2rem' }}>
        <h2>Los 15 roles</h2>
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 620 }}>
            <thead><tr><th style={{ textAlign: 'left', padding: 10 }}>Rol</th><th style={{ textAlign: 'left', padding: 10 }}>Bando</th><th style={{ textAlign: 'left', padding: 10 }}>Habilidad / objetivo</th></tr></thead>
            <tbody>{ROLE_INFO.map(([name, emoji, team, desc]) => <tr key={name} style={{ borderTop: '1px solid var(--border-color, rgba(255,255,255,.1))' }}><td style={{ padding: 10, whiteSpace: 'nowrap' }}>{emoji} {name}</td><td style={{ padding: 10 }}>{team}</td><td style={{ padding: 10 }}>{desc}</td></tr>)}</tbody>
          </table>
        </div>
      </section>
      <section>
        <h2>Qué roles aparecen</h2>
        <p>La tabla muestra la probabilidad de aparición en el mazo fijado para cada tamaño. “100 %” significa que el rol está garantizado; “—” indica que no aparece en esa composición.</p>
        <div className="card" style={{ overflowX: 'auto' }}>
          <table style={{ borderCollapse: 'collapse', minWidth: 920, width: '100%', fontSize: '.85rem' }}>
            <thead><tr><th style={{ textAlign: 'left', padding: 8 }}>Rol</th>{Object.keys(ROLE_SETS).map(n => <th key={n} style={{ padding: 8 }}>{n}</th>)}</tr></thead>
            <tbody>{ROLE_INFO.map(([name, emoji]) => <tr key={name} style={{ borderTop: '1px solid var(--border-color, rgba(255,255,255,.1))' }}><td style={{ padding: 8, whiteSpace: 'nowrap' }}>{emoji} {name}</td>{Object.values(ROLE_SETS).map((roles, i) => <td key={i} style={{ textAlign: 'center', padding: 8 }}>{roles.includes(name) ? '100 %' : '—'}</td>)}</tr>)}</tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
