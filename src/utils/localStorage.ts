// Utilidad para manejar el almacenamiento local (simula base de datos)

// Datos iniciales del sistema
const initialData = {
  materiales: [
    {
      id: 1,
      nombre: 'Cable UTP Cat6',
      descripcion: 'Cable de red categoría 6 para instalaciones',
      categoria: 'Cables',
      unidad_medida: 'metros',
      stock_actual: 15,
      stock_minimo: 50,
      ubicacion: 'Almacén Principal',
      proveedor: 'Distribuidora TeleCom'
    },
    {
      id: 2,
      nombre: 'Conectores RJ45',
      descripcion: 'Conectores para terminación de cables UTP',
      categoria: 'Conectores',
      unidad_medida: 'unidades',
      stock_actual: 45,
      stock_minimo: 100,
      ubicacion: 'Almacén Principal',
      proveedor: 'Distribuidora TeleCom'
    },
    {
      id: 3,
      nombre: 'Switch 24 puertos',
      descripcion: 'Switch de red gigabit 24 puertos',
      categoria: 'Equipos',
      unidad_medida: 'unidades',
      stock_actual: 8,
      stock_minimo: 5,
      ubicacion: 'Almacén Principal',
      proveedor: 'TechSupply SA'
    },
    {
      id: 4,
      nombre: 'Cable Fibra Óptica',
      descripcion: 'Cable de fibra óptica monomodo',
      categoria: 'Cables',
      unidad_medida: 'metros',
      stock_actual: 500,
      stock_minimo: 200,
      ubicacion: 'Almacén Principal',
      proveedor: 'FiberNet'
    },
  ],
  herramientas: [
    {
      id: 1,
      nombre: 'Taladro Percutor',
      descripcion: 'Taladro inalámbrico 18V',
      codigo_interno: 'HERR-001',
      estado: 'operativa',
      ubicacion: 'Almacén Principal',
      asignada_a: null
    },
    {
      id: 2,
      nombre: 'Escalera Telescópica',
      descripcion: 'Escalera extensible 3 metros',
      codigo_interno: 'HERR-002',
      estado: 'operativa',
      ubicacion: 'Vehículo 1',
      asignada_a: 'Juan Pérez'
    },
    {
      id: 3,
      nombre: 'Multímetro Digital',
      descripcion: 'Multímetro profesional',
      codigo_interno: 'HERR-003',
      estado: 'en_reparacion',
      ubicacion: 'Taller',
      asignada_a: null
    },
    {
      id: 4,
      nombre: 'Ponchadora RJ45',
      descripcion: 'Ponchadora para conectores de red',
      codigo_interno: 'HERR-004',
      estado: 'operativa',
      ubicacion: 'Almacén Principal',
      asignada_a: null
    },
  ],
  ubicaciones: [
    { id: 1, nombre: 'Almacén Principal', tipo: 'almacen' },
    { id: 2, nombre: 'Almacén Secundario', tipo: 'almacen' },
    { id: 3, nombre: 'Vehículo 1', tipo: 'vehiculo' },
    { id: 4, nombre: 'Vehículo 2', tipo: 'vehiculo' },
    { id: 5, nombre: 'Obra Centro Comercial', tipo: 'obra' },
    { id: 6, nombre: 'Oficina Central', tipo: 'oficina' },
  ],
  tecnicos: [
    {
      id: 1,
      nombre_completo: 'Juan Pérez García',
      cargo: 'Técnico Senior',
      contacto: '555-0101',
      email: 'juan.perez@empresa.com',
      herramientas_asignadas: 3,
      materiales_asignados: 5
    },
    {
      id: 2,
      nombre_completo: 'María González López',
      cargo: 'Técnico Junior',
      contacto: '555-0102',
      email: 'maria.gonzalez@empresa.com',
      herramientas_asignadas: 2,
      materiales_asignados: 3
    },
    {
      id: 3,
      nombre_completo: 'Carlos Ruiz Martínez',
      cargo: 'Jefe de Instalaciones',
      contacto: '555-0103',
      email: 'carlos.ruiz@empresa.com',
      herramientas_asignadas: 4,
      materiales_asignados: 8
    },
    {
      id: 4,
      nombre_completo: 'Ana Martínez Sánchez',
      cargo: 'Técnico',
      contacto: '555-0104',
      email: 'ana.martinez@empresa.com',
      herramientas_asignadas: 1,
      materiales_asignados: 2
    },
  ],
  proveedores: [
    {
      id: 1,
      nombre: 'Distribuidora TeleCom',
      contacto: 'Roberto Jiménez',
      telefono: '555-1001',
      correo: 'ventas@telecom.com',
      direccion: 'Av. Principal 123, Ciudad',
      materiales_suministrados: 12
    },
    {
      id: 2,
      nombre: 'TechSupply SA',
      contacto: 'Laura Méndez',
      telefono: '555-1002',
      correo: 'info@techsupply.com',
      direccion: 'Calle Comercio 456, Ciudad',
      materiales_suministrados: 8
    },
    {
      id: 3,
      nombre: 'FiberNet',
      contacto: 'Pedro Ramírez',
      telefono: '555-1003',
      correo: 'contacto@fibernet.com',
      direccion: 'Zona Industrial 789, Ciudad',
      materiales_suministrados: 5
    },
    {
      id: 4,
      nombre: 'RedEquip',
      contacto: 'Sandra Torres',
      telefono: '555-1004',
      correo: 'ventas@redequip.com',
      direccion: 'Centro Empresarial 321, Ciudad',
      materiales_suministrados: 15
    },
  ],
  proyectos: [
    {
      id: 1,
      nombre: 'Instalación Centro Comercial Plaza',
      cliente: 'Centro Comercial Plaza SA',
      ubicacion: 'Av. Principal 500',
      fecha_inicio: '2025-09-01',
      fecha_fin: '2025-12-15',
      estado: 'en_curso',
      progreso: 65
    },
    {
      id: 2,
      nombre: 'Red Corporativa Edificio Empresarial',
      cliente: 'Corporativo Global',
      ubicacion: 'Torre Empresarial, Piso 12',
      fecha_inicio: '2025-10-01',
      fecha_fin: '2025-11-30',
      estado: 'activo',
      progreso: 30
    },
    {
      id: 3,
      nombre: 'Mantenimiento Red Hospital Central',
      cliente: 'Hospital Central',
      ubicacion: 'Zona Hospitalaria',
      fecha_inicio: '2025-08-01',
      fecha_fin: '2025-10-15',
      estado: 'finalizado',
      progreso: 100
    },
    {
      id: 4,
      nombre: 'Fibra Óptica Residencial Los Pinos',
      cliente: 'Urbanización Los Pinos',
      ubicacion: 'Sector Los Pinos',
      fecha_inicio: '2025-10-15',
      fecha_fin: '2026-02-28',
      estado: 'activo',
      progreso: 15
    },
  ],
  movimientos: [
    {
      id: 1,
      tipo: 'entrada',
      fecha: '2025-10-20',
      item: 'Cable UTP Cat6',
      tipo_item: 'material',
      cantidad: 500,
      origen: 'Proveedor TechSupply',
      destino: 'Almacén Principal',
      observaciones: 'Nueva compra mensual'
    },
    {
      id: 2,
      tipo: 'salida',
      fecha: '2025-10-19',
      item: 'Taladro Percutor',
      tipo_item: 'herramienta',
      cantidad: 1,
      origen: 'Almacén Principal',
      destino: 'Técnico Juan Pérez',
      observaciones: 'Asignación para proyecto Centro Comercial'
    },
    {
      id: 3,
      tipo: 'devolucion',
      fecha: '2025-10-18',
      item: 'Escalera Telescópica',
      tipo_item: 'herramienta',
      cantidad: 1,
      origen: 'Técnico María González',
      destino: 'Almacén Principal',
      observaciones: 'Proyecto finalizado'
    },
    {
      id: 4,
      tipo: 'salida',
      fecha: '2025-10-17',
      item: 'Conectores RJ45',
      tipo_item: 'material',
      cantidad: 200,
      origen: 'Almacén Principal',
      destino: 'Proyecto Edificio Empresarial',
      observaciones: 'Material para instalación'
    },
  ],
  asignaciones: [
    {
      id: 1,
      tipo_item: 'herramienta',
      item: 'Taladro Percutor',
      asignado_a_tipo: 'tecnico',
      asignado_a: 'Juan Pérez',
      fecha_asignacion: '2025-10-15',
      fecha_devolucion: null,
      estado: 'activa',
      observaciones: 'Para proyecto Centro Comercial'
    },
    {
      id: 2,
      tipo_item: 'material',
      item: 'Cable UTP Cat6 - 100m',
      asignado_a_tipo: 'proyecto',
      asignado_a: 'Instalación Centro Comercial',
      fecha_asignacion: '2025-10-10',
      fecha_devolucion: null,
      estado: 'activa',
      observaciones: 'Material para instalación principal'
    },
    {
      id: 3,
      tipo_item: 'herramienta',
      item: 'Escalera Telescópica',
      asignado_a_tipo: 'tecnico',
      asignado_a: 'María González',
      fecha_asignacion: '2025-10-01',
      fecha_devolucion: '2025-10-18',
      estado: 'devuelta',
      observaciones: 'Devuelta en buen estado'
    },
    {
      id: 4,
      tipo_item: 'herramienta',
      item: 'Multímetro Digital',
      asignado_a_tipo: 'tecnico',
      asignado_a: 'Carlos Ruiz',
      fecha_asignacion: '2025-10-12',
      fecha_devolucion: null,
      estado: 'activa',
      observaciones: 'Mantenimiento preventivo'
    },
  ],
  usuarios: [
    {
      id: 1,
      usuario: 'admin',
      password: 'admin',
      nombre: 'Administrador',
      rol: 'admin'
    }
  ]
};

