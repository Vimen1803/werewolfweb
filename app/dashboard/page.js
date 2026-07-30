import { auth } from '@/lib/auth';
import { getDashboardGuilds } from '@/lib/dashboardData';
import { botInviteUrl } from '@/lib/discord';
import GuildCard from '../components/GuildCard';
import SignInButton from '../components/SignInButton';
import Link from 'next/link';

export const metadata = { title: 'Dashboard — Werewolf Bot' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return (
      <main className="main-content" style={{ maxWidth: 520, textAlign: 'center', paddingTop: '6rem' }}>
        <h1 className="page-title">Inicia sesión para ver tus servidores</h1>
        <p className="page-subtitle">
          Conecta tu cuenta de Discord para consultar el ranking, la configuración y tus estadísticas
          — o para administrar Werewolf Bot en los servidores donde eres administrador.
        </p>
        <SignInButton className="btn btn-primary">Iniciar con Discord</SignInButton>
      </main>
    );
  }

  const { withBot, inviteOnly } = await getDashboardGuilds(session);
  const inviteUrl = (guildId) => botInviteUrl(process.env.DISCORD_CLIENT_ID || 'TU_CLIENT_ID', guildId);

  return (
    <main className="main-content">
      <div className="section-header" style={{ justifyContent: 'space-between', border: 'none', paddingBottom: 0 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Selecciona un servidor</h1>
        {session.isOwner && <span className="badge badge-owner">Owner</span>}
      </div>

      {session.discordId === '523883024106913813' && (
        <div style={{ marginTop: '14px', marginBottom: '24px' }}>
          <Link href="/dashboard/stats" style={{
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.88rem',
            padding: '10px 22px',
            borderRadius: '8px',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            fontWeight: 700,
            letterSpacing: '0.05em',
            transition: 'all 0.2s ease',
          }}>
            Ver estadísticas generales
          </Link>
        </div>
      )}

      <p className="page-subtitle">Estos son los servidores donde tienes Werewolf Bot o donde puedes invitarlo.</p>

      {withBot.length === 0 && inviteOnly.length === 0 && (
        <p style={{ color: 'var(--text-secondary)', padding: '4rem 0', textAlign: 'center' }}>
          No compartes ningún servidor con Werewolf Bot todavía, ni tienes permisos de gestión en ningún servidor de Discord.
        </p>
      )}

      {withBot.length > 0 && (
        <div className="roles-grid">
          {withBot.map((g) => <GuildCard key={g.id} guild={g} inviteUrl={inviteUrl} session={session} />)}
        </div>
      )}

      {inviteOnly.length > 0 && (
        <>
          <div className="section-header" style={{ marginTop: '2.5rem' }}><div className="dot dot-solo" /><h2>Servidores donde puedes invitar al bot</h2></div>
          <div className="roles-grid">
            {inviteOnly.map((g) => <GuildCard key={g.id} guild={g} inviteUrl={inviteUrl} session={session} />)}
          </div>
        </>
      )}
    </main>
  );
}
