# Sistema de Inventario de Materiales y Herramientas

Sistema completo de gestión de inventario para empresas de instalaciones y servicios de redes y telecomunicaciones. **100% funcional sin necesidad de base de datos** - Los datos se guardan en el navegador (localStorage).

## 🚀 Características

✅ **10 Pantallas Completas**:
- Login (usuario: `admin`, contraseña: `admin`)
- Dashboard con estadísticas en tiempo real
- Gestión de Materiales
- Gestión de Herramientas
- Gestión de Ubicaciones
- Gestión de Técnicos
- Gestión de Proveedores
- Gestión de Proyectos
- Registro de Movimientos de Inventario
- Control de Asignaciones

✅ **Funcionalidades CRUD completas** para todos los módulos
✅ **Almacenamiento persistente** en localStorage del navegador
✅ **Diseño responsive** con esquema de colores negro, gris y amarillo
✅ **Alertas de stock bajo** automáticas
✅ **Control de asignaciones** de herramientas a técnicos/proyectos
✅ **Interfaz moderna** con React + Tailwind CSS + shadcn/ui

## 📋 Requisitos Previos

- Node.js (versión 16 o superior)
- npm o yarn

## 🛠️ Instalación y Ejecución

### Opción 1: Usando npm

```bash
# 1. Abre una terminal en la carpeta del proyecto

# 2. Instala las dependencias (primera vez solamente)
npm install

# 3. Ejecuta el proyecto
npm run dev
```

### Opción 2: Usando yarn

```bash
# 1. Abre una terminal en la carpeta del proyecto

# 2. Instala las dependencias (primera vez solamente)
yarn

# 3. Ejecuta el proyecto
yarn dev
```

### 4. Abre tu navegador

Una vez ejecutado el comando anterior, verás un mensaje como:

```
  Local:   http://localhost:5173/
```

Abre esa URL en tu navegador (normalmente es `http://localhost:5173/`)

## 🔐 Acceso al Sistema

**Credenciales predeterminadas:**
- Usuario: `admin`
- Contraseña: `admin`

## 📊 Datos Iniciales

El sistema viene precargado con datos de ejemplo:
- 4 Materiales
- 4 Herramientas
- 6 Ubicaciones
- 4 Técnicos
- 4 Proveedores
- 4 Proyectos
- 4 Movimientos de inventario
- 4 Asignaciones

**Todos los datos se guardan automáticamente en el navegador**, por lo que cualquier cambio que hagas (agregar, editar, eliminar) se mantendrá incluso si cierras la página.

## 🗂️ Estructura del Proyecto

```
/
├── App.tsx                 # Componente principal
├── utils/
│   └── localStorage.ts     # Manejo de datos (reemplaza la base de datos)
├── components/
│   ├── Login.tsx           # Pantalla de login
│   ├── Dashboard.tsx       # Panel principal
│   ├── Materiales.tsx      # Gestión de materiales
│   ├── Herramientas.tsx    # Gestión de herramientas
│   ├── Ubicaciones.tsx     # Gestión de ubicaciones
│   ├── Tecnicos.tsx        # Gestión de técnicos
│   ├── Proveedores.tsx     # Gestión de proveedores
│   ├── Proyectos.tsx       # Gestión de proyectos
│   ├── Movimientos.tsx     # Movimientos de inventario
│   ├── Asignaciones.tsx    # Control de asignaciones
│   └── ui/                 # Componentes de interfaz (shadcn/ui)
└── styles/
    └── globals.css         # Estilos globales
```

## 💾 Manejo de Datos

### ¿Dónde se guardan los datos?
Los datos se almacenan en el **localStorage** de tu navegador. Esto significa que:
- ✅ No necesitas instalar MySQL, Laragon o XAMPP
- ✅ Los datos persisten entre sesiones
- ✅ Cada navegador tiene su propia copia de los datos
- ⚠️ Los datos se pierden si limpias la caché del navegador

### Resetear datos a valores iniciales

Si deseas volver a los datos de ejemplo, abre la consola del navegador (F12) y ejecuta:

```javascript
localStorage.clear();
location.reload();
```

### Exportar/Importar datos

El sistema incluye utilidades para exportar e importar datos (en formato JSON):

```javascript
// Exportar todos los datos
import { exportData } from './utils/localStorage';
console.log(exportData());

// Importar datos desde JSON
import { importData } from './utils/localStorage';
importData(jsonString);
```

