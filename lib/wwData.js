// lib/wwData.js — Acceso a las colecciones de Werewolf desde la web.
//
// IMPORTANTE: este archivo debe reflejar EXACTAMENTE el esquema y los
// defaults de werewolf/database.py del bot (Python). Si cambias algo
// en un lado, cámbialo también en el otro.
//
// ── Esquema actual (documentos ANIDADOS) ───────────────────────────────────
// ww_players:
//   { _id, guild_id, user_id, username,
//     general_stats: { games_played, games_won, wolf_played, wolf_won,
//                       village_played, village_won, tanner_played, tanner_won,
//                       white_wolf_played, white_wolf_won, lovers_played, lovers_won,
//                       current_streak, max_streak },
//     WWP: { global_xp, weekly_xp, event_xp },
//     roles_played: {...}, roles_won: {...}, stats: {...} }
//
// ww_guilds:
//   { _id, prefix, level_roles, active_event,
//     flags: { mute_noche, mute_votacion, mute_muertos, pts_enabled, achievements_enabled },
//     channels: { allowed_channels, mention_role_id, canal_anuncios, mention_cooldown },
//     timers: { discussion_duration, vote_duration, ... },
//     points: { base: { victory, special_victory, round_alive, survive_end },
//               actions: { vidente_ver_lobo, ... } },
//     multipliers: { general, roles } }
//
// El resto de la web (páginas, componentes, rutas API) sigue trabajando con
// un contrato PLANO (las mismas claves de siempre): este archivo es el único
// responsable de traducir entre el formato plano de la UI y el formato
// anidado real guardado en Mongo, igual que hace database.py con
// _FLAT_TO_GROUP / _read_flat_or_nested en el lado del bot.

import { Long } from 'mongodb';
import { getCollections } from './mongodb';
import { createGuildInvite } from './discord';

const GUILD_CONFIG_DEFAULTS = {
  allowed_channels: [],
  mention_role_id: null,
  canal_anuncios: null,
  no_xp_role_id: null,
  mute_noche: true,
  mute_votacion: true,
  mute_muertos: true,
  level_roles: {},
  prefix: 'ww',
  pts_victory: 15,
  pts_special_victory: 40,
  pts_round_alive: 2,
  pts_survive_end: 5,
  pts_enabled: true,
  mention_cooldown: 900,
  discussion_duration: 90,
  vote_duration: 10,
  night_action_timeout: 60,
  wolf_vote_timeout: 60,
  wolf_decision_timeout: 30,
  hunter_shot_timeout: 30,
  night_countdown: 5,
  saquea_tumbas_decision: 30,
  judge_decision_timeout: 30,
  miron_read_timeout: 20,
  xp_vidente_ver_lobo: 3,
  xp_vidente_ver_lycan: -1,
  xp_bruja_matar_lobo: 5,
  xp_bruja_matar_inocente: -2,
  xp_cazador_matar_lobo: 5,
  xp_cazador_matar_inocente: -1,
  xp_curandera_proteger_atacado: 3,
  xp_caballero_usar_poder: 2,
  xp_ramera_bloquear_decisor: 5,
  xp_ramera_bloquear_inocente_accion: -1,
  xp_zorro_localizar_lobo: 2,
  xp_cazador_bestias_trampa_lobo: 5,
  xp_cupido_amantes_ganan: 15,
  xp_nino_salvaje_convertirse: 3,
  xp_hermanas_vivas_ganan: 5,
  xp_hermanas_muerte_votacion: -3,
  xp_lobo_kill_cooperativo: 1,
  xp_gran_lobo_kill_personal: 2,
  xp_lobo_blanco_kill_lobo: 3,
  xp_hechicera_descubrir_vidente: 5,
  slow_turn_duration: 15,
  slow_discussion_duration: 45,
  achievements_enabled: true,
  xp_multiplier: 1.0,
  role_multipliers: {},
  active_event: null,
};

export const XP_ACTION_KEYS = [
  'xp_vidente_ver_lobo', 'xp_vidente_ver_lycan', 'xp_bruja_matar_lobo',
  'xp_bruja_matar_inocente', 'xp_cazador_matar_lobo', 'xp_cazador_matar_inocente',
  'xp_curandera_proteger_atacado', 'xp_caballero_usar_poder', 'xp_ramera_bloquear_decisor',
  'xp_ramera_bloquear_inocente_accion', 'xp_zorro_localizar_lobo', 'xp_cazador_bestias_trampa_lobo',
  'xp_cupido_amantes_ganan', 'xp_nino_salvaje_convertirse', 'xp_hermanas_vivas_ganan',
  'xp_hermanas_muerte_votacion', 'xp_lobo_kill_cooperativo', 'xp_gran_lobo_kill_personal',
  'xp_lobo_blanco_kill_lobo', 'xp_hechicera_descubrir_vidente',
];

