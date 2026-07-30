import { XP_DEFAULTS, ROLE_XP_ACTIONS } from '@/lib/data/xpConfig';
import { xpForLevel } from '@/lib/constants';
import DocAchievementsViewer from './DocAchievementsViewer';

const SAMPLE_LEVELS = [1, 5, 10, 15, 20, 25];

export default function XpDocPage() {
  return (
    <main className="main-content">
      <h1 className="page-title">📈 XP</h1>
      <p className="page-subtitle">
        Cada partida deja huella: sobrevivir, ganar o usar bien tu rol da puntos de experiencia (XP).
        La XP se acumula <strong>por servidor</strong> — tu progreso en un Discord no afecta al de
        otro — y determina tu nivel, tu posición en el ranking y, si el servidor lo configura, un rol
        de rango automático.
      </p>

      <div className="card fade-in" style={{ borderLeft: '3px solid var(--accent-gold)', marginBottom: '2.5rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
          ⚠️ <strong style={{ color: 'var(--text-primary)' }}>Aviso:</strong> todas las cantidades de XP
          que ves en esta página (puntos base y XP por acción de cada rol) son los valores{' '}
          <strong style={{ color: 'var(--text-primary)' }}>por defecto</strong>. Cada servidor puede
          personalizarlos completamente a su gusto desde su panel de administración — o incluso{' '}
          <strong style={{ color: 'var(--text-primary)' }}>desactivar el sistema de XP por completo</strong>.
        </p>
      </div>

      {/* ── Fórmula ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="section-header"><div className="dot dot-village" /><h2>La fórmula del nivel</h2></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1rem' }}>
          El nivel se calcula directamente a partir de la XP acumulada, sin tablas fijas por nivel:
        </p>
        <div className="xp-formula card">Nivel = 1 + ⌊√(XP / 20)⌋</div>
        <div className="card" style={{ overflowX: 'auto' }}>
          <table className="xp-table">
            <thead><tr><th>Nivel</th>{SAMPLE_LEVELS.map((l) => <th key={l} style={{ textAlign: 'right' }}>{l}</th>)}</tr></thead>
            <tbody>
              <tr>
                <td>XP necesaria</td>
                {SAMPLE_LEVELS.map((l) => <td key={l} className="num">{xpForLevel(l).toLocaleString('es-ES')}</td>)}
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Cómo ganar XP ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="section-header"><div className="dot dot-wolves" /><h2>Cómo se gana XP</h2></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
          Al terminar cada partida, el bot calcula la XP de cada jugador con estas reglas base
          (valores por defecto — cada servidor puede ajustarlos desde el dashboard, en{' '}
          <code>/dashboard/{'{servidor}'}/xp</code>):
        </p>
        <div className="summary-grid">
          <div className="sum-card"><span className="sum-label">🕰️ Por ronda sobrevivida</span><span className="sum-value val-aldea">+{XP_DEFAULTS.pts_round_alive} XP</span></div>
          <div className="sum-card"><span className="sum-label">🏆 Victoria normal</span><span className="sum-value val-aldea">+{XP_DEFAULTS.pts_victory} XP</span></div>
          <div className="sum-card"><span className="sum-label">👑 Victoria especial</span><span className="sum-value val-aldea">+{XP_DEFAULTS.pts_special_victory} XP</span></div>
          <div className="sum-card"><span className="sum-label">❤️ Supervivencia final</span><span className="sum-value val-aldea">+{XP_DEFAULTS.pts_survive_end} XP</span></div>
        </div>
      </section>

      {/* ── Sistema de Logros Desplegable por Categorías ── */}
      <DocAchievementsViewer />

      {/* ── XP por acciones de rol (Sin punto azul en el header) ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <details className="card" style={{ padding: '1.25rem 1.5rem', cursor: 'pointer' }}>
          <summary style={{ outline: 'none', userSelect: 'none', listStyle: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div className="section-header" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
                <h2 style={{ fontSize: '1.15rem', margin: 0 }}>▶ Ver XP por acciones de rol</h2>
              </div>
              <span className="pill">Desplegar</span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '6px', marginBottom: 0 }}>
              Haz clic para desplegar el desglose detallado de XP obtenida por cada habilidad nocturna.
            </p>
          </summary>
          <div style={{ marginTop: '1.25rem', overflowX: 'auto' }}>
            <table className="xp-table">
              <thead><tr><th>Rol</th><th>Acción</th><th style={{ textAlign: 'right' }}>XP</th></tr></thead>
              <tbody>
                {ROLE_XP_ACTIONS.map((a) => (
                  <tr key={a.key}>
                    <td style={{ fontWeight: 600 }}>{a.role}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{a.label}</td>
                    <td className={`num ${a.value < 0 ? 'neg' : 'pos'}`}>{a.value > 0 ? `+${a.value}` : a.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      </section>

      {/* ── Roles de rango por nivel ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="section-header"><div className="dot dot-village" /><h2>Roles de rango por nivel</h2></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
          Desde el dashboard de administración, cada servidor puede <strong>crear sus propios roles de rango</strong> y
          asignarlos a los niveles que decida: un rol de Discord distinto para cada nivel (o tramo de niveles).
          Al subir de nivel, el bot asigna automáticamente el rol correspondiente y retira el anterior — la asignación es exclusiva,
          manteniendo siempre el rango más alto alcanzado por el jugador.
        </p>
      </section>

      {/* ── Ranking Global y Nivel de Servidor ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="section-header"><div className="dot dot-village" /><h2>Ranking Global y Nivel de Servidor</h2></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.7' }}>
          Toda la XP acumulada en tus partidas se suma permanentemente a tus <strong>puntos globales del servidor</strong>. Esta puntuación determina tu nivel histórico, desbloquea tus roles de rango automáticos y se consulta directamente con el comando <code>,ww lb global</code> / <code>/ww lb global</code> o desde las pestañas públicas de la web.
        </p>
      </section>

      {/* ── Clasificación Semanal ── */}
      <section style={{ marginBottom: '2.5rem' }}>
        <div className="section-header"><div className="dot dot-wolves" /><h2>Clasificación Semanal</h2></div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.7' }}>
          Inspirada en el sistema de AmariBot, la <strong>clasificación semanal</strong> mide los <em>WereWolf Points (WWP)</em> obtenidos exclusivamente durante el período semanal en curso. Consúltala en Discord con el comando <code>,ww lb weekly</code> / <code>,ww lb semanal</code>. Para garantizar la máxima equidad competitiva, los multiplicadores temporales o de roles no afectan a la clasificación semanal, asegurando que todos los jugadores compitan en igualdad de condiciones.
          <br /><br />
          El equipo de staff o administradores del servidor puede definir premios de XP adicionales para los mejores clasificados de la semana y reiniciar la tabla periódicamente con el comando <code>,ww resetweekly</code> o desde el panel de administración web para dar inicio a un nuevo período competitivo.
        </p>
      </section>
    </main>
  );
}
