import { auth, isGuildAdmin } from '@/lib/auth';
import { getPlayer, getPlayerRank, getGuildAchievementsStats } from '@/lib/wwData';
import { getDiscordUser, userAvatarUrl } from '@/lib/discord';
import { xpProgress } from '@/lib/constants';
import AdminNav from '@/app/dashboard/[guildId]/AdminNav';
import SignInButton from '../../../components/SignInButton';

import { ACHIEVEMENTS_DEF, CATEGORY_NAMES } from '@/lib/data/achievementsDef';

function getAchVal(ach, doc) {
  if (ach.key) return doc[ach.key] || 0;
  if (ach.role) return doc.roles_played?.[ach.role] || 0;
  if (ach.role_won) return doc.roles_won?.[ach.role_won] || 0;
  if (ach.level) return Math.floor(Math.sqrt((doc.event_points || 0) / 20)) + 1;
  if (ach.custom) return doc.stats?.[ach.custom] || 0;
  return 0;
}

export const dynamic = 'force-dynamic';

export default async function StatsPage({ params }) {
  const { guildId, userId } = await params;
  const session = await auth();

  const admin = isGuildAdmin(session, guildId);
  const [player, discordUser, achStats] = await Promise.all([
    getPlayer(guildId, userId),
    getDiscordUser(userId),
    getGuildAchievementsStats(guildId),
  ]);

  const doc = player || {
    event_points: 0, games_played: 0, games_won: 0,
    village_played: 0, village_won: 0, wolf_played: 0, wolf_won: 0,
    tanner_played: 0, tanner_won: 0, white_wolf_played: 0, white_wolf_won: 0,
    lovers_played: 0, lovers_won: 0, roles_played: {}, roles_won: {},
  };

  const rank = await getPlayerRank(guildId, doc.event_points);
  const progress = xpProgress(doc.event_points || 0);
  const displayName = discordUser?.global_name || discordUser?.username || doc.username || `Usuario ${userId}`;
  const avatar = discordUser ? userAvatarUrl(discordUser) : null;
  const totalWr = doc.games_played > 0 ? Math.round((doc.games_won / doc.games_played) * 100) : 0;
  const xpIntoLevel = Math.max(0, (doc.event_points || 0) - progress.currentFloor);
  const xpSpan = Math.max(1, progress.nextFloor - progress.currentFloor);

  // Bandos stats
  const villageWr = doc.village_played > 0 ? Math.round(((doc.village_won || 0) / doc.village_played) * 100) : 0;
  const wolfWr = doc.wolf_played > 0 ? Math.round(((doc.wolf_won || 0) / doc.wolf_played) * 100) : 0;

  const solitarioPlayed = (doc.tanner_played || 0) + (doc.white_wolf_played || 0);
  const solitarioWon = (doc.tanner_won || 0) + (doc.white_wolf_won || 0);
  const solitarioWr = solitarioPlayed > 0 ? Math.round((solitarioWon / solitarioPlayed) * 100) : 0;

  const loversWr = doc.lovers_played > 0 ? Math.round(((doc.lovers_won || 0) / doc.lovers_played) * 100) : 0;

  // Roles stats
  const rolesPlayedMap = doc.roles_played || {};
  const rolesWonMap = doc.roles_won || {};
  const roleEntries = Object.entries(rolesPlayedMap).sort((a, b) => b[1] - a[1]);

  return (
    <main className="main-content">
      <AdminNav guildId={guildId} active="stats" isAdmin={admin} />

      {/* Header Profile Card */}
      <div className="card profile">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {avatar && <img src={avatar} alt="" className="avatar" />}
        <div className="profile-main">
          <h2>{displayName}</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 8 }}>
            <span className="pill">{doc.games_played || 0} partidas</span>
            <span className="pill">{doc.games_won || 0} victorias</span>
            <span className="pill">{totalWr}% winrate</span>
            <span className="pill">Racha actual: {doc.current_streak || 0}</span>
            <span className="pill">Racha máx: {doc.max_streak || 0}</span>
            {rank && <span className="pill">Ranking #{rank}</span>}
          </div>
        </div>
        <div className="level-box">
          <span className="level-num">Nvl {progress.level}</span>
          <div className="level-bar"><div className="level-bar-fill" style={{ width: `${progress.percent}%` }} /></div>
          <span className="level-sub">{xpIntoLevel}/{xpSpan} XP</span>
        </div>
      </div>

      <div className="card xp-bar">
        <span>XP total</span>
        <strong>{(doc.event_points || 0).toLocaleString('es-ES')}</strong>
        <span className="dim">próximo nivel en {Math.max(0, progress.nextFloor - (doc.event_points || 0)).toLocaleString('es-ES')} XP</span>
      </div>

      {/* 1. Rendimiento por Bando */}
      <section style={{ marginTop: '2rem' }}>
        <h2 className="stats-section-title">Rendimiento por Bando</h2>

        <div className="bando-grid">
          {/* Aldea */}
          <div className="bando-card">
            <div className="bando-header">
              <span className="bando-icon" style={{ color: '#22c55e' }}>🏡</span>
              <span>Aldea</span>
            </div>
            <div className="bando-stats">
              <div className="bando-stat-col">
                <span className="bando-label">PARTIDAS</span>
                <span className="bando-val">{doc.village_played || 0}</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">WINRATE</span>
                <span className="bando-val" style={{ color: '#22c55e' }}>{villageWr}%</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">VICTORIAS</span>
                <span className="bando-val" style={{ color: '#22c55e' }}>{doc.village_won || 0}</span>
              </div>
            </div>
            <div className="bando-bar" style={{ background: '#22c55e' }} />
          </div>

          {/* Lobos */}
          <div className="bando-card">
            <div className="bando-header">
              <span className="bando-icon" style={{ color: '#ef4444' }}>🌙</span>
              <span>Lobos</span>
            </div>
            <div className="bando-stats">
              <div className="bando-stat-col">
                <span className="bando-label">PARTIDAS</span>
                <span className="bando-val">{doc.wolf_played || 0}</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">WINRATE</span>
                <span className="bando-val" style={{ color: '#ef4444' }}>{wolfWr}%</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">VICTORIAS</span>
                <span className="bando-val" style={{ color: '#ef4444' }}>{doc.wolf_won || 0}</span>
              </div>
            </div>
            <div className="bando-bar" style={{ background: '#ef4444' }} />
          </div>

          {/* Solitario */}
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

          {/* Amantes */}
          <div className="bando-card">
            <div className="bando-header">
              <span className="bando-icon" style={{ color: '#ec4899' }}>💗</span>
              <span>Amantes</span>
            </div>
            <div className="bando-stats">
              <div className="bando-stat-col">
                <span className="bando-label">PARTIDAS</span>
                <span className="bando-val">{doc.lovers_played || 0}</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">WINRATE</span>
                <span className="bando-val" style={{ color: '#ec4899' }}>{loversWr}%</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">VICTORIAS</span>
                <span className="bando-val" style={{ color: '#ec4899' }}>{doc.lovers_won || 0}</span>
              </div>
            </div>
            <div className="bando-bar" style={{ background: '#ec4899' }} />
          </div>
        </div>
      </section>

      {/* Rendimiento por Modo */}
      <section style={{ marginTop: '2.5rem' }}>
        <h2 className="stats-section-title">Rendimiento por Modo</h2>
        <p className="stats-section-sub">Tus victorias y partidas jugadas en cada modo de juego.</p>
        
        <div className="modo-grid">
          {[
            { name: 'Clásico', icon: '🐺', played: doc.classic_played, won: doc.classic_won, color: '#f1c40f' },
            { name: 'Slow', icon: '🐌', played: doc.slow_played, won: doc.slow_won, color: '#3498db' },
            { name: 'Silence', icon: '🤫', played: doc.silence_played, won: doc.silence_won, color: '#95a5a6' },
            { name: 'Weather', icon: '🌫️', played: doc.weather_played, won: doc.weather_won, color: '#e67e22' },
            { name: 'Kaos', icon: '🎭', played: doc.kaos_played, won: doc.kaos_won, color: '#9b59b6' },
            { name: 'Credit', icon: '💳', played: doc.credit_played, won: doc.credit_won, color: '#2ecc71' },
          ].map((m) => {
            const played = m.played || 0;
            const won = m.won || 0;
            const wr = played > 0 ? Math.round((won / played) * 100) : 0;
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
                    <span className="bando-label">WINRATE</span>
                    <span className="bando-val" style={{ color: m.color }}>{wr}%</span>
                  </div>
                  <div className="bando-stat-col">
                    <span className="bando-label">VICTORIAS</span>
                    <span className="bando-val" style={{ color: m.color }}>{won}</span>
                  </div>
                </div>
                <div className="bando-bar" style={{ background: m.color }} />
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Rendimiento por Rol */}
      <section style={{ marginTop: '2.5rem', marginBottom: '2.5rem' }}>
        <h2 className="stats-section-title">Rendimiento por Rol</h2>
        <p className="stats-section-sub">Victorias y partidas con cada rol que has jugado.</p>

        {roleEntries.length === 0 ? (
          <div className="card" style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
            Aún no has jugado partidas registradas con ningún rol.
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

      {/* Sección de Logros */}
      <section style={{ marginTop: '2.5rem' }}>
        <h3 className="stats-section-title">🏆 Progreso de Logros</h3>
        <p className="stats-section-sub">Logros acumulativos a largo plazo alcanzados en este servidor:</p>

        <div className="ach-categories-grid">
          {[1, 2, 3, 4, 5, 6].map((catNum) => {
            const catTitle = CATEGORY_NAMES[catNum];

            const catAchs = ACHIEVEMENTS_DEF.filter((a) => a.cat === catNum);
            const userAchs = doc.achievements || {};

            return (
              <div key={catNum} className="ach-cat-block" style={{ marginBottom: '2.5rem' }}>
                <h3 className="ach-cat-title" style={{
                  fontSize: '1rem',
                  fontFamily: 'var(--font-display)',
                  color: 'var(--text-secondary)',
                  marginBottom: '1.2rem',
                  paddingLeft: '8px',
                  borderLeft: '3px solid var(--accent-wolf)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.03em'
                }}>{catTitle}</h3>
                
                <div className="ach-grid">
                  {catAchs.map((ach) => {
                    const isDone = Boolean(userAchs[ach.id]);
                    const val = getAchVal(ach, doc);
                    const pct = Math.min(100, Math.round((val / ach.target) * 100));

                    const compCount = achStats.counts[ach.id] || 0;
                    const totalServerPlayers = achStats.totalPlayers || 0;
                    const compPct = totalServerPlayers > 0 ? ((compCount / totalServerPlayers) * 100).toFixed(1) : "0.0";

                    return (
                      <div key={ach.id} className={`ach-card ${isDone ? 'done' : ''}`}>
                        <div className="ach-card-header">
                          <span className="ach-name">{ach.name}</span>
                          <span className="ach-reward">+{ach.reward} XP</span>
                        </div>
                        <p className="ach-desc">{ach.desc}</p>
                        
                        {!isDone && (
                          <div className="ach-progress-row" style={{ marginTop: 'auto', marginBottom: '8px' }}>
                            <div className="ach-progress-bar">
                              <div className="ach-progress-fill" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="ach-progress-txt">{val}/{ach.target}</span>
                          </div>
                        )}
                        
                        <div className="ach-global-stats" style={{ marginTop: isDone ? 'auto' : '0' }}>
                          <span>Completado en el servidor</span>
                          <strong>{compCount}/{totalServerPlayers} ({compPct}%)</strong>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <style>{`
        .profile { display: flex; align-items: center; gap: 22px; padding: 1.75rem; margin-bottom: 1rem; flex-wrap: wrap; }
        .avatar { width: 72px; height: 72px; border-radius: 50%; }
        .profile-main { flex: 1; min-width: 180px; }
        .profile-main h2 { font-size: 1.4rem; font-family: var(--font-display); }
        .level-box { display: flex; flex-direction: column; gap: 6px; min-width: 160px; }
        .level-num { font-family: var(--font-display); font-weight: 700; color: var(--accent-wolf); }
        .level-bar { width: 160px; height: 6px; background: var(--bg-elevated); border-radius: 3px; overflow: hidden; }
        .level-bar-fill { height: 100%; background: var(--gradient-wolf); }
        .level-sub { font-size: 0.72rem; color: var(--text-muted); font-family: monospace; }
        .xp-bar { display: flex; align-items: baseline; gap: 12px; padding: 16px 24px; margin-bottom: 1.5rem; }
        .xp-bar strong { color: var(--accent-wolf); font-size: 1.1rem; font-family: monospace; }
        .dim { color: var(--text-muted); font-size: 0.82rem; margin-left: auto; }

        .stats-section-title {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.4rem;
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
        .metric-box:hover {
          background: none;
          border: none;
          box-shadow: none;
          transform: none;
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

        .ach-cat-block {
          margin-top: 24px;
        }
        .ach-cat-title {
          font-size: 1rem;
          font-weight: 700;
          color: var(--accent-wolf);
          margin-bottom: 12px;
        }
        .ach-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .ach-card {
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-subtle);
          border-radius: 8px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-height: 140px;
          transition: border-color 0.2s;
        }
        .ach-card:hover {
          border-color: rgba(255, 255, 255, 0.08);
        }
        .ach-card.done {
          border-color: rgba(234, 179, 8, 0.3);
          background: rgba(234, 179, 8, 0.02);
        }
        .ach-card-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .ach-name { font-weight: 700; font-size: 0.92rem; color: #ffffff; }
        .ach-reward { font-size: 0.72rem; font-weight: 700; color: var(--accent-gold); }
        .ach-desc { font-size: 0.8rem; color: var(--text-muted); margin: 0; line-height: 1.3; flex: 1; }
        .ach-progress-row { display: flex; align-items: center; gap: 10px; margin-top: 4px; }
        .ach-progress-bar { flex: 1; height: 8px; background: var(--bg-elevated); border-radius: 4px; overflow: hidden; }
        .ach-progress-fill { height: 100%; background: var(--accent-wolf); transition: width 0.3s ease; }
        .ach-progress-txt { font-size: 0.75rem; color: var(--text-secondary); font-family: monospace; font-weight: 700; }
        .ach-global-stats { font-size: 0.72rem; color: var(--text-muted); margin-top: 8px; border-top: 1px solid rgba(255, 255, 255, 0.04); padding-top: 8px; display: flex; justify-content: space-between; }
        .ach-global-stats strong { color: var(--text-primary); }

        .modo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }

        @media (max-width: 900px) {
          .bando-grid { grid-template-columns: repeat(2, 1fr); }
          .modo-grid { grid-template-columns: repeat(2, 1fr); }
          .ach-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 600px) {
          .bando-grid { grid-template-columns: 1fr; }
          .modo-grid { grid-template-columns: 1fr; }
          .roles-stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </main>
  );
}

