export const metadata = { title: 'Términos de servicio — Werewolf Bot' };

const SECTIONS = [
  { title: '1. Aceptación', text: 'Al invitar a Werewolf Bot a tu servidor o al iniciar sesión con Discord en esta web, aceptas estos términos. Si no estás de acuerdo, no uses el bot ni el panel web.' },
  { title: '2. Inicio de sesión con Discord', text: 'El panel web usa el OAuth2 de Discord únicamente para identificarte y comprobar en qué servidores tienes permisos de Administrador o Gestionar Servidor. No accedemos a tus mensajes privados ni publicamos nada en tu nombre.' },
  { title: '4. Administradores de servidor', text: 'Al obtener acceso de Administrador en el panel, puedes modificar la configuración, el sistema de XP y la blacklist de tu servidor. Eres responsable del uso que hagas de esos permisos dentro de tu propia comunidad.' },
  { title: '5. Disponibilidad', text: 'El bot y la web pueden sufrir caídas o mantenimientos sin previo aviso. No se garantiza la conservación indefinida de estadísticas ni configuraciones.' },
];

export default function TosPage() {
  return (
    <main className="main-content" style={{ maxWidth: 760 }}>
      <h1 className="page-title">Términos de servicio</h1>
      <p className="page-subtitle">Última actualización: {new Date().getFullYear()}</p>

      {SECTIONS.map((s) => (
        <div key={s.title} className="card fade-in" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 10 }}>{s.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>{s.text}</p>
        </div>
      ))}

      <div className="card fade-in">
        <h2 style={{ fontSize: '1.1rem', marginBottom: 10 }}>3. Normas de uso</h2>
        <ul style={{ paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 6, color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          <li>No está permitido usar el bot para acosar, discriminar o amenazar a otros usuarios.</li>
          <li>No está permitido explotar errores del bot para obtener XP o ventajas de forma ilegítima.</li>
          <li>El desarrollador puede bloquear (blacklist) a cualquier usuario que incumpla estas normas.</li>
        </ul>
      </div>

      <div className="card fade-in" style={{ marginTop: '1.25rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 10 }}>6. Cambios en estos términos</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
          Estos términos pueden actualizarse; los cambios relevantes se anunciarán en el{' '}
          <a href="/doc/changelog">changelog</a>.
        </p>
      </div>
    </main>
  );
}
