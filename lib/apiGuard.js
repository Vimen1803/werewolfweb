import { auth, hasGuildAdminOrMod } from './auth';
import { NextResponse } from 'next/server';

// Devuelve { session } si el usuario es admin de guildId, o una NextResponse
// de error lista para `return` si no lo es.
export async function requireGuildAdmin(guildId) {
  const session = await auth();
  if (!session) {
    return { error: NextResponse.json({ error: 'No autenticado' }, { status: 401 }) };
  }
  if (!await hasGuildAdminOrMod(session, guildId)) {
    return { error: NextResponse.json({ error: 'No tienes permiso de administrador en este servidor' }, { status: 403 }) };
  }
  return { session };
}