const INT_KEYS = [
  'pts_victory', 'pts_special_victory', 'pts_round_alive', 'pts_survive_end',
  'mention_cooldown', 'vote_duration', 'discussion_duration',
  'night_action_timeout', 'wolf_vote_timeout', 'wolf_decision_timeout',
  'hunter_shot_timeout', 'night_countdown', 'saquea_tumbas_decision',
  'judge_decision_timeout', 'miron_read_timeout',
  'slow_turn_duration', 'slow_discussion_duration',
];

const BOOL_KEYS = ['mute_noche', 'mute_votacion', 'mute_muertos', 'pts_enabled', 'achievements_enabled'];

export const VALID_CONFIG_KEYS = new Set([
  'allowed_channels', 'mention_role_id', 'canal_anuncios', 'no_xp_role_id',
  'mute_noche', 'mute_votacion', 'mute_muertos', 'prefix',
  'achievements_enabled', 'xp_multiplier', 'role_multipliers', 'active_event',
  ...INT_KEYS, 'level_roles', ...XP_ACTION_KEYS,
  'slow_turn_duration', 'slow_discussion_duration',
]);

// Mapa: clave plana (la que usa toda la UI/API de la web) -> (grupo nuevo,
// sub-grupo o null, clave nueva dentro del documento anidado de ww_guilds).
// Debe coincidir EXACTAMENTE con _FLAT_TO_GROUP en werewolf/database.py.
// Las claves que no aparecen aquí ("prefix", "level_roles", "active_event")
// se guardan sin anidar, igual que antes.
const FLAT_TO_GROUP = {
  mute_noche: ['flags', null, 'mute_noche'],
  mute_votacion: ['flags', null, 'mute_votacion'],
  mute_muertos: ['flags', null, 'mute_muertos'],
  pts_enabled: ['flags', null, 'pts_enabled'],
  achievements_enabled: ['flags', null, 'achievements_enabled'],

  allowed_channels: ['channels', null, 'allowed_channels'],
  canal_anuncios: ['channels', null, 'canal_anuncios'],
  mention_role_id: ['channels', null, 'mention_role_id'],
  no_xp_role_id: ['multipliers', null, 'no_xp_role_id'],
  mention_cooldown: ['channels', null, 'mention_cooldown'],

  discussion_duration: ['timers', null, 'discussion_duration'],
  vote_duration: ['timers', null, 'vote_duration'],
  night_action_timeout: ['timers', null, 'night_action_timeout'],
  wolf_vote_timeout: ['timers', null, 'wolf_vote_timeout'],
  wolf_decision_timeout: ['timers', null, 'wolf_decision_timeout'],
  hunter_shot_timeout: ['timers', null, 'hunter_shot_timeout'],
  night_countdown: ['timers', null, 'night_countdown'],
  saquea_tumbas_decision: ['timers', null, 'saquea_tumbas_decision'],
  judge_decision_timeout: ['timers', null, 'judge_decision_timeout'],
  miron_read_timeout: ['timers', null, 'miron_read_timeout'],
  slow_turn_duration: ['timers', null, 'slow_turn_duration'],
  slow_discussion_duration: ['timers', null, 'slow_discussion_duration'],

  pts_victory: ['points', 'base', 'victory'],
  pts_special_victory: ['points', 'base', 'special_victory'],
  pts_round_alive: ['points', 'base', 'round_alive'],
  pts_survive_end: ['points', 'base', 'survive_end'],

  xp_vidente_ver_lobo: ['points', 'actions', 'vidente_ver_lobo'],
  xp_vidente_ver_lycan: ['points', 'actions', 'vidente_ver_lycan'],
  xp_bruja_matar_lobo: ['points', 'actions', 'bruja_matar_lobo'],
  xp_bruja_matar_inocente: ['points', 'actions', 'bruja_matar_inocente'],
  xp_cazador_matar_lobo: ['points', 'actions', 'cazador_matar_lobo'],
  xp_cazador_matar_inocente: ['points', 'actions', 'cazador_matar_inocente'],
  xp_curandera_proteger_atacado: ['points', 'actions', 'curandera_proteger_atacado'],
  xp_caballero_usar_poder: ['points', 'actions', 'caballero_usar_poder'],
  xp_ramera_bloquear_decisor: ['points', 'actions', 'ramera_bloquear_decisor'],
  xp_ramera_bloquear_inocente_accion: ['points', 'actions', 'ramera_bloquear_inocente_accion'],
  xp_zorro_localizar_lobo: ['points', 'actions', 'zorro_localizar_lobo'],
  xp_cazador_bestias_trampa_lobo: ['points', 'actions', 'cazador_bestias_trampa_lobo'],
  xp_cupido_amantes_ganan: ['points', 'actions', 'cupido_amantes_ganan'],
  xp_nino_salvaje_convertirse: ['points', 'actions', 'nino_salvaje_convertirse'],
  xp_hermanas_vivas_ganan: ['points', 'actions', 'hermanas_vivas_ganan'],
  xp_hermanas_muerte_votacion: ['points', 'actions', 'hermanas_muerte_votacion'],
  xp_lobo_kill_cooperativo: ['points', 'actions', 'lobo_kill_cooperativo'],
  xp_gran_lobo_kill_personal: ['points', 'actions', 'gran_lobo_kill_personal'],
  xp_lobo_blanco_kill_lobo: ['points', 'actions', 'lobo_blanco_kill_lobo'],
  xp_hechicera_descubrir_vidente: ['points', 'actions', 'hechicera_descubrir_vidente'],

  xp_multiplier: ['multipliers', null, 'general'],
  role_multipliers: ['multipliers', null, 'roles'],
};

