// lib/dashboardData.js — Combina los guilds del usuario con los del bot
// para construir la pantalla "Selecciona un Servidor" del dashboard.

import { getUserGuilds, getBotGuilds, hasAdminPermission, hasManagePermission, isOwnerId, guildIconUrl } from './discord';

export async function getDashboardGuilds(session) {
  const [userGuilds, botGuilds] = await Promise.all([
    getUserGuilds(session.accessToken),
    getBotGuilds(),
  ]);

  const botGuildIds = new Set(botGuilds.map((g) => g.id));
  const owner = isOwnerId(session.discordId);

  const withBot = [];
  const inviteOnly = [];

  for (const g of Array.isArray(userGuilds) ? userGuilds : []) {
    const canManage = hasManagePermission(g.permissions) || g.owner;
    const isAdmin = hasAdminPermission(g.permissions) || g.owner || owner;

    if (botGuildIds.has(g.id)) {
      withBot.push({
        id: g.id,
        name: g.name,
        icon: guildIconUrl(g),
        role: isAdmin ? 'admin' : 'member',
      });
    } else if (canManage) {
      inviteOnly.push({
        id: g.id,
        name: g.name,
        icon: guildIconUrl(g),
        role: 'invite',
      });
    }
  }

  withBot.sort((a, b) => (a.role === b.role ? a.name.localeCompare(b.name) : a.role === 'admin' ? -1 : 1));
  inviteOnly.sort((a, b) => a.name.localeCompare(b.name));

  return { withBot, inviteOnly };
}
