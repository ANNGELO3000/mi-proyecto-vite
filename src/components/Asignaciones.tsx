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
import { Plus, Search, FileDown, Calendar, ClipboardList, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getData, addRecord, updateRecord } from '../utils/localStorage';
import { generarPDFAsignaciones } from '../utils/pdfGenerator';

export function Asignaciones() {
  const [asignaciones, setAsignaciones] = useState<any[]>([]);
  const [materiales, setMateriales] = useState<any[]>([]);
  const [herramientas, setHerramientas] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [proyectos, setProyectos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todas');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDevolucionDialog, setIsDevolucionDialog] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<any>(null);
  const [formData, setFormData] = useState({
    tipo_item: 'herramienta',
    item: '',
    asignado_a_tipo: 'tecnico',
    asignado_a: '',
    fecha_asignacion: new Date().toISOString().split('T')[0],
    observaciones: ''
  });
  const [devolucionData, setDevolucionData] = useState({
    fecha_devolucion: new Date().toISOString().split('T')[0],
    observaciones: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setAsignaciones(getData('asignaciones'));
    setMateriales(getData('materiales'));
    setHerramientas(getData('herramientas'));
    setTecnicos(getData('tecnicos'));
    setProyectos(getData('proyectos'));
  };

  const handleAdd = () => {
    setFormData({
      tipo_item: 'herramienta',
      item: '',
      asignado_a_tipo: 'tecnico',
      asignado_a: '',
      fecha_asignacion: new Date().toISOString().split('T')[0],
      observaciones: ''
    });
    setIsDialogOpen(true);
  };

  const handleDevolucion = (asignacion: any) => {
    setSelectedAsignacion(asignacion);
    setDevolucionData({
      fecha_devolucion: new Date().toISOString().split('T')[0],
      observaciones: ''
    });
    setIsDevolucionDialog(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newData = {
      ...formData,
      fecha_devolucion: null,
      estado: 'activa'
    };
    addRecord('asignaciones', newData);
    loadData();
    toast.success('Asignación registrada correctamente');
    setIsDialogOpen(false);
  };

  const handleDevolucionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    updateRecord('asignaciones', selectedAsignacion.id, {
      fecha_devolucion: devolucionData.fecha_devolucion,
      estado: 'devuelta',
      observaciones: selectedAsignacion.observaciones + ' | Devolución: ' + devolucionData.observaciones
    });
    loadData();
    toast.success('Devolución registrada correctamente');
    setIsDevolucionDialog(false);
  };

  const filteredAsignaciones = asignaciones.filter(a => {
    const matchesSearch = a.item?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         a.asignado_a?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'todas' || 
                         (filterEstado === 'activas' && a.estado === 'activa') ||
                         (filterEstado === 'devueltas' && a.estado === 'devuelta');
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadge = (estado: string) => {
    if (estado === 'activa') {
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1 inline" />Activa</Badge>;
    } else {
      return <Badge className="bg-gray-100 text-gray-800"><XCircle className="w-3 h-3 mr-1 inline" />Devuelta</Badge>;
    }
  };

  const exportToPDF = () => {
    generarPDFAsignaciones(asignaciones);
    toast.success('PDF generado correctamente');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-black mb-2">Asignaciones</h1>
          <p className="text-gray-600">Control de herramientas y materiales asignados</p>
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
            Nueva Asignación
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Filtros de Búsqueda</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por item o asignado a..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las asignaciones</SelectItem>
                <SelectItem value="activas">Activas</SelectItem>
                <SelectItem value="devueltas">Devueltas</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Item</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead>Tipo Asignación</TableHead>
                <TableHead>Fecha Asignación</TableHead>
                <TableHead>Fecha Devolución</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAsignaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No se encontraron asignaciones
                  </TableCell>
                </TableRow>
              ) : (
                filteredAsignaciones.map((asignacion) => (
                  <TableRow key={asignacion.id}>
                    <TableCell>
                      <Badge variant="outline">
                        {asignacion.tipo_item === 'herramienta' ? 'Herramienta' : 'Material'}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{asignacion.item}</TableCell>
                    <TableCell>{asignacion.asignado_a}</TableCell>
                    <TableCell>
                      {asignacion.asignado_a_tipo === 'tecnico' ? 'Técnico' : 'Proyecto'}
                    </TableCell>
                    <TableCell>{asignacion.fecha_asignacion}</TableCell>
                    <TableCell>{asignacion.fecha_devolucion || '-'}</TableCell>
                    <TableCell>{getEstadoBadge(asignacion.estado)}</TableCell>
                    <TableCell>
                      {asignacion.estado === 'activa' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDevolucion(asignacion)}
                          className="border-yellow-500 hover:bg-yellow-50"
                        >
                          Registrar Devolución
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Nueva Asignación</DialogTitle>
            <DialogDescription>
              Registre una nueva asignación de herramienta o material
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
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
                      <SelectItem value="herramienta">Herramienta</SelectItem>
                      <SelectItem value="material">Material</SelectItem>
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
                      {(formData.tipo_item === 'material' ? materiales : herramientas).map((item: any) => (
                        <SelectItem key={item.id} value={item.nombre}>{item.nombre}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="asignado_a_tipo">Asignar a *</Label>
                  <Select
                    value={formData.asignado_a_tipo}
                    onValueChange={(value) => setFormData({ ...formData, asignado_a_tipo: value, asignado_a: '' })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tecnico">Técnico</SelectItem>
                      <SelectItem value="proyecto">Proyecto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="asignado_a">
                    {formData.asignado_a_tipo === 'tecnico' ? 'Técnico' : 'Proyecto'} *
                  </Label>
                  <Select
                    value={formData.asignado_a}
                    onValueChange={(value) => setFormData({ ...formData, asignado_a: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {(formData.asignado_a_tipo === 'tecnico' ? tecnicos : proyectos).map((item: any) => (
                        <SelectItem 
                          key={item.id} 
                          value={formData.asignado_a_tipo === 'tecnico' ? item.nombre_completo : item.nombre}
                        >
                          {formData.asignado_a_tipo === 'tecnico' ? item.nombre_completo : item.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_asignacion">Fecha de Asignación *</Label>
                <Input
                  id="fecha_asignacion"
                  type="date"
                  value={formData.fecha_asignacion}
                  onChange={(e) => setFormData({ ...formData, fecha_asignacion: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  placeholder="Ej: Para proyecto Centro Comercial"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Guardar Asignación
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDevolucionDialog} onOpenChange={setIsDevolucionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Devolución</DialogTitle>
            <DialogDescription>
              Complete los datos de la devolución
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleDevolucionSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="fecha_devolucion">Fecha de Devolución *</Label>
                <Input
                  id="fecha_devolucion"
                  type="date"
                  value={devolucionData.fecha_devolucion}
                  onChange={(e) => setDevolucionData({ ...devolucionData, fecha_devolucion: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="observaciones_devolucion">Observaciones</Label>
                <Textarea
                  id="observaciones_devolucion"
                  value={devolucionData.observaciones}
                  onChange={(e) => setDevolucionData({ ...devolucionData, observaciones: e.target.value })}
                  placeholder="Estado del item, motivo de devolución, etc."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDevolucionDialog(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Registrar Devolución
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
