'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { ROLES_DATA } from '@/lib/data/roles';

export default function DocIndexPage() {
  const { status } = useSession();
  const router = useRouter();

  // 4 roles elegidos para la portada (2 de la aldea, 1 lobo, 1 solitario)
  const featuredRoles = [
    { ...ROLES_DATA.village.find((r) => r.name === 'Vidente'), teamLabel: 'La Aldea 🛡️', teamClass: 'badge-village' },
    { ...ROLES_DATA.village.find((r) => r.name === 'Bruja'), teamLabel: 'La Aldea 🛡️', teamClass: 'badge-village' },
    { ...ROLES_DATA.wolves.find((r) => r.name === 'Hombre Lobo'), teamLabel: 'Los Lobos 🐺', teamClass: 'badge-wolves' },
    { ...ROLES_DATA.solo.find((r) => r.name === 'Curtidor'), teamLabel: 'Solitarios 🎭', teamClass: 'badge-solo' },
  ];

  function handleDashboardClick() {
    if (status === 'authenticated') {
      router.push('/dashboard');
    } else {
      signIn('discord');
    }
  }

  return (
    <main className="main-content">
      {/* ══ HERO SECTION ══ */}
      <section className="hero-landing fade-in">
        <div className="hero-badge-container">
          <Link href="/doc/changelog" className="hero-simple-badge">
            <span>NUEVO — MODO HALLOWEEN 🎃 →</span>
          </Link>
        </div>

        <h1 className="hero-main-title">
          Noches de mentiras. Días de sospechas.
          <br />
          <span className="orange-highlight-text">El Pueblo Duerme en tu Discord</span>
        </h1>

        <p className="hero-description">
          El bot de Hombres Lobo más completo para Discord. <strong>29 roles nocturnos</strong>, votaciones en tiempo real con mutes automáticos, <strong>60 logros con XP</strong>, podios semanales en imagen y un dashboard web completo.
        </p>

        {/* 2 botones con tamaño idéntico */}
        <div className="hero-cta-group">
          <Link
            href="/proximamente"
            className="hero-btn-action btn-hero-invite"
          >
            <svg className="discord-svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.893.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            <span>Invitar a mi Servidor</span>
          </Link>

          <button
            onClick={handleDashboardClick}
            className="hero-btn-action btn-hero-dash"
          >
            <span>⚙️ Dashboard Web</span>
          </button>
        </div>
      </section>

      {/* ══ METRICS STRIP ══ */}
      <section className="metrics-strip fade-in">
        <div className="metric-box">
          <span className="metric-number text-orange">29</span>
          <span className="metric-title">Roles Nocturnos</span>
          <span className="metric-sub">Vidente, Bruja, Curtidor...</span>
        </div>
        <div className="metric-box">
          <span className="metric-number text-gold">60</span>
          <span className="metric-title">Logros con Recompensa</span>
          <span className="metric-sub">Puntos WWP & Nivel</span>
        </div>
        <div className="metric-box">
          <span className="metric-number text-green">3</span>
          <span className="metric-title">Bandos Enfrentados</span>
          <span className="metric-sub">Aldea, Lobos & Solitarios</span>
        </div>
        <div className="metric-box">
          <span className="metric-number text-purple">100%</span>
          <span className="metric-title">Gestionable por Web</span>
          <span className="metric-sub">Dashboard de Administración</span>
        </div>
      </section>
    </main>
  );
}
