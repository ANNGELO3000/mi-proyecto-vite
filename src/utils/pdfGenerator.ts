// Utilidad para generar PDFs
// Usa jsPDF y jspdf-autotable para generar reportes PDF

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export const generarPDFMateriales = (materiales: any[]) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('Reporte de Materiales', 14, 22);
  
  // Fecha
  doc.setFontSize(11);
  doc.setTextColor(100);
  const fecha = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Fecha: ${fecha}`, 14, 30);
  
  // Tabla de materiales
  const tableData = materiales.map(m => [
    m.nombre,
    m.categoria,
    `${m.stock_actual} ${m.unidad_medida}`,
    `${m.stock_minimo} ${m.unidad_medida}`,
    m.ubicacion,
    m.stock_actual < m.stock_minimo ? 'BAJO' : 'OK'
  ]);
  
  autoTable(doc, {
    startY: 35,
    head: [['Material', 'Categoría', 'Stock Actual', 'Stock Mínimo', 'Ubicación', 'Estado']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [234, 179, 8], // Amarillo
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    didParseCell: function(data) {
      // Colorear la columna de estado
      if (data.column.index === 5 && data.cell.section === 'body') {
        if (data.cell.text[0] === 'BAJO') {
          data.cell.styles.textColor = [220, 38, 38]; // Rojo
          data.cell.styles.fontStyle = 'bold';
        } else {
          data.cell.styles.textColor = [22, 163, 74]; // Verde
        }
      }
    }
  });
  
  // Guardar
  doc.save(`materiales_${new Date().getTime()}.pdf`);
};

export const generarPDFHerramientas = (herramientas: any[]) => {
  const doc = new jsPDF();
  
  // Título
  doc.setFontSize(18);
  doc.setTextColor(0, 0, 0);
  doc.text('Reporte de Herramientas', 14, 22);
  
  // Fecha
  doc.setFontSize(11);
  doc.setTextColor(100);
  const fecha = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Fecha: ${fecha}`, 14, 30);
  
  // Tabla de herramientas
  const tableData = herramientas.map(h => [
    h.codigo_interno,
    h.nombre,
    h.estado === 'operativa' ? 'Operativa' : h.estado === 'en_reparacion' ? 'En Reparación' : 'Perdida',
    h.ubicacion,
    h.asignada_a || 'Disponible'
  ]);
  
  autoTable(doc, {
    startY: 35,
    head: [['Código', 'Herramienta', 'Estado', 'Ubicación', 'Asignada a']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [234, 179, 8],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    }
  });
  
  doc.save(`herramientas_${new Date().getTime()}.pdf`);
};

export const generarPDFMovimientos = (movimientos: any[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Reporte de Movimientos de Inventario', 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  const fecha = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Fecha: ${fecha}`, 14, 30);
  
  const tableData = movimientos.map(m => [
    m.fecha,
    m.tipo === 'entrada' ? 'Entrada' : m.tipo === 'salida' ? 'Salida' : 'Devolución',
    m.tipo_item === 'material' ? 'Material' : 'Herramienta',
    m.item,
    m.cantidad.toString(),
    m.origen,
    m.destino
  ]);
  
  autoTable(doc, {
    startY: 35,
    head: [['Fecha', 'Tipo', 'Tipo Item', 'Item', 'Cantidad', 'Origen', 'Destino']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [234, 179, 8],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    }
  });
  
  doc.save(`movimientos_${new Date().getTime()}.pdf`);
};

export const generarPDFAsignaciones = (asignaciones: any[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Reporte de Asignaciones', 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  const fecha = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Fecha: ${fecha}`, 14, 30);
  
  const tableData = asignaciones.map(a => [
    a.item,
    a.tipo_item === 'material' ? 'Material' : 'Herramienta',
    a.asignado_a,
    a.asignado_a_tipo === 'tecnico' ? 'Técnico' : 'Proyecto',
    a.fecha_asignacion,
    a.fecha_devolucion || '-',
    a.estado === 'activa' ? 'Activa' : 'Devuelta'
  ]);
  
  autoTable(doc, {
    startY: 35,
    head: [['Item', 'Tipo', 'Asignado a', 'Tipo Asign.', 'F. Asignación', 'F. Devolución', 'Estado']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [234, 179, 8],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 8,
      cellPadding: 2
    }
  });
  
  doc.save(`asignaciones_${new Date().getTime()}.pdf`);
};

export const generarPDFTecnicos = (tecnicos: any[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Reporte de Técnicos', 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  const fecha = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Fecha: ${fecha}`, 14, 30);
  
  const tableData = tecnicos.map(t => [
    t.nombre_completo,
    t.cedula,
    t.telefono,
    t.email,
    t.especialidad
  ]);
  
  autoTable(doc, {
    startY: 35,
    head: [['Nombre', 'Cédula', 'Teléfono', 'Email', 'Especialidad']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [234, 179, 8],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    }
  });
  
  doc.save(`tecnicos_${new Date().getTime()}.pdf`);
};

export const generarPDFProyectos = (proyectos: any[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.text('Reporte de Proyectos', 14, 22);
  
  doc.setFontSize(11);
  doc.setTextColor(100);
  const fecha = new Date().toLocaleDateString('es-ES', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  doc.text(`Fecha: ${fecha}`, 14, 30);
  
  const tableData = proyectos.map(p => [
    p.nombre,
    p.cliente,
    p.ubicacion,
    p.fecha_inicio,
    p.fecha_fin || 'En curso',
    p.estado === 'planificacion' ? 'Planificación' : 
    p.estado === 'en_proceso' ? 'En Proceso' : 
    p.estado === 'completado' ? 'Completado' : 'Cancelado'
  ]);
  
  autoTable(doc, {
    startY: 35,
    head: [['Proyecto', 'Cliente', 'Ubicación', 'F. Inicio', 'F. Fin', 'Estado']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [234, 179, 8],
      textColor: [0, 0, 0],
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    }
  });
  
  doc.save(`proyectos_${new Date().getTime()}.pdf`);
};
