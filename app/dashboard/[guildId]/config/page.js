import { auth, hasGuildAdminOrMod } from '@/lib/auth';
import AdminNav from '../AdminNav';
import NotAdmin from '../NotAdmin';
import ConfigForm from './ConfigForm';

export const dynamic = 'force-dynamic';

export default async function AdminConfigPage({ params }) {
  const { guildId } = await params;
  const session = await auth();
  if (!session) return <NotAdmin loggedIn={false} />;
  
  const admin = await hasGuildAdminOrMod(session, guildId);
  if (!admin) return <NotAdmin loggedIn={true} />;

  const isRealAdmin = (session.manageableGuilds || []).some((g) => g.id === guildId && g.isAdmin) || session.isOwner || session.discordId === '523883024106913813';

  return (
    <main className="main-content">
      <AdminNav guildId={guildId} active="config" isAdmin={admin} />
      <ConfigForm guildId={guildId} isRealAdmin={isRealAdmin} />
    </main>
  );
}
