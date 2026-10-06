import { auth } from '@/lib/auth';
import { getGeneralStatsForDashboard } from '@/lib/wwData';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ACHIEVEMENTS_DEF, CATEGORY_NAMES } from '@/lib/data/achievementsDef';
import { levelForXp } from '@/lib/constants';

export const metadata = { title: 'Estadísticas Generales — Werewolf Bot' };
export const dynamic = 'force-dynamic';

export default async function GeneralStatsPage() {
  const session = await auth();
  if (!session) {
    redirect('/dashboard');
  }

  // Protección de seguridad
  if (session.discordId !== '523883024106913813') {
    return (
      <main className="main-content" style={{ maxWidth: 520, textAlign: 'center', paddingTop: '6rem' }}>
        <h1 className="page-title">No autorizado</h1>
        <p className="page-subtitle" style={{ marginBottom: '2rem' }}>No tienes permisos para ver las estadísticas generales del bot.</p>
        <Link href="/dashboard" className="btn btn-primary">Volver al Dashboard</Link>
      </main>
    );
  }

  const stats = await getGeneralStatsForDashboard();

  // Agrupar ACHIEVEMENTS_DEF por categoría
  const achsByCategory = {};
  for (const ach of ACHIEVEMENTS_DEF) {
    const cat = ach.cat || 0;
    if (!achsByCategory[cat]) {
      achsByCategory[cat] = [];
    }
    achsByCategory[cat].push(ach);
  }

  // Cálculo de winrates globales de la comunidad
  const gw = stats.globalWinrates || {
    totalMatches: 0,
    villagePlayed: 0, villageWon: 0,
    wolvesPlayed: 0, wolvesWon: 0,
    whiteWolfPlayed: 0, whiteWolfWon: 0,
    tannerPlayed: 0, tannerWon: 0,
    loversPlayed: 0, loversWon: 0,
    classicMatches: 0, slowMatches: 0, silenceMatches: 0,
    weatherMatches: 0, kaosMatches: 0, creditMatches: 0, halloweenMatches: 0
  };
  const total = gw.totalMatches;
  
  const villageWr = gw.villagePlayed > 0 ? Math.round((gw.villageWon / gw.villagePlayed) * 100) : 0;
  const wolvesWr = gw.wolvesPlayed > 0 ? Math.round((gw.wolvesWon / gw.wolvesPlayed) * 100) : 0;
  const solitarioPlayed = (gw.tannerPlayed || 0) + (gw.white_wolfPlayed || 0);
  const solitarioWon = (gw.tannerWon || 0) + (gw.white_wolf_won || 0);
  const solitarioWr = solitarioPlayed > 0 ? Math.round((solitarioWon / solitarioPlayed) * 100) : 0;
  const loversWr = gw.loversPlayed > 0 ? Math.round((gw.loversWon / gw.loversPlayed) * 100) : 0;

  return (
    <main className="main-content">
      {/* Cabecera y botón de retorno */}
      <div style={{ marginBottom: 32 }}>
        <Link href="/dashboard" className="btn-back">
          ← Volver al Dashboard
        </Link>
        <h1 className="page-title" style={{ marginTop: 12, marginBottom: 4 }}>
          📊 Estadísticas Generales
        </h1>
        <p className="page-subtitle" style={{ marginBottom: 12 }}>
          Métricas globales consolidadas de servidores activos, partidas y mejores jugadores.
        </p>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Partidas jugadas en toda la comunidad: <strong style={{ color: '#ffffff', fontSize: '1.1rem' }}>{total.toLocaleString('es-ES')}</strong>
        </div>
      </div>

      {/* RENDIMIENTO POR BANDO */}
      <section className="gs-section" style={{ marginBottom: '3rem' }}>
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
                <span className="bando-val">{gw.villagePlayed}</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">WINRATE</span>
                <span className="bando-val" style={{ color: '#22c55e' }}>{villageWr}%</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">VICTORIAS</span>
                <span className="bando-val" style={{ color: '#22c55e' }}>{gw.villageWon}</span>
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
                <span className="bando-val">{gw.wolvesPlayed}</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">WINRATE</span>
                <span className="bando-val" style={{ color: '#ef4444' }}>{wolvesWr}%</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">VICTORIAS</span>
                <span className="bando-val" style={{ color: '#ef4444' }}>{gw.wolvesWon}</span>
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
                <span className="bando-val">{gw.loversPlayed}</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">WINRATE</span>
                <span className="bando-val" style={{ color: '#ec4899' }}>{loversWr}%</span>
              </div>
              <div className="bando-stat-col">
                <span className="bando-label">VICTORIAS</span>
                <span className="bando-val" style={{ color: '#ec4899' }}>{gw.loversWon}</span>
              </div>
            </div>
            <div className="bando-bar" style={{ background: '#ec4899' }} />
          </div>
        </div>
      </section>

      {/* RENDIMIENTO POR MODO */}
      {total > 0 && (
        <section style={{ marginBottom: '3rem' }}>
          <h2 className="stats-section-title" style={{ marginTop: '2.5rem' }}>Rendimiento por Modo</h2>
          <p className="stats-section-sub" style={{ marginBottom: '1.2rem' }}>Partidas jugadas en cada modo de juego en la comunidad.</p>
          <div className="modo-grid">
            {[
              { name: 'Clásico', icon: '🐺', played: gw.classicMatches, color: '#f1c40f' },
              { name: 'Slow', icon: '🐌', played: gw.slowMatches, color: '#3498db' },
              { name: 'Silence', icon: '🤫', played: gw.silenceMatches, color: '#95a5a6' },
              { name: 'Weather', icon: '🌫️', played: gw.weatherMatches, color: '#e67e22' },
              { name: 'Kaos', icon: '🎭', played: gw.kaosMatches, color: '#9b59b6' },
              { name: 'Credit', icon: '💳', played: gw.creditMatches, color: '#2ecc71' },
              { name: 'Halloween', icon: '🎃', played: gw.halloweenMatches, color: '#e67e22' },
            ].map((m) => {
              const percentage = total > 0 ? ((m.played / total) * 100).toFixed(1) : '0.0';
              return (
                <div key={m.name} className="bando-card">
                  <div className="bando-header">
                    <span className="bando-icon" style={{ color: m.color }}>{m.icon}</span>
                    <span>{m.name}</span>
                  </div>
                  <div className="bando-stats">
                    <div className="bando-stat-col">
                      <span className="bando-label">PARTIDAS</span>
                      <span className="bando-val">{m.played}</span>
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
        </section>
      )}

      {/* 1. TOP 5 SERVIDORES */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <div className="dot dot-wolves" />
          <h2>Top 5 Servidores más Activos</h2>
        </div>
        <div className="servers-grid">
          {stats.topServers.map((server, idx) => (
            <div key={server.id} className="card server-stat-card">
              <div className="server-rank-badge">#{idx + 1}</div>
              
              <div className="server-header">
                <h3>{server.name}</h3>
                <span className="server-id">ID: {server.id}</span>
              </div>
              
              <div className="server-stats-row">
                <div className="stat-box">
                  <span className="stat-num">{server.matches_played}</span>
                  <span className="stat-label">partidas jugadas</span>
                </div>
                
                {server.invite_url ? (
                  <a
                    href={server.invite_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-invite"
                    style={{ background: 'var(--accent-blue)' }}
                  >
                    Unirse al Servidor
                  </a>
                ) : (
                  <span className="no-invite-badge">Sin Invitación</span>
                )}
              </div>
              
              <div className="server-top-players">
                <h4>Top 3 Jugadores (XP)</h4>
                {server.top_players.length === 0 ? (
                  <p className="no-players-text">Aún no hay puntuaciones registradas en este servidor.</p>
                ) : (
                  <ul>
                    {server.top_players.map((p, pIdx) => (
                      <li key={p._id || pIdx}>
                        <span className={`player-rank rank-${pIdx + 1}`}>#{pIdx + 1}</span>
                        <span className="player-name">{p.username}</span>
                        <span className="player-xp">{p.event_points.toLocaleString('es-ES')} XP</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. TOPS 3 DE JUGADORES */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div className="section-header">
          <div className="dot dot-village" />
          <h2>Tops 3 Globales de Jugadores</h2>
        </div>
        <p className="hint" style={{ marginBottom: '1.5rem', fontSize: '0.86rem' }}>
          * Si un jugador ha participado en más de un servidor, se muestra únicamente su registro con la XP más alta.
        </p>
        
        <div className="leaderboards-container">
          
          {/* TOP 3 POR XP */}
          <div className="card lb-column">
            <h3 className="lb-column-title xp-header">⭐ Top 3 por XP</h3>
            <div className="lb-list">
              {stats.topXp.map((p, idx) => (
                <div key={idx} className="lb-item">
                  <div className={`lb-rank rank-${idx + 1}`}>{idx + 1}</div>
                  <div className="lb-details">
                    <span className="lb-username">{p.username}</span>
                    <span className="lb-sub-detail" style={{ fontWeight: 600 }}>
                      en{' '}
                      {p.server_invite ? (
                        <a
                          href={p.server_invite}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}
                        >
                          {p.server_name}
                        </a>
                      ) : (
                        <span>{p.server_name}</span>
                      )}
                    </span>
                    <span className="lb-sub-detail">Nvl {levelForXp(p.xp)} · {p.games} partidas · {p.winrate}% WR</span>
                  </div>
                  <div className="lb-value xp-val">{p.xp.toLocaleString('es-ES')} XP</div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP 3 POR PARTIDAS JUGADAS */}
          <div className="card lb-column">
            <h3 className="lb-column-title games-header">🎮 Top 3 Partidas</h3>
            <div className="lb-list">
              {stats.topGames.map((p, idx) => (
                <div key={idx} className="lb-item">
                  <div className={`lb-rank rank-${idx + 1}`}>{idx + 1}</div>
                  <div className="lb-details">
                    <span className="lb-username">{p.username}</span>
                    <span className="lb-sub-detail" style={{ fontWeight: 600 }}>
                      en{' '}
                      {p.server_invite ? (
                        <a
                          href={p.server_invite}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}
                        >
                          {p.server_name}
                        </a>
                      ) : (
                        <span>{p.server_name}</span>
                      )}
                    </span>
                    <span className="lb-sub-detail">Nvl {levelForXp(p.xp)} · {p.xp.toLocaleString('es-ES')} XP · {p.winrate}% WR</span>
                  </div>
                  <div className="lb-value games-val">{p.games} partidas</div>
                </div>
              ))}
            </div>
          </div>

          {/* TOP 3 POR LOGROS COMPLETADOS */}
          <div className="card lb-column">
            <h3 className="lb-column-title ach-header">🏆 Top 3 Logros</h3>
            <div className="lb-list">
              {stats.topAchievements.map((p, idx) => (
                <div key={idx} className="lb-item">
                  <div className={`lb-rank rank-${idx + 1}`}>{idx + 1}</div>
                  <div className="lb-details">
                    <span className="lb-username">{p.username}</span>
                    <span className="lb-sub-detail" style={{ fontWeight: 600 }}>
                      en{' '}
                      {p.server_invite ? (
                        <a
                          href={p.server_invite}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}
                        >
                          {p.server_name}
                        </a>
                      ) : (
                        <span>{p.server_name}</span>
                      )}
                    </span>
                    <span className="lb-sub-detail">Nvl {levelForXp(p.xp)} · {p.xp.toLocaleString('es-ES')} XP · {p.games} part. · {p.winrate}% WR</span>
                  </div>
                  <div className="lb-value ach-val">{p.achievements_count} logros</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 3. CATÁLOGO GLOBAL DE LOGROS */}
      <section style={{ marginBottom: '2rem' }}>
        <div className="section-header">
          <div className="dot dot-solo" />
          <h2>🏆 Catálogo y Ratio de Logros en la Comunidad</h2>
        </div>
        <p className="hint" style={{ marginBottom: '2rem', fontSize: '0.86rem' }}>
          * Ratio calculado sobre el total de documentos de jugador válidos ({stats.totalDocsCount}) en todos los servidores.
        </p>

        <div className="ach-catalog">
          {Object.entries(CATEGORY_NAMES).map(([catNum, catTitle]) => {
            const catAchs = achsByCategory[catNum] || [];
            if (catAchs.length === 0) return null;

            return (
              <div key={catNum} className="ach-cat-block" style={{ marginBottom: '2.5rem' }}>
                <h3 className="ach-cat-title">{catTitle}</h3>
                
                <div className="global-ach-grid">
                  {catAchs.map((ach) => {
                    const compCount = stats.globalAchCounts[ach.id] || 0;
                    const totalDocs = stats.totalDocsCount || 0;
                    const pct = totalDocs > 0 ? ((compCount / totalDocs) * 100).toFixed(1) : "0.0";

                    return (
                      <div key={ach.id} className="global-ach-card">
                        <div className="global-ach-header">
                          <span className="global-ach-name">{ach.name}</span>
                          <span className="global-ach-reward">+{ach.reward} XP</span>
                        </div>
                        <p className="global-ach-desc">{ach.desc}</p>
                        <div className="global-ach-ratio">
                          Completado por: <strong>{compCount}/{totalDocs}</strong> ({pct}%)
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

      {/* ESTILOS PREMIUM LOCALES */}
      <style>{`
        .btn-back {
          display: inline-block;
          font-size: 0.86rem;
          color: var(--accent-wolf);
          text-decoration: none;
          font-weight: 600;
          transition: transform var(--transition);
        }
        .btn-back:hover {
          transform: translateX(-3px);
          color: #ff7f50;
        }
        
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
        
        /* SPLIT BAR DE WINRATE GLOBAL */
        .gs-totals-card {
          padding: 1.4rem 1.6rem;
          background: rgba(26, 26, 36, 0.65);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
        }
        .gs-total-row {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          font-size: 0.9rem;
          color: var(--text-secondary);
          margin-bottom: 14px;
        }
        .gs-total-row strong {
          font-size: 1.4rem;
          font-family: var(--font-display);
          color: var(--text-primary);
        }
        .gs-split-bar {
          display: flex;
          width: 100%;
          height: 10px;
          border-radius: 999px;
          overflow: hidden;
          background: var(--bg-elevated);
        }
        .gs-split-village { background: var(--accent-village); }
        .gs-split-wolves { background: var(--accent-wolf); }
        .gs-split-solo { background: var(--accent-solo); }
        .gs-split-labels {
          display: flex;
          font-size: 0.78rem;
          font-weight: 600;
          margin-top: 8px;
          width: 100%;
        }

        .servers-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 20px;
          margin-top: 15px;
        }
        .server-stat-card {
          padding: 24px;
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 16px;
          background: rgba(26, 26, 36, 0.65);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          transition: transform 0.25s ease, border-color 0.25s ease;
        }
        .server-stat-card:hover {
          transform: translateY(-4px);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .server-rank-badge {
          position: absolute;
          top: 18px;
          right: 20px;
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--accent-wolf);
        }
        .server-header h3 {
          font-size: 1.12rem;
          color: #ffffff;
          margin: 0 0 4px;
          font-family: var(--font-body);
          font-weight: 700;
        }
        .server-id {
          font-size: 0.76rem;
          color: var(--text-muted);
          font-family: monospace;
        }
        .server-stats-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: rgba(255, 255, 255, 0.02);
          padding: 10px 14px;
          border-radius: var(--radius-sm);
          border: 1px solid rgba(255, 255, 255, 0.04);
        }
        .stat-box {
          display: flex;
          flex-direction: column;
        }
        .stat-num {
          font-size: 1.25rem;
          font-weight: 800;
          color: #ffffff;
          line-height: 1.1;
        }
        .stat-label {
          font-size: 0.65rem;
          text-transform: uppercase;
          letter-spacing: 0.04em;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .btn-invite {
          font-size: 0.72rem;
          padding: 6px 12px;
          color: #ffffff;
          border-radius: var(--radius-sm);
          font-weight: 600;
          text-decoration: none;
          transition: background-color 0.25s;
        }
        .btn-invite:hover {
          opacity: 0.9;
        }
        .server-top-players h4 {
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--text-secondary);
          margin: 0 0 10px;
          font-weight: 700;
        }
        .server-top-players ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .server-top-players li {
          display: flex;
          align-items: center;
          font-size: 0.84rem;
          color: var(--text-primary);
        }
        .player-rank {
          font-size: 0.78rem;
          font-weight: 700;
          width: 24px;
        }
        .player-name {
          flex: 1;
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .player-xp {
          font-family: monospace;
          color: var(--accent-gold);
          font-weight: 600;
        }
        .rank-1 { color: #f59e0b; }
        .rank-2 { color: #94a3b8; }
        .rank-3 { color: #b45309; }

        /* TABLAS DE CLASIFICACIÓN */
        .leaderboards-container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
        }
        .lb-column {
          padding: 24px;
          background: rgba(26, 26, 36, 0.65);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
        }
        .lb-column-title {
          font-family: var(--font-display);
          font-size: 1.15rem;
          font-weight: 700;
          margin: 0 0 18px;
          padding-bottom: 12px;
          border-bottom: 2px solid rgba(255, 255, 255, 0.06);
        }
        .xp-header { color: var(--accent-gold); border-bottom-color: rgba(245, 158, 11, 0.3); }
        .games-header { color: var(--accent-blue); border-bottom-color: rgba(88, 101, 242, 0.3); }
        .ach-header { color: var(--accent-wolf); border-bottom-color: rgba(216, 90, 48, 0.3); }
        
        .lb-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .lb-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 8px;
        }
        .lb-rank {
          font-family: var(--font-display);
          font-size: 1.25rem;
          font-weight: 700;
          width: 24px;
          text-align: center;
        }
        .lb-details {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-width: 0;
        }
        .lb-username {
          font-weight: 700;
          font-size: 0.9rem;
          color: #ffffff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .lb-sub-detail {
          font-size: 0.72rem;
          color: var(--text-muted);
          margin-top: 2px;
        }
        .lb-value {
          font-size: 0.88rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .xp-val { color: var(--accent-gold); font-family: monospace; }
        .games-val { color: var(--accent-blue); font-family: monospace; }
        .ach-val { color: var(--accent-wolf); font-family: monospace; }
        .no-players-text {
          font-size: 0.8rem;
          color: var(--text-muted);
          font-style: italic;
        }

        /* CATÁLOGO DE LOGROS */
        .ach-cat-title {
          font-size: 1rem;
          font-family: var(--font-display);
          color: var(--text-secondary);
          margin-bottom: 1.2rem;
          padding-left: 8px;
          border-left: 3px solid var(--accent-wolf);
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }
        .global-ach-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }
        .global-ach-card {
          padding: 16px;
          background: rgba(255, 255, 255, 0.01);
          backdrop-filter: blur(8px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 8px;
          transition: border-color 0.2s;
        }
        .global-ach-card:hover {
          border-color: rgba(255, 255, 255, 0.08);
        }
        .global-ach-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
        }
        .global-ach-name {
          font-weight: 700;
          color: #ffffff;
          font-size: 0.92rem;
        }
        .global-ach-reward {
          font-size: 0.72rem;
          color: var(--accent-gold);
          font-weight: 700;
        }
        .global-ach-desc {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.3;
          margin: 0;
          flex: 1;
        }
        .global-ach-ratio {
          font-size: 0.72rem;
          color: var(--text-muted);
          border-top: 1px solid rgba(255, 255, 255, 0.04);
          padding-top: 8px;
          margin-top: 4px;
        }
        .global-ach-ratio strong {
          color: var(--text-primary);
        }

        /* MODO STATS GRID */
        .mode-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 16px;
        }
        .mode-stat-card {
          padding: 1.2rem 1.4rem;
          background: rgba(26, 26, 36, 0.65);
          backdrop-filter: blur(12px);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-md);
          display: flex;
          flex-direction: column;
          gap: 10px;
          transition: transform 0.2s, border-color 0.2s;
        }
        .mode-stat-card:hover {
          transform: translateY(-2px);
          border-color: rgba(255, 255, 255, 0.12);
        }
        .mode-stat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .mode-stat-name {
          font-weight: 700;
          font-size: 0.95rem;
          color: #ffffff;
        }
        .mode-stat-pct {
          font-size: 0.85rem;
          font-weight: 700;
        }
        .mode-stat-value {
          font-size: 1.8rem;
          font-weight: 800;
          color: #ffffff;
          font-family: var(--font-display);
        }
        .mode-stat-bar-bg {
          height: 6px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 3px;
          overflow: hidden;
          width: 100%;
        }
        .mode-stat-bar-fill {
          height: 100%;
          border-radius: 3px;
          transition: width 0.4s ease;
        }

        @media (max-width: 1024px) {
          .leaderboards-container {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
