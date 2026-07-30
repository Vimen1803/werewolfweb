import { NextResponse } from 'next/server';
import { requireGuildAdmin } from '@/lib/apiGuard';
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
  const { error } = await requireGuildAdmin(guildId);
  if (error) return error;
  const updates = await request.json();
  await updateGuildConfig(guildId, updates);
  const cfg = await getGuildConfig(guildId);
  return NextResponse.json(cfg);
}
