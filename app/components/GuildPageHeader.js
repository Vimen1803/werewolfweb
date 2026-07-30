import Link from 'next/link';
import { getGuildInfo, guildIconUrl } from '@/lib/discord';

export default async function GuildPageHeader({ guildId, active, isAdmin, statsUserId }) {
  const guild = await getGuildInfo(guildId);
  const name = guild?.name || `Servidor ${guildId}`;
  const icon = guild ? guildIconUrl(guild) : null;
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const tabs = [
    { key: 'leaderboard', label: 'Ranking', href: `/leaderboard/${guildId}` },
    { key: 'config', label: 'Configuración', href: `/config/${guildId}` },
    { key: 'stats', label: 'Mis stats', href: `/stats/${guildId}/${statsUserId || ''}` },
  ];

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
        <div className="icon" style={{
          width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--gradient-solo)', fontWeight: 700, fontFamily: 'var(--font-display)',
        }}>
          {icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}>{name}</h1>
        </div>
        <Link href={`/dashboard/${guildId}`} className="btn btn-ghost btn-sm" style={{ marginLeft: 'auto' }}>
          {isAdmin ? 'Panel de administración →' : 'Resumen del servidor →'}
        </Link>
      </div>

      <nav className="site-nav" style={{ justifyContent: 'flex-start', padding: 0, position: 'static', background: 'transparent', borderBottom: '1px solid var(--border-subtle)' }}>
        {tabs.map((t) => (
          <Link key={t.key} href={t.href} className={active === t.key ? 'active' : ''}>{t.label}</Link>
        ))}
      </nav>
    </div>
  );
}
