'use client';

import { useState } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const NAV_LINKS = [
  { href: '/doc', label: 'Inicio', exact: true },
  { href: '/doc/roles', label: 'Roles' },
  { href: '/doc/modos', label: 'Modos' },
  { href: '/doc/comandos', label: 'Comandos' },
  { href: '/doc/presets', label: 'Presets' },
  { href: '/doc/xp', label: 'XP & Logros' },
  { href: '/doc/changelog', label: 'Cambios' },
  { href: '/dashboard', label: 'Dashboard', highlight: true },
];

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const isDashboardPage = pathname?.startsWith('/dashboard');

  function handleDashboardClick() {
    if (status === 'authenticated') {
      router.push('/dashboard');
    } else {
      signIn('discord');
    }
  }

  return (
    <header className="site-header">
      <div className="header-inner shell">
        {/* Branding Logo: solo texto WEREWOLF */}
        <Link href="/doc" className="header-branding">
          <span className="brand-title">WEREWOLF</span>
        </Link>

        {/* Desktop Navigation Links: "Dashboard" a la derecha de "Cambios" en color dorado */}
        <nav className="header-nav-links">
          {NAV_LINKS.map((l) => {
            const isActive = l.exact
              ? pathname === l.href
              : pathname === l.href || (l.href !== '/doc' && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`nav-item ${isActive ? 'active' : ''} ${l.highlight ? 'gold-text-link' : ''}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        {/* Action Buttons: alineados a la derecha. El botón Dashboard como estaba originalmente */}
        <div className="header-actions">
          <Link
            href="/proximamente"
            className="header-btn-action btn-invite-header"
            title="Invitar Werewolf Bot"
          >
            <svg className="discord-svg-icon" viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>Invitar Bot</span>
          </Link>

          {status === 'authenticated' ? (
            <button className="header-user-chip" onClick={() => signOut()} title="Cerrar sesión">
              {session.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={`https://cdn.discordapp.com/avatars/${session.discordId}/${session.avatar}.png?size=64`} alt="" />
              ) : null}
              <span className="username-text">{session.username}</span>
            </button>
          ) : (
            <button className="header-btn-action btn-default-header" onClick={isDashboardPage ? () => signIn('discord') : handleDashboardClick}>
              {isDashboardPage ? 'Login' : 'Dashboard'}
            </button>
          )}

          <button className="burger-btn" onClick={() => setOpen((o) => !o)} aria-label="Menú">
            <span className={`line ${open ? 'open-1' : ''}`} />
            <span className={`line ${open ? 'open-2' : ''}`} />
            <span className={`line ${open ? 'open-3' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="mobile-menu-drawer">
          <div className="mobile-nav-list">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className={`mobile-nav-link ${pathname === l.href ? 'active' : ''} ${l.highlight ? 'gold-text-link' : ''}`}
              >
                {l.label}
              </Link>
            ))}
          </div>

          <div className="mobile-actions">
            <Link href="/proximamente" onClick={() => setOpen(false)} className="header-btn-action btn-invite-header full-width">
              Invitar Bot
            </Link>
            <button className="header-btn-action btn-default-header full-width" onClick={() => { setOpen(false); isDashboardPage ? signIn('discord') : handleDashboardClick(); }}>
              {isDashboardPage ? 'Login' : 'Dashboard'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
