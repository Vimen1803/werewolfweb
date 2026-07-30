import { redirect } from 'next/navigation';

// La home page ya no existe como página separada: la portada del sitio
// es la propia documentación (/doc). Se mantiene esta ruta solo para
// redirigir cualquier enlace o marcador antiguo a "/".
export default function RootPage() {
  redirect('/doc');
}
