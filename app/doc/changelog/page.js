'use client';
import { useState } from 'react';
import { CHANGELOG_DATA } from '@/lib/data/changelog';

export default function WerewolfCambios() {
  const [open, setOpen] = useState({});

  return (
    <main className="main-content">
      <h1 className="page-title">📋 Historial de Cambios</h1>
      <p className="page-subtitle">Explora el historial completo de cambios, mejoras y correcciones de Werewolf Bot.</p>

      <div className="changelog-container">
        {CHANGELOG_DATA.map((entry, i) => (
          <div key={i} className={`changelog-item card fade-in ${open[i] ? 'open' : ''}`}>
            <div
              className="changelog-header"
              role="button"
              tabIndex={0}
              aria-expanded={!!open[i]}
              onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setOpen(o => ({ ...o, [i]: !o[i] })); } }}
            >
              <div className="header-left">
                <span className="changelog-date">{entry.date}</span>
                <h2 className="changelog-title">{entry.title}</h2>
              </div>
              <span className="chevron">▼</span>
            </div>
            <div className="changelog-content">
              <div className="content-right">
                {entry.sections.map((s, si) => (
                  <div key={si}>
                    <h3>{s.heading}</h3>
                    <ul className="changelog-list">
                      {s.items.map((it, ii) => (
                        <li key={ii} dangerouslySetInnerHTML={{ __html: it }} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
