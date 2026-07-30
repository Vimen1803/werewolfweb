'use client';

import { useState } from 'react';
import { ACHIEVEMENTS_DEF, CATEGORY_NAMES } from '@/lib/data/achievementsDef';

export default function DocAchievementsViewer() {
  const [currentCat, setCurrentCat] = useState(1);

  const activeAchs = ACHIEVEMENTS_DEF.filter((a) => a.cat === currentCat);

  return (
    <section style={{ marginBottom: '2.5rem' }}>
      <details className="card" style={{ padding: '1.25rem 1.5rem', cursor: 'pointer' }}>
        <summary style={{ outline: 'none', userSelect: 'none', listStyle: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div className="section-header" style={{ marginBottom: 0, borderBottom: 'none', paddingBottom: 0 }}>
              <h2 style={{ fontSize: '1.15rem', margin: 0 }}>▶ Catálogo de los 60 Logros (WWP)</h2>
            </div>
            <span className="pill">Desplegar</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.84rem', marginTop: '6px', marginBottom: 0 }}>
            Haz clic para desplegar los logros por categoría y explorar las recompensas de XP disponibles.
          </p>
        </summary>

        <div style={{ marginTop: '1.5rem' }} onClick={(e) => e.stopPropagation()}>
          <div style={{ background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.25)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
            💡 <strong>Aviso sobre Logros Previos:</strong> Para recibir la XP correspondiente a los logros acumulativos que ya hubieras completado antes de esta actualización, solo tienes que ejecutar el comando <code>,ww logros</code> en Discord o finalizar una partida.
          </div>
          {/* Controles de Navegación por Categoría */}
          <div className="cat-nav" style={{ justifyContent: 'center' }}>
            <div className="cat-title">
              <span className="cat-badge">Categoría {currentCat} de 6</span>
              <h4>{CATEGORY_NAMES[currentCat]}</h4>
            </div>
          </div>

          {/* Selector de pestañas rápidas */}
          <div className="cat-tabs">
            {[1, 2, 3, 4, 5, 6].map((num) => (
              <button
                key={num}
                className={`tab-btn ${currentCat === num ? 'active' : ''}`}
                onClick={() => setCurrentCat(num)}
              >
                Cat. {num}
              </button>
            ))}
          </div>

          {/* Tabla / Grid de Logros de la Categoría Activa */}
          <div style={{ overflowX: 'auto', marginTop: '1rem' }}>
            <table className="xp-table">
              <thead>
                <tr>
                  <th>Logro</th>
                  <th>Descripción / Requisito</th>
                  <th style={{ textAlign: 'right' }}>Recompensa WWP</th>
                </tr>
              </thead>
              <tbody>
                {activeAchs.map((ach) => (
                  <tr key={ach.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                      🏆 {ach.name}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>{ach.desc}</td>
                    <td className="num pos" style={{ fontWeight: 700 }}>
                      +{ach.reward} XP
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>

      <style jsx>{`
        .cat-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid var(--border-subtle);
          border-radius: 10px;
          padding: 10px 16px;
          margin-bottom: 12px;
        }
        .cat-title {
          text-align: center;
        }
        .cat-badge {
          font-size: 0.72rem;
          color: var(--accent-gold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 600;
        }
        .cat-title h4 {
          margin: 2px 0 0;
          font-size: 1rem;
          font-family: var(--font-display);
          color: var(--text-primary);
        }

        .cat-tabs {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-bottom: 14px;
          flex-wrap: wrap;
        }
        .tab-btn {
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid var(--border-subtle);
          border-radius: 6px;
          padding: 4px 12px;
          font-size: 0.8rem;
          color: var(--text-secondary);
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .tab-btn:hover {
          background: rgba(255, 255, 255, 0.08);
          color: var(--text-primary);
        }
        .tab-btn.active {
          background: var(--accent-gold);
          color: #000;
          font-weight: 700;
          border-color: var(--accent-gold);
        }
      `}</style>
    </section>
  );
}
