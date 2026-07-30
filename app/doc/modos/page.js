// ww_web/app/doc/modos/page.js

export const metadata = {
  title: 'Modos de Juego - Werewolf Bot',
  description: 'Aprende sobre los diferentes modos de juego disponibles en Werewolf: Clásico, Slow, Silence, Weather, Kaos y Credit.',
};

export default function ModosDocPage() {
  return (
    <main className="main-content">
      <h1 className="page-title">🎮 Modos de Juego</h1>
      <p className="page-subtitle">
        Werewolf no es solo debate diurno y asesinatos nocturnos tradicionales. Explora los diferentes modos de juego disponibles en el bot y adapta la experiencia a tu servidor.
      </p>

      <div className="card fade-in" style={{ borderLeft: '3px solid var(--accent-gold)', marginBottom: '2.5rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          💡 <strong style={{ color: 'var(--text-primary)' }}>XP:</strong> Jugar cualquier modo alternativo al clásico incrementa tus estadísticas, sin embargo, <strong>no se suma XP</strong> en modos alternativos para garantizar el equilibrio del ranking.
        </p>
      </div>

      <section style={{ marginBottom: '2.5rem' }}>
        <div className="section-header"><div className="dot dot-village" /><h2>Catálogo de Modos</h2></div>
        
        <div className="modos-container">
          {[
            {
              name: '🐺 Clásico',
              command: ',ww start',
              desc: 'El modo tradicional de toda la vida. Debate diurno rápido, votaciones abiertas, y resolución de acciones nocturnas inmediatas. Otorga XP global, semanal y de evento de forma normal.',
              color: '#f1c40f',
              details: [
                'Roles revelados en ejecuciones y muertes.',
                'Tiempos de acción estándar configurados en el servidor.'
              ]
            },
            {
              name: '🐌 Slow',
              command: ',ww start slow',
              desc: 'Ideal para comunidades asíncronas o partidas relajadas. Las fases nocturna y diurna duran horas o días completos en lugar de segundos.',
              color: '#3498db',
              details: [
                'Duración configurable de debate diurno (e.g. 12h, 24h).',
                'Perfecto para servidores grandes con juego pausado.'
              ]
            },
            {
              name: '🤫 Silence',
              command: ',ww start silence',
              desc: 'Un velo de misterio cubre la aldea. Toda la información de muertes y roles es confidencial. Nadie sabe quién muere de qué, ni qué rol tenía.',
              color: '#95a5a6',
              details: [
                'No hay anuncios públicos de quién muere en la noche.',
                'Los roles y las causas de muerte de los linchados se ocultan ("Rol Desconocido").',
                'Las muertes secundarias (como los amantes o disparos del cazador) ocultan el rol y detalles.'
              ]
            },
            {
              name: '🌫️ Weather (Climas)',
              command: ',ww start weather',
              desc: 'La naturaleza interviene en el juego. Cada día amanece con un clima aleatorio que afecta la visibilidad, la velocidad de las acciones o introduce eventos catastróficos.',
              color: '#e67e22',
              details: [
                '☀️ Sunny (Soleado): Clima despejado sin efectos especiales.',
                '🌫️ Fog (Niebla): La visibilidad es nula. La votación del día se vuelve completamente anónima.',
                '⛈️ Thunderstorm (Tormenta): La tensión es máxima. Un empate exacto de votos desata un rayo que fulmina a un candidato aleatorio.',
                '🌙 Moon (Luna Llena): La noche se acelera. Los tiempos nocturnos se reducen a la mitad, y las protecciones/trampas tienen un 50% de probabilidad de fallar.',
                '❄️ Blizzard (Ventisca): El frío congela a un jugador vivo al azar, impidiéndole votar durante el día.'
              ]
            },
            {
              name: '🎭 Kaos',
              command: ',ww start kaos',
              desc: 'Desorden absoluto en la asignación de roles. Ignora por completo los límites de nivel del servidor y las restricciones del generador clásico.',
              color: '#9b59b6',
              details: [
                'Distribución uniforme de roles entre los disponibles.',
                'Permite composiciones caóticas y muy divertidas.',
                'Mantiene únicamente las validaciones lógicas esenciales (e.g., debe haber al menos un lobo).'
              ]
            },
            {
              name: '💳 Credit (Créditos de Voto)',
              command: ',ww start credit',
              desc: 'Introduce una reserva finita de créditos de voto. Cada jugador tiene una cantidad inicial de créditos y debe gestionar su gasto sabiamente a lo largo del juego.',
              color: '#2ecc71',
              details: [
                'Los votos consumen entre 1 y el total de tus créditos restantes.',
                'Saltar la votación (SKIP) no consume créditos.',
                'Si te quedas sin créditos, no podrás volver a votar en el resto de la partida.'
              ]
            }
          ].map((mode) => (
            <div key={mode.name} className="card mode-detail-card" style={{ borderLeft: `4px solid ${mode.color}`, marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ margin: 0, color: '#ffffff', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{mode.name}</h3>
                <code style={{ background: 'var(--bg-elevated)', padding: '4px 10px', borderRadius: 4, color: mode.color, fontSize: '0.8rem' }}>{mode.command}</code>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 10, marginBottom: 12 }}>{mode.desc}</p>
              <ul style={{ paddingLeft: 20, margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {mode.details.map((detail, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginBottom: '2.5rem' }}>
        <div className="section-header"><div className="dot dot-wolf" /><h2>Modos de Votación</h2></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
          Independientemente del modo de juego que elijas, puedes configurar cómo se realizan las votaciones diurnas. Esto afecta a la transparencia del proceso de debate y linchamiento.
        </p>

        <div className="modos-container">
          {[
            {
              name: '👁️ Votación Pública',
              command: ',ww start public',
              desc: 'Todos los votos son visibles para el resto de jugadores durante la fase de votación. Es el sistema clásico de Werewolf donde la presión social y la influencia directa son la clave.',
              color: '#3498db',
              details: [
                'Cada jugador puede ver quién ha votado a quién en tiempo real.',
                'Permite cambiar el voto durante el período de votación.',
                'Ideal para grupos que valoran la negociación abierta y las alianzas visibles.',
                'Se activa con el flag "public" al crear la partida.'
              ]
            },
            {
              name: '🔒 Votación Anónima',
              command: ',ww start private',
              desc: 'Los votos se realizan a través de un selector privado (menú desplegable). Nadie sabe quién ha votado a quién hasta que se revela el resultado final del conteo.',
              color: '#9b59b6',
              details: [
                'Se usa un menú de selección interactivo en el canal (Select Menu).',
                'Solo se revelan los conteos finales, no los votantes individuales.',
                'Reduce la presión social y permite votaciones más estratégicas y silenciosas.',
                'Es el modo de votación por defecto. Se activa explícitamente con el flag "private".'
              ]
            }
          ].map((mode) => (
            <div key={mode.name} className="card mode-detail-card" style={{ borderLeft: `4px solid ${mode.color}`, marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 10 }}>
                <h3 style={{ margin: 0, color: '#ffffff', fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>{mode.name}</h3>
                <code style={{ background: 'var(--bg-elevated)', padding: '4px 10px', borderRadius: 4, color: mode.color, fontSize: '0.8rem' }}>{mode.command}</code>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 10, marginBottom: 12 }}>{mode.desc}</p>
              <ul style={{ paddingLeft: 20, margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                {mode.details.map((detail, idx) => (
                  <li key={idx} style={{ marginBottom: 4 }}>{detail}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="card fade-in" style={{ borderLeft: '3px solid var(--accent-gold)', marginTop: '1rem' }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
            💡 <strong style={{ color: 'var(--text-primary)' }}>Combinaciones:</strong> Puedes combinar el modo de votación con cualquier modo de juego. Por ejemplo: <code style={{ background: 'var(--bg-elevated)', padding: '2px 6px', borderRadius: 3 }}>,ww start kaos public</code> inicia una partida en modo Kaos con votación pública.
          </p>
        </div>
      </section>

      <style>{`
        .modos-container {
          display: flex;
          flex-direction: column;
        }
        .mode-detail-card {
          padding: 1.5rem;
          transition: transform 0.2s, border-color 0.2s;
        }
        .mode-detail-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </main>
  );
}
