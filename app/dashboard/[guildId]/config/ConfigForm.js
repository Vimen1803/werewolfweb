'use client';

import { useEffect, useState } from 'react';

const TIMER_GROUPS = [
  {
    title: 'Discusión y votación',
    fields: [
      { key: 'discussion_duration', label: 'Discusión diurna (s)' },
      { key: 'vote_duration', label: 'Votación (s)' },
      { key: 'slow_discussion_duration', label: 'Discusión en modo pausado (s)' },
    ],
  },
  {
    title: 'Acciones nocturnas',
    fields: [
      { key: 'night_action_timeout', label: 'Acción nocturna (s)' },
      { key: 'wolf_vote_timeout', label: 'Votación de los lobos (s)' },
      { key: 'wolf_decision_timeout', label: 'Decisión del lobo decisor (s)' },
      { key: 'night_countdown', label: 'Cuenta atrás de la noche (s)' },
      { key: 'miron_read_timeout', label: 'Lectura del Mirón (s)' },
      { key: 'saquea_tumbas_decision', label: 'Decisión Saqueatumbas (s)' },
    ],
  },
  {
    title: 'Turnos y decisiones especiales',
    fields: [
      { key: 'hunter_shot_timeout', label: 'Disparo del Cazador (s)' },
      { key: 'judge_decision_timeout', label: 'Decisión del Juez (s)' },
      { key: 'slow_turn_duration', label: 'Turno en modo pausado (s)' },
    ],
  },
  {
    title: 'General',
    fields: [
      { key: 'mention_cooldown', label: 'Cooldown de mención (s)' },
    ],
  },
];

