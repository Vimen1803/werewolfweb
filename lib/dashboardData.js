// lib/dashboardData.js — Combina los guilds del usuario con los del bot
// para construir la pantalla "Selecciona un Servidor" del dashboard.

import { getUserGuilds, getBotGuilds, hasAdminPermission, hasManagePermission, isOwnerId, guildIconUrl, getGuildMember } from './discord';
import { getCollections } from './mongodb';

export async function getDashboardGuilds(session) {
  const [userGuilds, botGuilds] = await Promise.all([
    getUserGuilds(session.accessToken),
    getBotGuilds(),
  ]);

  const botGuildIds = new Set(botGuilds.map((g) => g.id));
  const owner = isOwnerId(session.discordId);

  // Consultar en BD todas las configuraciones de los guilds del usuario que tienen mod_role
  const sharedGuilds = (Array.isArray(userGuilds) ? userGuilds : []).filter((g) => botGuildIds.has(g.id));
  const sharedGuildIds = sharedGuilds.map((g) => Number(g.id));
  
  const modRoleMap = {};
  try {
    const { guilds } = await getCollections();
    const dbGuildConfigs = await guilds.find({ _id: { $in: sharedGuildIds }, mod_role: { $ne: null } }).toArray();
    for (const doc of dbGuildConfigs) {
      modRoleMap[String(doc._id)] = String(doc.mod_role);
    }
  } catch (e) {
    console.error('Error fetching mod_roles for dashboard:', e);
  }

  const withBot = [];
  const inviteOnly = [];

  for (const g of Array.isArray(userGuilds) ? userGuilds : []) {
    const canManage = hasManagePermission(g.permissions) || g.owner;
    let isAdmin = hasAdminPermission(g.permissions) || g.owner || owner;

    if (botGuildIds.has(g.id)) {
      // Si no es admin directo de Discord pero la guild tiene mod_role configurado
      if (!isAdmin && modRoleMap[g.id]) {
        try {
          const member = await getGuildMember(g.id, session.discordId);
          if (member && member.roles && member.roles.includes(modRoleMap[g.id])) {
            isAdmin = true;
          }
        } catch (e) {
          console.error(`Error checking mod_role for dashboard guild ${g.id}:`, e);
        }
      }

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
