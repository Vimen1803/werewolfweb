import Link from 'next/link';
import { auth, isGuildAdmin } from '@/lib/auth';
import { getLeaderboard, getWeeklyLeaderboard, getActiveEvent, getEventLeaderboard } from '@/lib/wwData';
import { levelForXp } from '@/lib/constants';
import AdminNav from '@/app/dashboard/[guildId]/AdminNav';
import SignInButton from '../../components/SignInButton';
import RankBadge from '../../components/RankBadge';

export const dynamic = 'force-dynamic';

export default async function LeaderboardPage({ params, searchParams }) {
  const { guildId } = await params;
  const sParams = await searchParams;
  const activeType = sParams?.type || 'global';
  const session = await auth();

  const admin = isGuildAdmin(session, guildId);
  const activeEvent = await getActiveEvent(guildId);

  let top = [];
  if (activeType === 'weekly') {
    top = await getWeeklyLeaderboard(guildId, 25);
  } else if (activeType === 'event' && activeEvent) {
    top = await getEventLeaderboard(guildId, activeEvent.event_id, 25);
  } else {
    top = await getLeaderboard(guildId, 25);
  }

  const emptyMessage = activeType === 'weekly'
    ? 'Todavía no hay XP registrada en la clasificación semanal.'
    : activeType === 'event'
    ? 'Todavía no hay XP registrada en este evento.'
    : 'Todavía no hay XP registrada en este servidor. ¡Juega la primera partida!';

  const xpLabel = activeType === 'weekly' ? 'XP semanal' : activeType === 'event' ? 'XP de evento' : 'XP total';
  const showExtras = activeType === 'global';

  return (
    <main className="main-content">
      <AdminNav guildId={guildId} active="leaderboard" isAdmin={admin} />

      <h1 className="page-title" style={{ fontSize: '1.6rem', marginBottom: '0.35rem' }}>Clasificación</h1>
      <p className="page-subtitle" style={{ marginBottom: '1.5rem' }}>
        Consulta quién domina el pueblo, esta semana y en el evento activo.
      </p>

      {/* Selector de tipo de Ranking */}
      <nav className="lb-tabs">
        <Link
          href={`/leaderboard/${guildId}?type=global`}
          className={`lb-tab ${activeType === 'global' ? 'active' : ''}`}
        >
          Global
        </Link>
        <Link
          href={`/leaderboard/${guildId}?type=weekly`}
          className={`lb-tab ${activeType === 'weekly' ? 'active' : ''}`}
        >
          Semanal
        </Link>
        {activeEvent && (
          <Link
            href={`/leaderboard/${guildId}?type=event`}
            className={`lb-tab event ${activeType === 'event' ? 'active' : ''}`}
          >
            {activeEvent.name}
          </Link>
        )}
      </nav>

      <div className="card lb-card">
        {top.length === 0 ? (
          <p className="lb-empty">{emptyMessage}</p>
        ) : (
          <ol className="lb-list">
            {top.map((p, i) => {
              const level = levelForXp(p.event_points || 0);
              const wr = p.games_played > 0 ? Math.round(((p.games_won || 0) / p.games_played) * 100) : 0;
              const targetUserId = p.user_id || (p._id && typeof p._id === 'string' ? p._id.split(':')[1] : null);
              return (
                <li key={p._id} className={i < 3 ? 'top3' : ''}>
                  <Link href={`/stats/${guildId}/${targetUserId}`} className="lb-row-link">
                    <span className="rank">
                      {i < 3 ? <RankBadge rank={i + 1} /> : `#${i + 1}`}
                    </span>
                    <span className="name">{p.username || `Usuario ${targetUserId}`}</span>
                    {showExtras && <span className="pill">Nvl {level}</span>}
                    {showExtras && (
                      <span className="wr">{p.games_won || 0}/{p.games_played || 0} · {wr}% WR</span>
                    )}
                    <span className="xp-block">
                      <span className="xp">{(p.event_points || 0).toLocaleString('es-ES')}</span>
                      <span className="xp-label">{xpLabel}</span>
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      <style>{`
        .lb-tabs {
          display: inline-flex;
          gap: 4px;
          padding: 5px;
          margin-bottom: 1.5rem;
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: var(--radius-lg);
          flex-wrap: wrap;
        }
        .lb-tab {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 9px 18px;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.85rem;
          color: var(--text-secondary);
          text-decoration: none;
          white-space: nowrap;
          transition: all var(--transition);
        }
        .lb-tab-icon { font-size: 0.95rem; line-height: 1; }
        .lb-tab:hover { color: var(--text-primary); background: var(--bg-card); }
        .lb-tab.active { background: var(--gradient-wolf); color: #fff; box-shadow: var(--shadow-glow-wolf); }
        .lb-tab.event.active { background: var(--gradient-gold); color: #241a02; box-shadow: 0 0 24px rgba(240,165,0,0.22); }

        .lb-card { padding: 0.5rem 0; }
        .lb-empty { color: var(--text-secondary); text-align: center; padding: 3.5rem 1.5rem; }

        .lb-list { list-style: none; margin: 0; padding: 0; }
        .lb-list li { border-bottom: 1px solid var(--border-subtle); }
        .lb-list li:last-child { border-bottom: none; }
        .lb-list li.top3 { background: rgba(240,165,0,0.045); }

        .lb-row-link {
          display: grid;
          grid-template-columns: 40px 1fr auto auto auto;
          align-items: center;
          gap: 16px;
          padding: 13px 24px;
          text-decoration: none;
          color: inherit;
          width: 100%;
          transition: background 0.15s ease;
        }
        .lb-row-link:hover { background: rgba(255, 255, 255, 0.05); }

        .rank { display: flex; align-items: center; justify-content: center; font-size: 1rem; color: var(--text-muted); font-weight: 700; }

        .name { font-weight: 600; color: #ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .lb-row-link:hover .name { color: var(--accent-wolf); }

        .wr { color: var(--text-muted); font-size: 0.8rem; white-space: nowrap; }

        .xp-block { display: flex; flex-direction: column; align-items: flex-end; min-width: 90px; }
        .xp { color: var(--accent-wolf); font-weight: 700; font-family: monospace; font-size: 0.98rem; line-height: 1.2; }
        .xp-label { font-size: 0.62rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.04em; margin-top: 2px; }

        @media (max-width: 640px) {
          .lb-row-link { grid-template-columns: 30px 1fr auto; }
          .wr, .pill { display: none; }
          .xp-block { align-items: flex-end; }
        }
      `}</style>
    </main>
  );
}


