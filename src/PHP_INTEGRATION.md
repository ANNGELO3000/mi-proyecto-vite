# Guía de Integración PHP/MySQL

## Resumen
Este sistema de inventario está construido en React/TypeScript y está diseñado para conectarse con un backend PHP y MySQL. Actualmente utiliza datos simulados (mock data) para demostración. Esta guía te ayudará a conectar el frontend con tu backend PHP.

## Estructura de Base de Datos

Tu base de datos `inventario_redes` debe tener las siguientes tablas:

```sql
-- Tabla de materiales
CREATE TABLE materiales (
    id_material INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    categoria VARCHAR(100),
    unidad_medida VARCHAR(50),
    stock_actual INT DEFAULT 0,
    stock_minimo INT DEFAULT 0,
    ubicacion_id INT,
    proveedor_id INT,
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id_ubicacion),
    FOREIGN KEY (proveedor_id) REFERENCES proveedores(id_proveedor)
);

-- Tabla de herramientas
CREATE TABLE herramientas (
    id_herramienta INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    codigo_interno VARCHAR(100),
    estado ENUM('operativa', 'en_reparacion', 'perdida') DEFAULT 'operativa',
    ubicacion_id INT,
    asignada_a VARCHAR(255),
    FOREIGN KEY (ubicacion_id) REFERENCES ubicaciones(id_ubicacion)
);

-- Tabla de ubicaciones
CREATE TABLE ubicaciones (
    id_ubicacion INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo ENUM('almacen', 'vehiculo', 'obra', 'oficina')
);

-- Tabla de técnicos
CREATE TABLE tecnicos (
    id_tecnico INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(255) NOT NULL,
    cargo VARCHAR(100),
    contacto VARCHAR(50),
    email VARCHAR(255)
);

-- Tabla de proveedores
CREATE TABLE proveedores (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    contacto VARCHAR(255),
    telefono VARCHAR(50),
    correo VARCHAR(255),
    direccion TEXT
);

-- Tabla de proyectos
CREATE TABLE proyectos (
    id_proyecto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    cliente VARCHAR(255),
    ubicacion TEXT,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado ENUM('activo', 'en_curso', 'finalizado') DEFAULT 'activo'
);

-- Tabla de movimientos
CREATE TABLE movimientos_inventario (
    id_movimiento INT AUTO_INCREMENT PRIMARY KEY,
    tipo_movimiento ENUM('entrada', 'salida', 'devolucion'),
    fecha DATE,
    cantidad INT,
    id_material INT,
    id_herramienta INT,
    origen_id INT,
    destino_id INT,
    observaciones TEXT,
    FOREIGN KEY (id_material) REFERENCES materiales(id_material),
    FOREIGN KEY (id_herramienta) REFERENCES herramientas(id_herramienta)
);

-- Tabla de asignaciones
CREATE TABLE asignaciones (
    id_asignacion INT AUTO_INCREMENT PRIMARY KEY,
    id_herramienta INT,
    id_material INT,
    id_tecnico INT,
    id_proyecto INT,
    fecha_asignacion DATE,
    fecha_devolucion DATE,
    observaciones TEXT,
    FOREIGN KEY (id_herramienta) REFERENCES herramientas(id_herramienta),
    FOREIGN KEY (id_material) REFERENCES materiales(id_material),
    FOREIGN KEY (id_tecnico) REFERENCES tecnicos(id_tecnico),
    FOREIGN KEY (id_proyecto) REFERENCES proyectos(id_proyecto)
);

-- Tabla de usuarios (para login)
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    usuario VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nombre_completo VARCHAR(255),
    rol ENUM('admin', 'usuario') DEFAULT 'usuario'
);
```

## Configuración PHP

### 1. Archivo de Conexión (conexion.php)

Crea este archivo en tu servidor para conectar con MySQL:

```php
<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

// Conexión a la base de datos
$host = "localhost";
$usuario = "root";
$password = "";
$base_datos = "inventario_redes";

$conexion = new mysqli($host, $usuario, $password, $base_datos);

if ($conexion->connect_error) {
    die(json_encode([
        'success' => false,
        'message' => 'Error de conexión: ' . $conexion->connect_error
    ]));
}

$conexion->set_charset("utf8");
?>
```

### 2. API de Login (api/login.php)

```php
<?php
require_once '../conexion.php';

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $usuario = $conexion->real_escape_string($data['usuario']);
    $password = $data['password'];
    
    $sql = "SELECT * FROM usuarios WHERE usuario = '$usuario'";
    $resultado = $conexion->query($sql);
    
    if ($resultado->num_rows > 0) {
        $user = $resultado->fetch_assoc();
        
        // Verificar password (usar password_verify si está hasheado)
        if (password_verify($password, $user['password'])) {
            echo json_encode([
                'success' => true,
                'user' => [
                    'id' => $user['id_usuario'],
                    'nombre' => $user['nombre_completo'],
                    'rol' => $user['rol']
                ]
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Credenciales incorrectas']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Usuario no encontrado']);
    }
}

$conexion->close();
?>
```

### 3. API de Materiales (api/materiales.php)

