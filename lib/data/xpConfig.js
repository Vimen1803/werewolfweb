// lib/data/xpConfig.js — Valores por defecto del sistema de XP
// Debe reflejar exactamente los defaults de get_guild_config() en
// cogs/werewolf/database.py del bot, para que la doc y el panel de
// admin muestren siempre la verdad tal y como la aplica el bot.

export const XP_DEFAULTS = {
  pts_enabled: true,
  pts_victory: 15,
  pts_special_victory: 40,
  pts_round_alive: 2,
  pts_survive_end: 5,
};

// XP por acciones específicas de cada rol durante la partida.
// Cada fila: [clave de config, etiqueta, rol, valor por defecto, descripción]
export const ROLE_XP_ACTIONS = [
  { key: 'xp_vidente_ver_lobo', role: 'Vidente', label: 'Ver a un Lobo o a la Hechicera', value: 3 },
  { key: 'xp_vidente_ver_lycan', role: 'Vidente', label: 'Ver al Licántropo (falso positivo)', value: -1 },
  { key: 'xp_bruja_matar_lobo', role: 'Bruja', label: 'Envenenar a un Lobo', value: 5 },
  { key: 'xp_bruja_matar_inocente', role: 'Bruja', label: 'Envenenar a un inocente', value: -2 },
  { key: 'xp_cazador_matar_lobo', role: 'Cazador', label: 'Disparar a un Lobo', value: 5 },
  { key: 'xp_cazador_matar_inocente', role: 'Cazador', label: 'Disparar a un inocente', value: -1 },
  { key: 'xp_curandera_proteger_atacado', role: 'Curandera', label: 'Proteger al atacado por los lobos', value: 3 },
  { key: 'xp_caballero_usar_poder', role: 'Caballero', label: 'Activar la venganza retardada', value: 2 },
  { key: 'xp_ramera_bloquear_decisor', role: 'Ramera', label: 'Bloquear al lobo decisor', value: 5 },
  { key: 'xp_ramera_bloquear_inocente_accion', role: 'Ramera', label: 'Bloquear a un inocente con poder', value: -1 },
  { key: 'xp_zorro_localizar_lobo', role: 'Zorro', label: 'Localizar un lobo en el trío', value: 2 },
  { key: 'xp_cazador_bestias_trampa_lobo', role: 'Cazador de Bestias', label: 'Atrapar a un lobo con la trampa', value: 5 },
  { key: 'xp_cupido_amantes_ganan', role: 'Cupido', label: 'Los amantes ganan la partida', value: 15 },
  { key: 'xp_nino_salvaje_convertirse', role: 'Niño Salvaje', label: 'Convertirse en lobo', value: 3 },
  { key: 'xp_hermanas_vivas_ganan', role: 'Hermanas', label: 'Las dos hermanas ganan vivas', value: 5 },
  { key: 'xp_hermanas_muerte_votacion', role: 'Hermanas', label: 'Una hermana muere en votación', value: -3 },
  { key: 'xp_lobo_kill_cooperativo', role: 'Hombre Lobo', label: 'Asesinato cooperativo (manada completa)', value: 1 },
  { key: 'xp_gran_lobo_kill_personal', role: 'Gran Lobo Feroz', label: 'Asesinato en solitario', value: 2 },
  { key: 'xp_lobo_blanco_kill_lobo', role: 'Lobo Blanco', label: 'Matar a otro lobo', value: 3 },
  { key: 'xp_hechicera_descubrir_vidente', role: 'Hechicera', label: 'Descubrir al Vidente', value: 5 },
];

export const NIVELES_RANGOS = [
  { level: 5, emoji: '🥈', name: 'Iniciado', color: '#a0a0a0', desc: 'Primer rango. Conoces las bases del juego.' },
  { level: 10, emoji: '🥇', name: 'Veterano', color: '#f0a500', desc: 'Rango de veteranía, un jugador con experiencia real.' },
  { level: 15, emoji: '👑', name: 'Leyenda', color: '#7f77dd', desc: 'Dominas el engaño, la traición y la deducción.' },
  { level: 20, emoji: '🏆', name: 'Mítico', color: '#e74c3c', desc: 'Nivel máximo de maestría en Werewolf.' },
];
