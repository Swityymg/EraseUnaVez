import React, { useState } from "react";
import Inicio from "./screens/Inicio";
import CatalogoCrearIA from "./screens/CatalogoCrearIA";
import Biblioteca from "./screens/Biblioteca";
import Perfil from "./screens/Perfil";
import Login from "./screens/Login";
import Splash from "./screens/Splash2";
import PaginaCuento from "./screens/PaginaCuento";
import Settings from "./screens/settings";

type Route =
  | "splash"
  | "home"
  | "catalogo"
  | "perfil"
  | "biblioteca"
  | "login"
  | "paginaCuento"
  | "settings";

type User = { id: string; name: string; email: string } | null;

export default function App() {
  const [route, setRoute] = useState<Route>("splash");
  const [user, setUser] = useState<User>(null);
  const [showSplash, setShowSplash] = useState(false);

  // Aquí guardamos el ID del cuento que el usuario quiere leer
  const [selectedId, setSelectedId] = useState<string>("");

  const [selectedOrigin, setSelectedOrigin] = useState<string>("home");

  React.useEffect(() => {
    const timer = setTimeout(() => setRoute("home"), 2000); // 2 segundos
    return () => clearTimeout(timer);
  }, []);

  if (showSplash) return <Splash />;

  function signIn(email: string) {
    const name = email.split("@")[0] || email;
    setUser({ id: String(Date.now()), name, email });
    setRoute("home");
  }

  function signOut() {
    setUser(null);
    setRoute("home");
  }

  const handleNavigate = (newRoute: string, params?: { idCuento: string }) => {
    if (params && params.idCuento) {
      setSelectedId(params.idCuento);
    }
    setRoute(newRoute as Route);
  };

  const isAuthenticated = !!user;

  switch (route) {
    case "splash":
      return <Splash />;
    case "home":
      return <Inicio onNavigate={handleNavigate} activeRoute={route} />;
    case "catalogo":
      return (
        <CatalogoCrearIA
          onBack={() => setRoute("home")}
          onNavigate={handleNavigate}
          activeRoute={route}
          isAuthenticated={isAuthenticated}
        />
      );
    case "biblioteca":
      return (
        <Biblioteca
          onNavigate={handleNavigate}
          activeRoute={route}
          isAuthenticated={isAuthenticated}
        />
      );
    case "perfil":
      return (
        <Perfil user={user} onSignOut={signOut} onNavigate={handleNavigate} />
      );
    case "login":
      return (
        <Login
          onSignIn={(email: string) => signIn(email)}
          onNavigate={handleNavigate}
        />
      );

    case "paginaCuento":
      return (
        <PaginaCuento
          idCuento={selectedId} // Le pasamos el ID guardado
          onNavigate={handleNavigate}
        />
      );
    case "settings":
      return (
        <Settings onNavigate={handleNavigate} 
          onSignOut={signOut}/>
      )

    default:
      return (
        <Inicio onNavigate={(r: any) => setRoute(r)} activeRoute={route} />
      );
  }
}
