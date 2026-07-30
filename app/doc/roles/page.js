'use client';
import { useState } from 'react';
import { ROLES_DATA } from '@/lib/data/roles';

const TEAMS = [
  { id: 'village', emoji: '🏡', label: 'La Aldea', dot: 'dot-village', roles: ROLES_DATA.village },
  { id: 'wolves', emoji: '🐺', label: 'Los Lobos', dot: 'dot-wolves', roles: ROLES_DATA.wolves },
  { id: 'solo', emoji: '🎭', label: 'Solitarios', dot: 'dot-solo', roles: ROLES_DATA.solo },
];

const FILTERS = [
  { id: 'village', label: `🏡 Aldea (${ROLES_DATA.village.length})` },
  { id: 'wolves', label: `🐺 Lobos (${ROLES_DATA.wolves.length})` },
  { id: 'solo', label: `🎭 Solitarios (${ROLES_DATA.solo.length})` },
];

export default function WerewolfRoles() {
  const [filter, setFilter] = useState('village');
  const [open, setOpen] = useState({});

  return (
    <main className="main-content">
      <h1 className="page-title">🎭 Roles de Werewolf</h1>
      <p className="page-subtitle">Haz clic en un rol para desplegar o plegar su descripción completa</p>

      <div className="filter-bar">
        {FILTERS.map(f => (
          <button
            key={f.id}
            className={`filter-btn ${filter === f.id ? 'active' : ''}`}
            onClick={() => setFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      {TEAMS.filter(t => t.id === filter).map(team => (
        <section key={team.id} className="team-section">
          <div className="section-header">
            <div className={`dot ${team.dot}`}></div>
            <h2>{team.emoji} {team.label}</h2>
          </div>
          <div className="roles-grid">
            {team.roles.map((role, i) => {
              const k = team.id + '-' + i;
              const isOpen = !!open[k];
              return (
                <div
                  key={k}
                  className={`role-card ${isOpen ? 'open' : ''}`}
                  role="button"
                  tabIndex={0}
                  aria-expanded={isOpen}
                  onClick={() => setOpen(o => ({ ...o, [k]: !o[k] }))}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => ({ ...o, [k]: !o[k] })); } }}
                >
                  <div className="role-card-header">
                    <span className="role-emoji">{role.emoji}</span>
                    <span className="role-name">{role.name}</span>
                    <span className={`role-night ${role.night ? 'yes' : 'no'}`}>{role.night ? '🌙 Nocturno' : '☀️ Pasivo'}</span>
                    <span className="chevron">▼</span>
                  </div>
                  <div className="role-card-body">
                    <p>{role.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </main>
  );
}
