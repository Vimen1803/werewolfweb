'use client';

import { useEffect, useState } from 'react';

export default function BlacklistManager({ guildId }) {
  const [list, setList] = useState(null);
  const [userId, setUserId] = useState('');
  const [reason, setReason] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);

  async function load() {
    const res = await fetch(`/api/guild/${guildId}/blacklist`);
    setList(await res.json());
  }

  useEffect(() => { load(); }, [guildId]);

  async function add() {
    if (!/^\d{5,25}$/.test(userId.trim())) {
      setMsg({ type: 'error', text: 'Introduce un ID de Discord válido (solo números).' });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch(`/api/guild/${guildId}/blacklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: userId.trim(), reason: reason.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error');
      setUserId('');
      setReason('');
      setMsg({ type: 'ok', text: 'Usuario añadido a la blacklist.' });
      load();
    } catch (e) {
      setMsg({ type: 'error', text: e.message });
    } finally {
      setBusy(false);
    }
  }

  async function remove(uid) {
    setBusy(true);
    try {
      await fetch(`/api/guild/${guildId}/blacklist`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: uid }),
      });
      load();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="bl-wrap">
      <div className="card block">
        <h3>Añadir usuario a la blacklist</h3>
        <p className="hint">Un usuario en la blacklist no podrá unirse a nuevas partidas de Werewolf en este servidor.</p>
        <div className="add-form">
          <input placeholder="ID de Discord del usuario" value={userId} onChange={(e) => setUserId(e.target.value)} />
          <input placeholder="Motivo (opcional)" value={reason} onChange={(e) => setReason(e.target.value)} />
          <button className="btn btn-primary btn-sm" onClick={add} disabled={busy}>Añadir</button>
        </div>
        {msg && <p className={msg.type === 'error' ? 'err' : 'ok'}>{msg.text}</p>}
      </div>

      <div className="card block">
        <h3>Usuarios bloqueados {list ? `(${list.length})` : ''}</h3>
        {!list ? (
          <p className="hint">Cargando…</p>
        ) : list.length === 0 ? (
          <p className="hint">No hay ningún usuario en la blacklist de este servidor.</p>
        ) : (
          <div className="bl-list">
            {list.map((b) => (
              <div key={b._id} className="bl-row">
                <div>
                  <span className="bl-name">{b.username}</span>
                  <span className="bl-id mono">{b.user_id}</span>
                  {b.reason && <span className="bl-reason">"{b.reason}"</span>}
                  <span className="bl-meta">Añadido por {b.added_by_name} · {new Date(b.date_added).toLocaleDateString('es-ES')}</span>
                </div>
                <button className="btn btn-ghost btn-sm" onClick={() => remove(b.user_id)} disabled={busy}>Quitar</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .block { padding: 22px 24px; margin-bottom: 16px; }
        .block h3 { font-size: 1rem; margin-bottom: 8px; }
        .hint { color: var(--text-muted); font-size: 0.82rem; margin-bottom: 14px; }
        .add-form { display: flex; gap: 10px; flex-wrap: wrap; }
        .add-form input { flex: 1; min-width: 160px; background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: 8px; padding: 9px 12px; color: var(--text-primary); font-size: 0.86rem; }
        .add-form input:focus { border-color: var(--accent-wolf); }
        .err { color: #ef8a7c; font-size: 0.84rem; margin-top: 10px; }
        .ok { color: var(--accent-village); font-size: 0.84rem; margin-top: 10px; }
        .bl-list { display: flex; flex-direction: column; gap: 8px; }
        .bl-row { display: flex; justify-content: space-between; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 12px 16px; flex-wrap: wrap; }
        .bl-name { font-weight: 600; margin-right: 8px; }
        .bl-id { color: var(--text-muted); font-size: 0.78rem; margin-right: 10px; }
        .bl-reason { color: var(--text-secondary); font-size: 0.84rem; display: block; margin-top: 2px; }
        .bl-meta { color: var(--text-muted); font-size: 0.74rem; display: block; margin-top: 4px; }
      `}</style>
    </div>
  );
}
