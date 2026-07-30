'use client';
import { useState } from 'react';
import { COMMANDS_DATA } from '@/lib/data/commands';

const CATS = [
  { id: 'all', icon: '🌍', label: 'Ver Todos' },
  { id: 'partida', icon: '🎮', label: 'Partida' },
  { id: 'info', icon: 'ℹ️', label: 'Información' },
  { id: 'stats', icon: '📈', label: 'Estadísticas' },
  { id: 'comunidad', icon: '📣', label: 'Comunidad' },
  { id: 'gear', icon: '⚙️', label: 'Configuración' },
  { id: 'admin', icon: '🔒', label: 'Administración' },
];

export default function WerewolfComandos() {
  const [cat, setCat] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  const q = search.toLowerCase();
  const filtered = COMMANDS_DATA.filter(c =>
    (cat === 'all' || c.cat === cat) &&
    ((c.prefix + c.name).toLowerCase().includes(q) || c.desc.toLowerCase().includes(q))
  );
  const count = id => id === 'all' ? COMMANDS_DATA.length : COMMANDS_DATA.filter(c => c.cat === id).length;

  return (
    <div className="dashboard-container">
      <aside className="sidebar fade-in">
        <div className="sidebar-header">Categorías</div>
        <ul className="sidebar-nav">
          {CATS.map(c => (
            <li key={c.id} className={cat === c.id ? 'active' : ''} role="button" tabIndex={0} aria-pressed={cat === c.id} onClick={() => setCat(c.id)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setCat(c.id); } }}>
              <span className="nav-icon">{c.icon}</span> {c.label}
              <span className="nav-count">{count(c.id)}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="main-dashboard">
        <header className="dashboard-header fade-in">
          <div className="search-wrapper">
            <svg fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path></svg>
            <input
              type="text"
              id="command-search"
              placeholder="Buscar comando o descripción..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </header>

        <div className="commands-grid">
          {filtered.map(cmd => (
            <div key={cmd.id} className="cmd-card fade-in" role="button" tabIndex={0} onClick={() => setSelected(cmd)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelected(cmd); } }}>
              <div className="cmd-card-header">
                <div className="cmd-card-title">{cmd.prefix}{cmd.name}</div>
                <div className="cmd-card-tag">{cmd.cat}</div>
              </div>
              <div className="cmd-card-desc">{cmd.desc}</div>
              <div className="cmd-card-footer">
                <div className="cmd-card-usage">Haz clic para ver detalles</div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <div className={`modal-overlay ${selected ? 'visible' : ''}`} onClick={() => setSelected(null)}>
        {selected && (
          <div className="modal-content fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelected(null)}>×</button>
            <div className="modal-header">
              <h2>{selected.prefix}{selected.name}</h2>
            </div>
            <div className="modal-section">
              <h3>Descripción</h3>
              <p>{selected.long_desc}</p>
            </div>
            <div className="modal-section">
              <h3>Parámetros</h3>
              <ul className="params-list">
                {selected.params.length > 0 ? selected.params.map((p, i) => (
                  <li key={i}><strong>{p.name}:</strong> {p.desc} {p.optional && <em style={{ opacity: 0.6 }}>(Opcional)</em>}</li>
                )) : <li>Este comando no requiere parámetros.</li>}
              </ul>
            </div>
            <div className="modal-section">
              <h3>Ejemplos de Uso</h3>
              <div className="examples-box">
                {selected.examples.map((ex, i) => (
                  <div key={i}><code>{ex}</code></div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
