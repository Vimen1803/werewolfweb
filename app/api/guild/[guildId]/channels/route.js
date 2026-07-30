import { NextResponse } from 'next/server';
import { requireGuildAdmin } from '@/lib/apiGuard';
import { getGuildChannels } from '@/lib/discord';

export async function GET(request, { params }) {
  const { guildId } = await params;
  const { error } = await requireGuildAdmin(guildId);
  if (error) return error;
  const channels = await getGuildChannels(guildId);
  return NextResponse.json(channels.map((c) => ({ id: c.id, name: c.name })));
}
