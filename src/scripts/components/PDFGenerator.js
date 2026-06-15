// =============================================================================
// PDF GENERATOR — Tutorial descargable
// Genera client-side el PDF del manual de juego usando jsPDF.
// Contiene las 9 secciones requeridas por la especificación pedagógica.
// =============================================================================

import { jsPDF } from 'jspdf';
import { bus, EVENTS } from '../core/EventBus.js';

const SECTIONS = [
  {
    title: '1. Cómo jugar',
    body: [
      'Sos un detective de la Agencia Federal de Protección Cultural. Tu misión es atrapar a "Los Saqueadores del Patrimonio", una banda que roba elementos culturales de las provincias argentinas: el tango, el mate, la Vendimia, el chamamé, las Cataratas...',
      'En cada caso:',
      '  • Recibís un robo y una provincia de origen.',
      '  • Hablás con testigos para recolectar pistas.',
      '  • Viajás entre provincias siguiendo el rastro.',
      '  • Identificás al ladrón por sus atributos.',
      '  • Emitís una orden de captura.',
      '  • Lo arrestás en su destino final, antes de que se cumplan los 7 días.',
    ],
  },
  {
    title: '2. Controles',
    body: [
      'Mobile / Tablet:',
      '  • Tocar para seleccionar.',
      '  • Deslizar para rotar el mapa 3D.',
      '  • Pinch (dos dedos) para hacer zoom.',
      '',
      'Notebook / Desktop:',
      '  • Click izquierdo para seleccionar.',
      '  • Arrastrar para rotar el mapa.',
      '  • Rueda del mouse para zoom.',
      '  • Teclado: Tab para navegar, Enter para activar, Esc para cerrar diálogos.',
      '',
      'Accesibilidad:',
      '  • Alto contraste: configurable en ajustes del sistema.',
      '  • Textos escalables: respeta tamaño de fuente del navegador.',
      '  • Reduce-motion: respeta preferencia del sistema operativo.',
    ],
  },
  {
    title: '3. Objetivos',
    body: [
      'Cada partida:',
      '  • Resolver el caso antes de los 7 días.',
      '  • Identificar al ladrón con la menor cantidad de pistas posibles.',
      '  • Visitar la cantidad correcta de provincias (sin perderte por pistas mal interpretadas).',
      '',
      'A largo plazo:',
      '  • Desbloquear los logros: Detective Novato, Detective Experto, Maestro de la Geografía, Protector Cultural.',
      '  • Conocer las 24 provincias y sus elementos culturales.',
    ],
  },
  {
    title: '4. Beneficios educativos',
    body: [
      '"Tras las Huellas" no es solo un juego: es una herramienta pedagógica que estimula:',
      '  • Aprendizaje activo de la geografía argentina.',
      '  • Reconocimiento del patrimonio cultural intangible y material.',
      '  • Vocabulario formal en contexto narrativo.',
      '  • Lectura comprensiva en tiempos cortos (pistas breves).',
      '  • Toma de decisiones con consecuencias visibles.',
    ],
  },
  {
    title: '5. Beneficios psicopedagógicos',
    body: [
      'Diseñado para niñas y niños de 10 a 12 años, etapa en que la psicología cognitiva ' +
      'identifica el desarrollo del pensamiento hipotético-deductivo (Piaget, operaciones formales).',
      '',
      'El juego ejercita específicamente:',
      '  • Memoria de trabajo: retener pistas mientras se planifica.',
      '  • Atención sostenida: leer testimonios sin perder el hilo.',
      '  • Función ejecutiva: planificar el orden de acciones bajo restricción de tiempo.',
      '  • Tolerancia a la frustración: pistas falsas como oportunidad de revisión, no castigo.',
      '  • Autorregulación: gestión del tiempo dentro del límite de 7 días.',
    ],
  },
  {
    title: '6. Geografía argentina',
    body: [
      'El juego cubre las 24 jurisdicciones (23 provincias + CABA) con datos verídicos:',
      '  • Capital, región (NOA, NEA, Cuyo, Pampeana, Patagonia, CABA).',
      '  • Clima predominante y terreno característico.',
      '  • Comidas, músicas, danzas y festividades locales.',
      '  • Sitios geográficos emblemáticos (Glaciar Perito Moreno, Cataratas, Cerro Aconcagua, ' +
      'Quebrada de Humahuaca, Iberá, etc.).',
      '',
      'Los recorridos del ladrón conectan provincias cercanas con lógica geográfica real.',
    ],
  },
  {
    title: '7. Pensamiento crítico',
    body: [
      'Las pistas nunca son explícitas. Por ejemplo, en lugar de "el ladrón fue a Mendoza", ' +
      'el testigo dice "preguntó por la provincia más famosa por su vino". El jugador debe:',
      '  • Identificar el dato clave en el testimonio.',
      '  • Cruzarlo con su conocimiento previo o el mapa.',
      '  • Descartar provincias que no encajan.',
      '  • Verificar antes de viajar (un viaje en vano cuesta 6 horas).',
      '',
      'Este proceso entrena el escepticismo informado y la verificación de fuentes.',
    ],
  },
  {
    title: '8. Resolución de problemas',
    body: [
      'Cada caso es un problema con múltiples variables:',
      '  • Tiempo limitado (7 días = 168 horas).',
      '  • Recursos: testigos, archivos, viajes.',
      '  • Objetivo: identificar al sospechoso y capturarlo en su destino final.',
      '',
      'El jugador aprende a:',
      '  • Descomponer el problema en sub-objetivos.',
      '  • Priorizar acciones de mayor retorno (entrevistar antes de viajar).',
      '  • Evaluar trade-offs (¿gasto 3h en archivo o 2h con un testigo más?).',
      '  • Adaptar el plan cuando aparece información nueva.',
    ],
  },
  {
    title: '9. Comprensión lectora',
    body: [
      'Cada testimonio es un texto breve con información explícita e implícita.',
      'Ejemplo: "El sospechoso pidió un libro sobre lagos cordilleranos y traía olor a humo de fogón."',
      '',
      'El jugador debe extraer:',
      '  • Información explícita: pidió un libro de lagos cordilleranos.',
      '  • Información implícita: posiblemente acampaba (humo de fogón).',
      '  • Inferencia: destino probablemente patagónico.',
      '',
      'Este ejercicio de lectura activa fortalece la capacidad de inferir y resumir, ' +
      'habilidades centrales de los estándares curriculares para el ciclo (CABA, PBA, federal).',
    ],
  },
];

