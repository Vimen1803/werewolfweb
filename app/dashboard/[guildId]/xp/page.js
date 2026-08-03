import { auth, hasGuildAdminOrMod } from '@/lib/auth';
import AdminNav from '../AdminNav';
import NotAdmin from '../NotAdmin';
import XpForm from './XpForm';

export const dynamic = 'force-dynamic';

export default async function AdminXpPage({ params }) {
  const { guildId } = await params;
  const session = await auth();
  if (!session) return <NotAdmin loggedIn={false} />;
  
  const admin = await hasGuildAdminOrMod(session, guildId);
  if (!admin) return <NotAdmin loggedIn={true} />;

  return (
    <main className="main-content">
      <AdminNav guildId={guildId} active="xp" />
      <XpForm guildId={guildId} />
    </main>
  );
}
