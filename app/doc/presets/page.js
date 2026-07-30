'use client';
import { useState } from 'react';
import { PRESETS_DATA } from '@/lib/data/presets';

function pctClass(v) {
  if (v === 0) return 'pct-zero';
  if (v >= 70) return 'pct-high';
  if (v >= 40) return 'pct-med';
  return 'pct-low';
}

function RoleBars({ roles, idx, team }) {
  return (
    <div className="role-grid">
      {roles.map(r => {
        const v = r.spawn[idx];
        return (
          <div key={r.name} className={`role-bar-item ${v === 0 ? 'pct-zero' : ''}`}>
            <span style={{ fontSize: '1.2rem' }}>{r.emoji}</span>
            <span className="role-name">{r.name}</span>
            <div className="bar-container"><div className={`bar-fill bar-${team}`} style={{ width: `${v}%` }}></div></div>
            <span className={`role-pct ${pctClass(v)}`}>{v}%</span>
          </div>
        );
      })}
    </div>
  );
}

export default function WerewolfPresets() {
  const [n, setN] = useState(10);
  const idx = n - 5;
  const wolfBase = PRESETS_DATA.wolfCount[idx];
  const soloSlot = n === 20 ? 2 : (n >= 8 ? 1 : 0);
  const villageCount = n - wolfBase - soloSlot;

  const notes = [];
  if (n < 8) notes.push('Sin slot solitario con menos de 8 jugadores.');
  if (n === 7 || n === 8) notes.push('En partidas de 7 y 8 jugadores no hay Hechicera.');
  if (n === 9) notes.push('Regla especial para 9 jugadores: Siempre habrá 2 lobos de base, y además puede aparecer una Hechicera (haciendo un total de 3 lobos). Si la Hechicera se activa, se reduce la aldea a 5 slots (garantizando que haya un Vidente).');
  if (n >= 8 && n < 11) notes.push('Si no sale ningún rol solitario se suma un slot a la aldea.');
  if (n >= 11 && n < 20) notes.push('Curtidor y Lobo Blanco compiten por el slot solitario. Si sale Lobo Blanco, se resta un slot a los lobos.');
  if (n === 20) notes.push('Partida especial: Pueden aparecer hasta 2 roles solitarios (Máx 1 Lobo Blanco, hasta 2 Curtidores).');

  return (
    <main className="main-content">
      <div className="presets-header">
        <h1 className="page-title">📊 Presets Dinámicos</h1>
        <div className="info-icon-container">
          <div className="info-trigger">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
            </svg>
          </div>
          <div className="info-tooltip">
            <h3>Reglas de Generación</h3>
            <ul>
              <li><strong>Hechicera / Licántropo:</strong> Requieren que un <b>Vidente</b> esté presente en la partida.</li>
              <li><strong>5 Jugadores:</strong> En partidas de <b>5 jugadores</b>, si hay <b>Vidente</b> no habrá <b>Bruja</b>.</li>
              <li><strong>Visitantes:</strong> Nunca habrá <b>Ramera e Infiel</b> en la misma partida.</li>
              <li><strong>Mirón:</strong> En partidas de <b>-15 jugadores</b>, no puede coexistir con el Vidente.</li>
              <li><strong>Ladrón:</strong> Sus cartas del centro nunca serán roles ya existentes en la partida, ni tampoco Aldeanos o Alma Pura. Pueden ser 2,3 o 4 cartas de forma aleatoria.</li>
              <li><strong>Especiales Lobo:</strong> Máximo <b>un</b> Gran Lobo Feroz, <b>un</b> Padre de los Lobos y <b>un</b> Lobo Kamikaze.</li>
              <li><strong>20 Jugadores:</strong> 2 slots solitarios (Máx. 1 Lobo Blanco). Probabilidad de segundo rol solitario reducida.</li>
              <li><strong>Relleno:</strong> Si los roles especiales no superan su probabilidad, los slots restantes se completan con <b>Hombres Lobos</b> (en su bando) y <b>Aldeanos</b> (en la aldea).</li>
            </ul>
          </div>
        </div>
      </div>
      <p className="page-subtitle">Ajusta el número de jugadores para ver la distribución de roles y probabilidades.</p>

      <div className="controls-card card fade-in">
        <div className="slider-group">
          <label htmlFor="player-slider">Jugadores: <span id="player-count-display">{n}</span></label>
          <input type="range" min="5" max="20" value={n} step="1" id="player-slider" className="styled-slider" onChange={e => setN(+e.target.value)} />
        </div>
      </div>

      <div className="summary-grid fade-in">
        <div className="sum-card"><span className="sum-label">Aldea</span><span className="sum-value val-aldea">{villageCount}</span></div>
        <div className="sum-card"><span className="sum-label">Lobos</span><span className="sum-value val-lobos">{wolfBase}</span></div>
        <div className="sum-card"><span className="sum-label">Solitario</span><span className="sum-value val-solo">{soloSlot}</span></div>
        <div className="sum-card"><span className="sum-label">Total</span><span className="sum-value">{n}</span></div>
      </div>

      <div className="fade-in">
        <div className="section">
          <div className="section-header">🏡 Aldea</div>
          <RoleBars roles={PRESETS_DATA.village} idx={idx} team="village" />
        </div>
        <div className="section">
          <div className="section-header">🐺 Lobos</div>
          <RoleBars roles={PRESETS_DATA.wolves} idx={idx} team="wolves" />
        </div>
        <div className="section">
          <div className="section-header">🎭 Solitarios (Slot Único / Doble en 20j)</div>
          <RoleBars roles={PRESETS_DATA.solo} idx={idx} team="solo" />
        </div>
      </div>

      <div className="notes-container card fade-in">
        <p className="note-text">{notes.join(' ')}</p>
      </div>
    </main>
  );
}
