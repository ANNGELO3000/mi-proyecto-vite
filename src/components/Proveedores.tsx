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
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Plus, Search, Edit, Trash2, Store, Phone, Mail, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getData, addRecord, updateRecord, deleteRecord } from '../utils/localStorage';

export function Proveedores() {
  const [proveedores, setProveedores] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProveedor, setEditingProveedor] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    contacto: '',
    telefono: '',
    correo: '',
    direccion: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setProveedores(getData('proveedores'));
  };

  const handleAdd = () => {
    setEditingProveedor(null);
    setFormData({
      nombre: '',
      contacto: '',
      telefono: '',
      correo: '',
      direccion: ''
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (proveedor: any) => {
    setEditingProveedor(proveedor);
    setFormData({
      nombre: proveedor.nombre,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      correo: proveedor.correo,
      direccion: proveedor.direccion
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este proveedor?')) {
      if (deleteRecord('proveedores', id)) {
        loadData();
        toast.success('Proveedor eliminado correctamente');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProveedor) {
      updateRecord('proveedores', editingProveedor.id, formData);
      toast.success('Proveedor actualizado correctamente');
    } else {
      const newData = {
        ...formData,
        materiales_suministrados: 0
      };
      addRecord('proveedores', newData);
      toast.success('Proveedor agregado correctamente');
    }
    
    loadData();
    setIsDialogOpen(false);
  };

  const filteredProveedores = proveedores.filter(p =>
    p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.telefono.includes(searchTerm)
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-black mb-2">Gestión de Proveedores</h1>
          <p className="text-gray-600">Administra los proveedores de materiales</p>
        </div>
        <Button 
          onClick={handleAdd}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          <Plus className="mr-2 h-4 w-4" />
          Agregar Proveedor
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Buscar Proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredProveedores.map((proveedor) => (
          <Card key={proveedor.id} className="hover:shadow-lg transition-shadow border-l-4 border-l-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <Store className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-black truncate mb-1">{proveedor.nombre}</h3>
                  <p className="text-sm text-gray-600">Contacto: {proveedor.contacto}</p>
                  <p className="text-xs text-yellow-600 mt-1">
                    {proveedor.materiales_suministrados || 0} materiales suministrados
                  </p>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm">{proveedor.telefono}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <span className="text-sm truncate">{proveedor.correo}</span>
                </div>
                <div className="flex items-start gap-2 text-gray-600">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="text-sm">{proveedor.direccion}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(proveedor)}
                  className="flex-1 border-yellow-500 hover:bg-yellow-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(proveedor.id)}
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
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>
              {editingProveedor ? 'Editar Proveedor' : 'Agregar Nuevo Proveedor'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos del proveedor
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Empresa *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Distribuidora TeleCom"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contacto">Persona de Contacto *</Label>
                <Input
                  id="contacto"
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                  placeholder="Ej: Juan Pérez"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono *</Label>
                  <Input
                    id="telefono"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    placeholder="Ej: 555-1001"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="correo">Correo Electrónico</Label>
                  <Input
                    id="correo"
                    type="email"
                    value={formData.correo}
                    onChange={(e) => setFormData({ ...formData, correo: e.target.value })}
                    placeholder="Ej: ventas@empresa.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Ej: Av. Principal 123, Ciudad"
                  rows={2}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                {editingProveedor ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
