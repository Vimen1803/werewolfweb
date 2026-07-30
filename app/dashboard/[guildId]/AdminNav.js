import Link from 'next/link';
import { getGuildInfo, guildIconUrl } from '@/lib/discord';
import { auth } from '@/lib/auth';

export default async function AdminNav({ guildId, active, isAdmin = true }) {
  const session = await auth();
  const guild = await getGuildInfo(guildId);
  const name = guild?.name || `Servidor ${guildId}`;
  const icon = guild ? guildIconUrl(guild) : null;
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const tabs = [
    { key: 'overview', label: 'Resumen', href: `/dashboard/${guildId}` },
    { key: 'leaderboard', label: 'Ranking', href: `/leaderboard/${guildId}` },
    { key: 'config', label: 'Configuración', href: isAdmin ? `/dashboard/${guildId}/config` : `/config/${guildId}` },
    { key: 'xp', label: 'Sistema de XP', href: `/dashboard/${guildId}/xp`, adminOnly: true },
    { key: 'blacklist', label: 'Blacklist', href: `/dashboard/${guildId}/blacklist`, adminOnly: true },
  ];

  if (session?.discordId) {
    tabs.push({ key: 'stats', label: 'Mis stats', href: `/stats/${guildId}/${session.discordId}` });
  }

  const filteredTabs = tabs.filter((t) => !t.adminOnly || isAdmin);

  return (
    <div style={{ marginBottom: 32 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 22, flexWrap: 'wrap' }}>
        <div style={{
          width: 56, height: 56, borderRadius: '50%', overflow: 'hidden', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'var(--gradient-wolf)', fontWeight: 700, fontFamily: 'var(--font-display)',
        }}>
          {icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={icon} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>{initials}</span>
          )}
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-wolf)' }}>
            {isAdmin ? 'Panel de administración' : 'Resumen del servidor'}
          </span>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginTop: 2 }}>{name}</h1>
        </div>
      </div>

      <nav className="site-nav" style={{ justifyContent: 'flex-start', padding: 0, position: 'static', background: 'transparent', borderBottom: '1px solid var(--border-subtle)' }}>
        {filteredTabs.map((t) => (
          <Link key={t.key} href={t.href} className={active === t.key ? 'active' : ''}>{t.label}</Link>
        ))}
      </nav>
    </div>
  );
}