export default function ConfigForm({ guildId, isRealAdmin }) {
  const [cfg, setCfg] = useState(null);
  const [channels, setChannels] = useState([]);
  const [roles, setRoles] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | saving | saved | error
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [cfgRes, chRes, rolesRes] = await Promise.all([
          fetch(`/api/guild/${guildId}/config`),
          fetch(`/api/guild/${guildId}/channels`),
          fetch(`/api/guild/${guildId}/roles`),
        ]);
        setCfg(await cfgRes.json());
        setChannels(await chRes.json());
        setRoles(await rolesRes.json());
        setStatus('ready');
      } catch {
        setStatus('error');
        setErrorMsg('No se pudo cargar la configuración.');
      }
    })();
  }, [guildId]);

  function set(key, value) {
    setCfg((c) => ({ ...c, [key]: value }));
  }

  const [newChannel, setNewChannel] = useState('');

  function addChannel() {
    if (!newChannel) return;
    if (cfg.allowed_channels.includes(newChannel)) return;
    setCfg((c) => ({ ...c, allowed_channels: [...c.allowed_channels, newChannel] }));
    setNewChannel('');
  }

  function removeChannel(id) {
    setCfg((c) => ({ ...c, allowed_channels: c.allowed_channels.filter((x) => String(x) !== String(id)) }));
  }

  async function save() {
    setStatus('saving');
    try {
      const res = await fetch(`/api/guild/${guildId}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cfg),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setCfg(updated);
      setStatus('saved');
      setTimeout(() => setStatus('ready'), 1800);
    } catch {
      setStatus('error');
      setErrorMsg('No se pudo guardar. Inténtalo de nuevo.');
    }
  }

  if (status === 'loading' || !cfg) return <p className="loading">Cargando configuración…</p>;

  return (
    <div className="form-wrap">
      <div className="grid">
        <div className="card block">
          <h3>General</h3>
          <Field label="Prefijo de comandos">
            <input value={cfg.prefix} onChange={(e) => set('prefix', e.target.value)} maxLength={5} />
          </Field>
          <Field label="Canal de anuncios">
            <select value={cfg.canal_anuncios || ''} onChange={(e) => set('canal_anuncios', e.target.value || null)}>
              <option value="">— Ninguno —</option>
              {channels.map((c) => <option key={c.id} value={c.id}>#{c.name}</option>)}
            </select>
          </Field>
          <Field label="Rol de mención (para avisar de partidas)">
            <select value={cfg.mention_role_id || ''} onChange={(e) => set('mention_role_id', e.target.value || null)}>
              <option value="">— Ninguno —</option>
              {roles.map((r) => <option key={r.id} value={r.id}>@{r.name}</option>)}
            </select>
          </Field>
          <Field label="Rol sin XP (no recibe ninguna XP)">
            <select value={cfg.no_xp_role_id || ''} onChange={(e) => set('no_xp_role_id', e.target.value || null)}>
              <option value="">— Ninguno —</option>
              {roles.map((r) => <option key={r.id} value={r.id}>@{r.name}</option>)}
            </select>
          </Field>
          <Field label="Rol de moderación (permisos para gestionar el bot)">
            <select
              value={cfg.mod_role || ''}
              onChange={(e) => set('mod_role', e.target.value || null)}
              disabled={!isRealAdmin}
            >
              <option value="">— Ninguno —</option>
              {roles.map((r) => <option key={r.id} value={r.id}>@{r.name}</option>)}
            </select>
            {!isRealAdmin && <p className="hint" style={{ color: 'var(--text-muted)', marginTop: 4 }}>Solo los administradores reales pueden modificar este rol.</p>}
          </Field>
        </div>

        <div className="card block">
          <h3>Mutes automáticos</h3>
          <Toggle label="Mutear durante la noche" checked={cfg.mute_noche} onChange={(v) => set('mute_noche', v)} />
          <Toggle label="Mutear durante la votación" checked={cfg.mute_votacion} onChange={(v) => set('mute_votacion', v)} />
          <Toggle label="Mutear a los jugadores muertos" checked={cfg.mute_muertos} onChange={(v) => set('mute_muertos', v)} />
        </div>

        <div className="card block span-2">
          <h3>Canales permitidos</h3>
          <p className="hint">Si no seleccionas ninguno, Werewolf funcionará en todos los canales de texto.</p>

          {cfg.allowed_channels.length === 0 ? (
            <p className="hint">Werewolf está permitido en todos los canales de texto.</p>
          ) : (
            <div className="level-roles-list" style={{ marginBottom: 14 }}>
              {cfg.allowed_channels.map((chId) => {
                const ch = channels.find((c) => String(c.id) === String(chId));
                return (
                  <div key={chId} className="lr-row">
                    <span>#{ch ? ch.name : chId}</span>
                    <button className="btn btn-ghost btn-sm" onClick={() => removeChannel(chId)}>Quitar</button>
                  </div>
                );
              })}
            </div>
          )}

          <div className="add-row">
            <select value={newChannel} onChange={(e) => setNewChannel(e.target.value)}>
              <option value="">— Elige un canal —</option>
              {channels
                .filter((c) => !cfg.allowed_channels.includes(c.id) && !cfg.allowed_channels.includes(String(c.id)))
                .map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.name}
                  </option>
                ))}
            </select>
            <button className="btn btn-ghost btn-sm" onClick={addChannel}>+ Añadir canal</button>
          </div>
        </div>

        <div className="card block span-2">
          <h3>Tiempos de partida</h3>
          <div className="timer-groups">
            {TIMER_GROUPS.map((g) => (
              <div key={g.title} className="timer-group">
                <h4>{g.title}</h4>
                <div className="timers-grid">
                  {g.fields.map((f) => (
                    <Field key={f.key} label={f.label}>
                      <input type="number" min="0" value={cfg[f.key]} onChange={(e) => set(f.key, Number(e.target.value))} />
                    </Field>
                  ))}
                </div>
              </div>
            ))}
          </div>
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
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .block { padding: 22px 24px; }
        .block.span-2 { grid-column: span 2; }
        .block h3 { font-size: 1rem; margin-bottom: 16px; }
        .hint { color: var(--text-muted); font-size: 0.8rem; margin-bottom: 12px; }
        .channel-grid { display: flex; flex-wrap: wrap; gap: 8px; }
        .channel-chip { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.04); border: 1px solid var(--border-medium); border-radius: 999px; padding: 6px 14px; font-size: 0.82rem; cursor: pointer; }
        .timer-groups { display: flex; flex-direction: column; gap: 22px; }
        .timer-group h4 { font-size: 0.74rem; text-transform: uppercase; letter-spacing: 0.06em; font-weight: 700; color: var(--accent-wolf); border-bottom: 1px solid var(--border-subtle); padding-bottom: 8px; margin-bottom: 14px; }
        .timers-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 4px 16px; }
        .level-roles-list { display: flex; flex-direction: column; gap: 8px; }
        .lr-row { display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 8px; padding: 8px 14px; font-size: 0.86rem; }
        .add-row { display: flex; gap: 10px; align-items: center; }
        .add-row select { background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: 8px; padding: 9px 12px; color: var(--text-primary); font-size: 0.86rem; max-width: 300px; flex: 1; }
        .save-bar { position: sticky; bottom: 20px; display: flex; align-items: center; gap: 16px; margin-top: 28px; }
        .err { color: #ef8a7c; font-size: 0.85rem; }
        @media (max-width: 900px) {
          .grid { grid-template-columns: 1fr; }
          .block.span-2 { grid-column: span 1; }
          .timers-grid { grid-template-columns: 1fr 1fr; }
          .add-row select { max-width: 100%; }
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
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; font-size: 0.85rem; color: var(--text-secondary); }
        .field :global(input), .field :global(select) {
          background: var(--bg-elevated); border: 1px solid var(--border-medium); border-radius: 8px;
          padding: 9px 12px; color: var(--text-primary); font-size: 0.88rem;
        }
        .field :global(input:focus), .field :global(select:focus) { border-color: var(--accent-wolf); }
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
        .toggle { display: flex; align-items: center; gap: 10px; padding: 8px 0; font-size: 0.88rem; cursor: pointer; }
        .toggle input { width: 16px; height: 16px; accent-color: var(--accent-wolf); }
      `}</style>
    </label>
  );
}
