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
import { Badge } from './ui/badge';
import { Plus, Search, Edit, Trash2, User, Phone, Mail, FileDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getData, addRecord, updateRecord, deleteRecord } from '../utils/localStorage';
import { generarPDFTecnicos } from '../utils/pdfGenerator';

export function Tecnicos() {
  const [tecnicos, setTecnicos] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setTecnicos(getData('tecnicos'));
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTecnico, setEditingTecnico] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre_completo: '',
    cargo: '',
    contacto: '',
    email: ''
  });

  const handleAdd = () => {
    setEditingTecnico(null);
    setFormData({
      nombre_completo: '',
      cargo: '',
      contacto: '',
      email: ''
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (tecnico: any) => {
    setEditingTecnico(tecnico);
    setFormData({
      nombre_completo: tecnico.nombre_completo,
      cargo: tecnico.cargo,
      contacto: tecnico.contacto,
      email: tecnico.email
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este técnico?')) {
      if (deleteRecord('tecnicos', id)) {
        loadData();
        toast.success('Técnico eliminado correctamente');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingTecnico) {
      updateRecord('tecnicos', editingTecnico.id, formData);
      toast.success('Técnico actualizado correctamente');
    } else {
      const newData = {
        ...formData,
        herramientas_asignadas: 0,
        materiales_asignados: 0
      };
      addRecord('tecnicos', newData);
      toast.success('Técnico agregado correctamente');
    }
    
    loadData();
    setIsDialogOpen(false);
  };

  const filteredTecnicos = tecnicos.filter(t =>
    t.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.cargo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-black mb-2">Gestión de Técnicos</h1>
          <p className="text-gray-600">Administra el personal técnico</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => {
              generarPDFTecnicos(tecnicos);
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
            Agregar Técnico
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Buscar Técnico</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTecnicos.map((tecnico) => (
          <Card key={tecnico.id} className="hover:shadow-lg transition-shadow border-t-4 border-t-yellow-500">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                  <User className="w-8 h-8 text-yellow-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-black truncate">{tecnico.nombre_completo}</h3>
                  <Badge variant="outline" className="mt-1">{tecnico.cargo}</Badge>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">{tecnico.contacto}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm truncate">{tecnico.email}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mb-4 p-3 bg-gray-50 rounded">
                <div className="text-center">
                  <div className="text-black">{tecnico.herramientas_asignadas}</div>
                  <div className="text-xs text-gray-600">Herramientas</div>
                </div>
                <div className="text-center">
                  <div className="text-black">{tecnico.materiales_asignados}</div>
                  <div className="text-xs text-gray-600">Materiales</div>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(tecnico)}
                  className="flex-1 border-yellow-500 hover:bg-yellow-50"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(tecnico.id)}
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
              {editingTecnico ? 'Editar Técnico' : 'Agregar Nuevo Técnico'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos del técnico
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre_completo">Nombre Completo *</Label>
                <Input
                  id="nombre_completo"
                  value={formData.nombre_completo}
                  onChange={(e) => setFormData({ ...formData, nombre_completo: e.target.value })}
                  placeholder="Ej: Juan Pérez García"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cargo">Cargo *</Label>
                <Input
                  id="cargo"
                  value={formData.cargo}
                  onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  placeholder="Ej: Técnico Senior"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contacto">Teléfono *</Label>
                <Input
                  id="contacto"
                  value={formData.contacto}
                  onChange={(e) => setFormData({ ...formData, contacto: e.target.value })}
                  placeholder="Ej: 555-0101"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Ej: tecnico@empresa.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                {editingTecnico ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