const MISSING = Symbol('missing');

/**
 * Busca el valor de una clave de configuración tanto en el nuevo formato
 * anidado (doc[grupo][clave] o doc[grupo][subgrupo][clave]) como en el
 * formato plano antiguo (doc[clave_plana]), dando preferencia al nuevo.
 * Devuelve MISSING si no se encuentra en ninguno de los dos formatos.
 * Espejo de _read_flat_or_nested() en werewolf/database.py.
 */
function readFlatOrNested(doc, flatKey) {
  const mapping = FLAT_TO_GROUP[flatKey];
  if (mapping) {
    const [group, subgroup, newKey] = mapping;
    const groupVal = doc[group];
    if (groupVal && typeof groupVal === 'object') {
      if (subgroup) {
        const subVal = groupVal[subgroup];
        if (subVal && typeof subVal === 'object' && newKey in subVal) {
          return subVal[newKey];
        }
      } else if (newKey in groupVal) {
        return groupVal[newKey];
      }
    }
  }
  if (flatKey in doc) return doc[flatKey];
  return MISSING;
}

function toLong(val) {
  if (val === null || val === undefined || val === '') return null;
  if (typeof val === 'bigint') return Long.fromBigInt(val);
  if (typeof val === 'number') {
    if (!Number.isFinite(val)) return null;
    return Long.fromNumber(val);
  }
  const str = String(val).trim();
  if (!str) return null;
  try {
    return Long.fromString(str);
  } catch (e) {
    return str;
  }
}

function sanitizeBson(val) {
  if (val === null || val === undefined) return val;
  if (typeof val === 'object' && val._bsontype === 'Long') {
    return val.toString();
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeBson);
  }
  if (typeof val === 'object' && val.constructor === Object) {
    const res = {};
    for (const [k, v] of Object.entries(val)) {
      res[k] = sanitizeBson(v);
    }
    return res;
  }
  return val;
}

function matchId(val) {
  if (val === null || val === undefined || val === '') return null;
  const str = String(val).trim();
  const conditions = [str];
  try {
    conditions.push(Long.fromString(str));
  } catch (e) {}
  const num = Number(str);
  if (!Number.isNaN(num) && Number.isFinite(num)) {
    conditions.push(num);
  }
  return { $in: conditions };
}

function pid(guildId, userId) {
  return `${guildId}:${userId}`;
}

/**
 * Convierte un documento ANIDADO de ww_players (general_stats / WWP) al
 * formato PLANO que espera el resto de la web (páginas de stats, leaderboard,
 * definiciones de logros...). Espejo, en sentido inverso, de lo que hace
 * record_game() en werewolf/database.py al escribir.
 */
