import { auth, isGuildAdmin } from '@/lib/auth';
import { getGuildConfig } from '@/lib/wwData';
import { getGuildChannels, getGuildRoles } from '@/lib/discord';
import { ROLE_XP_ACTIONS } from '@/lib/data/xpConfig';
import AdminNav from '@/app/dashboard/[guildId]/AdminNav';
import SignInButton from '../../components/SignInButton';

export const dynamic = 'force-dynamic';

export default async function ConfigPage({ params }) {
  const { guildId } = await params;
  const session = await auth();

  if (!session) {
    return (
      <main className="main-content" style={{ maxWidth: 480, textAlign: 'center', paddingTop: '6rem' }}>
        <h1 className="page-title">Inicia sesión para ver la configuración</h1>
        <SignInButton className="btn btn-primary">Iniciar con Discord</SignInButton>
      </main>
    );
  }

  const admin = isGuildAdmin(session, guildId);
  const [cfg, channels, roles] = await Promise.all([
    getGuildConfig(guildId),
    getGuildChannels(guildId),
    getGuildRoles(guildId),
  ]);

  const channelName = (id) => channels.find((c) => c.id === String(id))?.name;
  const roleName = (id) => roles.find((r) => r.id === String(id))?.name;

  return (
    <main className="main-content">
      <AdminNav guildId={guildId} active="config" isAdmin={admin} />

      <div className="roles-grid">
        <div className="card block">
          <h3>General</h3>
          <Row label="Prefijo" value={<code>{cfg.prefix}</code>} />
          <Row label="Canales permitidos" value={
            cfg.allowed_channels.length
              ? cfg.allowed_channels.map((id) => `#${channelName(id) || id}`).join(', ')
              : 'Todos los canales'
          } />
          <Row label="Canal de anuncios" value={cfg.canal_anuncios ? `#${channelName(cfg.canal_anuncios) || cfg.canal_anuncios}` : '— sin configurar'} />
          <Row label="Rol de mención" value={cfg.mention_role_id ? `@${roleName(cfg.mention_role_id) || cfg.mention_role_id}` : '— sin configurar'} />
          <Row label="Rol sin XP" value={cfg.no_xp_role_id ? `@${roleName(cfg.no_xp_role_id) || cfg.no_xp_role_id}` : '— sin configurar'} />
        </div>

        <div className="card block">
          <h3>Mutes automáticos</h3>
          <Row label="Mute en la noche" value={<Bool v={cfg.mute_noche} />} />
          <Row label="Mute en votación" value={<Bool v={cfg.mute_votacion} />} />
          <Row label="Mute a jugadores muertos" value={<Bool v={cfg.mute_muertos} />} />
        </div>

        <div className="card block">
          <h3>Tiempos de partida</h3>
          <Row label="Discusión diurna" value={`${cfg.discussion_duration}s`} />
          <Row label="Votación" value={`${cfg.vote_duration}s`} />
          <Row label="Acción nocturna" value={`${cfg.night_action_timeout}s`} />
          <Row label="Cuenta atrás de la noche" value={`${cfg.night_countdown}s`} />
        </div>

        <div className="card block">
          <h3>Sistema de XP y Logros</h3>
          <Row label="XP activada" value={<Bool v={cfg.pts_enabled} />} />
          <Row label="Sistema de Logros" value={<Bool v={cfg.achievements_enabled ?? true} />} />
          <Row label="Multiplicador General" value={`${cfg.xp_multiplier ?? 1.0}x`} />
          <Row label="Evento Activo" value={cfg.active_event && cfg.active_event.active ? cfg.active_event.name : '— ninguno'} />
        </div>

        <div className="card block" style={{ gridColumn: '1 / -1' }}>
          <h3>Multiplicadores por Roles de Discord</h3>
          {Object.keys(cfg.role_multipliers || {}).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No hay multiplicadores por rol configurados.</p>
          ) : (
            Object.entries(cfg.role_multipliers).map(([rid, mult]) => (
              <Row key={rid} label={`@${roleName(rid) || rid}`} value={`${mult}x XP`} />
            ))
          )}
        </div>

        <div className="card block" style={{ gridColumn: '1 / -1' }}>
          <h3>Roles de rango por nivel</h3>
          {Object.keys(cfg.level_roles || {}).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sin roles de rango configurados.</p>
          ) : (
            Object.entries(cfg.level_roles).sort((a, b) => Number(a[0]) - Number(b[0])).map(([lvl, rid]) => (
              <Row key={lvl} label={`Nivel ${lvl}`} value={`@${roleName(rid) || rid}`} />
            ))
          )}
        </div>
      </div>

      <details className="card" style={{ marginTop: '1rem', padding: '1rem 1.5rem', cursor: 'pointer' }}>
        <summary style={{ outline: 'none', userSelect: 'none', listStyle: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', margin: 0 }}>Ver XP por acción de rol en este servidor</h3>
            <span className="pill">Desplegar</span>
          </div>
        </summary>
        <div style={{ marginTop: '1rem' }}>
          <Row label="Victoria" value={`+${cfg.pts_victory} XP`} />
          <Row label="Victoria especial" value={`+${cfg.pts_special_victory} XP`} />
          <Row label="Por ronda viva" value={`+${cfg.pts_round_alive} XP`} />
          <Row label="Sobrevivir al final" value={`+${cfg.pts_survive_end} XP`} />
        </div>
        <div style={{ marginTop: '1rem', overflowX: 'auto' }}>
          <table className="xp-table">
            <thead><tr><th>Rol</th><th>Acción</th><th style={{ textAlign: 'right' }}>XP en este servidor</th></tr></thead>
            <tbody>
              {ROLE_XP_ACTIONS.map((a) => {
                const value = cfg[a.key];
                return (
                  <tr key={a.key}>
                    <td style={{ fontWeight: 600 }}>{a.role}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{a.label}</td>
                    <td className={`num ${value < 0 ? 'neg' : 'pos'}`}>{value > 0 ? `+${value}` : value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </details>

      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '1.5rem' }}>
        Vista de solo lectura. {admin ? <>Puedes editar esta configuración desde el <a href={`/dashboard/${guildId}/config`}>panel de administración</a>.</> : 'Solo un administrador del servidor puede modificar estos valores.'}
      </p>

      <style>{`
        .block h3 { font-size: 1rem; margin-bottom: 14px; font-family: var(--font-display); }
      `}</style>
    </main>
  );
}

function Row({ label, value }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}>
      <span style={{ color: 'var(--text-secondary)' }}>{label}</span>
      <span style={{ fontWeight: 600, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function Bool({ v }) {
  return <span style={{ color: v ? 'var(--accent-village)' : 'var(--accent-wolf)' }}>{v ? '✅ Sí' : '❌ No'}</span>;
}
