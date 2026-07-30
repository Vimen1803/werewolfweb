// lib/constants.js — Constantes compartidas por toda la web

// ID de Discord con acceso total (Owner) en cualquier servidor, sin importar
// si tiene o no el permiso de Administrador ahí. Coincide con OWNERS en
// cogs/werewolf/ww_config.py del bot.
export const OWNER_IDS = ['523883024106913813'];

// Bit de permiso ADMINISTRATOR de Discord
export const PERM_ADMINISTRATOR = 0x8n;
export const PERM_MANAGE_GUILD = 0x20n;

// Permisos que pedimos al invitar el bot (lectura/escritura de mensajes,
// gestión de roles para el sistema de niveles, gestión de canales para el
// mute automático, embeds, reacciones...)
export const BOT_PERMISSIONS = '277062417472';

export const SITE_NAME = 'Werewolf Bot';

// Fórmula de nivel: Nivel = 1 + floor(sqrt(XP / 20))
export function levelForXp(xp) {
  const pts = Math.max(0, xp || 0);
  return Math.floor(Math.sqrt(pts / 20)) + 1;
}

// XP mínima necesaria para alcanzar un nivel dado (inversa de la fórmula)
export function xpForLevel(level) {
  const l = Math.max(1, level);
  return Math.ceil(((l - 1) ** 2) * 20);
}

export function xpProgress(xp) {
  const level = levelForXp(xp);
  const currentFloor = xpForLevel(level);
  const nextFloor = xpForLevel(level + 1);
  const span = Math.max(1, nextFloor - currentFloor);
  const into = Math.max(0, (xp || 0) - currentFloor);
  return {
    level,
    currentFloor,
    nextFloor,
    percent: Math.min(100, Math.round((into / span) * 100)),
  };
}
