# Plan de Expansión — Tras las Huellas del Ladrón Federal

> Roadmap a 4 fases. La fase 1 corresponde al estado actual del proyecto.

---

## Fase 1 — Foundation (estado actual)

✅ Núcleo jugable completo.

- Arquitectura modular Vanilla JS (sin frameworks).
- Generadores procedurales: 100+ casos únicos, 120 sospechosos.
- 11 escenas funcionales con transiciones GSAP.
- Mapa 3D interactivo Three.js de las 24 provincias.
- Sistema de tiempo, pistas, captura y persistencia.
- Audio procedural (sin copyright).
- 7 logros desbloqueables.
- Accesibilidad: teclado, alto contraste, reduce-motion, mobile-first.
- PDF tutorial descargable client-side.

---

## Fase 2 — Contenido y profundidad (3 meses)

### 2.1 Contenido cultural ampliado

- **Expansión del catálogo cultural**: de ~45 a 150+ items. Incluir:
  - Música: cumbia, cuarteto, folclore de cada región.
  - Personajes históricos: San Martín, Sarmiento, Belgrano (sin ficcionalizar de modo problemático).
  - Eventos: Pascuas en Tilcara, Carnaval de Gualeguaychú, Tinkunaco.
- **Plantillas de pistas adicionales**: pasar de ~15 geográficas a 50+.
- **Diálogos contextuales**: testigos con personalidad regional (modismos, mateadas, etc).

### 2.2 Modos de juego adicionales

- **Modo libre**: el jugador elige provincia inicial y dificultad.
- **Modo desafío**: cadenas de 5 casos consecutivos sin perder.
- **Modo educativo**: docente predefine el caso (URL compartible con seed).

### 2.3 Traducciones

- Inglés (para difusión internacional).
- Portugués (mercado escolar Mercosur).
- Variantes ortográficas regionales: pibe/chico/niño según provincia.

### 2.4 Modelos 3D

Sustituir avatares emoji por modelos GLB low-poly:
- Detective protagonista.
- 6 arquetipos de sospechosos (combinables con paleta para 120 variantes).
- Landmarks 3D por provincia (Obelisco, Glaciar, Cataratas, etc).

Pipeline propuesto: Blender → glTF → carga lazy por escena.

---

## Fase 3 — Social y colaborativo (6 meses)

### 3.1 Multijugador cooperativo

Modo "Brigada Federal": 2–4 detectives resuelven el mismo caso colaborando.

- Implementación: WebRTC peer-to-peer (sin servidor central).
- División de tareas: un jugador entrevista, otro investiga el archivo, otro viaja.
- Chat de texto in-game con palabras prohibidas filtradas.
- Avatar único por jugador.

### 3.2 Modo aula

- **Panel docente** (web app separada):
  - Crear "operativos" con casos curados (semillas).
  - Asignar a un grupo de estudiantes.
  - Ver progreso anonimizado: provincias visitadas, tiempo promedio, pistas detectadas.
- Cumplimiento Ley de Protección de Datos Personales (Ley 25.326).
- Sin recolección de datos personales del menor: solo nickname elegido.

### 3.3 Tabla de logros compartida

- Liga federal: top resultados por escuela / provincia.
- Anti-cheat básico: validación server-side de los seeds y tiempos.

---

## Fase 4 — Mini-juegos provinciales (12 meses)

Cada provincia desbloquea un mini-juego al ser visitada por primera vez:

| Provincia          | Mini-juego                                     |
| ------------------ | ---------------------------------------------- |
| Buenos Aires (CABA) | Match-3 de fileteado porteño                  |
| Mendoza            | Vendimia: cosecha rítmica                      |
| Salta              | Empanada Quest: ingredientes correctos         |
| Tierra del Fuego   | Ruta del faro: laberinto                       |
| Misiones           | Cataratas runner: salto entre saltos           |
| Córdoba            | Cuarteto rhythm: tap al ritmo                  |
| Santa Cruz         | Pingüino patagónico: peinado de la pingüinera  |
| Jujuy              | Quebrada en colores: pintá los 7 colores       |

Cada mini-juego es **autocontenido** (módulo separado), reutiliza el `EventBus` y otorga un logro al completarse.

---

## Fase 5 (visión a largo plazo) — Plataforma educativa

- **Currículum alineado** a los Núcleos de Aprendizajes Prioritarios (NAP) de Ciencias Sociales para 4º, 5º y 6º grado.
- **Material complementario**: fichas docentes en PDF generadas por caso (qué se trabaja, preguntas guía, evaluación).
- **API pública** para que comunidades de docentes publiquen casos curados.
- **PWA offline**: jugar sin conexión en escuelas rurales con conectividad intermitente.
- **Versión accesibilidad extendida**:
  - Lectura por voz (Text-to-Speech del Web Speech API).
  - Subtítulos en diálogos.
  - Modo daltonismo (re-coloreado de la paleta).
  - Pictogramas SAAC para apoyo visual.

---

## Restricciones permanentes

Cualquier expansión debe respetar:

1. **Sin violencia**: los "saqueadores" son criminales culturales, no armados.
2. **Sin estereotipos**: representación respetuosa de pueblos originarios, regiones, géneros.
3. **Sin tracking de menores**: cero analytics personales, cero cookies de terceros.
4. **Sin in-app purchases ni publicidad**: el juego es gratuito y abierto.
5. **Sin contenido copyrighted**: música, modelos y textos son originales o de dominio público.
6. **Tiempos de sesión sanos**: cap soft de 45 minutos por sesión con sugerencia de descanso.

---

## Métricas de éxito (cuando se mida)

- **Educativas**: pre/post test sobre identificación de provincias, mejora ≥20%.
- **Engagement**: 60% de jugadores resuelve al menos 3 casos.
- **Accesibilidad**: WCAG 2.1 AA pleno en todas las escenas.
- **Performance**: Lighthouse ≥ 85 en mobile.
