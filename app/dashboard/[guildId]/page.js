import { auth, hasGuildAdminOrMod } from '@/lib/auth';
import { getGuildConfig, getLeaderboard, getBlacklist, getGlobalStats, getWeeklyLeaderboard, getEventLeaderboard } from '@/lib/wwData';
import AdminNav from './AdminNav';
import NotAdmin from './NotAdmin';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage({ params }) {
  const { guildId } = await params;
  const session = await auth();
  const admin = session ? await hasGuildAdminOrMod(session, guildId) : false;

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
  const villagePlayed = globalStats.bandos_played?.aldea ?? total;
  const villageWon = globalStats.bandos_won?.aldea ?? (globalStats.village_won || 0);
  const villageWr = villagePlayed > 0 ? Math.round((villageWon / villagePlayed) * 100) : 0;

  const wolfPlayed = globalStats.bandos_played?.lobo ?? total;
  const wolfWon = globalStats.bandos_won?.lobo ?? (globalStats.wolves_won || 0);
  const wolfWr = wolfPlayed > 0 ? Math.round((wolfWon / wolfPlayed) * 100) : 0;

  const tannerPlayed = globalStats.bandos_played?.tanner ?? (globalStats.tanner_matches || 0);
  const tannerWon = globalStats.bandos_won?.tanner ?? (globalStats.tanner_won || 0);
  const wbPlayed = globalStats.bandos_played?.lobo_blanco ?? (globalStats.white_wolf_matches || 0);
  const wbWon = globalStats.bandos_won?.lobo_blanco ?? (globalStats.white_wolf_won || 0);
  const solitarioPlayed = tannerPlayed + wbPlayed;
  const solitarioWon = tannerWon + wbWon;
  const solitarioWr = solitarioPlayed > 0 ? Math.round((solitarioWon / solitarioPlayed) * 100) : 0;

  const loversPlayed = globalStats.bandos_played?.lovers ?? (globalStats.lovers_matches || 0);
  const loversWon = globalStats.bandos_won?.lovers ?? (globalStats.lovers_won || 0);
  const loversWr = loversPlayed > 0 ? Math.round((loversWon / loversPlayed) * 100) : 0;

  const rolesPlayedMap = globalStats.rol_played || {};
  const rolesWonMap = globalStats.rol_won || {};
  const roleEntries = Object.entries(rolesPlayedMap)
    .sort((a, b) => {
      if (b[1] !== a[1]) return b[1] - a[1];
      return a[0].localeCompare(b[0]);
    });

  // Gamemodes
  const gamemodes = [
    { name: 'Clásico', icon: '🐺', played: globalStats.gamemode_played?.classic ?? (globalStats.classic_matches || 0), color: '#f1c40f' },
    { name: 'Slow', icon: '🐌', played: globalStats.gamemode_played?.slow ?? (globalStats.slow_matches || 0), color: '#3498db' },
    { name: 'Silence', icon: '🤫', played: globalStats.gamemode_played?.silence ?? (globalStats.silence_matches || 0), color: '#95a5a6' },
    { name: 'Weather', icon: '🌫️', played: globalStats.gamemode_played?.weather ?? (globalStats.weather_matches || 0), color: '#e67e22' },
    { name: 'Kaos', icon: '🎭', played: globalStats.gamemode_played?.kaos ?? (globalStats.kaos_matches || 0), color: '#9b59b6' },
    { name: 'Credit', icon: '💳', played: globalStats.gamemode_played?.credit ?? (globalStats.credit_matches || 0), color: '#2ecc71' },
    { name: 'Halloween', icon: '🎃', played: globalStats.gamemode_played?.halloween ?? (globalStats.halloween_matches || 0), color: '#e67e22' },
  ];

  return (
    <main className="main-content">
      <AdminNav guildId={guildId} active="overview" isAdmin={admin} />

      <section className="gs-section">
        {/* Rendimiento por Bando */}
        <h2 className="stats-section-title">Rendimiento por Bando</h2>
        <div className="bando-grid">
          <div className="bando-card">
            <div className="bando-header">
              <span className="bando-icon" style={{ color: '#22c55e' }}>🏡</span>
              <span>Aldea</span>
            </div>
            <div className="bando-stats">
              <div className="bando-stat-col">
                <span className="bando-label">PARTIDAS</span>
                <span className="bando-val">{villagePlayed}</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">WINRATE</span>
                <span className="bando-val" style={{ color: '#22c55e' }}>{villageWr}%</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">VICTORIAS</span>
                <span className="bando-val" style={{ color: '#22c55e' }}>{villageWon}</span>
              </div>
            </div>
            <div className="bando-bar" style={{ background: '#22c55e' }} />
          </div>

          <div className="bando-card">
            <div className="bando-header">
              <span className="bando-icon" style={{ color: '#ef4444' }}>🌙</span>
              <span>Lobos</span>
            </div>
            <div className="bando-stats">
              <div className="bando-stat-col">
                <span className="bando-label">PARTIDAS</span>
                <span className="bando-val">{wolfPlayed}</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">WINRATE</span>
                <span className="bando-val" style={{ color: '#ef4444' }}>{wolfWr}%</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">VICTORIAS</span>
                <span className="bando-val" style={{ color: '#ef4444' }}>{wolfWon}</span>
              </div>
            </div>
            <div className="bando-bar" style={{ background: '#ef4444' }} />
          </div>

          <div className="bando-card">
            <div className="bando-header">
              <span className="bando-icon" style={{ color: '#a855f7' }}>✦</span>
              <span>Solitario</span>
            </div>
            <div className="bando-stats">
              <div className="bando-stat-col">
                <span className="bando-label">PARTIDAS</span>
                <span className="bando-val">{solitarioPlayed}</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">WINRATE</span>
                <span className="bando-val" style={{ color: '#a855f7' }}>{solitarioWr}%</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">VICTORIAS</span>
                <span className="bando-val" style={{ color: '#a855f7' }}>{solitarioWon}</span>
              </div>
            </div>
            <div className="bando-bar" style={{ background: '#a855f7' }} />
          </div>

          <div className="bando-card">
            <div className="bando-header">
              <span className="bando-icon" style={{ color: '#ec4899' }}>💗</span>
              <span>Amantes</span>
            </div>
            <div className="bando-stats">
              <div className="bando-stat-col">
                <span className="bando-label">PARTIDAS</span>
                <span className="bando-val">{loversPlayed}</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">WINRATE</span>
                <span className="bando-val" style={{ color: '#ec4899' }}>{loversWr}%</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">VICTORIAS</span>
                <span className="bando-val" style={{ color: '#ec4899' }}>{loversWon}</span>
              </div>
            </div>
            <div className="bando-bar" style={{ background: '#ec4899' }} />
          </div>
        </div>

        {/* Rendimiento por Modo */}
        <h2 className="stats-section-title" style={{ marginTop: '2.5rem' }}>Rendimiento por Modo</h2>
        <p className="stats-section-sub">Partidas jugadas en cada modo de juego en este servidor.</p>
        <div className="modo-grid">
          {gamemodes.map((m) => {
            const played = m.played || 0;
            const percentage = total > 0 ? ((played / total) * 100).toFixed(1) : '0.0';
            return (
              <div key={m.name} className="bando-card">
                <div className="bando-header">
                  <span className="bando-icon" style={{ color: m.color }}>{m.icon}</span>
                  <span>{m.name}</span>
                </div>
                <div className="bando-stats">
                  <div className="bando-stat-col">
                    <span className="bando-label">PARTIDAS</span>
                    <span className="bando-val">{played}</span>
                  </div>
                  <div className="bando-stat-col">
                    <span className="bando-label">% DEL TOTAL</span>
                    <span className="bando-val" style={{ color: m.color }}>{percentage}%</span>
                  </div>
                </div>
                <div className="bando-bar" style={{ background: m.color }} />
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
        .sum-sub { font-size: 0.72rem; color: var(--text-muted); font-weight: 600; }

        .stats-section-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          color: var(--text-primary);
          margin-bottom: 1rem;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .stats-section-sub {
          color: var(--text-secondary);
          font-size: 0.88rem;
          margin-bottom: 1.25rem;
        }

        .bando-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 16px;
        }
        .modo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .bando-card {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 18px 20px 22px;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .bando-header {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 700;
          font-size: 1.1rem;
          color: #ffffff;
          margin-bottom: 18px;
        }
        .bando-icon {
          font-size: 1.2rem;
        }
        .bando-stats {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
        }
        .bando-stat-col {
          display: flex;
          flex-direction: column;
        }
        .bando-label {
          font-size: 0.65rem;
          letter-spacing: 0.06em;
          color: var(--text-muted);
          font-weight: 700;
          margin-bottom: 4px;
        }
        .bando-val {
          font-size: 1.45rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
        }
        .bando-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 4px;
        }

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

        @media (max-width: 900px) {
          .bando-grid { grid-template-columns: repeat(2, 1fr); }
          .modo-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 600px) {
          .bando-grid { grid-template-columns: 1fr; }
          .modo-grid { grid-template-columns: 1fr; }
          .roles-stat-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .role-stat-card { padding: 8px 6px; min-height: 100px; }
          .role-badge { font-size: 0.6rem; padding: 2px 5px; }
          .role-stat-name { font-size: 0.78rem; }
          .metric-num { font-size: 1rem; }
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
