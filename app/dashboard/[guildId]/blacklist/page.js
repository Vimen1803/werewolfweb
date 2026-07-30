import { auth, isGuildAdmin } from '@/lib/auth';
import AdminNav from '../AdminNav';
import NotAdmin from '../NotAdmin';
import BlacklistManager from './BlacklistManager';

export const dynamic = 'force-dynamic';

export default async function AdminBlacklistPage({ params }) {
  const { guildId } = await params;
  const session = await auth();
  if (!session) return <NotAdmin loggedIn={false} />;
  if (!isGuildAdmin(session, guildId)) return <NotAdmin loggedIn={true} />;

  return (
    <main className="main-content">
      <AdminNav guildId={guildId} active="blacklist" />
      <BlacklistManager guildId={guildId} />
    </main>
  );
}
