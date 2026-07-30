import Link from 'next/link';

const COLUMNS = [
  {
    title: 'Navegación',
    links: [
      { href: '/doc', label: 'Inicio' },
      { href: '/doc/roles', label: 'Roles' },
      { href: '/doc/comandos', label: 'Comandos' },
      { href: '/doc/presets', label: 'Presets' },
    ],
  },
  {
    title: 'Documentación',
    links: [
      { href: '/doc/xp', label: 'XP & Logros' },
      { href: '/doc/changelog', label: 'Cambios' },
      { href: '/dashboard', label: 'Dashboard' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { href: '/tos', label: 'Términos de servicio' },
      { href: '/privacy', label: 'Política de privacidad' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <div className="footer-brand-name">🐺 Werewolf Bot</div>
          <p>
            El bot de Pueblo Duerme (Hombres Lobo) más completo para Discord: roles, presets
            dinámicos y un sistema de niveles por servidor.
          </p>
        </div>

        <div className="footer-cols">
          {COLUMNS.map((col) => (
            <div key={col.title} className="footer-col">
              <h4>{col.title}</h4>
              {col.links.map((l) => (
                <Link key={l.href} href={l.href}>{l.label}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Werewolf Bot. Todos los derechos reservados.
      </div>
    </footer>
  );
}