function normalizePlayer(doc) {
  if (!doc) return null;
  const gs = (doc.general_stats && typeof doc.general_stats === 'object') ? doc.general_stats : {};
  const wwp = (doc.WWP && typeof doc.WWP === 'object') ? doc.WWP : {};
  return sanitizeBson({
    _id: doc._id,
    guild_id: doc.guild_id,
    user_id: doc.user_id,
    username: doc.username,
    games_played: gs.games_played || 0,
    games_won: gs.games_won || 0,
    wolf_played: gs.wolf_played || 0,
    wolf_won: gs.wolf_won || 0,
    village_played: gs.village_played || 0,
    village_won: gs.village_won || 0,
    tanner_played: gs.tanner_played || 0,
    tanner_won: gs.tanner_won || 0,
    white_wolf_played: gs.white_wolf_played || 0,
    white_wolf_won: gs.white_wolf_won || 0,
    lovers_played: gs.lovers_played || 0,
    lovers_won: gs.lovers_won || 0,
    slow_played: gs.slow_played || 0,
    slow_won: gs.slow_won || 0,
    silence_played: gs.silence_played || 0,
    silence_won: gs.silence_won || 0,
    weather_played: gs.weather_played || 0,
    weather_won: gs.weather_won || 0,
    kaos_played: gs.kaos_played || 0,
    kaos_won: gs.kaos_won || 0,
    credit_played: gs.credit_played || 0,
    credit_won: gs.credit_won || 0,
    classic_played: gs.classic_played || 0,
    classic_won: gs.classic_won || 0,
    current_streak: gs.current_streak || 0,
    max_streak: gs.max_streak || 0,
    event_points: wwp.global_xp || 0,
    weekly_xp: wwp.weekly_xp || 0,
    event_xp: wwp.event_xp || 0,
    roles_played: doc.roles_played || {},
    roles_won: doc.roles_won || {},
    stats: doc.stats || {},
    achievements: doc.achievements || {},
  });
}

export async function getGuildConfig(guildId) {
  const { guilds } = await getCollections();
  const doc = await guilds.findOne({ _id: matchId(guildId) }) || {};
  const result = { ...GUILD_CONFIG_DEFAULTS };
  for (const key of Object.keys(result)) {
    const v = readFlatOrNested(doc, key);
    if (v !== MISSING) result[key] = sanitizeBson(v);
  }
  return result;
}

export async function updateGuildConfig(guildId, updates) {
  const { guilds } = await getCollections();
  const setFields = {};

  for (const [k, raw] of Object.entries(updates)) {
    if (!VALID_CONFIG_KEYS.has(k)) continue;
    let v = raw;

    if ((k === 'mention_role_id' || k === 'canal_anuncios' || k === 'no_xp_role_id') && v !== null && v !== undefined && v !== '') {
      v = toLong(v);
    } else if ((k === 'mention_role_id' || k === 'canal_anuncios' || k === 'no_xp_role_id') && (v === '' || v === undefined)) {
      v = null;
    } else if (k === 'allowed_channels' && Array.isArray(v)) {
      v = v.map((x) => toLong(x)).filter(Boolean);
    } else if (INT_KEYS.includes(k) || XP_ACTION_KEYS.includes(k)) {
      const n = Number(v);
      v = Number.isFinite(n) ? Math.trunc(n) : 0;
    } else if (BOOL_KEYS.includes(k)) {
      v = Boolean(v);
    } else if (k === 'level_roles' && v && typeof v === 'object') {
      const cleaned = {};
      for (const [lvl, roleId] of Object.entries(v)) {
        const l = Number(lvl);
        if (Number.isFinite(l) && roleId) {
          cleaned[String(l)] = toLong(roleId);
        }
      }
      v = cleaned;
    } else if (k === 'role_multipliers' && v && typeof v === 'object') {
      const cleaned = {};
      for (const [roleId, mult] of Object.entries(v)) {
        const m = Number(mult);
        if (roleId && Number.isFinite(m)) {
          cleaned[String(roleId)] = m;
        }
      }
      v = cleaned;
    } else if (k === 'xp_multiplier') {
      const n = Number(v);
      v = Number.isFinite(n) ? n : 1.0;
    }
    setFields[k] = v;
  }

  if (Object.keys(setFields).length === 0) return;

  // Traduce cada clave plana a su ruta anidada nueva (igual que
  // update_guild_config() en werewolf/database.py). Las claves sin mapeo
  // ("prefix", "level_roles", "active_event") se guardan igual que siempre.
  const dottedSetFields = {};
  for (const [k, v] of Object.entries(setFields)) {
    const mapping = FLAT_TO_GROUP[k];
    if (mapping) {
      const [group, subgroup, newKey] = mapping;
      const dotted = subgroup ? `${group}.${subgroup}.${newKey}` : `${group}.${newKey}`;
      dottedSetFields[dotted] = v;
    } else {
      dottedSetFields[k] = v;
    }
  }

  const existing = await guilds.findOne({ _id: matchId(guildId) });
  const targetId = existing ? existing._id : toLong(guildId);

  await guilds.updateOne({ _id: targetId }, { $set: dottedSetFields }, { upsert: true });
}

