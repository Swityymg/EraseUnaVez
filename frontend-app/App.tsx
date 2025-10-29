import React, { useState } from 'react';
import Inicio from './screens/Inicio';
import CatalogoCrearIA from './screens/CatalogoCrearIA';
import Biblioteca from './screens/Biblioteca';
import Perfil from './screens/Perfil';
import Login from './screens/Login';

type Route = 'home' | 'catalogo' | 'perfil' | 'biblioteca' | 'login';

type User = { id: string; name: string; email: string } | null;

export default function App() {
  const [route, setRoute] = useState<Route>('home');
  const [user, setUser] = useState<User>(null);

  function signIn(email: string) {
    // inicio simulado: crear usuario usando la parte del email como nombre
    const name = email.split('@')[0] || email;
    setUser({ id: String(Date.now()), name, email });
    // después de iniciar, volver a Inicio
    setRoute('home');
  }

  function signOut() {
    setUser(null);
    setRoute('home');
  }

  const isAuthenticated = !!user;

  switch (route) {
    case 'home':
      return <Inicio onNavigate={(r: any) => setRoute(r)} activeRoute={route} />;
    case 'catalogo':
      return (
        <CatalogoCrearIA
          onBack={() => setRoute('home')}
          onNavigate={(r: any) => setRoute(r)}
          activeRoute={route}
          isAuthenticated={isAuthenticated}
        />
      );
    case 'biblioteca':
      return <Biblioteca onNavigate={(r: any) => setRoute(r)} activeRoute={route} isAuthenticated={isAuthenticated} />;
    case 'perfil':
      return <Perfil user={user} onSignOut={signOut} onNavigate={(r: any) => setRoute(r)} />;
    case 'login':
      return <Login onSignIn={(email: string) => signIn(email)} onNavigate={(r: any) => setRoute(r)} />;
    
    default:
  return <Inicio onNavigate={(r: any) => setRoute(r)} activeRoute={route} />;
  }
}

