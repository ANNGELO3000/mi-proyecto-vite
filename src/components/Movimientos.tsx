import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Plus, Search, FileDown, Calendar, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getData, addRecord } from '../utils/localStorage';
import { generarPDFMovimientos } from '../utils/pdfGenerator';

export function Movimientos() {
  const [movimientos, setMovimientos] = useState<any[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  const [herramientas, setHerramientas] = useState<any[]>([]);
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMovimientos(getData('movimientos'));
    setMateriales(getData('materiales'));
    setHerramientas(getData('herramientas'));
    setUbicaciones(getData('ubicaciones'));
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todos');
  const [filterFecha, setFilterFecha] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    tipo: 'entrada',
    fecha: new Date().toISOString().split('T')[0],
    tipo_item: 'material',
    item: '',
    cantidad: 1,
    origen: '',
    destino: '',
    observaciones: ''
  });

  const handleAdd = () => {
    setFormData({
      tipo: 'entrada',
      fecha: new Date().toISOString().split('T')[0],
      tipo_item: 'material',
      item: '',
      cantidad: 1,
      origen: '',
      destino: '',
      observaciones: ''
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    addRecord('movimientos', formData);
    loadData();
    toast.success('Movimiento registrado correctamente');
    setIsDialogOpen(false);
  };

  const filteredMovimientos = movimientos.filter(m => {
    const matchesSearch = m.item.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.origen.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.destino.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'todos' || m.tipo === filterTipo;
    const matchesFecha = !filterFecha || m.fecha === filterFecha;
    return matchesSearch && matchesTipo && matchesFecha;
  });

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case 'entrada':
        return <Badge className="bg-green-100 text-green-800">Entrada</Badge>;
      case 'salida':
        return <Badge className="bg-blue-100 text-blue-800">Salida</Badge>;
      case 'devolucion':
        return <Badge className="bg-yellow-100 text-yellow-800">Devolución</Badge>;
      default:
        return <Badge>{tipo}</Badge>;
    }
  };

  const exportToPDF = () => {
    generarPDFMovimientos(movimientos);
    toast.success('PDF generado correctamente');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-black mb-2">Movimientos de Inventario</h1>
          <p className="text-gray-600">Registro de entradas, salidas y devoluciones</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={exportToPDF}
            variant="outline"
            className="border-yellow-500 text-black hover:bg-yellow-50"
          >
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button 
            onClick={handleAdd}
            className="bg-yellow-500 hover:bg-yellow-600 text-black"
          >
            <Plus className="mr-2 h-4 w-4" />
            Registrar Movimiento
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de movimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="entrada">Entrada</SelectItem>
                <SelectItem value="salida">Salida</SelectItem>
                <SelectItem value="devolucion">Devolución</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={filterFecha}
                onChange={(e) => setFilterFecha(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-yellow-500 hover:bg-yellow-500">
                <TableHead className="text-black">Tipo</TableHead>
                <TableHead className="text-black">Fecha</TableHead>
                <TableHead className="text-black">Item</TableHead>
                <TableHead className="text-black">Cantidad</TableHead>
                <TableHead className="text-black">Origen</TableHead>
                <TableHead className="text-black">Destino</TableHead>
                <TableHead className="text-black">Observaciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovimientos.map((mov) => (
                <TableRow key={mov.id}>
                  <TableCell>{getTipoBadge(mov.tipo)}</TableCell>
                  <TableCell className="text-gray-600">{mov.fecha}</TableCell>
                  <TableCell>
                    <div>
                      <div>{mov.item}</div>
                      <div className="text-xs text-gray-500 capitalize">{mov.tipo_item}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">{mov.cantidad}</TableCell>
                  <TableCell className="text-gray-600">{mov.origen}</TableCell>
                  <TableCell className="text-gray-600">{mov.destino}</TableCell>
                  <TableCell className="text-gray-600 max-w-xs truncate">
                    {mov.observaciones}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Movimiento</DialogTitle>
            <DialogDescription>
              Complete los datos del movimiento de inventario
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Movimiento *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="salida">Salida</SelectItem>
                    <SelectItem value="devolucion">Devolución</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo_item">Tipo de Item *</Label>
                <Select
                  value={formData.tipo_item}
                  onValueChange={(value) => setFormData({ ...formData, tipo_item: value, item: '' })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="material">Material</SelectItem>
                    <SelectItem value="herramienta">Herramienta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="item">Item *</Label>
                <Select
                  value={formData.item}
                  onValueChange={(value) => setFormData({ ...formData, item: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione item" />
                  </SelectTrigger>
                  <SelectContent>
                    {(formData.tipo_item === 'material' ? materiales : herramientas).map((item) => (
                      <SelectItem key={item.id} value={item.nombre}>{item.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="cantidad">Cantidad *</Label>
                <Input
                  id="cantidad"
                  type="number"
                  value={formData.cantidad}
                  onChange={(e) => setFormData({ ...formData, cantidad: parseInt(e.target.value) })}
                  min="1"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="origen">Origen *</Label>
                <Select
                  value={formData.origen}
                  onValueChange={(value) => setFormData({ ...formData, origen: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione origen" />
                  </SelectTrigger>
                  <SelectContent>
                    {ubicaciones.map((ubi) => (
                      <SelectItem key={ubi.id} value={ubi.nombre}>{ubi.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="destino">Destino *</Label>
                <Select
                  value={formData.destino}
                  onValueChange={(value) => setFormData({ ...formData, destino: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione destino" />
                  </SelectTrigger>
                  <SelectContent>
                    {ubicaciones.map((ubi) => (
                      <SelectItem key={ubi.id} value={ubi.nombre}>{ubi.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Notas adicionales sobre el movimiento"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Registrar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