export async function getPlayer(guildId, userId) {
  const { players } = await getCollections();
  const primaryId = pid(guildId, userId);
  let doc = await players.findOne({ _id: primaryId });
  if (!doc) {
    doc = await players.findOne({
      guild_id: matchId(guildId),
      user_id: matchId(userId),
    });
  }
  return normalizePlayer(doc);
}

export async function getLeaderboard(guildId, limit = 10) {
  const { players } = await getCollections();
  const docs = await players
    .find({ guild_id: matchId(guildId), 'WWP.global_xp': { $gt: 0 } })
    .project({
      _id: 1, user_id: 1, username: 1,
      'WWP.global_xp': 1,
      'general_stats.games_played': 1, 'general_stats.games_won': 1,
    })
    .sort({ 'WWP.global_xp': -1 })
    .limit(limit)
    .toArray();

  return docs.map((d) => ({
    _id: d._id,
    user_id: d.user_id && typeof d.user_id === 'object' && d.user_id._bsontype === 'Long' ? d.user_id.toString() : d.user_id,
    username: d.username,
    event_points: d.WWP?.global_xp || 0,
    games_played: d.general_stats?.games_played || 0,
    games_won: d.general_stats?.games_won || 0,
  }));
}

export async function getPlayerRank(guildId, pts) {
  if (!pts || pts <= 0) return null;
  const { players } = await getCollections();
  const countAbove = await players.countDocuments({
    guild_id: matchId(guildId),
    'WWP.global_xp': { $gt: pts },
  });
  return countAbove + 1;
}

export async function getBlacklist(guildId) {
  const { blacklist } = await getCollections();
  return blacklist.find({ guild_id: matchId(guildId) }).sort({ date_added: 1 }).toArray();
}

export async function addBlacklist(guildId, userId, { username, addedBy, addedByName, reason }) {
  const { blacklist } = await getCollections();
  const _id = pid(guildId, userId);
  const existing = await blacklist.findOne({ _id });
  if (existing) return false;
  await blacklist.insertOne({
    _id,
    guild_id: toLong(guildId),
    user_id: toLong(userId),
    username,
    added_by: toLong(addedBy),
    added_by_name: addedByName,
    reason: reason || 'Sin motivo especificado',
    date_added: new Date(),
  });
  return true;
}

export async function removeBlacklist(guildId, userId) {
  const { blacklist } = await getCollections();
  const res = await blacklist.deleteOne({ _id: pid(guildId, userId) });
  return res.deletedCount > 0;
}

export async function getGlobalStats(guildId) {
  const { globalStats } = await getCollections();
  const doc = await globalStats.findOne({ guild_id: matchId(guildId) });
  
  const rolesList = [
    "Aldeano", "Vidente", "Bruja", "Cazador", "Curandera", "Caballero", "El Anciano",
    "Ramera", "Zorro", "Cazador de Bestias", "Cupido", "Panadero", "Niño Salvaje",
    "Alma Pura", "Infiel", "Licántropo", "2x Hermana", "Ladrón", "Saquea Tumbas",
    "Juez", "Miron", "Hereje", "Hombre Lobo", "Gran Lobo Feroz", "Lobo Blanco",
    "Padre de los Lobos", "Hechicera", "Lobo Kamikaze", "Curtidor"
  ];
  
  const defaults = {
    total_played: 0,
    bandos_played: { aldea: 0, lobo: 0, tanner: 0, lobo_blanco: 0 },
    bandos_won: { aldea: 0, lobo: 0, tanner: 0, lobo_blanco: 0 },
    gamemode_played: { classic: 0, slow: 0, silence: 0, weather: 0, kaos: 0, credit: 0 },
    gamemode_won: { classic: 0, slow: 0, silence: 0, weather: 0, kaos: 0, credit: 0 },
    rol_played: Object.fromEntries(rolesList.map(r => [r, 0])),
    rol_won: Object.fromEntries(rolesList.map(r => [r, 0])),
  };

  if (!doc) return defaults;

  const sanitized = sanitizeBson(doc);
  const totalPlayed = sanitized.total_played !== undefined ? sanitized.total_played : (sanitized.total_matches || 0);

  const bp = sanitized.bandos_played || {};
  const bandos_played = {
    aldea: bp.aldea !== undefined ? bp.aldea : totalPlayed,
    lobo: bp.lobo !== undefined ? bp.lobo : totalPlayed,
    tanner: bp.tanner !== undefined ? bp.tanner : (sanitized.tanner_matches || 0),
    lobo_blanco: bp.lobo_blanco !== undefined ? bp.lobo_blanco : (sanitized.white_wolf_matches || 0)
  };

  const bw = sanitized.bandos_won || {};
  const bandos_won = {
    aldea: bw.aldea !== undefined ? bw.aldea : (sanitized.village_won || 0),
    lobo: bw.lobo !== undefined ? bw.lobo : (sanitized.wolves_won || 0),
    tanner: bw.tanner !== undefined ? bw.tanner : (sanitized.tanner_won || 0),
    lobo_blanco: bw.lobo_blanco !== undefined ? bw.lobo_blanco : (sanitized.white_wolf_won || 0)
  };

  const gmp = sanitized.gamemode_played || {};
  const gamemode_played = {
    classic: gmp.classic !== undefined ? gmp.classic : (sanitized.classic_matches || 0),
    slow: gmp.slow !== undefined ? gmp.slow : (sanitized.slow_matches || 0),
    silence: gmp.silence !== undefined ? gmp.silence : (sanitized.silence_matches || 0),
    weather: gmp.weather !== undefined ? gmp.weather : (sanitized.weather_matches || 0),
    kaos: gmp.kaos !== undefined ? gmp.kaos : (sanitized.kaos_matches || 0),
    credit: gmp.credit !== undefined ? gmp.credit : (sanitized.credit_matches || 0)
  };

  const gmw = sanitized.gamemode_won || {};
  const gamemode_won = {
    classic: gmw.classic || 0,
    slow: gmw.slow || 0,
    silence: gmw.silence || 0,
    weather: gmw.weather || 0,
    kaos: gmw.kaos || 0,
    credit: gmw.credit || 0
  };

  const rp = sanitized.rol_played || {};
  const rol_played = Object.fromEntries(rolesList.map(r => [r, rp[r] || 0]));

  const rw = sanitized.rol_won || {};
  const rol_won = Object.fromEntries(rolesList.map(r => [r, rw[r] || 0]));

  return {
    _id: sanitized._id,
    guild_id: sanitized.guild_id,
    total_played: totalPlayed,
    bandos_played,
    bandos_won,
    gamemode_played,
    gamemode_won,
    rol_played,
    rol_won,
    lovers_matches: sanitized.lovers_matches || 0,
    lovers_won: sanitized.lovers_won || 0
  };
}

