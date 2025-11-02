import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Network, AlertCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface LoginProps {
  onLogin: (success: boolean) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validación con localStorage
      const usuarios = JSON.parse(localStorage.getItem('usuarios') || '[]');
      const user = usuarios.find((u: any) => u.usuario === usuario && u.password === password);
      
      setTimeout(() => {
        if (user) {
          toast.success('Inicio de sesión exitoso');
          localStorage.setItem('currentUser', JSON.stringify(user));
          onLogin(true);
        } else {
          setError('Credenciales incorrectas');
          setLoading(false);
        }
      }, 500);
    } catch (err) {
      setError('Error al validar credenciales');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-neutral-900 border-yellow-500 border-2">
        <CardHeader className="space-y-4 text-center">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-yellow-500 flex items-center justify-center">
              <Network className="w-12 h-12 text-black" />
            </div>
          </div>
          <CardTitle className="text-yellow-500">Sistema de Inventario</CardTitle>
          <CardDescription className="text-gray-300">
            Instalaciones y Servicios de Redes y Telecomunicaciones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="usuario" className="text-gray-200">Usuario</Label>
              <Input
                id="usuario"
                type="text"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                className="bg-neutral-800 border-gray-600 text-white placeholder:text-gray-500"
                placeholder="Ingrese su usuario"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-gray-200">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-neutral-800 border-gray-600 text-white placeholder:text-gray-500"
                placeholder="Ingrese su contraseña"
                required
              />
            </div>
            
            {error && (
              <div className="flex items-center gap-2 text-red-500 bg-red-950 p-3 rounded">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black transition-all hover:shadow-lg"
              disabled={loading}
            >
              {loading ? 'Ingresando...' : 'Iniciar Sesión'}
            </Button>

            <p className="text-xs text-center text-gray-400 mt-4">
              Demo: usuario: admin / contraseña: admin
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
