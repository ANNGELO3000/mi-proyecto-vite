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
import { Progress } from './ui/progress';
import { Plus, Search, Edit, Trash2, FolderKanban, Calendar, FileDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getData, addRecord, updateRecord, deleteRecord } from '../utils/localStorage';
import { generarPDFProyectos } from '../utils/pdfGenerator';

export function Proyectos() {
  const [proyectos, setProyectos] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProyectos(getData('proyectos'));
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProyecto, setEditingProyecto] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    cliente: '',
    ubicacion: '',
    fecha_inicio: '',
    fecha_fin: '',
    estado: 'activo'
  });

  const handleAdd = () => {
    setEditingProyecto(null);
    setFormData({
      nombre: '',
      cliente: '',
      ubicacion: '',
      fecha_inicio: '',
      fecha_fin: '',
      estado: 'activo'
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (proyecto: any) => {
    setEditingProyecto(proyecto);
    setFormData({
      nombre: proyecto.nombre,
      cliente: proyecto.cliente,
      ubicacion: proyecto.ubicacion,
      fecha_inicio: proyecto.fecha_inicio,
      fecha_fin: proyecto.fecha_fin,
      estado: proyecto.estado
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este proyecto?')) {
      if (deleteRecord('proyectos', id)) {
        loadData();
        toast.success('Proyecto eliminado correctamente');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProyecto) {
      updateRecord('proyectos', editingProyecto.id, formData);
      toast.success('Proyecto actualizado correctamente');
    } else {
      const newData = {
        ...formData,
        progreso: 0
      };
      addRecord('proyectos', newData);
      toast.success('Proyecto agregado correctamente');
    }
    
    loadData();
    setIsDialogOpen(false);
  };

  const filteredProyectos = proyectos.filter(p => {
    const matchesSearch = p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.cliente.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'todos' || p.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'activo':
        return <Badge className="bg-blue-100 text-blue-800">Activo</Badge>;
      case 'en_curso':
        return <Badge className="bg-yellow-100 text-yellow-800">En Curso</Badge>;
      case 'finalizado':
        return <Badge className="bg-green-100 text-green-800">Finalizado</Badge>;
      default:
        return <Badge>{estado}</Badge>;
    }
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-black mb-2">Gestión de Proyectos</h1>
          <p className="text-gray-600">Administra los proyectos de instalación</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              generarPDFProyectos(proyectos);
              toast.success('PDF generado correctamente');
            }}
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
            Agregar Proyecto
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o cliente..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterEstado} onValueChange={setFilterEstado}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="activo">Activos</SelectItem>
                <SelectItem value="en_curso">En Curso</SelectItem>
                <SelectItem value="finalizado">Finalizados</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredProyectos.map((proyecto) => (
          <Card key={proyecto.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3 flex-1">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                    <FolderKanban className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-black mb-1">{proyecto.nombre}</h3>
                    <p className="text-sm text-gray-600 mb-2">{proyecto.cliente}</p>
                    {getEstadoBadge(proyecto.estado)}
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Inicio: {proyecto.fecha_inicio}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Calendar className="w-4 h-4" />
                  <span>Fin: {proyecto.fecha_fin}</span>
                </div>
              </div>

              <div className="mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Progreso</span>
                  <span className="text-black">{proyecto.progreso}%</span>
                </div>
                <Progress value={proyecto.progreso} className="h-2" />
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(proyecto)}
                  className="flex-1 border-yellow-500 hover:bg-yellow-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(proyecto.id)}
                  className="border-red-500 text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingProyecto ? 'Editar Proyecto' : 'Agregar Nuevo Proyecto'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos del proyecto
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="col-span-2 space-y-2">
                <Label htmlFor="nombre">Nombre del Proyecto *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Instalación Centro Comercial"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cliente">Cliente *</Label>
                <Input
                  id="cliente"
                  value={formData.cliente}
                  onChange={(e) => setFormData({ ...formData, cliente: e.target.value })}
                  placeholder="Ej: Empresa XYZ"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => setFormData({ ...formData, estado: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="en_curso">En Curso</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Textarea
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  placeholder="Ej: Av. Principal 123, Ciudad"
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) => setFormData({ ...formData, fecha_inicio: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fecha_fin">Fecha de Fin *</Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) => setFormData({ ...formData, fecha_fin: e.target.value })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                {editingProyecto ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