export async function getGuildAchievementsStats(guildId) {
  const { players } = await getCollections();
  
  const docs = await players
    .find({
      guild_id: matchId(guildId),
      'general_stats.games_played': { $gte: 1 }
    })
    .project({ achievements: 1 })
    .toArray();
    
  const totalPlayers = docs.length;
  
  const counts = {};
  for (const doc of docs) {
    if (doc.achievements && typeof doc.achievements === 'object') {
      for (const achId of Object.keys(doc.achievements)) {
        counts[achId] = (counts[achId] || 0) + 1;
      }
    }
  }
  return {
    totalPlayers,
    counts
  };
}

export async function getGeneralStatsForDashboard() {
  const { globalStats, guilds, players } = await getCollections();

  // Obtener estadísticas globales de toda la comunidad sumando todos los servidores
  const allGlobalStats = await globalStats.find({}).toArray();
  let totalMatches = 0;
  let villageWon = 0;
  let wolvesWon = 0;
  let whiteWolfWon = 0;
  let tannerWon = 0;
  let loversWon = 0;
  let classicMatches = 0, slowMatches = 0, silenceMatches = 0;
  let weatherMatches = 0, kaosMatches = 0, creditMatches = 0;
  
  for (const gs of allGlobalStats) {
    totalMatches += gs.total_matches || 0;
    villageWon += gs.village_won || 0;
    wolvesWon += gs.wolves_won || 0;
    whiteWolfWon += gs.white_wolf_won || 0;
    tannerWon += gs.tanner_won || 0;
    loversWon += gs.lovers_won || 0;
    classicMatches += gs.classic_matches || 0;
    slowMatches += gs.slow_matches || 0;
    silenceMatches += gs.silence_matches || 0;
    weatherMatches += gs.weather_matches || 0;
    kaosMatches += gs.kaos_matches || 0;
    creditMatches += gs.credit_matches || 0;
  }
  
  const globalWinrates = {
    totalMatches,
    villageWon,
    wolvesWon,
    soloWon: whiteWolfWon + tannerWon + loversWon,
    classicMatches, slowMatches, silenceMatches,
    weatherMatches, kaosMatches, creditMatches,
  };

  // Obtener nombres e invitaciones de todos los servidores para mapeo
  const allGuilds = await guilds.find({}).toArray();
  const guildNames = {};
  const guildInvites = {};
  for (const g of allGuilds) {
    const key = String(g._id);
    guildNames[key] = g.name;
    guildInvites[key] = g.invite_url || null;
  }

  const resolveInvite = async (gId) => {
    if (guildInvites[gId]) return guildInvites[gId];
    const generated = await createGuildInvite(gId);
    if (generated) {
      await guilds.updateOne({ _id: matchId(gId) }, { $set: { invite_url: generated } }, { upsert: true });
      guildInvites[gId] = generated;
      return generated;
    }
    return null;
  };

  const getPlayerServerName = (p) => {
    const gId = p.guild_id && typeof p.guild_id === 'object' && p.guild_id._bsontype === 'Long'
      ? p.guild_id.toString()
      : String(p.guild_id || '');
    return guildNames[gId] || `Servidor ${gId}`;
  };

  const getPlayerServerId = (p) => {
    return p.guild_id && typeof p.guild_id === 'object' && p.guild_id._bsontype === 'Long'
      ? p.guild_id.toString()
      : String(p.guild_id || '');
  };

  // 1. Top 5 servidores por partidas jugadas
  const topGuildStats = await globalStats
    .find({ total_matches: { $gt: 0 } })
    .sort({ total_matches: -1 })
    .limit(5)
    .toArray();

  const topServers = [];
  for (const gs of topGuildStats) {
    const gId = gs.guild_id && typeof gs.guild_id === 'object' && gs.guild_id._bsontype === 'Long' 
      ? gs.guild_id.toString() 
      : String(gs.guild_id);
    
    const gInfo = await guilds.findOne({ _id: matchId(gId) }) || {};
    let inviteUrl = gInfo.invite_url || null;
    if (!inviteUrl) {
      inviteUrl = await resolveInvite(gId);
    }
    
    const serverTopPlayers = await getLeaderboard(gId, 3);

    topServers.push({
      id: gId,
      name: gInfo.name || `Servidor ${gId}`,
      invite_url: inviteUrl,
      matches_played: gs.total_matches || 0,
      top_players: serverTopPlayers
    });
  }

  // 2. Cargar todos los jugadores
  const allPlayersRaw = await players.find({}).toArray();
  
  // Calcular estadísticas de logros globales sobre todos los documentos con partidas >= 1
  const eligibleDocs = allPlayersRaw.filter(p => {
    const gs = p.general_stats || {};
    return (gs.games_played || 0) >= 1;
  });
  const totalDocsCount = eligibleDocs.length;
  
  const globalAchCounts = {};
  for (const doc of eligibleDocs) {
    if (doc.achievements && typeof doc.achievements === 'object') {
      for (const achId of Object.keys(doc.achievements)) {
        globalAchCounts[achId] = (globalAchCounts[achId] || 0) + 1;
      }
    }
  }

  // Agrupar y deduplicar por user_id, quedándonos con el del servidor con mayor XP
  const playersByUserId = {};
  for (const p of allPlayersRaw) {
    if (!p.user_id) continue;
    const uId = p.user_id && typeof p.user_id === 'object' && p.user_id._bsontype === 'Long'
      ? p.user_id.toString()
      : String(p.user_id);
      
    const normalized = normalizePlayer(p);
    if (!normalized) continue;
    
    const existing = playersByUserId[uId];
    if (!existing || normalized.event_points > existing.event_points) {
      playersByUserId[uId] = normalized;
    }
  }

  const uniquePlayersList = Object.values(playersByUserId);

  // A. Top 3 por XP
  const topXpRaw = [...uniquePlayersList]
    .sort((a, b) => b.event_points - a.event_points)
    .slice(0, 3);

  const topXp = await Promise.all(topXpRaw.map(async p => {
    const sId = getPlayerServerId(p);
    const invite = await resolveInvite(sId);
    return {
      username: p.username,
      xp: p.event_points,
      games: p.games_played,
      winrate: p.games_played > 0 ? Math.round((p.games_won / p.games_played) * 100) : 0,
      server_name: getPlayerServerName(p),
      server_invite: invite,
      server_id: sId
    };
  }));

  // B. Top 3 por partidas jugadas
  const topGamesRaw = [...uniquePlayersList]
    .sort((a, b) => b.games_played - a.games_played)
    .slice(0, 3);

  const topGames = await Promise.all(topGamesRaw.map(async p => {
    const sId = getPlayerServerId(p);
    const invite = await resolveInvite(sId);
    return {
      username: p.username,
      xp: p.event_points,
      games: p.games_played,
      winrate: p.games_played > 0 ? Math.round((p.games_won / p.games_played) * 100) : 0,
      server_name: getPlayerServerName(p),
      server_invite: invite,
      server_id: sId
    };
  }));

  // C. Top 3 por logros completados
  const topAchievementsRaw = [...uniquePlayersList]
    .sort((a, b) => {
      const countA = Object.keys(a.achievements || {}).length;
      const countB = Object.keys(b.achievements || {}).length;
      return countB - countA;
    })
    .slice(0, 3);

  const topAchievements = await Promise.all(topAchievementsRaw.map(async p => {
    const count = Object.keys(p.achievements || {}).length;
    const sId = getPlayerServerId(p);
    const invite = await resolveInvite(sId);
    return {
      username: p.username,
      xp: p.event_points,
      games: p.games_played,
      achievements_count: count,
      winrate: p.games_played > 0 ? Math.round((p.games_won / p.games_played) * 100) : 0,
      server_name: getPlayerServerName(p),
      server_invite: invite,
      server_id: sId
    };
  }));

  return {
    topServers,
    topXp,
    topGames,
    topAchievements,
    globalAchCounts,
    totalDocsCount,
    globalWinrates
  };
}

