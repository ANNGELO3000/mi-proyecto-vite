import { useState, useEffect } from 'react';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { Materiales } from './components/Materiales';
import { Herramientas } from './components/Herramientas';
import { Ubicaciones } from './components/Ubicaciones';
import { Tecnicos } from './components/Tecnicos';
import { Proveedores } from './components/Proveedores';
import { Proyectos } from './components/Proyectos';
import { Movimientos } from './components/Movimientos';
import { Asignaciones } from './components/Asignaciones';
import { MainLayout } from './components/MainLayout';
import { Toaster } from './components/ui/sonner';
import { initializeStorage } from './utils/localStorage';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');

  // Inicializar el almacenamiento local al cargar la app
  useEffect(() => {
    initializeStorage();
  }, []);

  const handleLogin = (success: boolean) => {
    setIsLoggedIn(success);
    if (success) {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentView('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'materiales':
        return <Materiales />;
      case 'herramientas':
        return <Herramientas />;
      case 'ubicaciones':
        return <Ubicaciones />;
      case 'tecnicos':
        return <Tecnicos />;
      case 'proveedores':
        return <Proveedores />;
      case 'proyectos':
        return <Proyectos />;
      case 'movimientos':
        return <Movimientos />;
      case 'asignaciones':
        return <Asignaciones />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <>
      <MainLayout 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        onLogout={handleLogout}
      >
        {renderView()}
      </MainLayout>
      <Toaster />
    </>
  );
}