// Inicializar localStorage con datos por defecto
export function initializeStorage() {
  if (!localStorage.getItem('inventario_initialized')) {
    Object.keys(initialData).forEach(key => {
      localStorage.setItem(key, JSON.stringify(initialData[key as keyof typeof initialData]));
    });
    localStorage.setItem('inventario_initialized', 'true');
  }
}

// Obtener datos de una tabla
export function getData(table: string): any[] {
  const data = localStorage.getItem(table);
  return data ? JSON.parse(data) : [];
}

// Guardar datos de una tabla
export function saveData(table: string, data: any[]): void {
  localStorage.setItem(table, JSON.stringify(data));
}

// Agregar un registro
export function addRecord(table: string, record: any): any {
  const data = getData(table);
  const newId = data.length > 0 ? Math.max(...data.map((item: any) => item.id)) + 1 : 1;
  const newRecord = { ...record, id: newId };
  data.push(newRecord);
  saveData(table, data);
  return newRecord;
}

// Actualizar un registro
export function updateRecord(table: string, id: number, updates: any): boolean {
  const data = getData(table);
  const index = data.findIndex((item: any) => item.id === id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updates };
    saveData(table, data);
    return true;
  }
  return false;
}

// Eliminar un registro
export function deleteRecord(table: string, id: number): boolean {
  const data = getData(table);
  const filteredData = data.filter((item: any) => item.id !== id);
  if (filteredData.length !== data.length) {
    saveData(table, filteredData);
    return true;
  }
  return false;
}

// Resetear todos los datos a valores iniciales
export function resetAllData(): void {
  Object.keys(initialData).forEach(key => {
    localStorage.setItem(key, JSON.stringify(initialData[key as keyof typeof initialData]));
  });
}

// Exportar datos como JSON
export function exportData(): string {
  const allData: any = {};
  Object.keys(initialData).forEach(key => {
    allData[key] = getData(key);
  });
  return JSON.stringify(allData, null, 2);
}

// Importar datos desde JSON
export function importData(jsonData: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    Object.keys(data).forEach(key => {
      saveData(key, data[key]);
    });
    return true;
  } catch (error) {
    console.error('Error importing data:', error);
    return false;
  }
}
