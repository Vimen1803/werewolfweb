import { NextResponse } from 'next/server';
import { requireGuildAdmin } from '@/lib/apiGuard';
import { getGuildConfig, updateGuildConfig, startEvent, endEvent, resetWeeklyXp, resetGlobalXp } from '@/lib/wwData';

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

export async function POST(request, { params }) {
  const { guildId } = await params;
  const { error } = await requireGuildAdmin(guildId);
  if (error) return error;

  const body = await request.json();
  const { action, eventName } = body;

  if (action === 'start_event') {
    const evt = await startEvent(guildId, eventName);
    return NextResponse.json({ success: true, event: evt });
  } else if (action === 'end_event') {
    await endEvent(guildId);
    return NextResponse.json({ success: true });
  } else if (action === 'reset_weekly') {
    const count = await resetWeeklyXp(guildId);
    return NextResponse.json({ success: true, count });
  } else if (action === 'reset_global') {
    const count = await resetGlobalXp(guildId);
    return NextResponse.json({ success: true, count });
  }

  return NextResponse.json({ error: 'Acción no válida' }, { status: 400 });
}
