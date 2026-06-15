# Arquitectura Técnica — Tras las Huellas del Ladrón Federal

## 1. Stack

| Capa            | Tecnología                                  |
| --------------- | ------------------------------------------- |
| Lenguaje        | JavaScript ES2025 (Vanilla, sin frameworks) |
| Markup          | HTML5 semántico                             |
| Estilos         | CSS3 (custom properties, container queries) |
| 3D              | Three.js 0.160                              |
| Animación       | GSAP 3.12                                   |
| PDF             | jsPDF 2.5                                   |
| Build           | Vite 5                                      |
| Audio           | Web Audio API (nativo, sin assets)          |

**Decisiones explícitas**:
- **Sin React/Vue/Angular**: requisito del proyecto.
- **Sin librerías de estado**: el `EventBus` propio + sistemas inyectados son suficientes.
- **Sin backend**: 100% client-side. Persistencia en `localStorage`.

---

## 2. Estructura de carpetas

```
tras-las-huellas/
├── docs/                          # GDD, arquitectura, deployment, expansión
├── public/                        # favicon, robots.txt (estáticos)
├── src/
│   ├── assets/                    # (placeholder para futuros .png/.glb/.mp3)
│   │   ├── audio/
│   │   ├── images/
│   │   └── models/
│   ├── scripts/
│   │   ├── components/            # UI: HUD, Notebook, Toast, ProvinceMap3D, PDFGenerator
│   │   ├── core/                  # EventBus, SceneManager, Game
│   │   ├── data/                  # provinces, culturalItems, suspectTemplates, clueTemplates
│   │   ├── generators/            # CaseGenerator, SuspectGenerator
│   │   ├── scenes/                # 11 escenas (Title, Intro, Office, etc.)
│   │   ├── systems/               # Time, Clue, Case, Save, Audio, Achievement
│   │   └── utils/                 # random (seeded PRNG)
│   ├── styles/                    # variables, main, components, responsive
│   └── main.js                    # bootstrap
├── index.html
├── package.json
└── vite.config.js
```

---

## 3. Capas de responsabilidad

```
┌──────────────────────────────────────────────────────┐
│  ESCENAS (UI por contexto: title, office, map...)    │
└────────────────────┬─────────────────────────────────┘
                     │ usa
┌────────────────────┴─────────────────────────────────┐
│  COMPONENTES (HUD, Notebook, Map3D, Toast)            │
└────────────────────┬─────────────────────────────────┘
                     │ usa
┌────────────────────┴─────────────────────────────────┐
│  SISTEMAS (TimeSystem, ClueSystem, CaseSystem,       │
│   AchievementSystem, AudioSystem, SaveSystem)         │
└────────────────────┬─────────────────────────────────┘
                     │ usa
┌────────────────────┴─────────────────────────────────┐
│  GENERADORES (CaseGenerator, SuspectGenerator)        │
└────────────────────┬─────────────────────────────────┘
                     │ lee
┌────────────────────┴─────────────────────────────────┐
│  DATOS (provinces, culturalItems, plantillas)         │
└──────────────────────────────────────────────────────┘

         ────── EventBus (bus de eventos global) ──────
```

Las flechas son unidireccionales: una escena puede usar componentes y sistemas, pero un sistema **nunca** importa una escena. Esto garantiza que la lógica del juego sea independiente de la UI.

---

## 4. Flujo de datos

### 4.1 EventBus

Singleton publish/subscribe en `core/EventBus.js`. Tipos de eventos:

```js
EVENTS = {
  TIME_TICK, TIME_EXPIRED,
  CASE_START, CASE_WIN, CASE_LOSE,
  CLUE_DISCOVERED, ATTRIBUTE_REVEALED,
  TRAVEL_START, TRAVEL_END,
  WARRANT_ISSUED, SUSPECT_CAPTURED, SUSPECT_MISMATCH,
  ACHIEVEMENT_UNLOCKED, SHOW_TOAST,
  SCENE_CHANGE, SCENE_LOADED,
  PLAY_SFX, PLAY_MUSIC, STOP_MUSIC,
}
```

### 4.2 Contexto compartido

`Game.js` arma un objeto `context` que se inyecta a cada escena:

```js
context = {
  game,                  // referencia al controlador
  time, clues, case,     // sistemas mutables
  achievements,
  suspectRoster,         // array de 120 sospechosos
  audio, bus,            // singletons
}
```

Las escenas reciben `context` en su `onMount(body, context, payload)` y nunca importan sistemas directamente — facilita testing y desacopla.

### 4.3 Lifecycle de escena

```
SceneManager.goTo('office', payload)
   │
   ├→ if (scene actual) → await scene.unmount()
   │        ├→ scene.onUnmount() [override]
   │        ├→ scene.notebook.unmount()
   │        └→ scene.hud.unmount()
   │
   ├→ scene = registry[id]
   │
   ├→ await scene.mount(root, context, payload)
   │        ├→ mount HUD si showHud
   │        ├→ mount Notebook
   │        ├→ scene.body = main.scene-body
   │        └→ await scene.onMount(body, context, payload) [override]
   │
   └→ bus.emit(SCENE_LOADED, {id, payload})
```

`window.resize` se delega a `scene.onResize()` (útil para Three.js).

---

## 5. Sistemas

### 5.1 TimeSystem

```js
new TimeSystem(7) // 7 días
.consume(2)       // resta 2h
.snapshot()       // {day, hour, remainingHours, totalHours}
.toJSON()/loadJSON()
```

