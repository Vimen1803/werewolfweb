export const metadata = { title: 'Política de Privacidad — Werewolf Bot' };

const SECTIONS = [
  {
    title: '1. Información que recopilamos',
    text: 'Werewolf Bot y su panel web recopilan únicamente la información necesaria para el funcionamiento del juego y la administración del servidor: tu ID de Discord, nombre de usuario, avatar, los IDs de los servidores en los que juegas o administras, y las estadísticas de juego (partidas jugadas, victorias, XP y logros).',
  },
  {
    title: '2. Uso de la información',
    text: 'La información recopilada se utiliza exclusivamente para: procesar las mecánicas del juego de Hombres Lobo, calcular el nivel de XP y logros, generar tablas de clasificación globales/semanales, mantener la configuración del servidor y gestionar permisos de administración en el panel web.',
  },
  {
    title: '3. Autenticación y Tokens OAuth2',
    text: 'El inicio de sesión mediante Discord OAuth2 utiliza los permisos estrictamente necesarios (identificación pública y lista de servidores). Los tokens de acceso se almacenan de forma segura en cookies de sesión encriptadas y nunca se comparten con terceros.',
  },
  {
    title: '4. Almacenamiento y Protección de Datos',
    text: 'Toda la información se almacena en bases de datos protegidas con acceso restringido. No vendemos, alquilamos ni compartimos tus datos personales con ninguna empresa o entidad externa.',
  },
  {
    title: '5. Eliminación de Datos',
    text: 'Los usuarios pueden solicitar la eliminación completa de sus datos y estadísticas almacenadas en Werewolf Bot en cualquier momento contactando con la administración del bot a través del servidor oficial o la web.',
  },
];

export default function PrivacyPage() {
  return (
    <main className="main-content" style={{ maxWidth: 760, paddingBottom: '4rem' }}>
      <h1 className="page-title">Política de Privacidad</h1>
      <p className="page-subtitle">Última actualización: {new Date().getFullYear()}</p>

      {SECTIONS.map((s) => (
        <div key={s.title} className="card fade-in" style={{ marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.1rem', marginBottom: 10 }}>{s.title}</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.65 }}>{s.text}</p>
        </div>
      ))}
    </main>
  );
}
