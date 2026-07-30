// lib/discord.js — Llamadas a la API REST de Discord

import { PERM_ADMINISTRATOR, PERM_MANAGE_GUILD, OWNER_IDS, BOT_PERMISSIONS } from './constants';

const API = 'https://discord.com/api/v10';

export function hasAdminPermission(permissionsBitfield) {
  try {
    const bits = BigInt(permissionsBitfield || '0');
    return (bits & PERM_ADMINISTRATOR) === PERM_ADMINISTRATOR;
  } catch {
    return false;
  }
}

export function hasManagePermission(permissionsBitfield) {
  try {
    const bits = BigInt(permissionsBitfield || '0');
    return (
      (bits & PERM_ADMINISTRATOR) === PERM_ADMINISTRATOR ||
      (bits & PERM_MANAGE_GUILD) === PERM_MANAGE_GUILD
    );
  } catch {
    return false;
  }
}

export function isOwnerId(discordId) {
  return OWNER_IDS.includes(String(discordId));
}

// Guilds del USUARIO (requiere su access_token con scope `guilds`)
export async function getUserGuilds(accessToken) {
  const res = await fetch(`${API}/users/@me/guilds`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

// Guilds en las que está el BOT (requiere DISCORD_BOT_TOKEN), paginado
export async function getBotGuilds() {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return [];
  let all = [];
  let after = '0';
  for (let page = 0; page < 10; page++) {
    const res = await fetch(`${API}/users/@me/guilds?limit=200&after=${after}`, {
      headers: { Authorization: `Bot ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) break;
    const batch = await res.json();
    all = all.concat(batch);
    if (batch.length < 200) break;
    after = batch[batch.length - 1].id;
  }
  return all;
}

export async function getGuildInfo(guildId) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return null;
  const res = await fetch(`${API}/guilds/${guildId}?with_counts=true`, {
    headers: { Authorization: `Bot ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getGuildMember(guildId, userId) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return null;
  const res = await fetch(`${API}/guilds/${guildId}/members/${userId}`, {
    headers: { Authorization: `Bot ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export async function getGuildRoles(guildId) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return [];
  const res = await fetch(`${API}/guilds/${guildId}/roles`, {
    headers: { Authorization: `Bot ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const roles = await res.json();
  // Sin @everyone, sin roles gestionados por integraciones
  return roles.filter((r) => r.name !== '@everyone' && !r.managed).sort((a, b) => b.position - a.position);
}

export async function getGuildChannels(guildId) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return [];
  const res = await fetch(`${API}/guilds/${guildId}/channels`, {
    headers: { Authorization: `Bot ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const channels = await res.json();
  // Tipo 0 = canal de texto
  return channels.filter((c) => c.type === 0).sort((a, b) => a.position - b.position);
}

export async function getDiscordUser(userId) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return null;
  const res = await fetch(`${API}/users/${userId}`, {
    headers: { Authorization: `Bot ${token}` },
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

export function guildIconUrl(guild) {
  if (!guild?.icon) return null;
  const ext = guild.icon.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${ext}?size=128`;
}

export function userAvatarUrl(user) {
  if (!user) return null;
  if (!user.avatar) {
    const idx = user.discriminator && user.discriminator !== '0'
      ? Number(user.discriminator) % 5
      : (Number(BigInt(user.id) >> 22n) % 6);
    return `https://cdn.discordapp.com/embed/avatars/${idx}.png`;
  }
  const ext = user.avatar.startsWith('a_') ? 'gif' : 'png';
  return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=128`;
}

export function botInviteUrl(clientId, guildId) {
  const params = new URLSearchParams({
    client_id: clientId,
    permissions: BOT_PERMISSIONS,
    scope: 'bot applications.commands',
  });
  if (guildId) {
    params.set('guild_id', guildId);
    params.set('disable_guild_select', 'true');
  }
  return `https://discord.com/api/oauth2/authorize?${params.toString()}`;
}

export async function createGuildInvite(guildId) {
  const token = process.env.DISCORD_BOT_TOKEN;
  if (!token) return null;
  
  const channels = await getGuildChannels(guildId);
  if (!channels || channels.length === 0) return null;
  
  const targetChannel = channels[0];
  
  const res = await fetch(`${API}/channels/${targetChannel.id}/invites`, {
    method: 'POST',
    headers: {
      Authorization: `Bot ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      max_age: 0,
      max_uses: 0,
    }),
    cache: 'no-store',
  });
  
  if (!res.ok) {
    const fallbackRes = await fetch(`${API}/channels/${targetChannel.id}/invites`, {
      method: 'POST',
      headers: {
        Authorization: `Bot ${token}`,
      },
      cache: 'no-store',
    });
    if (!fallbackRes.ok) return null;
    const data = await fallbackRes.json();
    return data.code ? `https://discord.gg/${data.code}` : null;
  }
  
  const data = await res.json();
  return data.code ? `https://discord.gg/${data.code}` : null;
}
