# Ejemplo de Integración PHP - Materiales.tsx

## Paso 1: Identificar Mock Data

En `components/Materiales.tsx` encontrarás:

**LÍNEAS 35-80:** Mock data de materiales
```typescript
const mockMateriales = [ ... ];
```

**LÍNEAS 82-83:** Mock data de ubicaciones y proveedores
```typescript
const mockUbicaciones = ['Almacén Principal', 'Almacén Secundario', ...];
const mockProveedores = ['Distribuidora TeleCom', 'TechSupply SA', ...];
```

---

## Paso 2: Modificar el Componente

### ANTES (con Mock Data):

```typescript
import { useState } from 'react';

const mockMateriales = [ ... ];
const mockUbicaciones = [ ... ];
const mockProveedores = [ ... ];

export function Materiales() {
  const [materiales, setMateriales] = useState(mockMateriales);
  // ...resto del código
}
```

### DESPUÉS (con PHP):

```typescript
import { useState, useEffect } from 'react';  // ← Agregar useEffect

// ← ELIMINAR o comentar las constantes mock:
// const mockMateriales = [ ... ];
// const mockUbicaciones = [ ... ];
// const mockProveedores = [ ... ];

export function Materiales() {
  // Estado vacío al inicio
  const [materiales, setMateriales] = useState([]);
  const [ubicaciones, setUbicaciones] = useState([]);
  const [proveedores, setProveedores] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Cargar datos al montar el componente
  useEffect(() => {
    fetchMateriales();
    fetchUbicaciones();
    fetchProveedores();
  }, []);
  
  // Función para obtener materiales desde PHP
  const fetchMateriales = async () => {
    try {
      const response = await fetch('http://localhost/inventario/api/materiales.php');
      const data = await response.json();
      
      if (data.success) {
        setMateriales(data.data);
      } else {
        toast.error('Error al cargar materiales');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };
  
  // Función para obtener ubicaciones
  const fetchUbicaciones = async () => {
    try {
      const response = await fetch('http://localhost/inventario/api/ubicaciones.php');
      const data = await response.json();
      if (data.success) {
        setUbicaciones(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Función para obtener proveedores
  const fetchProveedores = async () => {
    try {
      const response = await fetch('http://localhost/inventario/api/proveedores.php');
      const data = await response.json();
      if (data.success) {
        setProveedores(data.data);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // ...resto del código
}
```

---

## Paso 3: Actualizar función handleSubmit

