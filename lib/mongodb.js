// lib/mongodb.js — Conexión a la base de datos de Werewolf (MongoDB)
//
// Usa la MISMA base de datos que el bot de Python (cogs/werewolf/database.py),
// para que la web lea y escriba exactamente las mismas colecciones:
//   - ww_players      → stats/XP de jugador, ahora con clave compuesta guild_id:user_id
//   - ww_guilds       → configuración de Werewolf por servidor
//   - ww_blacklist    → usuarios bloqueados, ahora por servidor
//   - ww_global_stats → estadísticas globales de partidas por servidor
//   - pending_unmutes → (no se usa desde la web)

import { MongoClient } from 'mongodb';

const uri = process.env.WEREWOLF_MONGODB_URI;
const DB_NAME = process.env.WEREWOLF_MONGODB_DB || 'labotv2';

if (!uri) {
  throw new Error('Falta la variable de entorno WEREWOLF_MONGODB_URI en .env');
}

let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._wwMongoClientPromise) {
    const client = new MongoClient(uri);
    global._wwMongoClientPromise = client.connect();
  }
  clientPromise = global._wwMongoClientPromise;
} else {
  const client = new MongoClient(uri);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db(DB_NAME);
}

export async function getCollections() {
  const db = await getDb();
  return {
    players: db.collection('ww_players'),
    guilds: db.collection('ww_guilds'),
    blacklist: db.collection('ww_blacklist'),
    globalStats: db.collection('ww_global_stats'),
  };
}

export default clientPromise;
