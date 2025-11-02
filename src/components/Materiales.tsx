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
import { Plus, Search, Edit, Trash2, AlertTriangle, FileDown } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getData, addRecord, updateRecord, deleteRecord } from '../utils/localStorage';
import { generarPDFMateriales } from '../utils/pdfGenerator';

export function Materiales() {
  const [materiales, setMateriales] = useState<any[]>([]);
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);
  const [proveedores, setProveedores] = useState<any[]>([]);

  // Cargar datos del localStorage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setMateriales(getData('materiales'));
    setUbicaciones(getData('ubicaciones'));
    setProveedores(getData('proveedores'));
  };
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    unidad_medida: 'unidades',
    stock_actual: 0,
    stock_minimo: 0,
    ubicacion: '',
    proveedor: ''
  });

  const handleAdd = () => {
    setEditingMaterial(null);
    setFormData({
      nombre: '',
      descripcion: '',
      categoria: '',
      unidad_medida: 'unidades',
      stock_actual: 0,
      stock_minimo: 0,
      ubicacion: '',
      proveedor: ''
    });
    setIsDialogOpen(true);
  };

  const handleEdit = (material: any) => {
    setEditingMaterial(material);
    setFormData({
      nombre: material.nombre,
      descripcion: material.descripcion,
      categoria: material.categoria,
      unidad_medida: material.unidad_medida,
      stock_actual: material.stock_actual,
      stock_minimo: material.stock_minimo,
      ubicacion: material.ubicacion,
      proveedor: material.proveedor
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de eliminar este material?')) {
      if (deleteRecord('materiales', id)) {
        loadData();
        toast.success('Material eliminado correctamente');
      } else {
        toast.error('Error al eliminar el material');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingMaterial) {
      if (updateRecord('materiales', editingMaterial.id, formData)) {
        loadData();
        toast.success('Material actualizado correctamente');
      } else {
        toast.error('Error al actualizar el material');
      }
    } else {
      addRecord('materiales', formData);
      loadData();
      toast.success('Material agregado correctamente');
    }
    
    setIsDialogOpen(false);
  };

  const filteredMateriales = materiales.filter(m =>
    m.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToPDF = () => {
    generarPDFMateriales(materiales);
    toast.success('PDF generado correctamente');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-black mb-2">Gestión de Materiales</h1>
          <p className="text-gray-600">Administra el inventario de materiales</p>
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
            Agregar Material
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Buscar Material</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o categoría..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-yellow-500 hover:bg-yellow-500">
                <TableHead className="text-black">Nombre</TableHead>
                <TableHead className="text-black">Categoría</TableHead>
                <TableHead className="text-black">Stock Actual</TableHead>
                <TableHead className="text-black">Stock Mínimo</TableHead>
                <TableHead className="text-black">Ubicación</TableHead>
                <TableHead className="text-black">Proveedor</TableHead>
                <TableHead className="text-black text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMateriales.map((material) => {
                const isLowStock = material.stock_actual < material.stock_minimo;
                return (
                  <TableRow key={material.id} className={isLowStock ? 'bg-red-50' : ''}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {isLowStock && <AlertTriangle className="h-4 w-4 text-red-500" />}
                        <span>{material.nombre}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{material.categoria}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className={isLowStock ? 'text-red-600' : ''}>
                        {material.stock_actual} {material.unidad_medida}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {material.stock_minimo} {material.unidad_medida}
                    </TableCell>
                    <TableCell className="text-gray-600">{material.ubicacion}</TableCell>
                    <TableCell className="text-gray-600">{material.proveedor}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(material)}
                          className="hover:bg-yellow-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(material.id)}
                          className="hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingMaterial ? 'Editar Material' : 'Agregar Nuevo Material'}
            </DialogTitle>
            <DialogDescription>
              Complete los datos del material
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría *</Label>
                <Input
                  id="categoria"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                  required
                />
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unidad_medida">Unidad de Medida</Label>
                <Select
                  value={formData.unidad_medida}
                  onValueChange={(value) => setFormData({ ...formData, unidad_medida: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="unidades">Unidades</SelectItem>
                    <SelectItem value="metros">Metros</SelectItem>
                    <SelectItem value="kilogramos">Kilogramos</SelectItem>
                    <SelectItem value="cajas">Cajas</SelectItem>
                    <SelectItem value="rollos">Rollos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_actual">Stock Actual *</Label>
                <Input
                  id="stock_actual"
                  type="number"
                  value={formData.stock_actual}
                  onChange={(e) => setFormData({ ...formData, stock_actual: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="stock_minimo">Stock Mínimo *</Label>
                <Input
                  id="stock_minimo"
                  type="number"
                  value={formData.stock_minimo}
                  onChange={(e) => setFormData({ ...formData, stock_minimo: parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Select
                  value={formData.ubicacion}
                  onValueChange={(value) => setFormData({ ...formData, ubicacion: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {ubicaciones.map((ubi) => (
                      <SelectItem key={ubi.id} value={ubi.nombre}>{ubi.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="proveedor">Proveedor</Label>
                <Select
                  value={formData.proveedor}
                  onValueChange={(value) => setFormData({ ...formData, proveedor: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    {proveedores.map((prov) => (
                      <SelectItem key={prov.id} value={prov.nombre}>{prov.nombre}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                {editingMaterial ? 'Actualizar' : 'Guardar'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
