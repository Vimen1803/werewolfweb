import { auth, isGuildAdmin } from '@/lib/auth';
import { getGuildConfig, getLeaderboard, getBlacklist, getGlobalStats, getWeeklyLeaderboard, getEventLeaderboard } from '@/lib/wwData';
import AdminNav from './AdminNav';
import NotAdmin from './NotAdmin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function pct(part, total) {
  if (!total) return '0.00';
  return ((part / total) * 100).toFixed(2);
}

export default async function AdminOverviewPage({ params }) {
  const { guildId } = await params;
  const session = await auth();
  const admin = session ? isGuildAdmin(session, guildId) : false;

  const cfg = await getGuildConfig(guildId);
  const activeEvent = cfg.active_event && cfg.active_event.active ? cfg.active_event : null;

  const [top, blacklist, globalStats, weeklyTop, eventTop] = await Promise.all([
    getLeaderboard(guildId, 5),
    getBlacklist(guildId),
    getGlobalStats(guildId),
    getWeeklyLeaderboard(guildId, 1),
    activeEvent ? getEventLeaderboard(guildId, activeEvent.event_id, 1) : Promise.resolve([]),
  ]);

  const total = globalStats.total_played !== undefined ? globalStats.total_played : (globalStats.total_matches || 0);
  const villagePct = pct(globalStats.bandos_won?.aldea !== undefined ? globalStats.bandos_won.aldea : (globalStats.village_won || 0), total);
  const wolvesPct = pct(globalStats.bandos_won?.lobo !== undefined ? globalStats.bandos_won.lobo : (globalStats.wolves_won || 0), total);
  const soloWon = (globalStats.bandos_won?.lobo_blanco !== undefined ? globalStats.bandos_won.lobo_blanco : (globalStats.white_wolf_won || 0)) + 
                  (globalStats.bandos_won?.tanner !== undefined ? globalStats.bandos_won.tanner : (globalStats.tanner_won || 0)) + 
                  (globalStats.lovers_won || 0);
  const soloPct = pct(soloWon, total);

  const specialCategories = [
    { label: 'Curtidor', played: globalStats.bandos_played?.tanner !== undefined ? globalStats.bandos_played.tanner : (globalStats.tanner_matches || 0), won: globalStats.bandos_won?.tanner !== undefined ? globalStats.bandos_won.tanner : (globalStats.tanner_won || 0), color: 'var(--accent-solo)' },
    { label: 'Lobo Blanco', played: globalStats.bandos_played?.lobo_blanco !== undefined ? globalStats.bandos_played.lobo_blanco : (globalStats.white_wolf_matches || 0), won: globalStats.bandos_won?.lobo_blanco !== undefined ? globalStats.bandos_won.lobo_blanco : (globalStats.white_wolf_won || 0), color: 'var(--accent-wolf)' },
    { label: 'Amantes', played: globalStats.lovers_matches || 0, won: globalStats.lovers_won || 0, color: '#ec4899' },
  ];

  const rolesPlayedMap = globalStats.rol_played || {};
  const rolesWonMap = globalStats.rol_won || {};
  const roleEntries = Object.entries(rolesPlayedMap)
    .filter(([_, played]) => played > 0)
    .sort((a, b) => b[1] - a[1]);

  return (
    <main className="main-content">
      <AdminNav guildId={guildId} active="overview" isAdmin={admin} />

      {/* Estadísticas globales de partidas (ww_global_stats) */}
      <section className="gs-section">
        <h2 className="gs-section-title">Estadísticas de partidas</h2>

        <div className="card gs-totals-card">
          <div className="gs-total-row">
            <span>Partidas jugadas en este servidor</span>
            <strong>{total.toLocaleString('es-ES')}</strong>
          </div>

          {total > 0 ? (
            <>
              <div className="gs-split-bar">
                <div className="gs-split-village" style={{ width: `${villagePct}%` }} />
                <div className="gs-split-wolves" style={{ width: `${wolvesPct}%` }} />
                <div className="gs-split-solo" style={{ width: `${soloPct}%` }} />
              </div>
              <div className="gs-split-labels">
                <div style={{ width: `${villagePct}%`, display: 'flex', justifyContent: Number(villagePct) < 15 ? 'flex-start' : 'center' }}>
                  <span style={{ color: 'var(--accent-village)', whiteSpace: 'nowrap' }}>Aldea: {globalStats.bandos_won?.aldea !== undefined ? globalStats.bandos_won.aldea : (globalStats.village_won || 0)} ({villagePct}%)</span>
                </div>
                <div style={{ width: `${wolvesPct}%`, display: 'flex', justifyContent: 'center' }}>
                  <span style={{ color: 'var(--accent-wolf)', whiteSpace: 'nowrap' }}>Lobos: {globalStats.bandos_won?.lobo !== undefined ? globalStats.bandos_won.lobo : (globalStats.wolves_won || 0)} ({wolvesPct}%)</span>
                </div>
                <div style={{ width: `${soloPct}%`, display: 'flex', justifyContent: Number(soloPct) < 15 ? 'flex-end' : 'center' }}>
                  <span style={{ color: 'var(--accent-solo)', whiteSpace: 'nowrap' }}>Solitario: {soloWon} ({soloPct}%)</span>
                </div>
              </div>
            </>
          ) : (
            <p className="hint" style={{ marginTop: 10 }}>Todavía no se ha registrado ninguna partida en este servidor.</p>
          )}
        </div>

        <div className="gs-mini-grid">
          {specialCategories.map((c) => {
            const played = c.played || 0;
            const won = c.won || 0;
            const wr = pct(won, played);
            return (
              <div key={c.label} className="card gs-mini-card">
                <span className="gs-mini-label" style={{ color: c.color }}>{c.label}</span>
                <div className="gs-mini-stats">
                  <div>
                    <span className="gs-mini-num">{played}</span>
                    <span className="gs-mini-sub">partidas</span>
                  </div>
                  <div>
                    <span className="gs-mini-num">{won}</span>
                    <span className="gs-mini-sub">victorias</span>
                  </div>
                  <div>
                    <span className="gs-mini-num">{wr}%</span>
                    <span className="gs-mini-sub">winrate</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="gs-section-title" style={{ marginTop: '2rem' }}>Partidas por Modo de Juego</h2>
        <div className="gs-mini-grid">
          {[
            { label: 'Clásico', count: globalStats.gamemode_played?.classic !== undefined ? globalStats.gamemode_played.classic : (globalStats.classic_matches || 0), color: '#f1c40f' },
            { label: 'Slow', count: globalStats.gamemode_played?.slow !== undefined ? globalStats.gamemode_played.slow : (globalStats.slow_matches || 0), color: '#3498db' },
            { label: 'Silence', count: globalStats.gamemode_played?.silence !== undefined ? globalStats.gamemode_played.silence : (globalStats.silence_matches || 0), color: '#95a5a6' },
            { label: 'Weather', count: globalStats.gamemode_played?.weather !== undefined ? globalStats.gamemode_played.weather : (globalStats.weather_matches || 0), color: '#e67e22' },
            { label: 'Kaos', count: globalStats.gamemode_played?.kaos !== undefined ? globalStats.gamemode_played.kaos : (globalStats.kaos_matches || 0), color: '#9b59b6' },
            { label: 'Credit', count: globalStats.gamemode_played?.credit !== undefined ? globalStats.gamemode_played.credit : (globalStats.credit_matches || 0), color: '#2ecc71' },
          ].map((c) => {
            const matches = c.count;
            const percentage = total > 0 ? ((matches / total) * 100).toFixed(1) : '0.0';
            return (
              <div key={c.label} className="card gs-mini-card" style={{ borderLeft: `4px solid ${c.color}` }}>
                <span className="gs-mini-label" style={{ color: c.color }}>{c.label}</span>
                <div className="gs-mini-stats">
                  <div>
                    <span className="gs-mini-num">{matches}</span>
                    <span className="gs-mini-sub">partidas</span>
                  </div>
                  <div>
                    <span className="gs-mini-num">{percentage}%</span>
                    <span className="gs-mini-sub">del total</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="gs-section-title" style={{ marginTop: '2.5rem' }}>Rendimiento por Rol</h2>
        <p className="stats-section-sub" style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.2rem', marginTop: '-0.5rem' }}>
          Victorias y partidas jugadas con cada rol en este servidor.
        </p>

        {roleEntries.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Aún no se han registrado partidas con ningún rol en este servidor.
          </div>
        ) : (
          <div className="roles-stat-grid">
            {roleEntries.map(([roleName, playedCount]) => {
              const wonCount = rolesWonMap[roleName] || 0;
              const roleWr = playedCount > 0 ? Math.round((wonCount / playedCount) * 100) : 0;
              return (
                <div key={roleName} className="role-stat-card">
                  <div className="role-badge">{roleWr}% WINRATE</div>
                  <div className="role-stat-name">{roleName}</div>
                  <div className="role-stat-metrics">
                    <div className="metric-box">
                      <span className="metric-num win-color">{wonCount}</span>
                      <span className="metric-label">WIN</span>
                    </div>
                    <div className="metric-divider">|</div>
                    <div className="metric-box">
                      <span className="metric-num played-color">{playedCount}</span>
                      <span className="metric-label">PLAYED</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Clasificaciones y XP */}
      <section className="gs-section">
        <h2 className="gs-section-title">Clasificaciones y XP</h2>
        <div className="summary-grid">
          <div className="sum-card">
            <span className="sum-label">Multiplicador global</span>
            <span className="sum-value">{cfg.xp_multiplier ?? 1}x</span>
          </div>
          <TopCard label="Top XP global" entry={top[0]} />
          <TopCard label="Top XP semanal" entry={weeklyTop[0]} />
          {activeEvent && (
            <TopCard label={`Top evento: ${activeEvent.name}`} entry={eventTop[0]} />
          )}
        </div>
      </section>

      <div className="summary-grid">
        <div className="sum-card"><span className="sum-label">XP</span><span className="sum-value" style={{ fontSize: '1.1rem' }}>{cfg.pts_enabled ? 'Activada' : 'Desactivada'}</span></div>
        <div className="sum-card"><span className="sum-label">Blacklist</span><span className="sum-value val-lobos">{blacklist.length}</span></div>
        <div className="sum-card"><span className="sum-label">Canales</span><span className="sum-value" style={{ fontSize: '1.1rem' }}>{cfg.allowed_channels.length || 'Todos'}</span></div>
      </div>

      <style>{`
        .gs-section { margin-bottom: 2rem; }
        .gs-section-title { font-family: var(--font-display); font-size: 1.05rem; margin-bottom: 1rem; color: var(--text-primary); }
        .gs-totals-card { padding: 1.4rem 1.6rem; margin-bottom: 1rem; }
        .gs-total-row { display: flex; justify-content: space-between; align-items: baseline; font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 14px; }
        .gs-total-row strong { font-size: 1.4rem; font-family: var(--font-display); color: var(--text-primary); }
        .gs-split-bar { display: flex; width: 100%; height: 10px; border-radius: 999px; overflow: hidden; background: var(--bg-elevated); }
        .gs-split-village { background: var(--accent-village); }
        .gs-split-wolves { background: var(--accent-wolf); }
        .gs-split-solo { background: var(--accent-solo); }
        .gs-split-labels { display: flex; font-size: 0.78rem; font-weight: 600; margin-top: 8px; width: 100%; }
        .gs-mini-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
        .gs-mini-card { padding: 1.1rem 1.2rem; display: flex; flex-direction: column; gap: 10px; }
        .gs-mini-label { font-size: 0.8rem; font-weight: 700; }
        .gs-mini-stats { display: flex; justify-content: space-between; }
        .gs-mini-num { display: block; font-size: 1.2rem; font-weight: 800; font-family: var(--font-display); color: var(--text-primary); }
        .gs-mini-sub { display: block; font-size: 0.65rem; text-transform: uppercase; letter-spacing: 0.04em; color: var(--text-muted); margin-top: 2px; }
        .sum-sub { font-size: 0.72rem; color: var(--text-muted); font-weight: 600; }
        
        .roles-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(135px, 1fr));
          gap: 12px;
        }
        .role-stat-card {
          background: #141519;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 10px 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          min-height: 120px;
          transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
        }
        .role-stat-card:hover {
          border-color: #eab308;
          box-shadow: 0 0 12px rgba(234, 179, 8, 0.15);
          transform: translateY(-2px);
        }
        .role-badge {
          background: #eab308;
          color: #000000;
          font-weight: 800;
          font-size: 0.65rem;
          padding: 3px 7px;
          border-radius: 4px;
          letter-spacing: 0.02em;
          margin-bottom: 8px;
          text-transform: uppercase;
          line-height: 1;
        }
        .role-stat-name {
          font-weight: 700;
          font-size: 0.88rem;
          color: #ffffff;
          text-align: center;
          margin-bottom: 10px;
          word-break: break-word;
          line-height: 1.2;
        }
        .role-stat-metrics {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
        }
        .metric-box {
          background: none;
          border: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-width: 30px;
        }
        .metric-num {
          font-size: 1.2rem;
          font-weight: 800;
          line-height: 1;
        }
        .win-color {
          color: #eab308;
        }
        .played-color {
          color: #ffffff;
        }
        .metric-label {
          font-size: 0.58rem;
          color: var(--text-muted);
          font-weight: 700;
          margin-top: 3px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }
        .metric-divider {
          color: rgba(255, 255, 255, 0.2);
          font-size: 0.95rem;
          font-weight: 300;
          margin-bottom: 10px;
          user-select: none;
        }

        @media (max-width: 700px) {
          .gs-mini-grid { grid-template-columns: 1fr; }
          .roles-stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </main>
  );
}

function TopCard({ label, entry }) {
  return (
    <div className="sum-card">
      <span className="sum-label">{label}</span>
      <span className="sum-value" style={{ fontSize: '1.05rem' }}>{entry ? entry.username : '—'}</span>
      {entry && <span className="sum-sub">{(entry.event_points || 0).toLocaleString('es-ES')} XP</span>}
    </div>
  );
}
