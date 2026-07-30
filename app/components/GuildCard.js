import Link from 'next/link';

export default function GuildCard({ guild, session }) {
  const initials = guild.name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  const inner = (
    <>
      <div className="icon">
        {guild.icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={guild.icon} alt="" />
        ) : (
          <span>{initials}</span>
        )}
      </div>
      <h3>{guild.name}</h3>
      {guild.role === 'admin' && <span className="badge badge-admin">Admin</span>}
      {guild.role === 'member' && <span className="badge badge-member">Miembro</span>}
      {guild.role === 'invite' && <span className="badge badge-invite">Click para invitar Bot</span>}
    </>
  );

  if (guild.role === 'invite') {
    return <Link href="/proximamente" className="card guild-card">{inner}</Link>;
  }
  return (
    <Link href={`/dashboard/${guild.id}`} className="card guild-card">
      {inner}
    </Link>
  );
}
