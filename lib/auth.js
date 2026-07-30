// lib/auth.js — Configuración de NextAuth (login con Discord)

import NextAuth from 'next-auth';
import Discord from 'next-auth/providers/discord';
import { getUserGuilds, hasAdminPermission, hasManagePermission, isOwnerId } from './discord';

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: { params: { scope: 'identify guilds' } },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        token.accessToken = account.access_token;
        token.discordId = profile.id;
        token.username = profile.username;
        token.avatar = profile.avatar;

        // Guardamos, en el momento del login, un resumen ligero de los
        // servidores del usuario donde tiene permiso de Administrador o
        // Gestionar Servidor. Así no repetimos esta llamada en cada página.
        try {
          const guilds = await getUserGuilds(account.access_token);
          token.manageableGuilds = (Array.isArray(guilds) ? guilds : [])
            .filter((g) => hasManagePermission(g.permissions) || g.owner)
            .map((g) => ({
              id: g.id,
              name: g.name,
              icon: g.icon,
              isAdmin: hasAdminPermission(g.permissions) || g.owner || isOwnerId(profile.id),
            }));
        } catch {
          token.manageableGuilds = [];
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.discordId = token.discordId;
      session.username = token.username;
      session.avatar = token.avatar;
      session.isOwner = isOwnerId(token.discordId);
      session.manageableGuilds = token.manageableGuilds || [];
      return session;
    },
  },
  pages: {
    signIn: '/dashboard',
  },
  trustHost: true,
});

// Comprueba si el usuario de la sesión es Admin en un servidor concreto.
// El Owner global (ID fijo) es admin en cualquier servidor.
export function isGuildAdmin(session, guildId) {
  if (!session) return false;
  if (session.isOwner) return true;
  return (session.manageableGuilds || []).some((g) => g.id === guildId && g.isAdmin);
}