export function generateTutorialPdf() {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 50;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Portada
  doc.setFillColor(0x11, 0x8A, 0xB2); // azul
  doc.rect(0, 0, pageWidth, 200, 'F');
  doc.setTextColor(0xFF, 0xFF, 0xFF);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(28);
  doc.text('Tras las Huellas', margin, 100);
  doc.text('del Ladrón Federal', margin, 135);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'normal');
  doc.text('Manual del Detective · 10 a 12 años', margin, 165);

  doc.setTextColor(0x22, 0x22, 0x22);
  y = 230;
  doc.setFontSize(11);
  doc.setFont('helvetica', 'italic');
  const intro =
    'Una aventura educativa para recorrer Argentina, atrapar criminales culturales ' +
    'y desarrollar pensamiento lógico, comprensión lectora y resolución de problemas.';
  const introLines = doc.splitTextToSize(intro, contentWidth);
  doc.text(introLines, margin, y);
  y += introLines.length * 14 + 20;

  // Índice
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('Índice', margin, y);
  y += 20;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  SECTIONS.forEach(s => {
    doc.text(s.title, margin + 10, y);
    y += 16;
  });

  // Secciones
  SECTIONS.forEach((section) => {
    doc.addPage();
    y = margin;

    // Header de sección
    doc.setFillColor(0xFF, 0xD6, 0x0A); // amarillo
    doc.rect(0, 0, pageWidth, 60, 'F');
    doc.setTextColor(0x22, 0x22, 0x22);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text(section.title, margin, 40);

    y = 95;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(0x22, 0x22, 0x22);

    section.body.forEach(paragraph => {
      if (paragraph === '') {
        y += 8;
        return;
      }
      const lines = doc.splitTextToSize(paragraph, contentWidth);
      // Salto de página si no cabe
      if (y + lines.length * 14 > pageHeight - margin) {
        doc.addPage();
        y = margin;
      }
      doc.text(lines, margin, y);
      y += lines.length * 14 + 6;
    });
  });

  // Pie en última página
  doc.addPage();
  doc.setFillColor(0x06, 0xD6, 0xA0); // verde
  doc.rect(0, 0, pageWidth, pageHeight, 'F');
  doc.setTextColor(0xFF, 0xFF, 0xFF);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('¡Buena cacería, detective!', margin, pageHeight / 2 - 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'italic');
  doc.text('Que la geografía argentina te guíe.', margin, pageHeight / 2 + 10);

  // Descargar
  doc.save('tras-las-huellas-manual.pdf');

  bus.emit(EVENTS.SHOW_TOAST, {
    icon: '📄',
    title: 'Manual generado',
    body: 'El PDF se está descargando.',
    duration: 3500,
  });
}
