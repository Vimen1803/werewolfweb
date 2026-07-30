import './globals.css';
import Providers from './components/Providers';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: 'Werewolf Bot — Deducción social para tu Discord',
  description:
    'Werewolf Bot trae el clásico juego de Hombres Lobo a tu servidor de Discord: roles nocturnos, votaciones, niveles y un panel web completo para administrarlo.',
  metadataBase: new URL(process.env.NEXTAUTH_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'Werewolf Bot',
    description: 'Deducción social, roles ocultos y noches de mentiras — directo en tu Discord.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
