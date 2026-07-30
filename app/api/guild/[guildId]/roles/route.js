import { NextResponse } from 'next/server';
import { requireGuildAdmin } from '@/lib/apiGuard';
import { getGuildRoles } from '@/lib/discord';

export async function GET(request, { params }) {
  const { guildId } = await params;
  const { error } = await requireGuildAdmin(guildId);
  if (error) return error;
  const roles = await getGuildRoles(guildId);
  return NextResponse.json(roles.map((r) => ({ id: r.id, name: r.name, color: r.color })));
}
