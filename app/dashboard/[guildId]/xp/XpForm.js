'use client';

import { useEffect, useState } from 'react';
import { ROLE_XP_ACTIONS } from '@/lib/data/xpConfig';

export default function XpForm({ guildId }) {
  const [cfg, setCfg] = useState(null);
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMsg, setErrorMsg] = useState('');
  const [newLevel, setNewLevel] = useState('');
  const [newRole, setNewRole] = useState('');

  // Estados para Multiplicadores de Rol y Eventos
  const [newMultRole, setNewMultRole] = useState('');
  const [newMultValue, setNewMultValue] = useState('1.5');
  const [eventNameInput, setEventNameInput] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [cfgRes, rolesRes] = await Promise.all([
          fetch(`/api/guild/${guildId}/xp`),
          fetch(`/api/guild/${guildId}/roles`),
        ]);
        setCfg(await cfgRes.json());
        setRoles(await rolesRes.json());
        setStatus('ready');
      } catch {
        setStatus('error');
        setErrorMsg('No se pudo cargar la configuración de XP.');
      }
    })();
  }, [guildId]);

  function set(key, value) {
    setCfg((c) => ({ ...c, [key]: value }));
  }

  function addLevelRole() {
    const lvl = Number(newLevel);
    if (!lvl || lvl < 1 || !newRole) return;
    setCfg((c) => ({ ...c, level_roles: { ...c.level_roles, [String(lvl)]: newRole } }));
    setNewLevel('');
    setNewRole('');
  }

  function removeLevelRole(lvl) {
    setCfg((c) => {
      const copy = { ...c.level_roles };
      delete copy[lvl];
      return { ...c, level_roles: copy };
    });
  }

  function addRoleMultiplier() {
    const val = Number(newMultValue);
    if (!newMultRole || !val || val <= 0) return;
    setCfg((c) => ({
      ...c,
      role_multipliers: { ...(c.role_multipliers || {}), [newMultRole]: val },
    }));
    setNewMultRole('');
    setNewMultValue('1.5');
  }

  function removeRoleMultiplier(roleId) {
    setCfg((c) => {
      const copy = { ...(c.role_multipliers || {}) };
      delete copy[roleId];
      return { ...c, role_multipliers: copy };
    });
  }

  async function handleStartEvent() {
    if (!eventNameInput.trim()) return;
    try {
      const res = await fetch(`/api/guild/${guildId}/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'start_event', eventName: eventNameInput.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setCfg((c) => ({ ...c, active_event: data.event }));
        setEventNameInput('');
        setActionMsg('⚡ Evento iniciado correctamente.');
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch {
      setErrorMsg('No se pudo iniciar el evento.');
    }
  }

  async function handleEndEvent() {
    try {
      const res = await fetch(`/api/guild/${guildId}/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'end_event' }),
      });
      const data = await res.json();
      if (data.success) {
        setCfg((c) => ({ ...c, active_event: null }));
        setActionMsg('✅ Evento finalizado.');
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch {
      setErrorMsg('No se pudo finalizar el evento.');
    }
  }

  async function handleResetWeekly() {
    if (!confirm('¿Seguro que quieres reiniciar la XP semanal de todos los jugadores?')) return;
    try {
      const res = await fetch(`/api/guild/${guildId}/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_weekly' }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`📅 Se ha reseteado la XP semanal de ${data.count} jugadores.`);
        setTimeout(() => setActionMsg(''), 3000);
      }
    } catch {
      setErrorMsg('No se pudo reiniciar la XP semanal.');
    }
  }

  async function handleResetGlobal() {
    if (!confirm('⚠️ ¿ATENCIÓN: Seguro que quieres reiniciar la XP GLOBAL de TODOS los jugadores del servidor a 0? Esta acción no se puede deshacer.')) return;
    try {
      const res = await fetch(`/api/guild/${guildId}/xp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset_global' }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMsg(`💥 Se ha reiniciado la XP Global de ${data.count} jugadores a 0.`);
        setTimeout(() => setActionMsg(''), 4000);
      }
    } catch {
      setErrorMsg('No se pudo reiniciar la XP Global.');
    }
  }

  async function save() {
    setStatus('saving');
    try {
      const res = await fetch(`/api/guild/${guildId}/xp`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) throw new Error();
      setCfg(await res.json());
      setStatus('saved');
      setTimeout(() => setStatus('ready'), 1800);
    } catch {
      setStatus('error');
      setErrorMsg('No se pudo guardar. Inténtalo de nuevo.');
    }
  }

  if (status === 'loading' || !cfg) return <p className="loading">Cargando configuración de XP…</p>;

  const roleName = (id) => roles.find((r) => r.id === id)?.name || id;

  return (
    <div className="form-wrap">
      {actionMsg && <div className="action-banner">{actionMsg}</div>}

      {/* Sistema de XP y Logros */}
      <div className="card block">
        <div className="row-between">
          <h3>Sistema de XP</h3>
          <Toggle checked={cfg.pts_enabled ?? true} onChange={(v) => set('pts_enabled', v)} label={cfg.pts_enabled ? 'Activado' : 'Desactivado'} />
        </div>
        <div className="row-between" style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <h3 style={{ fontSize: '0.95rem' }}>🏆 Sistema de Logros por Servidor</h3>
            <p className="hint" style={{ margin: '2px 0 0' }}>
              Si están activados, al completar un logro te sumará la XP y te avisará por MD. Si están desactivados, el progreso se contará pero no dará XP ni avisará por MD.
            </p>
          </div>
          <Toggle checked={cfg.achievements_enabled ?? true} onChange={(v) => set('achievements_enabled', v)} label={cfg.achievements_enabled ? 'Activado' : 'Desactivado'} />
        </div>

        <div className="pts-grid" style={{ marginTop: 18 }}>
          <Field label="Victoria normal (XP)"><input type="number" value={cfg.pts_victory} onChange={(e) => set('pts_victory', Number(e.target.value))} /></Field>
          <Field label="Victoria especial (Solitario/Amantes)"><input type="number" value={cfg.pts_special_victory} onChange={(e) => set('pts_special_victory', Number(e.target.value))} /></Field>
          <Field label="Por ronda sobrevivida"><input type="number" value={cfg.pts_round_alive} onChange={(e) => set('pts_round_alive', Number(e.target.value))} /></Field>
          <Field label="Supervivencia final"><input type="number" value={cfg.pts_survive_end} onChange={(e) => set('pts_survive_end', Number(e.target.value))} /></Field>
        </div>
      </div>

      {/* Multiplicadores de XP */}
      <div className="card block">
        <h3>⚡ Multiplicadores de XP</h3>
        <p className="hint">Los multiplicadores afectan únicamente a la XP Global acumulada. La XP semanal y de evento se mantiene siempre en 1.0x.</p>
        <div style={{ maxWidth: 220, marginBottom: 16 }}>
          <Field label="Multiplicador General del Servidor">
            <input type="number" step="0.1" min="0.1" value={cfg.xp_multiplier ?? 1.0} onChange={(e) => set('xp_multiplier', Number(e.target.value))} />
          </Field>
        </div>

        <h4 style={{ fontSize: '0.9rem', marginTop: 14 }}>Multiplicadores por Roles de Discord</h4>
        <div className="level-roles-list" style={{ marginTop: 8 }}>
          {Object.keys(cfg.role_multipliers || {}).length === 0 && <p className="hint">No hay multiplicadores por rol configurados.</p>}
          {Object.entries(cfg.role_multipliers || {}).map(([rid, mult]) => (
            <div key={rid} className="lr-row">
              <span>@{roleName(rid)}</span>
              <span className="pill">{mult}x XP</span>
              <button className="btn btn-ghost btn-sm" onClick={() => removeRoleMultiplier(rid)}>Quitar</button>
            </div>
          ))}
        </div>

        <div className="add-row">
          <select value={newMultRole} onChange={(e) => setNewMultRole(e.target.value)}>
            <option value="">— Elige un rol —</option>
            {roles.map((r) => <option key={r.id} value={r.id}>@{r.name}</option>)}
          </select>
          <input type="number" step="0.1" min="0.1" placeholder="Ej: 1.5" value={newMultValue} onChange={(e) => setNewMultValue(e.target.value)} style={{ width: 90 }} />
          <button className="btn btn-ghost btn-sm" onClick={addRoleMultiplier}>+ Añadir Multiplicador</button>
        </div>
      </div>

      {/* Eventos y Clasificación Semanal */}
      <div className="card block">
        <h3>🎉 Eventos Especiales de XP</h3>
        {cfg.active_event && cfg.active_event.active ? (
          <div style={{ background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.3)', padding: 14, borderRadius: 8, marginTop: 10 }}>
            <div style={{ fontWeight: 700, color: '#eab308' }}>⚡ Evento Activo: {cfg.active_event.name}</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 4 }}>Iniciado el: {new Date(cfg.active_event.start_date).toLocaleString()}</div>
            <button className="btn btn-ghost btn-sm" onClick={handleEndEvent} style={{ marginTop: 10, color: '#ef8a7c' }}>Finalizar Evento Activo</button>
          </div>
        ) : (
          <div className="add-row" style={{ marginTop: 10 }}>
            <input type="text" placeholder="Nombre del evento (ej: Evento Verano 2x)" value={eventNameInput} onChange={(e) => setEventNameInput(e.target.value)} style={{ flex: 1 }} />
            <button className="btn btn-ghost btn-sm" onClick={handleStartEvent}>⚡ Iniciar Evento</button>
          </div>
        )}

        <div style={{ marginTop: 22, paddingTop: 16, borderTop: '1px solid var(--border-subtle)' }}>
          <h3>📅 Reinicio de Clasificaciones y XP</h3>
          <p className="hint">Gestiona los reseteos de XP semanal y XP global para los jugadores del servidor.</p>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <button className="btn btn-ghost btn-sm" onClick={handleResetWeekly} style={{ color: '#eab308' }}>🔄 Reiniciar Clasificación Semanal</button>
            <button className="btn btn-ghost btn-sm" onClick={handleResetGlobal} style={{ color: '#ef8a7c' }}>💥 Reiniciar XP Global del Servidor</button>
          </div>
        </div>
      </div>

      {/* XP por acciones de rol (Desplegable cerrado por defecto) */}
      <details className="card block" style={{ cursor: 'pointer' }}>
        <summary style={{ outline: 'none', userSelect: 'none', listStyle: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ margin: 0 }}>▶ Configurar XP por acciones de rol</h3>
            <span className="pill">Desplegar</span>
          </div>
          <p className="hint" style={{ marginTop: 6, marginBottom: 0 }}>
            Valores positivos suman XP, negativos restan. Se aplican al terminar la partida según lo que haya hecho cada jugador.
          </p>
        </summary>
        <div className="actions-table" style={{ marginTop: 14 }}>
          {ROLE_XP_ACTIONS.map((a) => (
            <div key={a.key} className="action-row">
              <span className="a-role">{a.role}</span>
              <span className="a-label">{a.label}</span>
              <input type="number" value={cfg[a.key]} onChange={(e) => set(a.key, Number(e.target.value))} />
            </div>
          ))}
        </div>
      </details>

      {/* Roles de rango por nivel */}
      <div className="card block">
        <h3>Roles de rango por nivel</h3>
        <p className="hint">Al alcanzar el nivel indicado, el bot asigna ese rol y retira el rango anterior.</p>

        {Object.keys(cfg.level_roles || {}).length === 0 && <p className="hint">Todavía no hay ninguno configurado.</p>}

        <div className="level-roles-list">
          {Object.entries(cfg.level_roles || {}).sort((a, b) => Number(a[0]) - Number(b[0])).map(([lvl, roleId]) => (
            <div key={lvl} className="lr-row">
              <span className="pill">Nivel {lvl}</span>
              <span>@{roleName(roleId)}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => removeLevelRole(lvl)}>Quitar</button>
            </div>
          ))}
        </div>

        <div className="add-row">
          <input type="number" min="1" placeholder="Nivel" value={newLevel} onChange={(e) => setNewLevel(e.target.value)} />
          <select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
            <option value="">— Elige un rol —</option>
            {roles.map((r) => <option key={r.id} value={r.id}>@{r.name}</option>)}
          </select>
          <button className="btn btn-ghost btn-sm" onClick={addLevelRole}>+ Añadir</button>
        </div>
      </div>

      <div className="save-bar">
        <button className="btn btn-primary" onClick={save} disabled={status === 'saving'}>
          {status === 'saving' ? 'Guardando…' : status === 'saved' ? '✅ Guardado' : 'Guardar cambios'}
        </button>
        {status === 'error' && <span className="err">{errorMsg}</span>}
      </div>

      <style>{`
        .loading { color: var(--text-secondary); padding: 60px 0; text-align: center; }
        .action-banner { background: rgba(34, 197, 94, 0.15); border: 1px solid rgba(34, 197, 94, 0.4); color: #4ade80; padding: 12px 16px; border-radius: 8px; margin-bottom: 14px; font-size: 0.9rem; }
        .block { padding: 22px 24px; margin-bottom: 16px; }
        .block h3 { font-size: 1rem; }
        .row-between { display: flex; justify-content: space-between; align-items: center; }
        .hint { color: var(--text-muted); font-size: 0.8rem; margin: 8px 0 14px; }
        .pts-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        .actions-table { display: flex; flex-direction: column; gap: 2px; }
        .action-row { display: grid; grid-template-columns: 140px 1fr 90px; align-items: center; gap: 12px; padding: 8px 0; border-bottom: 1px solid var(--border-subtle); font-size: 0.85rem; }
        .action-row:last-child { border-bottom: none; }
        .a-role { font-weight: 600; }
        .a-label { color: var(--text-secondary); }
        .level-roles-list { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
        .lr-row { display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.03); border-radius: 8px; padding: 8px 12px; font-size: 0.86rem; }
        .lr-row span:nth-child(2) { flex: 1; }
        .add-row { display: flex; gap: 10px; }
        .add-row input { width: 90px; }
        .save-bar { position: sticky; bottom: 20px; display: flex; align-items: center; gap: 16px; margin-top: 12px; }
        .err { color: #ef8a7c; font-size: 0.85rem; }
        input, select { background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: 8px; padding: 9px 12px; color: var(--text-primary); font-size: 0.86rem; }
        input:focus, select:focus { border-color: var(--accent-wolf); }
        @media (max-width: 700px) {
          .pts-grid { grid-template-columns: 1fr 1fr; }
          .action-row { grid-template-columns: 1fr; gap: 4px; }
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}
      <style jsx>{`
        .field { display: flex; flex-direction: column; gap: 6px; font-size: 0.82rem; color: var(--text-secondary); }
      `}</style>
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
      <style jsx>{`
        .toggle { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; cursor: pointer; }
        .toggle input { width: 16px; height: 16px; accent-color: var(--accent-wolf); }
      `}</style>
    </label>
  );
}

