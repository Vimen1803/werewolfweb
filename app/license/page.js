export const metadata = { title: 'Licencia — Werewolf Bot' };

export default function LicensePage() {
  return (
    <main className="main-content" style={{ maxWidth: 760 }}>
      <h1 className="page-title">Licencia</h1>
      <p className="page-subtitle">Última actualización: {new Date().getFullYear()}</p>

      <div className="card fade-in" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 10 }}>1. Uso del bot</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Werewolf Bot se ofrece "tal cual", de forma gratuita, para su uso en servidores de Discord.
          El desarrollador no garantiza disponibilidad continua ni ausencia de errores, y puede
          modificar o retirar funciones del bot en cualquier momento.
        </p>
      </div>

      <div className="card fade-in" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 10 }}>2. Código y marca</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          El nombre "Werewolf Bot", su identidad visual y el contenido de esta web pertenecen a su
          desarrollador. No está permitido revender el bot, redistribuir su código sin permiso, ni
          presentarlo como propio en otra plataforma.
        </p>
      </div>

      <div className="card fade-in" style={{ marginBottom: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 10 }}>3. Datos almacenados</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          El bot almacena únicamente los datos necesarios para su funcionamiento: identificadores de
          servidor y usuario de Discord, configuración del servidor, y estadísticas de partidas (XP,
          victorias, roles jugados). No se recopila contenido de mensajes fuera de los comandos usados.
        </p>
      </div>

      <div className="card fade-in">
        <h2 style={{ fontSize: '1.1rem', marginBottom: 10 }}>4. Sin garantías</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          En la máxima medida permitida por la ley, el desarrollador no será responsable de daños
          derivados del uso o la imposibilidad de uso del bot o de esta web.
        </p>
      </div>
    </main>
  );
}
