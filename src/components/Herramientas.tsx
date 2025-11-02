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
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Plus, Search, Edit, Trash2, FileDown, X } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { getData, addRecord, updateRecord, deleteRecord } from '../utils/localStorage';
import { generarPDFHerramientas } from '../utils/pdfGenerator';

export function Herramientas() {
  const [herramientas, setHerramientas] = useState<any[]>([]);
  const [ubicaciones, setUbicaciones] = useState<any[]>([]);
  const [tecnicos, setTecnicos] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todas');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [codigoInterno, setCodigoInterno] = useState('');
  const [estado, setEstado] = useState('operativa');
  const [ubicacion, setUbicacion] = useState('');
  const [asignadaA, setAsignadaA] = useState('');

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = () => {
    try {
      setHerramientas(getData('herramientas') || []);
      setUbicaciones(getData('ubicaciones') || []);
      setTecnicos(getData('tecnicos') || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setCodigoInterno('');
    setEstado('operativa');
    setUbicacion('');
    setAsignadaA('');
    setEditingId(null);
    setShowForm(false);
  };

  const handleAgregar = () => {
    limpiarFormulario();
    setShowForm(true);
  };

  const handleEditar = (h: any) => {
    setNombre(h.nombre || '');
    setDescripcion(h.descripcion || '');
    setCodigoInterno(h.codigo_interno || '');
    setEstado(h.estado || 'operativa');
    setUbicacion(h.ubicacion || '');
    setAsignadaA(h.asignada_a || '');
    setEditingId(h.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGuardar = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nombre || !codigoInterno) {
      toast.error('Nombre y código son requeridos');
      return;
    }

    try {
      const data = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        codigo_interno: codigoInterno.trim(),
        estado: estado,
        ubicacion: ubicacion.trim(),
        asignada_a: asignadaA.trim() || null
      };

      if (editingId) {
        updateRecord('herramientas', editingId, data);
        toast.success('Herramienta actualizada');
      } else {
        addRecord('herramientas', data);
        toast.success('Herramienta agregada');
      }
      
      cargarDatos();
      limpiarFormulario();
    } catch (error) {
      toast.error('Error al guardar');
    }
  };

  const handleEliminar = (id: number) => {
    if (window.confirm('¿Eliminar esta herramienta?')) {
      try {
        deleteRecord('herramientas', id);
        toast.success('Herramienta eliminada');
        cargarDatos();
      } catch (error) {
        toast.error('Error al eliminar');
      }
    }
  };

  const handleExportPDF = () => {
    try {
      generarPDFHerramientas(herramientas);
      toast.success('PDF generado');
    } catch (error) {
      toast.error('Error al generar PDF');
    }
  };

  const filteredHerramientas = herramientas.filter(h => {
    const matchSearch = 
      (h.nombre || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (h.codigo_interno || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchEstado = filterEstado === 'todas' || h.estado === filterEstado;
    return matchSearch && matchEstado;
  });

  const getBadge = (est: string) => {
    if (est === 'operativa') return <Badge className="bg-green-100 text-green-800">Operativa</Badge>;
    if (est === 'en_reparacion') return <Badge className="bg-yellow-100 text-yellow-800">En Reparación</Badge>;
    if (est === 'perdida') return <Badge className="bg-red-100 text-red-800">Perdida</Badge>;
    return <Badge>{est}</Badge>;
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-black mb-2">Gestión de Herramientas</h1>
          <p className="text-gray-600">Administra el inventario de herramientas</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleExportPDF} variant="outline" className="border-yellow-500 text-black hover:bg-yellow-50">
            <FileDown className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={handleAgregar} className="bg-yellow-500 hover:bg-yellow-600 text-black">
            <Plus className="mr-2 h-4 w-4" />
            Agregar Herramienta
          </Button>
        </div>
      </div>

      {showForm && (
        <Card className="border-yellow-500 border-2">
          <CardHeader className="bg-yellow-50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-black">
                {editingId ? 'Editar Herramienta' : 'Nueva Herramienta'}
              </CardTitle>
              <Button variant="ghost" size="sm" onClick={limpiarFormulario}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleGuardar}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nombre *</Label>
                  <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label>Código Interno *</Label>
                  <Input value={codigoInterno} onChange={(e) => setCodigoInterno(e.target.value)} required />
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Descripción</Label>
                  <Textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} rows={2} />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <select 
                    value={estado} 
                    onChange={(e) => setEstado(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="operativa">Operativa</option>
                    <option value="en_reparacion">En Reparación</option>
                    <option value="perdida">Perdida</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Ubicación</Label>
                  <select 
                    value={ubicacion} 
                    onChange={(e) => setUbicacion(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Seleccione...</option>
                    {ubicaciones.map((ubi) => (
                      <option key={ubi.id} value={ubi.nombre}>{ubi.nombre}</option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2 space-y-2">
                  <Label>Asignada a (Técnico)</Label>
                  <select 
                    value={asignadaA} 
                    onChange={(e) => setAsignadaA(e.target.value)}
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="">Sin asignar</option>
                    {tecnicos.map((tec) => (
                      <option key={tec.id} value={tec.nombre_completo}>{tec.nombre_completo}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-6">
                <Button type="submit" className="bg-yellow-500 hover:bg-yellow-600 text-black">
                  {editingId ? 'Actualizar' : 'Guardar'}
                </Button>
                <Button type="button" variant="outline" onClick={limpiarFormulario}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-black">Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <select 
              value={filterEstado} 
              onChange={(e) => setFilterEstado(e.target.value)}
              className="h-10 px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="todas">Todas</option>
              <option value="operativa">Operativas</option>
              <option value="en_reparacion">En Reparación</option>
              <option value="perdida">Perdidas</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-yellow-500 hover:bg-yellow-500">
                <TableHead className="text-black">Código</TableHead>
                <TableHead className="text-black">Nombre</TableHead>
                <TableHead className="text-black">Estado</TableHead>
                <TableHead className="text-black">Ubicación</TableHead>
                <TableHead className="text-black">Asignada a</TableHead>
                <TableHead className="text-black text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHerramientas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-gray-500 py-8">
                    No hay herramientas
                  </TableCell>
                </TableRow>
              ) : (
                filteredHerramientas.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell className="text-gray-600">{h.codigo_interno}</TableCell>
                    <TableCell>{h.nombre}</TableCell>
                    <TableCell>{getBadge(h.estado)}</TableCell>
                    <TableCell className="text-gray-600">{h.ubicacion}</TableCell>
                    <TableCell>
                      {h.asignada_a ? (
                        <Badge variant="outline">{h.asignada_a}</Badge>
                      ) : (
                        <span className="text-green-600">Disponible</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditar(h)}
                          className="hover:bg-yellow-100"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEliminar(h.id)}
                          className="hover:bg-red-100 text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
