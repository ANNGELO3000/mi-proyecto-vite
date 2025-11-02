# ⚡ CÓMO EJECUTAR EL SISTEMA - GUÍA RÁPIDA

## 🎯 PASOS SIMPLES

### 1️⃣ Abre una Terminal/Consola

**Windows:**
- Presiona `Win + R`
- Escribe `cmd` y presiona Enter
- Navega a la carpeta del proyecto: `cd ruta\del\proyecto`

**Mac/Linux:**
- Presiona `Cmd + Espacio` (Mac) o `Ctrl + Alt + T` (Linux)
- Navega a la carpeta del proyecto: `cd ruta/del/proyecto`

### 2️⃣ Instala las Dependencias (Solo la primera vez)

```bash
npm install
```

Espera a que termine (puede tardar 1-2 minutos)

### 3️⃣ Ejecuta el Proyecto

```bash
npm run dev
```

### 4️⃣ Abre tu Navegador

Verás algo como esto en la terminal:

```
VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Abre en tu navegador:**  `http://localhost:5173/`

### 5️⃣ Inicia Sesión

```
Usuario: admin
Contraseña: admin
```

---

## ✅ ¡LISTO! El sistema está funcionando

## 🔥 Características del Sistema

- ✅ **No necesita base de datos** - Todo se guarda en el navegador
- ✅ **Los datos persisten** - Se mantienen aunque cierres el navegador
- ✅ **10 módulos completos** - Materiales, Herramientas, Técnicos, etc.
- ✅ **CRUD completo** - Crear, leer, actualizar y eliminar registros
- ✅ **Diseño responsive** - Funciona en desktop y móvil

---

## 🗂️ Navegación del Sistema

Una vez dentro verás el menú lateral con:

1. **Dashboard** - Vista general con estadísticas
2. **Materiales** - Control de cables, conectores, equipos
3. **Herramientas** - Taladros, escaleras, multímetros
4. **Ubicaciones** - Almacenes, vehículos, obras
5. **Técnicos** - Personal de campo
6. **Proveedores** - Empresas que suministran materiales
7. **Proyectos** - Instalaciones en curso
8. **Movimientos** - Entradas, salidas y devoluciones
9. **Asignaciones** - Control de qué técnico tiene qué herramienta

---

## 💡 Tips Rápidos

### Agregar un Material
1. Click en "Materiales" en el menú
2. Click en "Agregar Material"
3. Llena el formulario
4. Click en "Guardar"

### Ver Stock Bajo
- En el Dashboard verás alertas automáticas de materiales con stock bajo

### Asignar Herramienta a un Técnico
1. Click en "Asignaciones"
2. Click en "Nueva Asignación"
3. Selecciona herramienta y técnico
4. Click en "Guardar"

### Registrar Movimiento
1. Click en "Movimientos"
2. Click en "Registrar Movimiento"
3. Selecciona tipo (entrada/salida/devolución)
4. Completa datos
5. Click en "Guardar"

---

## 🆘 Problemas Comunes

### "npm no se reconoce como comando"

**Solución:** Necesitas instalar Node.js
1. Ve a https://nodejs.org
2. Descarga la versión LTS (recomendada)
3. Instala y reinicia la terminal
4. Vuelve a intentar

### El navegador no carga la página

**Solución:**
1. Verifica que el comando `npm run dev` esté ejecutándose
2. Busca en la terminal la URL correcta (puede ser otro puerto)
3. Prueba `http://localhost:5173/` o `http://localhost:3000/`

### Los datos desaparecieron

**Solución:**
- Verifica que no hayas limpiado la caché del navegador
- Los datos están en localStorage (solo en ese navegador)
- Si limpias caché, se pierden los datos

### Error "EADDRINUSE"

**Solución:** El puerto ya está en uso
1. Cierra otros servidores que estén corriendo
2. O cambia el puerto en `vite.config.ts`

---

## 🔄 Resetear Datos a Valores Iniciales

Si quieres volver a los datos de ejemplo:

1. Presiona `F12` en el navegador (abre la consola)
2. Ve a la pestaña "Console"
3. Escribe: `localStorage.clear()`
4. Presiona Enter
5. Recarga la página (`F5` o `Ctrl+R`)

---

## 📱 Datos de Ejemplo Incluidos

El sistema viene con estos datos precargados:

- **4 Materiales**: Cable UTP, Conectores RJ45, Switch, Fibra Óptica
- **4 Herramientas**: Taladro, Escalera, Multímetro, Ponchadora
- **6 Ubicaciones**: 2 Almacenes, 2 Vehículos, 1 Obra, 1 Oficina
- **4 Técnicos**: Juan Pérez, María González, Carlos Ruiz, Ana Martínez
- **4 Proveedores**: Empresas de telecomunicaciones
- **4 Proyectos**: Instalaciones en diferentes estados
- **4 Movimientos**: Ejemplos de entradas/salidas
- **4 Asignaciones**: Herramientas asignadas a técnicos

---

## 🎨 Personalización Básica

### Cambiar Usuario/Contraseña

Edita `/utils/localStorage.ts` línea ~307:

```javascript
usuarios: [
  {
    id: 1,
    usuario: 'miusuario',      // ← Cambia aquí
    password: 'mipassword',     // ← Cambia aquí
    nombre: 'Mi Nombre',
    rol: 'admin'
  }
]
```

### Agregar Más Materiales Iniciales

Edita `/utils/localStorage.ts` línea ~9 y agrega en el array `materiales`:

```javascript
{
  id: 5,
  nombre: 'Nuevo Material',
  descripcion: 'Descripción...',
  categoria: 'Cables',
  unidad_medida: 'metros',
  stock_actual: 100,
  stock_minimo: 50,
  ubicacion: 'Almacén Principal',
  proveedor: 'Distribuidora TeleCom'
},
```

---

## 📞 ¿Necesitas Ayuda?

1. Lee el `README.md` para documentación completa
2. Revisa `PHP_INTEGRATION.md` si quieres migrar a base de datos
3. Abre la consola del navegador (F12) para ver errores
4. Verifica que Node.js esté instalado: `node --version`

---

## ✨ ¡Eso es Todo!

El sistema está listo para usar. Puedes:

- ✅ Agregar, editar y eliminar registros
- ✅ Buscar y filtrar información
- ✅ Ver estadísticas en el dashboard
- ✅ Controlar stock de materiales
- ✅ Asignar herramientas a técnicos
- ✅ Registrar movimientos de inventario

**Todo se guarda automáticamente en tu navegador** 🎉

---

**Última actualización:** Octubre 2025