Al llegar a 0 horas → `bus.emit(TIME_EXPIRED)`.

### 5.2 ClueSystem

Acumula:
- `geographicClues[]`: pistas geográficas con `provinceFrom`, `text`, `day`.
- `identityClues[]`: pistas de identidad con `text`, `attribute={key,value}`, `day`.
- `knownAttributes{}`: dict acumulativo de atributos confirmados.

`matchSuspects(roster)` aplica los filtros y devuelve compatibles.

### 5.3 CaseSystem

Gestiona el caso activo: `activeCase`, `currentStopIndex`, `visitedProvinces`, `consultedWitnesses`, `warrantIssued/Suspect/Attempts`. Métodos clave:

- `startCase(seed)` → genera caso desde seed y emite `CASE_START`.
- `travelTo(provinceId)` → valida que coincida con el próximo destino esperado. No revela el destino correcto en caso de error.
- `issueWarrant(suspectId, roster)` → asigna sospechoso y verifica match.
- `attemptCapture()` → requiere estar en provincia final + orden correcta.

### 5.4 AchievementSystem

Escucha `CASE_WIN` y aplica condicionales sobre stats. Emite `ACHIEVEMENT_UNLOCKED` + `SHOW_TOAST` cuando corresponde.

### 5.5 SaveSystem

Singleton, namespace `tras-las-huellas:*:v1`. API funcional:
`saveGame/loadGame/hasSave`, `getStats/updateStats`, `getAchievements/unlockAchievement`, `getSettings/saveSettings`.

### 5.6 AudioSystem

`audio.init()` crea un `AudioContext`. Tracks musicales son secuenciadores procedurales:
```js
TRACKS = {
  menu:        { tempo, pattern: [...notas] },
  investigate: { ... },
  ...
}
```

SFX son funciones puras que generan envolventes ADSR sintetizadas. **No hay archivos de audio en el repo** → cero issues de copyright.

---

## 6. Generación procedural

### 6.1 PRNG seeded

`utils/random.js` usa **mulberry32** (PRNG rápido determinista) sobre un seed `uint32`. Helpers: `pick`, `pickN`, `intBetween`, `shuffle`, `hashSeed(string)`.

### 6.2 SuspectGenerator

`generateSuspectRoster(120)` produce 120 sospechosos combinando pools (nombres, alias, pelos, profesiones, hobbies, comidas, lugares, colores, accesorios). Con 8 atributos y pools de ~10–15 valores cada uno, el espacio combinatorio supera el millón de variantes.

### 6.3 CaseGenerator

```
generateCase(seed):
   1. Elige objeto cultural robado
   2. Calcula ruta (2 a 5 hops) con scoring por distancia
   3. Genera sospechoso asignado
   4. Para cada parada, genera 2-3 testigos con pistas hacia el próximo destino
   5. Devuelve {title, stolen, origin, route, stops, suspect, briefing, ...}
```

`generateCaseDossier(100)` produce 100 casos únicos.

---

## 7. Mapa 3D

`components/ProvinceMap3D.js`:

- Three.js renderer + scene + perspective camera.
- Proyección equirectangular de lat/lng a (x, z) con escalas calibradas para Argentina.
- Base plane verde + cordillera estilizada (conos al oeste).
- Por provincia: grupo con cilindro (pin) + esfera (cabeza) coloreada por región.
- Provincias visitadas: torus verde anular.
- Provincia actual: highlight rojo.
- Raycaster para hover/click.
- Controles: drag (rotación), wheel/pinch (zoom).
- Tooltip flotante (`.province-tooltip`).
- `flyTo(id)` → Promise con tween GSAP de cámara.

Performance:
- 24 grupos de mesh = ~50 polígonos visibles. Sin VBO custom necesario.
- `requestAnimationFrame` solo activo cuando la escena está montada.
- `destroy()` libera geometrías, materiales y observers.

---

## 8. Build y performance

### 8.1 Vite

- `manualChunks`: separa `three`, `gsap`, `jspdf` en bundles propios (lazy-able en fase 2).
- `target: es2022` (top-level await, optional chaining nativo).
- Sourcemaps activos para debugging en producción.

### 8.2 Presupuestos

| Métrica                       | Objetivo |
| ----------------------------- | -------- |
| JS bundle (gzipped)           | < 250 KB |
| First Contentful Paint        | < 1.5s en 4G |
| Three.js bundle aparte        | sí       |
| Lighthouse Performance        | ≥ 85     |
| Lighthouse Accessibility      | ≥ 95     |
| Sin requests externos en runtime | salvo fuentes Google (con preconnect) |

---

## 9. Testing (plan)

Fase actual: testing manual exhaustivo + assertions defensivas en sistemas.

Fase próxima (sin agregar dependencias pesadas):
- `vitest` para unit tests sobre generators y systems.
- Snapshot test de `generateCase(seed=1)` para detectar regresiones de contenido.
- Playwright para smoke tests E2E (jugar un caso completo).

---

## 10. Seguridad

- **Sin backend** → sin superficie de ataque de servidor.
- **localStorage** → datos del jugador locales al dispositivo.
- **CSP recomendada** en deployment: `default-src 'self'; font-src fonts.gstatic.com; style-src 'self' fonts.googleapis.com 'unsafe-inline';`.
- **Sin tracking ni analytics** por defecto (compatible con normativa infantil).
