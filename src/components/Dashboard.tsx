import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Package, Wrench, Users, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import { Badge } from './ui/badge';
import { getData } from '../utils/localStorage';

export function Dashboard() {
  const [materiales, setMateriales] = useState<any[]>([]);
  const [herramientas, setHerramientas] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [movimientos, setMovimientos] = useState<any[]>([]);

  useEffect(() => {
    setMateriales(getData('materiales'));
    setHerramientas(getData('herramientas'));
    setTecnicos(getData('tecnicos'));
    setMovimientos(getData('movimientos'));
  }, []);

  const materialesBajoStock = materiales.filter(m => m.stock_actual < m.stock_minimo);
  const ultimosMovimientos = movimientos.slice(0, 5);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-black mb-2">Panel Principal</h1>
        <p className="text-gray-600">Resumen general del inventario</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Total Materiales</CardTitle>
            <Package className="h-8 w-8 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-black">{materiales.length}</span>
              <TrendingUp className="h-4 w-4 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Registrados en sistema</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Total Herramientas</CardTitle>
            <Wrench className="h-8 w-8 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-black">{herramientas.length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">En inventario</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Técnicos Activos</CardTitle>
            <Users className="h-8 w-8 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-black">{tecnicos.length}</span>
            </div>
            <p className="text-xs text-gray-500 mt-2">Personal registrado</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500 hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-gray-600">Alertas Stock Bajo</CardTitle>
            <AlertTriangle className="h-8 w-8 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-black">{materialesBajoStock.length}</span>
              <TrendingDown className="h-4 w-4 text-red-500" />
            </div>
            <p className="text-xs text-red-600 mt-2">Requieren reposición</p>
          </CardContent>
        </Card>
      </div>

      {/* Alertas de Stock Bajo */}
      {materialesBajoStock.length > 0 && (
        <Alert className="border-red-500 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <span>Hay {materialesBajoStock.length} materiales con stock por debajo del mínimo. Revisa el módulo de materiales para más detalles.</span>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Materiales con Stock Bajo */}
        <Card className="border-t-4 border-t-yellow-500">
          <CardHeader>
            <CardTitle className="text-black">Materiales con Stock Bajo</CardTitle>
          </CardHeader>
          <CardContent>
            {materialesBajoStock.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay materiales con stock bajo</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-yellow-500 hover:bg-yellow-500">
                    <TableHead className="text-black">Material</TableHead>
                    <TableHead className="text-black">Actual</TableHead>
                    <TableHead className="text-black">Mínimo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {materialesBajoStock.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.nombre}</TableCell>
                      <TableCell>
                        <span className="text-red-600">
                          {item.stock_actual} {item.unidad_medida}
                        </span>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {item.stock_minimo} {item.unidad_medida}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Últimos Movimientos */}
        <Card className="border-t-4 border-t-yellow-500">
          <CardHeader>
            <CardTitle className="text-black">Últimos Movimientos</CardTitle>
          </CardHeader>
          <CardContent>
            {ultimosMovimientos.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No hay movimientos registrados</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-yellow-500 hover:bg-yellow-500">
                    <TableHead className="text-black">Tipo</TableHead>
                    <TableHead className="text-black">Item</TableHead>
                    <TableHead className="text-black">Fecha</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ultimosMovimientos.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell>
                        <Badge 
                          className={
                            mov.tipo === 'entrada' 
                              ? 'bg-green-100 text-green-800' 
                              : mov.tipo === 'salida'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }
                        >
                          {mov.tipo === 'entrada' ? 'Entrada' : mov.tipo === 'salida' ? 'Salida' : 'Devolución'}
                        </Badge>
                      </TableCell>
                      <TableCell>{mov.item}</TableCell>
                      <TableCell className="text-gray-600">{mov.fecha}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
