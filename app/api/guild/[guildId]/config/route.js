import { NextResponse } from 'next/server';
import { requireGuildAdmin } from '@/lib/apiGuard';
import { isGuildAdmin } from '@/lib/auth';
import { getGuildConfig, updateGuildConfig } from '@/lib/wwData';

export async function GET(request, { params }) {
  const { guildId } = await params;
  const { error } = await requireGuildAdmin(guildId);
  if (error) return error;
  const cfg = await getGuildConfig(guildId);
  return NextResponse.json(cfg);
}

export async function PUT(request, { params }) {
  const { guildId } = await params;
  const { error, session } = await requireGuildAdmin(guildId);
  if (error) return error;
  
  const updates = await request.json();

  if ('gamemode' in updates && !isGuildAdmin(session, guildId)) {
    return NextResponse.json({ error: 'Solo un administrador del servidor puede cambiar los modos de juego' }, { status: 403 });
  }

  if ('mod_role' in updates) {
    const isRealAdmin = (session.manageableGuilds || []).some((g) => g.id === guildId && g.isAdmin) || session.isOwner;
    if (!isRealAdmin) {
      const currentCfg = await getGuildConfig(guildId);
      const currentVal = currentCfg.mod_role ? String(currentCfg.mod_role) : null;
      let newVal = updates.mod_role;
      if (newVal !== undefined && newVal !== null && newVal !== '') {
        newVal = String(newVal);
      } else {
        newVal = null;
      }
      if (newVal !== currentVal) {
        return NextResponse.json({ error: 'No tienes permiso para modificar el rol de moderador' }, { status: 403 });
      }
    }
  }

  await updateGuildConfig(guildId, updates);
  const cfg = await getGuildConfig(guildId);
  return NextResponse.json(cfg);
}