export async function getWeeklyLeaderboard(guildId, limit = 10) {
  const { players } = await getCollections();
  const docs = await players
    .find({ guild_id: matchId(guildId), 'WWP.weekly_xp': { $gt: 0 } })
    .project({
      _id: 1, user_id: 1, username: 1,
      'WWP.weekly_xp': 1,
      'general_stats.games_played': 1, 'general_stats.games_won': 1,
    })
    .sort({ 'WWP.weekly_xp': -1 })
    .limit(limit)
    .toArray();

  return docs.map((d) => ({
    _id: d._id,
    user_id: d.user_id && typeof d.user_id === 'object' && d.user_id._bsontype === 'Long' ? d.user_id.toString() : d.user_id,
    username: d.username,
    games_played: d.general_stats?.games_played || 0,
    games_won: d.general_stats?.games_won || 0,
    event_points: d.WWP?.weekly_xp || 0,
  }));
}

export async function resetWeeklyXp(guildId) {
  const { players } = await getCollections();
  const res = await players.updateMany({ guild_id: matchId(guildId) }, { $set: { 'WWP.weekly_xp': 0 } });
  return res.modifiedCount;
}

export async function resetGlobalXp(guildId) {
  const { players } = await getCollections();
  const res = await players.updateMany({ guild_id: matchId(guildId) }, { $set: { 'WWP.global_xp': 0 } });
  return res.modifiedCount;
}

