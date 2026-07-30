import { NextResponse } from 'next/server';
import { requireGuildAdmin } from '@/lib/apiGuard';
import { getBlacklist, addBlacklist, removeBlacklist } from '@/lib/wwData';
import { getDiscordUser } from '@/lib/discord';

export async function GET(request, { params }) {
  const { guildId } = await params;
  const { error } = await requireGuildAdmin(guildId);
  if (error) return error;
  const list = await getBlacklist(guildId);
  return NextResponse.json(list);
}

export async function POST(request, { params }) {
  const { guildId } = await params;
  const { error, session } = await requireGuildAdmin(guildId);
  if (error) return error;

  const { userId, reason } = await request.json();
  if (!userId || !/^\d{5,25}$/.test(String(userId))) {
    return NextResponse.json({ error: 'ID de usuario de Discord no válido' }, { status: 400 });
  }

  const targetUser = await getDiscordUser(userId);
  const username = targetUser ? (targetUser.global_name || targetUser.username) : `Usuario ${userId}`;

  const added = await addBlacklist(guildId, userId, {
    username,
    addedBy: session.discordId,
    addedByName: session.username,
    reason: reason || 'Sin motivo especificado',
  });

  if (!added) {
    return NextResponse.json({ error: 'Ese usuario ya está en la blacklist de este servidor' }, { status: 409 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { guildId } = await params;
  const { error } = await requireGuildAdmin(guildId);
  if (error) return error;

  const { userId } = await request.json();
  const removed = await removeBlacklist(guildId, userId);
  if (!removed) {
    return NextResponse.json({ error: 'Ese usuario no estaba en la blacklist' }, { status: 404 });
  }
  return NextResponse.json({ ok: true });
}