```php
<?php
require_once '../conexion.php';

$method = $_SERVER['REQUEST_METHOD'];
$data = json_decode(file_get_contents('php://input'), true);

switch ($method) {
    case 'GET':
        // Obtener todos los materiales
        $sql = "SELECT m.*, u.nombre as ubicacion, p.nombre as proveedor 
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
        // Crear nuevo material
        $nombre = $conexion->real_escape_string($data['nombre']);
        $descripcion = $conexion->real_escape_string($data['descripcion']);
        $categoria = $conexion->real_escape_string($data['categoria']);
        $unidad_medida = $conexion->real_escape_string($data['unidad_medida']);
        $stock_actual = intval($data['stock_actual']);
        $stock_minimo = intval($data['stock_minimo']);
        
        $sql = "INSERT INTO materiales (nombre, descripcion, categoria, unidad_medida, stock_actual, stock_minimo) 
                VALUES ('$nombre', '$descripcion', '$categoria', '$unidad_medida', $stock_actual, $stock_minimo)";
        
        if ($conexion->query($sql)) {
            echo json_encode(['success' => true, 'id' => $conexion->insert_id]);
        } else {
            echo json_encode(['success' => false, 'message' => $conexion->error]);
        }
        break;
        
    case 'PUT':
        // Actualizar material
        $id = intval($data['id']);
        $nombre = $conexion->real_escape_string($data['nombre']);
        $stock_actual = intval($data['stock_actual']);
        
        $sql = "UPDATE materiales SET nombre='$nombre', stock_actual=$stock_actual WHERE id_material=$id";
        
        if ($conexion->query($sql)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => $conexion->error]);
        }
        break;
        
    case 'DELETE':
        // Eliminar material
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

### 4. API de Dashboard (api/dashboard.php)

```php
<?php
require_once '../conexion.php';

// Total de materiales
$sql_materiales = "SELECT COUNT(*) as total FROM materiales";
$total_materiales = $conexion->query($sql_materiales)->fetch_assoc()['total'];

// Total de herramientas
$sql_herramientas = "SELECT COUNT(*) as total FROM herramientas";
$total_herramientas = $conexion->query($sql_herramientas)->fetch_assoc()['total'];

// Total de técnicos
$sql_tecnicos = "SELECT COUNT(*) as total FROM tecnicos";
$total_tecnicos = $conexion->query($sql_tecnicos)->fetch_assoc()['total'];

// Materiales con stock bajo
$sql_stock_bajo = "SELECT * FROM materiales WHERE stock_actual < stock_minimo";
$resultado_stock = $conexion->query($sql_stock_bajo);
$materiales_bajo_stock = [];
while ($row = $resultado_stock->fetch_assoc()) {
    $materiales_bajo_stock[] = $row;
}

// Últimos movimientos
$sql_movimientos = "SELECT m.*, mat.nombre as material 
                    FROM movimientos_inventario m
                    LEFT JOIN materiales mat ON m.id_material = mat.id_material
                    ORDER BY m.fecha DESC LIMIT 10";
$resultado_mov = $conexion->query($sql_movimientos);
$ultimos_movimientos = [];
while ($row = $resultado_mov->fetch_assoc()) {
    $ultimos_movimientos[] = $row;
}

echo json_encode([
    'success' => true,
    'data' => [
        'totalMateriales' => $total_materiales,
        'totalHerramientas' => $total_herramientas,
        'totalTecnicos' => $total_tecnicos,
        'stockBajo' => count($materiales_bajo_stock),
        'materialesBajoStock' => $materiales_bajo_stock,
        'ultimosMovimientos' => $ultimos_movimientos
    ]
]);

$conexion->close();
?>
```

## Integración Frontend - Backend

### Actualizar los componentes React

En cada componente donde hay `// Mock data`, reemplaza con llamadas reales a la API:

**Ejemplo en Materiales.tsx:**

```typescript
// Reemplazar esta sección:
const [materiales, setMateriales] = useState(mockMateriales);

// Por:
const [materiales, setMateriales] = useState([]);

useEffect(() => {
  fetchMateriales();
}, []);

const fetchMateriales = async () => {
  try {
    const response = await fetch('http://localhost/inventario/api/materiales.php');
    const data = await response.json();
    if (data.success) {
      setMateriales(data.data);
    }
  } catch (error) {
    console.error('Error al cargar materiales:', error);
    toast.error('Error al cargar los datos');
  }
};
```

**Ejemplo de POST (crear material):**

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  try {
    const response = await fetch('http://localhost/inventario/api/materiales.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const data = await response.json();
    
    if (data.success) {
      toast.success('Material agregado correctamente');
      fetchMateriales(); // Recargar lista
      setIsDialogOpen(false);
    } else {
      toast.error('Error al guardar');
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error('Error de conexión');
  }
};
```

## Estructura de Carpetas PHP Sugerida

```
/var/www/html/inventario/
├── api/
│   ├── login.php
│   ├── dashboard.php
│   ├── materiales.php
│   ├── herramientas.php
│   ├── ubicaciones.php
│   ├── tecnicos.php
│   ├── proveedores.php
│   ├── proyectos.php
│   ├── movimientos.php
│   └── asignaciones.php
├── reportes/
│   ├── materiales_pdf.php
│   ├── movimientos_pdf.php
│   └── asignaciones_pdf.php
└── conexion.php
```

## Consideraciones de Seguridad

1. **Hashear passwords**: Usa `password_hash()` y `password_verify()`
2. **Prepared Statements**: Usa consultas preparadas para evitar SQL injection
3. **Validación**: Valida todos los datos de entrada
4. **HTTPS**: En producción, usa siempre HTTPS
5. **Sessions**: Implementa sesiones PHP para mantener usuarios autenticados
6. **CORS**: Configura correctamente los headers CORS

## Próximos Pasos

1. Crea la base de datos y tablas en MySQL
2. Configura los archivos PHP en tu servidor Laragon
3. Actualiza las URLs de las llamadas fetch en los componentes React
4. Prueba cada módulo individualmente
5. Implementa las funciones de exportación PDF usando librerías como TCPDF o FPDF

## Notas Importantes

- El frontend actual usa datos simulados para demostración
- Todos los componentes tienen comentarios indicando dónde hacer las llamadas PHP
- La URL base `http://localhost/inventario/api/` debe ajustarse según tu configuración
- Considera implementar un sistema de tokens JWT para mayor seguridad
