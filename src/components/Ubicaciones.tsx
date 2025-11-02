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
import { Badge } from './ui/badge';
import { Plus, Search, Edit, Trash2, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getData, addRecord, updateRecord, deleteRecord } from '../utils/localStorage';

export function Ubicaciones() {
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setUbicaciones(getData('ubicaciones'));
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTipo, setFilterTipo] = useState('todas');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUbicacion, setEditingUbicacion] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    tipo: 'almacen'
  });

  const handleAdd = () => {
    setEditingUbicacion(null);
    setFormData({ nombre: '', tipo: 'almacen' });
    setIsDialogOpen(true);
  };

  const handleEdit = (ubicacion: any) => {
    setEditingUbicacion(ubicacion);
    setFormData({
      nombre: ubicacion.nombre,
      tipo: ubicacion.tipo
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar esta ubicación?')) {
      if (deleteRecord('ubicaciones', id)) {
        loadData();
        toast.success('Ubicación eliminada correctamente');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingUbicacion) {
      updateRecord('ubicaciones', editingUbicacion.id, formData);
      toast.success('Ubicación actualizada correctamente');
    } else {
      addRecord('ubicaciones', formData);
      toast.success('Ubicación agregada correctamente');
    }
    
    loadData();
    setIsDialogOpen(false);
  };

  const filteredUbicaciones = ubicaciones.filter(u => {
    const matchesSearch = u.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTipo = filterTipo === 'todas' || u.tipo === filterTipo;
    return matchesSearch && matchesTipo;
  });

  const getTipoBadge = (tipo: string) => {
    const colors: any = {
      almacen: 'bg-blue-100 text-blue-800',
      vehiculo: 'bg-green-100 text-green-800',
      obra: 'bg-yellow-100 text-yellow-800',
      oficina: 'bg-purple-100 text-purple-800'
    };
    const labels: any = {
      almacen: 'Almacén',
      vehiculo: 'Vehículo',
      obra: 'Obra',
      oficina: 'Oficina'
    };
    return <Badge className={colors[tipo]}>{labels[tipo]}</Badge>;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-black mb-2">Gestión de Ubicaciones</h1>
          <p className="text-gray-600">Administra las ubicaciones del inventario</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Ubicación
        </Button>
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
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterTipo} onValueChange={setFilterTipo}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="almacen">Almacén</SelectItem>
                <SelectItem value="vehiculo">Vehículo</SelectItem>
                <SelectItem value="obra">Obra</SelectItem>
                <SelectItem value="oficina">Oficina</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredUbicaciones.map((ubicacion) => (
          <Card key={ubicacion.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-black">{ubicacion.nombre}</h3>
                    {getTipoBadge(ubicacion.tipo)}
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(ubicacion)}
                  className="flex-1 border-yellow-500 hover:bg-yellow-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(ubicacion.id)}
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingUbicacion ? 'Editar Ubicación' : 'Agregar Nueva Ubicación'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos de la ubicación
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Almacén Principal"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select
                  value={formData.tipo}
                  onValueChange={(value) => setFormData({ ...formData, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="almacen">Almacén</SelectItem>
                    <SelectItem value="vehiculo">Vehículo</SelectItem>
                    <SelectItem value="obra">Obra</SelectItem>
                    <SelectItem value="oficina">Oficina</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                {editingUbicacion ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
