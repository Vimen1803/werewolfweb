import SignInButton from '../../components/SignInButton';

export default function NotAdmin({ loggedIn }) {
  return (
    <main className="main-content" style={{ maxWidth: 480, textAlign: 'center', paddingTop: '6rem' }}>
      <h1 className="page-title">{loggedIn ? 'No tienes permiso aquí' : 'Inicia sesión para continuar'}</h1>
      <p className="page-subtitle">
        {loggedIn
          ? 'Necesitas el permiso de Administrador de Discord en este servidor (o ser Gestionar Servidor) para acceder a este panel.'
          : 'Conecta tu cuenta de Discord para comprobar tus permisos en este servidor.'}
      </p>
      {!loggedIn && <SignInButton className="btn btn-primary">Iniciar con Discord</SignInButton>}
    </main>
  );
}