### ANTES:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (editingMaterial) {
    setMateriales(materiales.map(m => 
      m.id === editingMaterial.id ? { ...m, ...formData } : m
    ));
    toast.success('Material actualizado correctamente');
  } else {
    const newMaterial = {
      id: Math.max(...materiales.map(m => m.id)) + 1,
      ...formData
    };
    setMateriales([...materiales, newMaterial]);
    toast.success('Material agregado correctamente');
  }
  
  setIsDialogOpen(false);
};
```

### DESPUÉS:
```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const url = editingMaterial 
      ? 'http://localhost/inventario/api/materiales.php'
      : 'http://localhost/inventario/api/materiales.php';
    
    const method = editingMaterial ? 'PUT' : 'POST';
    
    const dataToSend = editingMaterial 
      ? { ...formData, id: editingMaterial.id }
      : formData;
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend)
    });
    
    const data = await response.json();
    
    if (data.success) {
      toast.success(editingMaterial ? 'Material actualizado' : 'Material agregado');
      fetchMateriales(); // Recargar la lista
      setIsDialogOpen(false);
    } else {
      toast.error(data.message || 'Error al guardar');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error de conexión');
  }
};
```

---

## Paso 4: Actualizar función handleDelete

### ANTES:
```typescript
const handleDelete = async (id: number) => {
  if (confirm('¿Está seguro de eliminar este material?')) {
    setMateriales(materiales.filter(m => m.id !== id));
    toast.success('Material eliminado correctamente');
  }
};
```

### DESPUÉS:
```typescript
const handleDelete = async (id: number) => {
  if (confirm('¿Está seguro de eliminar este material?')) {
    try {
      const response = await fetch(
        `http://localhost/inventario/api/materiales.php?id=${id}`, 
        { method: 'DELETE' }
      );
      
      const data = await response.json();
      
      if (data.success) {
        toast.success('Material eliminado correctamente');
        fetchMateriales(); // Recargar la lista
      } else {
        toast.error(data.message || 'Error al eliminar');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error de conexión');
    }
  }
};
```

---

## Paso 5: Actualizar los Select para usar datos dinámicos

### ANTES:
```typescript
<SelectContent>
  {mockUbicaciones.map((ubi) => (
    <SelectItem key={ubi} value={ubi}>{ubi}</SelectItem>
  ))}
</SelectContent>
```

### DESPUÉS:
```typescript
<SelectContent>
  {ubicaciones.map((ubi) => (
    <SelectItem key={ubi.id_ubicacion} value={ubi.id_ubicacion}>
      {ubi.nombre}
    </SelectItem>
  ))}
</SelectContent>
```

---

## Archivos PHP Necesarios

Crea estos archivos en tu servidor:

### 1. `/inventario/api/materiales.php`
```php
<?php
require_once '../conexion.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $sql = "SELECT m.*, 
                u.nombre as ubicacion, 
                p.nombre as proveedor 
                FROM materiales m
                LEFT JOIN ubicaciones u ON m.ubicacion_id = u.id_ubicacion
                LEFT JOIN proveedores p ON m.proveedor_id = p.id_proveedor
                ORDER BY m.id_material DESC";
        
        $resultado = $conexion->query($sql);
        $materiales = [];
        
        while ($row = $resultado->fetch_assoc()) {
            $materiales[] = $row;
        }
        
        echo json_encode(['success' => true, 'data' => $materiales]);
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $nombre = $conexion->real_escape_string($data['nombre']);
        $descripcion = $conexion->real_escape_string($data['descripcion']);
        $categoria = $conexion->real_escape_string($data['categoria']);
        $unidad_medida = $conexion->real_escape_string($data['unidad_medida']);
        $stock_actual = intval($data['stock_actual']);
        $stock_minimo = intval($data['stock_minimo']);
        $ubicacion_id = isset($data['ubicacion']) ? intval($data['ubicacion']) : null;
        $proveedor_id = isset($data['proveedor']) ? intval($data['proveedor']) : null;
        
        $sql = "INSERT INTO materiales 
                (nombre, descripcion, categoria, unidad_medida, stock_actual, stock_minimo, ubicacion_id, proveedor_id) 
                VALUES 
                ('$nombre', '$descripcion', '$categoria', '$unidad_medida', $stock_actual, $stock_minimo, $ubicacion_id, $proveedor_id)";
        
        if ($conexion->query($sql)) {
            echo json_encode(['success' => true, 'id' => $conexion->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => $conexion->error]);
        }
        break;
        
    case 'PUT':
        $data = json_decode(file_get_contents('php://input'), true);
        
        $id = intval($data['id']);
        $nombre = $conexion->real_escape_string($data['nombre']);
        $descripcion = $conexion->real_escape_string($data['descripcion']);
        $categoria = $conexion->real_escape_string($data['categoria']);
        $stock_actual = intval($data['stock_actual']);
        $stock_minimo = intval($data['stock_minimo']);
        
        $sql = "UPDATE materiales SET 
                nombre='$nombre', 
                descripcion='$descripcion', 
                categoria='$categoria',
                stock_actual=$stock_actual,
                stock_minimo=$stock_minimo
                WHERE id_material=$id";
        
        if ($conexion->query($sql)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => $conexion->error]);
        }
        break;
        
    case 'DELETE':
        $id = intval($_GET['id']);
        $sql = "DELETE FROM materiales WHERE id_material=$id";
        
        if ($conexion->query($sql)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => $conexion->error]);
        }
        break;
}

$conexion->close();
?>
```

### 2. `/inventario/api/ubicaciones.php`
```php
<?php
require_once '../conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM ubicaciones ORDER BY nombre";
    $resultado = $conexion->query($sql);
    $ubicaciones = [];
    
    while ($row = $resultado->fetch_assoc()) {
        $ubicaciones[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $ubicaciones]);
}

$conexion->close();
?>
```

### 3. `/inventario/api/proveedores.php`
```php
<?php
require_once '../conexion.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $sql = "SELECT * FROM proveedores ORDER BY nombre";
    $resultado = $conexion->query($sql);
    $proveedores = [];
    
    while ($row = $resultado->fetch_assoc()) {
        $proveedores[] = $row;
    }
    
    echo json_encode(['success' => true, 'data' => $proveedores]);
}

$conexion->close();
?>
```

---

## Resumen de Cambios

✅ **Eliminar/comentar** las constantes mock (líneas 35-83)
✅ **Agregar** `useEffect` para cargar datos al inicio
✅ **Crear** funciones `fetch` para obtener datos de PHP
✅ **Actualizar** `handleSubmit` para enviar datos a PHP
✅ **Actualizar** `handleDelete` para eliminar vía PHP
✅ **Modificar** los `<Select>` para usar arrays dinámicos

---

## Probar la Conexión

1. Inicia Laragon
2. Accede a `http://localhost/inventario/api/materiales.php`
3. Deberías ver: `{"success":true,"data":[...]}`

Si ves este JSON, la conexión funciona correctamente ✅