## 🎨 Esquema de Colores

- **Primario**: Amarillo (#EAB308 / yellow-500)
- **Secundario**: Negro (#000000)
- **Fondo**: Blanco y Grises (#F3F4F6 / gray-100)
- **Alertas**: Rojo para stock bajo
- **Éxito**: Verde para confirmaciones

## 📱 Pantallas del Sistema

### 1. Login
- Autenticación de usuarios
- Validación de credenciales

### 2. Dashboard
- Resumen de totales (materiales, herramientas, técnicos)
- Alertas de stock bajo
- Últimos movimientos

### 3. Materiales
- Listado con stock actual y mínimo
- Alertas visuales para stock bajo
- CRUD completo
- Filtros por categoría y ubicación

### 4. Herramientas
- Control de estado (operativa, en reparación, fuera de servicio)
- Seguimiento de asignaciones
- Códigos internos únicos

### 5. Ubicaciones
- Gestión de almacenes, vehículos, obras y oficinas
- Tipo de ubicación personalizable

### 6. Técnicos
- Información de contacto
- Control de herramientas y materiales asignados

### 7. Proveedores
- Datos de contacto completos
- Historial de materiales suministrados

### 8. Proyectos
- Seguimiento de estado y progreso
- Fechas de inicio y fin
- Información del cliente

### 9. Movimientos
- Registro de entradas, salidas y devoluciones
- Filtros por tipo y fecha
- Trazabilidad completa

### 10. Asignaciones
- Control de herramientas/materiales asignados
- Asignación a técnicos o proyectos
- Registro de devoluciones

## 🔧 Personalización

### Cambiar colores

Edita el archivo `styles/globals.css`:

```css
:root {
  --primary: 45 93% 47%;        /* Amarillo */
  --primary-foreground: 0 0% 0%; /* Negro */
  /* ... más variables */
}
```

### Agregar nuevos campos

Edita el archivo `/utils/localStorage.ts` en la sección `initialData` para agregar campos a las tablas.

### Crear nuevos usuarios

Abre `/utils/localStorage.ts` y agrega usuarios en el array `usuarios`:

```javascript
usuarios: [
  {
    id: 1,
    usuario: 'admin',
    password: 'admin',
    nombre: 'Administrador',
    rol: 'admin'
  },
  {
    id: 2,
    usuario: 'operador',
    password: '1234',
    nombre: 'Operador',
    rol: 'operador'
  }
]
```

## ⚠️ Notas Importantes

1. **Los datos solo existen en tu navegador**: Si usas otro navegador o dispositivo, verás los datos iniciales.

2. **Limpieza de caché**: Si limpias la caché del navegador, perderás todos los datos ingresados.

3. **Modo desarrollo**: El sistema está optimizado para desarrollo. Para producción, considera migrar a una base de datos real.

4. **Migración futura a PHP/MySQL**: El archivo `PHP_INTEGRATION.md` contiene instrucciones detalladas de cómo migrar a un backend PHP real.

## 🚨 Solución de Problemas

### El sistema no carga
```bash
# Limpia la caché de npm
npm clean-cache --force
rm -rf node_modules
npm install
npm run dev
```

### Los datos no se guardan
- Verifica que el navegador permita localStorage
- Abre la consola (F12) y busca errores
- Intenta en modo incógnito

### Error al ejecutar npm run dev
```bash
# Verifica la versión de Node.js
node --version  # Debe ser 16 o superior

# Actualiza npm
npm install -g npm@latest
```

## 📄 Licencia

Sistema desarrollado para uso interno de la empresa.

## 🤝 Soporte

Para problemas o dudas:
1. Revisa los archivos `PHP_INTEGRATION.md` y `EJEMPLO_INTEGRACION_PHP.md`
2. Verifica la consola del navegador (F12) para mensajes de error
3. Asegúrate de que localStorage esté habilitado en tu navegador

---

## 🎯 Próximos Pasos

Una vez familiarizado con el sistema, puedes:

1. ✅ Personalizar los datos iniciales en `/utils/localStorage.ts`
2. ✅ Agregar nuevos campos a los formularios
3. ✅ Implementar reportes en PDF (actualmente muestra notificación)
4. ✅ Migrar a backend PHP/MySQL siguiendo `PHP_INTEGRATION.md`

¡Listo para usar! 🎉