export async function resetEventXp(guildId) {
  const { players } = await getCollections();
  const res = await players.updateMany({ guild_id: matchId(guildId) }, { $set: { 'WWP.event_xp': 0 } });
  return res.modifiedCount;
}

export async function getActiveEvent(guildId) {
  const cfg = await getGuildConfig(guildId);
  if (cfg.active_event && cfg.active_event.active) {
    return cfg.active_event;
  }
  return null;
}

/**
 * Devuelve el top N jugadores del evento de XP activo en este servidor.
 * NOTA: en el esquema nuevo solo puede haber UN evento activo por servidor
 * a la vez, y su XP se guarda como un valor plano en WWP.event_xp (no como
 * un diccionario por event_id). El parámetro eventId se mantiene por
 * compatibilidad con quien la llama, pero ya no se usa para filtrar.
 */
export async function getEventLeaderboard(guildId, eventId, limit = 10) {
  const { players } = await getCollections();
  const docs = await players
    .find({ guild_id: matchId(guildId), 'WWP.event_xp': { $gt: 0 } })
    .project({
      _id: 1, user_id: 1, username: 1,
      'WWP.event_xp': 1,
      'general_stats.games_played': 1, 'general_stats.games_won': 1,
    })
    .sort({ 'WWP.event_xp': -1 })
    .limit(limit)
    .toArray();

  return docs.map((d) => ({
    _id: d._id,
    user_id: d.user_id && typeof d.user_id === 'object' && d.user_id._bsontype === 'Long' ? d.user_id.toString() : d.user_id,
    username: d.username,
    games_played: d.general_stats?.games_played || 0,
    games_won: d.general_stats?.games_won || 0,
    event_points: d.WWP?.event_xp || 0,
  }));
}

export async function startEvent(guildId, name, createdBy = 'web_admin') {
  const evtId = `evt_${Date.now()}`;
  const evtData = {
    event_id: evtId,
    name: name || 'Nuevo Evento de XP',
    active: true,
    start_date: new Date().toISOString(),
    created_by: createdBy,
  };
  await updateGuildConfig(guildId, { active_event: evtData });
  return evtData;
}

export async function endEvent(guildId) {
  const { guilds } = await getCollections();
  await guilds.updateOne({ _id: matchId(guildId) }, { $unset: { active_event: '' } });
  return true;
}
