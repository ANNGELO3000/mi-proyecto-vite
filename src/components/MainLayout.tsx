import { ReactNode } from 'react';
import { 
  Package, 
  Wrench, 
  MapPin, 
  Users, 
  Store, 
  FolderKanban, 
  ArrowLeftRight, 
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Network
} from 'lucide-react';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface MainLayoutProps {
  children: ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
  onLogout: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'materiales', label: 'Materiales', icon: Package },
  { id: 'herramientas', label: 'Herramientas', icon: Wrench },
  { id: 'ubicaciones', label: 'Ubicaciones', icon: MapPin },
  { id: 'tecnicos', label: 'Técnicos', icon: Users },
  { id: 'proveedores', label: 'Proveedores', icon: Store },
  { id: 'proyectos', label: 'Proyectos', icon: FolderKanban },
  { id: 'movimientos', label: 'Movimientos', icon: ArrowLeftRight },
  { id: 'asignaciones', label: 'Asignaciones', icon: ClipboardList },
];

export function MainLayout({ children, currentView, setCurrentView, onLogout }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-neutral-100">
      {/* Sidebar */}
      <aside className="w-64 bg-black border-r border-yellow-500">
        <div className="p-6 border-b border-yellow-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
              <Network className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="text-yellow-500">Inventario</h1>
              <p className="text-xs text-gray-400">Redes y Telecom</p>
            </div>
          </div>
        </div>

        <ScrollArea className="h-[calc(100vh-200px)]">
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start ${
                    isActive 
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600 hover:text-black' 
                      : 'text-gray-300 hover:bg-neutral-900 hover:text-yellow-500'
                  }`}
                  onClick={() => setCurrentView(item.id)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.label}
                </Button>
              );
            })}
          </nav>
        </ScrollArea>

        <div className="absolute bottom-0 w-64 p-4 border-t border-yellow-500 bg-black">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-950 hover:text-red-300"
            onClick={onLogout}
          >
            <LogOut className="mr-3 h-5 w-5" />
            Cerrar Sesión
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
